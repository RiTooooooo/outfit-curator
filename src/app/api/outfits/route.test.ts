import { prismaClient } from "server/lib/prismaClient";
import { expect, test } from "vitest";
import { GET } from "./route";

test("GET /api/outfits は styleTypeSlug に一致する outfit を返す", async () => {
  const styleType = await prismaClient.styleType.create({
    data: {
      slug: "test-type",
      name: "テストタイプ",
      description: "テスト用のスタイルタイプ",
      catchphrase: "テストキャッチ",
      outfits: {
        create: [
          { title: "コーデA", s3Key: "outfits/test-type/a.jpg", order: 1 },
          { title: "コーデB", s3Key: "outfits/test-type/b.jpg", order: 2 },
        ],
      },
    },
  });

  const res = await GET(
    new Request(`http://localhost/api/outfits?styleTypeSlug=${styleType.slug}`),
  );
  const body = (await res.json()) as {
    id: string;
    title: string;
    imageUrl: string;
    order: number;
  }[];

  expect(res.status).toBe(200);
  expect(body).toHaveLength(2);
  expect(body[0].title).toBe("コーデA");
  expect(body[0].order).toBe(1);
  expect(body[0].imageUrl).toContain("a.jpg");
  expect(body[1].title).toBe("コーデB");
});

test("GET /api/outfits は存在しない slug のとき空配列を返す", async () => {
  const res = await GET(
    new Request("http://localhost/api/outfits?styleTypeSlug=non-existent"),
  );
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body).toEqual([]);
});
