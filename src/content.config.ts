import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

type CollectionSchemaFactory = Extract<
  Parameters<typeof defineCollection>[0]['schema'],
  (...args: any[]) => any
>;

const sidebarSchema = z
  .object({
    enable: z.boolean().optional(),
    toc: z.boolean().optional(),
    relatedPosts: z.boolean().optional(),
  })
  .optional();

const articleSchema = ({ image }: Parameters<CollectionSchemaFactory>[0]) =>
  z.object({
    title: z.string(),
    description: z.string(),
    // Creation date. Accepts ISO 8601 strings and plain dates such as YYYY-MM-DD.
    date: z.coerce.date(),
    draft: z.boolean().optional().default(false),
    heroImage: z.optional(image()),
    showHeroImage: z.boolean().optional().default(true),
    tags: z.array(z.string()).optional().default([]),
    sidebar: sidebarSchema,
  });

const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
  icon: z.string().optional(),
  disabled: z.boolean().optional().default(false),
});

const navigationItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  subtitle: z.string(),
  href: z.string(),
});

const siteConfig = defineCollection({
  loader: file('./src/config/site.toml'),
  schema: z.object({
    site: z.object({
      title: z.string(),
      description: z.string(),
      pageTitle: z.string(),
      pageDescription: z.string(),
      repository: z.string().url(),
      footerNote: z.string(),
    }),
    profile: z.object({
      name: z.string(),
      handle: z.string(),
      role: z.string(),
      company: z.string(),
      location: z.string(),
      email: z.string().email(),
      website: z.string().url(),
      github: z.string().url(),
      meta: z.string(),
      avatar: z.string(),
    }),
    topNav: z.object({
      links: z.array(linkSchema.omit({ icon: true })),
    }),
    home: z.object({
      layout: z.enum(['grid']),
      quote: z.object({
        text: z.array(z.string()).min(1),
        image: z.string(),
      }),
      intro: z.object({
        title: z.string(),
        name: z.string(),
        body: z.array(z.string()).min(1),
        image: z.string(),
      }),
      latest: z
        .object({
          count: z.number().int().positive().default(1),
        })
        .optional()
        .default({ count: 1 }),
      navigation: z.array(navigationItemSchema),
      connect: z.array(linkSchema.required({ icon: true })),
      doing: z.array(
        z.object({
          text: z.string(),
          mark: z.string(),
        }),
      ),
    }),
  }),
});

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: articleSchema,
});

const about = defineCollection({
  loader: glob({ base: './src/content', pattern: 'about.{md,mdx}' }),
  schema: articleSchema,
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: articleSchema,
});

export const collections = { about, blog, projects, siteConfig };
