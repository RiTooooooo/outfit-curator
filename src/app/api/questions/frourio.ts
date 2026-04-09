import type { FrourioSpec } from "@frourio/next";
import { z } from "zod";

const choiceSchema = z.object({
  id: z.string(),
  text: z.string(),
  tags: z.array(z.string()),
});

const questionSchema = z.object({
  id: z.string(),
  order: z.number(),
  text: z.string(),
  choices: z.array(choiceSchema),
});

export const frourioSpec = {
  get: {
    res: {
      200: { body: z.array(questionSchema) },
    },
  },
} satisfies FrourioSpec;
