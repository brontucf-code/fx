import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  @Get()
  list() {
    return { message: 'authors endpoint ready' };
  }
}
