import { Module } from '@nestjs/common';
import { SeoController } from './seo.controller';
import { SeoService } from './seo.service';

@Module({ providers: [SeoService], controllers: [SeoController], exports: [SeoService] })
export class SeoModule {}
