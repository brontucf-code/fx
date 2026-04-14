import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RssService } from './rss.service';

@ApiTags('rss')
@Controller()
export class RssController {
  constructor(private readonly rssService: RssService) {}

  @Get('/rss.xml')
  @Header('Content-Type', 'application/xml')
  feed(@Query('siteCode') siteCode?: string) {
    return this.rssService.buildFeed(siteCode);
  }
}
