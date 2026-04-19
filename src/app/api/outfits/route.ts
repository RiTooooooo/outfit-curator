import { getPresignedUrl } from "server/lib/s3Client";
import { prismaClient } from "server/lib/prismaClient";
import { createRoute } from "./frourio.server";

export const { GET } = createRoute({
  get: async ({ query }) => {
    const styleType = await prismaClient.styleType.findUnique({
      where: { slug: query.styleTypeSlug },
      include: { outfits: { orderBy: { order: "asc" } } },
    });

    if (styleType === null) {
      return { status: 200, body: [] };
    }

    const outfits = await Promise.all(
      styleType.outfits.map(async (outfit) => ({
        id: outfit.id,
        title: outfit.title,
        imageUrl: await getPresignedUrl(outfit.s3Key),
        order: outfit.order,
      })),
    );

    return { status: 200, body: outfits };
  },
});
