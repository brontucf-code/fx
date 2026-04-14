import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PublishingService } from '../publishing/publishing.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly publishingService: PublishingService) {}

  @Cron('*/2 * * * *')
  async handlePublishQueue() {
    const res = await this.publishingService.scanAndPublishDue();
    if (res.scanned > 0) {
      this.logger.log(`scan finished scanned=${res.scanned} published=${res.published}`);
    }
  }
}
