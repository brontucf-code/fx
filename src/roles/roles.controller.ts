import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  @Get()
  list() {
    return { items: ['admin', 'editor', 'reviewer'] };
  }
}
