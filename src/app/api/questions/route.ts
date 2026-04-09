import { prismaClient } from "server/lib/prismaClient";
import { createRoute } from "./frourio.server";

export const { GET } = createRoute({
  get: async () => {
    const questions = await prismaClient.question.findMany({
      orderBy: { order: "asc" },
      include: {
        choices: { select: { id: true, text: true, tags: true } },
      },
    });

    return {
      status: 200,
      body: questions.map((q) => ({
        id: q.id,
        order: q.order,
        text: q.text,
        choices: q.choices,
      })),
    };
  },
});
