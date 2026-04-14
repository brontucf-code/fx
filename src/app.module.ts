import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { SitesModule } from './sites/sites.module';
import { ArticlesModule } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { AuthorsModule } from './authors/authors.module';
import { SeoModule } from './seo/seo.module';
import { SourcesModule } from './sources/sources.module';
import { PublishingModule } from './publishing/publishing.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { GenerationModule } from './generation/generation.module';
import { MediaModule } from './media/media.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { RssModule } from './rss/rss.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    SitesModule,
    ArticlesModule,
    CategoriesModule,
    TagsModule,
    AuthorsModule,
    SeoModule,
    SourcesModule,
    PublishingModule,
    SchedulerModule,
    GenerationModule,
    MediaModule,
    SitemapModule,
    RssModule,
    AnalyticsModule,
    HealthModule,
  ],
})
export class AppModule {}
