import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SitemapService {
  constructor(private readonly prisma: PrismaService) {}

  async buildSitemap(siteCode?: string) {
    const sites = await this.prisma.site.findMany({ where: siteCode ? { code: siteCode } : undefined });
    const urls: Array<{ loc: string; lastmod: string }> = [];

    for (const site of sites) {
      const articles = await this.prisma.article.findMany({ where: { siteId: site.id, status: 'published' }, select: { slug: true, updatedAt: true } });
      for (const a of articles) {
        urls.push({ loc: `${site.baseUrl.replace(/\/$/, '')}/${a.slug}`, lastmod: a.updatedAt.toISOString() });
      }
    }

    const root = create({ version: '1.0', encoding: 'UTF-8' }).ele('urlset', {
      xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
    });

    urls.forEach((u) => {
      const url = root.ele('url');
      url.ele('loc').txt(u.loc);
      url.ele('lastmod').txt(u.lastmod);
    });

    return root.end({ prettyPrint: true });
  }

  async buildNewsSitemap(siteCode?: string) {
    const sites = await this.prisma.site.findMany({ where: siteCode ? { code: siteCode } : undefined });
    const now = Date.now();
    const entries: Array<{ loc: string; title: string; publicationDate: string; siteName: string; language: string }> = [];

    for (const site of sites) {
      const ms = site.newsLookbackHours * 3600 * 1000;
      const from = new Date(now - ms);
      const articles = await this.prisma.article.findMany({
        where: { siteId: site.id, status: 'published', publishedAt: { gte: from } },
        select: { slug: true, title: true, publishedAt: true },
      });
      articles.forEach((a) => {
        if (!a.publishedAt) return;
        entries.push({
          loc: `${site.baseUrl.replace(/\/$/, '')}/${a.slug}`,
          title: a.title,
          publicationDate: a.publishedAt.toISOString(),
          siteName: site.title,
          language: site.language,
        });
      });
    }

    const root = create({ version: '1.0' }).ele('urlset', {
      xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
      'xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9',
    });

    entries.forEach((entry) => {
      const url = root.ele('url');
      url.ele('loc').txt(entry.loc);
      const news = url.ele('news:news');
      const publication = news.ele('news:publication');
      publication.ele('news:name').txt(entry.siteName);
      publication.ele('news:language').txt(entry.language);
      news.ele('news:publication_date').txt(entry.publicationDate);
      news.ele('news:title').txt(entry.title);
    });

    return root.end({ prettyPrint: true });
  }
}
