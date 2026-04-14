import slugify from 'slugify';

export const sanitizeHtml = (input: string): string => input.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');

export const generateSlug = (text: string): string =>
  slugify(text, { lower: true, strict: true, locale: 'en' }).slice(0, 80);

export const estimateReadingTime = (text: string): number => {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 220));
};

export const summarize = (markdown: string, maxLength = 160): string => {
  const cleaned = markdown.replace(/[#>*`\-\n]/g, ' ').replace(/\s+/g, ' ').trim();
  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength - 1)}…` : cleaned;
};
