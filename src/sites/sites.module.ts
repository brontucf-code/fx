import { Module } from '@nestjs/common';
import { SitesController } from './sites.controller';
import { SitesService } from './sites.service';

@Module({ providers: [SitesService], controllers: [SitesController], exports: [SitesService] })
export class SitesModule {}
