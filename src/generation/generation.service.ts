import { Injectable } from '@nestjs/common';
import { ArticleType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ArticlesService } from '../articles/articles.service';
import { SeoService } from '../seo/seo.service';

@Injectable()
export class GenerationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly articlesService: ArticlesService,
    private readonly seoService: SeoService,
  ) {}

  private template(type: ArticleType, keyword: string) {
    return `# ${keyword}\n\n## 市场概览\n围绕 ${keyword} 的最新动态...\n\n## 影响分析\n对市场、监管及平台的影响。\n\n## 风险提示\n投资有风险，入市需谨慎。\n\n模板类型：${type}`;
  }

  async generateFromKeyword(keyword: string, articleType: ArticleType, language: string, siteId: string) {
    const title = `${keyword}最新进展与市场影响`;
    const contentMarkdown = this.template(articleType, keyword);
    const article = await this.articlesService.create({
      title,
      contentMarkdown,
      articleType,
      language,
      siteId,
      status: 'draft',
      summary: `围绕 ${keyword} 的财经资讯摘要。`,
    });

    await this.prisma.generationLog.create({
      data: { siteId, articleId: article.id, promptType: 'keyword', input: keyword, output: contentMarkdown, status: 'success', model: 'mock-openai-compatible' },
    });

    return article;
  }

  async rewriteFromSource(sourceText: string, sourceUrl: string, articleType: ArticleType, language: string, siteId: string) {
    const rewritten = `${sourceText.slice(0, 500)}\n\n【编辑改写】以上内容已重组为站内稿件。`;
    const article = await this.articlesService.create({
      title: `改写：${sourceText.slice(0, 18)}`,
      contentMarkdown: rewritten,
      articleType,
      language,
      siteId,
      status: 'draft',
      summary: '来自外部资讯源的改写内容。',
    });

    await this.prisma.generationLog.create({
      data: { siteId, articleId: article.id, promptType: 'rewrite', input: sourceUrl, output: rewritten, status: 'success', model: 'mock-openai-compatible' },
    });

    return article;
  }

  generateSeoMeta(articleId: string) {
    return this.seoService.ensureSeo(articleId);
  }

  async generateFaq(articleId: string) {
    const faq = [
      { question: '这条新闻对普通投资者有什么意义？', answer: '重点关注监管表态与流动性变化。' },
      { question: '是否存在短期波动风险？', answer: '存在，建议结合风险承受能力评估。' },
    ];
    await this.prisma.seoMeta.update({ where: { articleId }, data: { faqJson: faq } });
    return faq;
  }

  async suggestInternalLinks(articleId: string) {
    const article = await this.prisma.article.findUnique({ where: { id: articleId } });
    if (!article) return [];
    const candidates = await this.prisma.article.findMany({
      where: { siteId: article.siteId, id: { not: articleId }, status: 'published' },
      take: 5,
      orderBy: { publishedAt: 'desc' },
      select: { title: true, slug: true },
    });
    return candidates.map((c) => ({ anchor: c.title.slice(0, 16), target: `/${c.slug}` }));
  }
}
