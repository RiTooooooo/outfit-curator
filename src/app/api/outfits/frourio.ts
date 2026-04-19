import type { FrourioSpec } from "@frourio/next";
import { z } from "zod";

const outfitSchema = z.object({
  id: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  order: z.number(),
});

export const frourioSpec = {
  get: {
    query: z.object({ styleTypeSlug: z.string() }),
    res: { 200: { body: z.array(outfitSchema) } },
  },
} satisfies FrourioSpec;
