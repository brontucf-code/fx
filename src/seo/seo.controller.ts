import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SeoService } from './seo.service';
import { UpsertSeoDto } from './dto/upsert-seo.dto';

@ApiTags('seo')
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Post(':articleId/generate')
  generate(@Param('articleId') articleId: string) {
    return this.seoService.ensureSeo(articleId);
  }

  @Post(':articleId')
  upsert(@Param('articleId') articleId: string, @Body() dto: UpsertSeoDto) {
    return this.seoService.upsert(articleId, dto);
  }
}
