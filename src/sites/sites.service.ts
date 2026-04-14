import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SitesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.site.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
