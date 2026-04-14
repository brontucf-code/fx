import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { summarize } from '../common/utils/content.util';
import { UpsertSeoDto } from './dto/upsert-seo.dto';

@Injectable()
export class SeoService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureSeo(articleId: string) {
    const article = await this.prisma.article.findUnique({ where: { id: articleId }, include: { site: true, author: true, category: true } });
    if (!article) throw new BadRequestException('文章不存在');

    const baseUrl = article.site.baseUrl;
    const canonicalUrl = `${baseUrl.replace(/\/$/, '')}/${article.slug}`;
    const metaTitle = `${article.title} | ${article.site.title}`.slice(0, 70);
    const metaDescription = summarize(article.summary ?? article.contentMarkdown, 160);

    const schemaType = article.articleType === 'news' ? 'NewsArticle' : 'Article';
    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': schemaType,
      headline: article.title,
      description: metaDescription,
      author: { '@type': 'Person', name: article.author?.name ?? '编辑部' },
      publisher: { '@type': 'Organization', name: article.site.title },
      datePublished: article.publishedAt ?? article.createdAt,
      dateModified: article.updatedAt,
      mainEntityOfPage: canonicalUrl,
    };

    const breadcrumbJson = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: article.category?.name ?? 'News', item: `${baseUrl}/category/${article.category?.slug ?? 'news'}` },
        { '@type': 'ListItem', position: 3, name: article.title, item: canonicalUrl },
      ],
    };

    await this.prisma.article.update({ where: { id: articleId }, data: { canonicalUrl } });

    return this.prisma.seoMeta.upsert({
      where: { articleId },
      create: {
        articleId,
        metaTitle,
        metaDescription,
        ogTitle: metaTitle,
        ogDescription: metaDescription,
        twitterTitle: metaTitle,
        twitterDescription: metaDescription,
        robots: article.site.defaultRobots,
        schemaType,
        schemaJson,
        breadcrumbJson,
      },
      update: {
        metaTitle,
        metaDescription,
        ogTitle: metaTitle,
        ogDescription: metaDescription,
        twitterTitle: metaTitle,
        twitterDescription: metaDescription,
        schemaType,
        schemaJson,
        breadcrumbJson,
      },
    });
  }

  upsert(articleId: string, dto: UpsertSeoDto) {
    return this.prisma.seoMeta.upsert({
      where: { articleId },
      create: {
        articleId,
        metaTitle: dto.metaTitle ?? '',
        metaDescription: dto.metaDescription ?? '',
        metaKeywords: dto.metaKeywords,
        robots: dto.robots ?? 'index,follow',
      },
      update: dto,
    });
  }
}
