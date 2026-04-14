import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  @Get()
  list() {
    return { message: 'tags endpoint ready' };
  }
}
