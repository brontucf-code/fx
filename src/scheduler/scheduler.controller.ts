import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublishingService } from '../publishing/publishing.service';

@ApiTags('scheduler')
@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly publishingService: PublishingService) {}

  @Post('scan')
  runScan() {
    return this.publishingService.scanAndPublishDue();
  }
}
