import { Module } from '@nestjs/common';
import { RssController } from './rss.controller';
import { RssService } from './rss.service';

@Module({ providers: [RssService], controllers: [RssController], exports: [RssService] })
export class RssModule {}
