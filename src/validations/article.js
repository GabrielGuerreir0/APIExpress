const { z } = require("zod");

const base = {
  title: z.string().min(3),
  subtitle: z.string().optional(),
  content: z.string().min(10),
  coverImageUrl: z.string().url().optional(),
  status: z.enum(["draft", "scheduled", "published"]).optional(),
  publishAt: z.coerce.date().optional(),
  categorySlug: z.string().optional(),
  tagSlugs: z.array(z.string()).optional(),
  slug: z.string().optional(),
};

exports.createArticleSchema = z.object(base);
exports.updateArticleSchema = z.object({
  title: base.title.optional(),
  subtitle: base.subtitle,
  content: base.content.optional(),
  coverImageUrl: base.coverImageUrl,
  status: base.status,
  publishAt: base.publishAt,
  categorySlug: base.categorySlug,
  tagSlugs: base.tagSlugs,
  slug: base.slug,
});
