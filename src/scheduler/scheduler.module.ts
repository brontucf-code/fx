import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { PublishingModule } from '../publishing/publishing.module';

@Module({ imports: [PublishingModule], providers: [SchedulerService], controllers: [SchedulerController] })
export class SchedulerModule {}
