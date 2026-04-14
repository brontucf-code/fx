import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RssService {
  constructor(private readonly prisma: PrismaService) {}

  async buildFeed(siteCode?: string) {
    const site = await this.prisma.site.findFirst({ where: siteCode ? { code: siteCode } : undefined });
    if (!site) return '';
    const items = await this.prisma.article.findMany({ where: { siteId: site.id, status: 'published' }, orderBy: { publishedAt: 'desc' }, take: 50 });
    const root = create({ version: '1.0' }).ele('rss', { version: '2.0' });
    const channel = root.ele('channel');
    channel.ele('title').txt(site.title);
    channel.ele('link').txt(site.baseUrl);
    channel.ele('description').txt(site.description ?? 'Finance news feed');
    items.forEach((article) => {
      const item = channel.ele('item');
      item.ele('title').txt(article.title);
      item.ele('link').txt(`${site.baseUrl.replace(/\/$/, '')}/${article.slug}`);
      item.ele('description').txt(article.summary ?? '');
      if (article.publishedAt) item.ele('pubDate').txt(article.publishedAt.toUTCString());
    });
    return root.end({ prettyPrint: true });
  }
}
