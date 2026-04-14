import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('media')
@Controller('media')
export class MediaController {
  @Get()
  list() {
    return { message: 'media endpoint ready' };
  }
}
