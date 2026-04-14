import { Module } from '@nestjs/common';
import { AuthorsController } from './authors.controller';

@Module({ controllers: [AuthorsController] })
export class AuthorsModule {}
