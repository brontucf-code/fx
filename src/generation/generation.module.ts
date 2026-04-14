import { Module } from '@nestjs/common';
import { GenerationController } from './generation.controller';
import { GenerationService } from './generation.service';
import { ArticlesModule } from '../articles/articles.module';
import { SeoModule } from '../seo/seo.module';

@Module({ imports: [ArticlesModule, SeoModule], providers: [GenerationService], controllers: [GenerationController] })
export class GenerationModule {}
