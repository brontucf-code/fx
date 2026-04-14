import { Module } from '@nestjs/common';
import { SitemapController } from './sitemap.controller';
import { SitemapService } from './sitemap.service';

@Module({ providers: [SitemapService], controllers: [SitemapController], exports: [SitemapService] })
export class SitemapModule {}
