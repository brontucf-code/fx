import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ArticleStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { estimateReadingTime, generateSlug, sanitizeHtml, summarize } from '../common/utils/content.util';
import { CreateArticleDto } from './dto/create-article.dto';
import { QueryArticlesDto } from './dto/query-articles.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  private async buildUniqueSlug(siteId: string, title: string, currentId?: string) {
    const base = generateSlug(title);
    let slug = base;
    let i = 1;
    while (true) {
      const found = await this.prisma.article.findFirst({ where: { siteId, slug, NOT: currentId ? { id: currentId } : undefined } });
      if (!found) break;
      slug = `${base}-${i++}`;
    }
    return slug;
  }

  async create(dto: CreateArticleDto) {
    const slug = await this.buildUniqueSlug(dto.siteId, dto.title);
    const summary = dto.summary ?? summarize(dto.contentMarkdown);
    const wordCount = dto.contentMarkdown.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = estimateReadingTime(dto.contentMarkdown);

    const article = await this.prisma.article.create({
      data: {
        ...dto,
        slug,
        summary,
        contentHtml: sanitizeHtml(dto.contentHtml ?? dto.contentMarkdown.replace(/\n/g, '<br/>')),
        wordCount,
        readingTime,
      },
    });

    if (dto.tagIds?.length) {
      await this.prisma.articleTag.createMany({
        data: dto.tagIds.map((tagId) => ({ articleId: article.id, tagId })),
        skipDuplicates: true,
      });
    }

    return article;
  }

  async findAll(query: QueryArticlesDto) {
    const { page, pageSize, status, siteId, categoryId, tagId } = query;
    const where: Prisma.ArticleWhereInput = { status, siteId, categoryId };
    if (tagId) where.tags = { some: { tagId } };

    const [items, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { category: true, seoMeta: true, tags: { include: { tag: true } } },
      }),
      this.prisma.article.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async findOne(id: string) {
    const article = await this.prisma.article.findUnique({ where: { id }, include: { seoMeta: true, tags: { include: { tag: true } } } });
    if (!article) throw new NotFoundException('文章不存在');
    return article;
  }

  async update(id: string, dto: UpdateArticleDto) {
    const existing = await this.findOne(id);
    const data: Prisma.ArticleUpdateInput = {
      ...dto,
      contentHtml: dto.contentHtml ? sanitizeHtml(dto.contentHtml) : undefined,
    };

    if (dto.title || dto.siteId) {
      data.slug = await this.buildUniqueSlug(dto.siteId ?? existing.siteId, dto.title ?? existing.title, id);
    }
    if (dto.contentMarkdown) {
      data.wordCount = dto.contentMarkdown.trim().split(/\s+/).filter(Boolean).length;
      data.readingTime = estimateReadingTime(dto.contentMarkdown);
      data.summary = dto.summary ?? summarize(dto.contentMarkdown);
    }

    const updated = await this.prisma.article.update({ where: { id }, data });
    if (dto.tagIds) {
      await this.prisma.articleTag.deleteMany({ where: { articleId: id } });
      if (dto.tagIds.length) {
        await this.prisma.articleTag.createMany({ data: dto.tagIds.map((tagId) => ({ articleId: id, tagId })) });
      }
    }
    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.article.delete({ where: { id } });
    return { success: true };
  }

  async transitionStatus(id: string, status: ArticleStatus) {
    const article = await this.findOne(id);
    if (status === ArticleStatus.published && !article.publishedAt) {
      return this.prisma.article.update({ where: { id }, data: { status, publishedAt: new Date() } });
    }
    if (status === ArticleStatus.scheduled && !article.scheduledAt) {
      throw new BadRequestException('定时发布需要 scheduledAt');
    }
    return this.prisma.article.update({ where: { id }, data: { status } });
  }
}
