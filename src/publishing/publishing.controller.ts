import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublishingService } from './publishing.service';

@ApiTags('publishing')
@Controller('publishing')
export class PublishingController {
  constructor(private readonly publishingService: PublishingService) {}

  @Post(':articleId/publish')
  publish(@Param('articleId') articleId: string) {
    return this.publishingService.publishNow(articleId);
  }

  @Post(':articleId/schedule')
  schedule(@Param('articleId') articleId: string, @Body('scheduledAt') scheduledAt: string) {
    return this.publishingService.schedule(articleId, new Date(scheduledAt));
  }

  @Post('run-scan')
  scan() {
    return this.publishingService.scanAndPublishDue();
  }
}
