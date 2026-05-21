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
    comments: z.boolean().optional().default(true),
    sidebar: sidebarSchema,
  });

const commentProviderSchema = z.enum(['giscus', 'utterances', 'waline', 'none']);
const paletteSchema = z.enum([
  'green-soft',
  'green-vivid',
  'rose-soft',
  'pink-soft',
  'purple-soft',
  'blue-soft',
  'orange-soft',
  'brown-soft',
]);

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
    vibe: z
      .object({
        showTrail: z.boolean().optional().default(true),
      })
      .optional()
      .default({ showTrail: true }),
    theme: z
      .object({
        palette: paletteSchema.optional().default('green-soft'),
      })
      .optional()
      .default({
        palette: 'green-soft',
      }),
    comments: z
      .object({
        enabled: z.boolean().optional().default(true),
        provider: commentProviderSchema.optional().default('giscus'),
        show_on_posts: z.boolean().optional().default(true),
        giscus: z
          .object({
            repo: z.string().optional().default(''),
            repo_id: z.string().optional().default(''),
            category: z.string().optional().default(''),
            category_id: z.string().optional().default(''),
            mapping: z.string().optional().default('pathname'),
            strict: z.string().optional().default('0'),
            reactions_enabled: z.string().optional().default('1'),
            emit_metadata: z.string().optional().default('0'),
            input_position: z.string().optional().default('bottom'),
            theme: z.string().optional().default('preferred_color_scheme'),
            lang: z.string().optional().default('zh-CN'),
            loading: z.string().optional().default('lazy'),
          })
          .optional()
          .default({}),
        utterances: z
          .object({
            repo: z.string().optional().default(''),
            issue_term: z.string().optional().default('pathname'),
            label: z.string().optional().default('comment'),
            theme: z.string().optional().default('github-light'),
          })
          .optional()
          .default({}),
        waline: z
          .object({
            server_url: z.string().optional().default(''),
            lang: z.string().optional().default('zh-CN'),
            dark: z.string().optional().default('html.dark'),
            pageview: z.boolean().optional().default(true),
            comment: z.boolean().optional().default(true),
          })
          .optional()
          .default({}),
      })
      .optional()
      .default({}),
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
    search: z
      .object({
        enabled: z.boolean().optional().default(true),
        shortcut: z.enum(['mod+k']).optional().default('mod+k'),
        placeholder: z.string().optional().default('Search notes...'),
        maxResults: z.number().int().positive().optional().default(6),
      })
      .optional()
      .default({
        enabled: true,
        shortcut: 'mod+k',
        placeholder: 'Search notes...',
        maxResults: 6,
      }),
    blog: z
      .object({
        postsPerPage: z.number().int().positive().optional().default(6),
      })
      .optional()
      .default({
        postsPerPage: 6,
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
          heatmapWeeks: z.number().int().positive().default(24),
          showHeatmapLatest: z.boolean().optional().default(true),
          excludeDraft: z.boolean().optional().default(true),
          startDate: z.string().optional().default(''),
          dateArchiveBaseHref: z.string().optional().default(''),
        })
        .optional()
        .default({
          count: 1,
          heatmapWeeks: 24,
          showHeatmapLatest: true,
          excludeDraft: true,
          startDate: '',
          dateArchiveBaseHref: '',
        }),
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

const vibe = defineCollection({
  loader: glob({ base: './src/content/vibe', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      date: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().optional().default(false),
      type: z.enum(['text', 'photo', 'quote', 'code', 'mixed']).optional().default('text'),
      mood: z.string().optional(),
      location: z.string().optional(),
      images: z.array(image()).optional().default([]),
      tags: z.array(z.string()).optional().default([]),
      align: z.enum(['left', 'right', 'center']).optional(),
      size: z.enum(['sm', 'md', 'lg']).optional().default('md'),
    }),
});

export const collections = { about, blog, projects, vibe, siteConfig };
