import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  @Get()
  overview() {
    return { message: 'analytics endpoint ready' };
  }
}
