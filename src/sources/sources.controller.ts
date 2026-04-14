import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('sources')
@Controller('sources')
export class SourcesController {
  @Get()
  list() {
    return { message: 'sources endpoint ready' };
  }
}
