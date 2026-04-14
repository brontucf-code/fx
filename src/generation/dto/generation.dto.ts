import { ApiProperty } from '@nestjs/swagger';
import { ArticleType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class KeywordGenerationDto {
  @ApiProperty()
  @IsString()
  keyword: string;

  @ApiProperty({ enum: ArticleType })
  @IsEnum(ArticleType)
  articleType: ArticleType;

  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsString()
  siteId: string;
}

export class RewriteGenerationDto {
  @ApiProperty()
  @IsString()
  sourceText: string;

  @ApiProperty()
  @IsString()
  sourceUrl: string;

  @ApiProperty({ enum: ArticleType })
  @IsEnum(ArticleType)
  articleType: ArticleType;

  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsString()
  siteId: string;
}
