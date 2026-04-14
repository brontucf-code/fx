import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GenerationService } from './generation.service';
import { KeywordGenerationDto, RewriteGenerationDto } from './dto/generation.dto';

@ApiTags('generation')
@Controller('generation')
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Post('keyword')
  fromKeyword(@Body() dto: KeywordGenerationDto) {
    return this.generationService.generateFromKeyword(dto.keyword, dto.articleType, dto.language, dto.siteId);
  }

  @Post('rewrite')
  rewrite(@Body() dto: RewriteGenerationDto) {
    return this.generationService.rewriteFromSource(dto.sourceText, dto.sourceUrl, dto.articleType, dto.language, dto.siteId);
  }

  @Post(':articleId/seo')
  generateSeo(@Param('articleId') articleId: string) {
    return this.generationService.generateSeoMeta(articleId);
  }

  @Post(':articleId/faq')
  faq(@Param('articleId') articleId: string) {
    return this.generationService.generateFaq(articleId);
  }

  @Post(':articleId/internal-links')
  links(@Param('articleId') articleId: string) {
    return this.generationService.suggestInternalLinks(articleId);
  }
}
