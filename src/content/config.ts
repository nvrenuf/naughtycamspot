import { defineCollection, z } from 'astro:content';

const platformSchema = z.object({
  name: z.string(),
  slug: z.string(),
  path: z.string(),
  placeholder: z.string().url().optional(),
  variant: z.enum(['primary', 'secondary']).optional(),
  active: z.boolean().optional(),
  kind: z.enum(['default', 'beacons']).default('default')
});

const trackingSchema = z
  .object({
    slotPrefix: z.string().optional(),
    profileCamp: z.string().optional(),
    beaconsCamp: z.string().optional()
  })
  .optional();

const models = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    archetype: z.string(),
    summary: z.string(),
    heroImage: z.string().url(),
    cardImage: z.string().url().optional(),
    gallery: z.array(z.string().url()).min(1),
    consent: z.boolean().default(false),
    quote: z.string().optional(),
    range_band: z.enum(['new', 'growing', 'top25', 'top10']).optional(),
    featured: z.boolean().default(false),
    featuredOrder: z.number().optional(),
    platforms: z.array(platformSchema).default([]),
    profiles: z.array(z.string().url()).default([]),
    tracking: trackingSchema
  })
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    excerpt: z.string(),
    publishDate: z.date(),
    category: z.string(),
    author: z.string(),
    heroImage: z.string().url(),
    heroImageAlt: z.string().optional(),
    cardImage: z.string().url().optional(),
    vipOnly: z.boolean().default(false)
  })
});

const training = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    excerpt: z.string(),
    publishDate: z.date(),
    category: z.string(),
    author: z.string(),
    heroImage: z.string().url(),
    heroImageAlt: z.string().optional(),
    cardImage: z.string().url().optional()
  })
});

export const collections = { models, blog, training };
