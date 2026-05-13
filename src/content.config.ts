import { defineCollection } from "astro:content";
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';


const menu = defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/data" }),
    schema: ({ image }) => z.array(z.object({
        name: z.string(),
        thumbnail: image(),
        description: z.string()
    }))
});

export const collections = { menu };