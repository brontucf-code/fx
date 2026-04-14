import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SitemapService } from './sitemap.service';

@ApiTags('sitemap')
@Controller()
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get('/sitemap.xml')
  @Header('Content-Type', 'application/xml')
  sitemap(@Query('siteCode') siteCode?: string) {
    return this.sitemapService.buildSitemap(siteCode);
  }

  @Get('/news-sitemap.xml')
  @Header('Content-Type', 'application/xml')
  newsSitemap(@Query('siteCode') siteCode?: string) {
    return this.sitemapService.buildNewsSitemap(siteCode);
  }
}
