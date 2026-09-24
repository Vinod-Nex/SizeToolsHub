import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const converters = defineCollection({
  loader: glob({ base: './src/content/converters', pattern: '**/*.{md,json}' }),
  schema: z.object({
    title: z.string(),
    primaryKeyword: z.string(),
    metaDescription: z.string(),
    canonicalUrl: z.string().optional(),
    directAnswer: z.string().optional(),
    converterType: z.string(),
    fromUnit: z.string(),
    toUnit: z.string(),
    faq: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    ),
  }),
});

export const collections = {
  converters,
};
