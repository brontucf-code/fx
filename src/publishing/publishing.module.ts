import { Module } from '@nestjs/common';
import { PublishingController } from './publishing.controller';
import { PublishingService } from './publishing.service';
import { SeoModule } from '../seo/seo.module';

@Module({ imports: [SeoModule], providers: [PublishingService], controllers: [PublishingController], exports: [PublishingService] })
export class PublishingModule {}
