import type { FrourioSpec } from "@frourio/next";
import { z } from "zod";

const diagnosisResultSchema = z.object({
  id: z.string(),
  styleType: z.object({
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    catchphrase: z.string(),
  }),
});

export const frourioSpec = {
  post: {
    body: z.object({
      choiceIds: z.array(z.string()),
      sessionId: z.string(),
    }),
    res: {
      200: { body: diagnosisResultSchema },
    },
  },
} satisfies FrourioSpec;
