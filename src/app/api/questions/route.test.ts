import { prismaClient } from "server/lib/prismaClient";
import { expect, test } from "vitest";
import { GET } from "./route";

test("GET /api/questions は質問を order 昇順で返す", async () => {
  await prismaClient.question.create({
    data: {
      order: 99,
      text: "2番目の質問",
      choices: { create: [{ text: "選択肢A", tags: ["cool"] }] },
    },
  });
  await prismaClient.question.create({
    data: {
      order: 98,
      text: "1番目の質問",
      choices: {
        create: [
          { text: "選択肢B", tags: ["natural", "relax"] },
          { text: "選択肢C", tags: ["elegant"] },
        ],
      },
    },
  });

  const res = await GET(new Request("http://localhost/api/questions"));
  const body = (await res.json()) as {
    id: string;
    order: number;
    text: string;
    choices: { id: string; text: string; tags: string[] }[];
  }[];

  expect(res.status).toBe(200);
  expect(body.length).toBeGreaterThanOrEqual(2);

  const q98 = body.find((q) => q.order === 98);
  const q99 = body.find((q) => q.order === 99);

  expect(q98).toBeDefined();
  expect(q98?.text).toBe("1番目の質問");
  expect(q98?.choices).toHaveLength(2);
  expect(q98?.choices[0].tags).toEqual(["natural", "relax"]);

  expect(q99).toBeDefined();
  expect(q99?.text).toBe("2番目の質問");

  const q98Index = body.findIndex((q) => q.order === 98);
  const q99Index = body.findIndex((q) => q.order === 99);

  expect(q98Index).toBeLessThan(q99Index);
});
