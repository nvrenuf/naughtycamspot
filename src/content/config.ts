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
    featured: z.boolean().default(false),
    featuredOrder: z.number().optional(),
    platforms: z.array(platformSchema).default([]),
    profiles: z.array(z.string().url()).default([]),
    tracking: trackingSchema
  })
});

export const collections = { models };
