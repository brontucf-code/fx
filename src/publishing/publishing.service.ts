import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SeoService } from '../seo/seo.service';

@Injectable()
export class PublishingService {
  constructor(private readonly prisma: PrismaService, private readonly seoService: SeoService) {}

  async publishNow(articleId: string) {
    const article = await this.prisma.article.findUnique({ where: { id: articleId }, include: { site: true, seoMeta: true } });
    if (!article) throw new BadRequestException('文章不存在');
    if (!article.coverImage) throw new BadRequestException('发布前必须设置封面图');
    if (article.contentMarkdown.length < 120) throw new BadRequestException('正文长度不足');

    if (!article.slug) throw new BadRequestException('slug 缺失');
    const dupSlug = await this.prisma.article.findFirst({ where: { siteId: article.siteId, slug: article.slug, id: { not: article.id } } });
    if (dupSlug) throw new BadRequestException('slug 冲突');

    const seo = article.seoMeta ?? (await this.seoService.ensureSeo(articleId));
    if (!seo.metaTitle || !seo.metaDescription) throw new BadRequestException('SEO 字段不完整');

    const published = await this.prisma.article.update({
      where: { id: articleId },
      data: { status: 'published', publishedAt: new Date() },
    });

    await this.prisma.publishJob.create({
      data: { articleId, publishStatus: 'success', publishedAt: new Date(), scheduledAt: article.scheduledAt },
    });

    await this.prisma.indexingLog.create({
      data: {
        siteId: article.siteId,
        articleId,
        url: `${article.site.baseUrl.replace(/\/$/, '')}/${article.slug}`,
        status: 'submitted',
        message: 'auto submit after publish',
      },
    });

    return published;
  }

  schedule(articleId: string, scheduledAt: Date) {
    return this.prisma.article.update({ where: { id: articleId }, data: { status: 'scheduled', scheduledAt } });
  }

  async scanAndPublishDue() {
    const dueArticles = await this.prisma.article.findMany({
      where: { status: 'scheduled', scheduledAt: { lte: new Date() } },
      select: { id: true },
    });

    const results = [];
    for (const article of dueArticles) {
      try {
        results.push(await this.publishNow(article.id));
      } catch (error) {
        await this.prisma.publishJob.create({
          data: {
            articleId: article.id,
            publishStatus: 'failed',
            retryCount: 1,
            errorMessage: error instanceof Error ? error.message : 'unknown error',
          },
        });
      }
    }

    return { scanned: dueArticles.length, published: results.length };
  }
}
