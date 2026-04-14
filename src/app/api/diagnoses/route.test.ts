import { prismaClient } from "server/lib/prismaClient";
import { expect, test } from "vitest";
import { POST } from "./route";

async function setupTestData() {
  // シードデータの slug と衝突しないようテスト用プレフィックスを使う
  const naturalRelax = await prismaClient.styleType.create({
    data: {
      name: "テスト：ナチュラル",
      slug: "test-natural-relax",
      description: "自然体のスタイル",
      catchphrase: "素材の温もりをまとう",
      styleTypeTags: {
        create: [
          { tag: "test-natural", weight: 3 },
          { tag: "test-relax", weight: 3 },
          { tag: "test-earth", weight: 2 },
        ],
      },
    },
  });

  const coolMode = await prismaClient.styleType.create({
    data: {
      name: "テスト：クール",
      slug: "test-cool-mode",
      description: "都会的なスタイル",
      catchphrase: "静かな存在感",
      styleTypeTags: {
        create: [
          { tag: "test-cool", weight: 3 },
          { tag: "test-mono", weight: 3 },
        ],
      },
    },
  });

  // Question と Choice を作成
  const question = await prismaClient.question.create({
    data: {
      order: 97,
      text: "好みのスタイルは？",
      choices: {
        create: [
          { text: "ナチュラル系", tags: ["test-natural", "test-relax"] },
          { text: "クール系", tags: ["test-cool", "test-mono"] },
        ],
      },
    },
    include: { choices: true },
  });

  return { naturalRelax, coolMode, question };
}

test("POST /api/diagnoses はタグが最も一致するスタイルタイプを返す", async () => {
  const { question } = await setupTestData();

  const naturalChoice = question.choices.find(
    (c) => c.text === "ナチュラル系",
  )!;

  const res = await POST(
    new Request("http://localhost/api/diagnoses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        choiceIds: [naturalChoice.id],
        sessionId: "test-session-001",
      }),
    }),
  );

  const body = (await res.json()) as {
    id: string;
    styleType: { slug: string; name: string };
  };

  expect(res.status).toBe(200);
  expect(body.styleType.slug).toBe("test-natural-relax");
  expect(body.styleType.name).toBe("テスト：ナチュラル");
  expect(body.id).toBeDefined();
});

test("POST /api/diagnoses は診断結果を DB に保存する", async () => {
  const { question } = await setupTestData();

  const coolChoice = question.choices.find((c) => c.text === "クール系")!;

  const res = await POST(
    new Request("http://localhost/api/diagnoses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        choiceIds: [coolChoice.id],
        sessionId: "test-session-002",
      }),
    }),
  );

  const body = (await res.json()) as { id: string };

  // DB に保存されていることを確認
  const saved = await prismaClient.diagnosisResult.findUnique({
    where: { id: body.id },
    include: { styleType: true },
  });

  expect(saved).not.toBeNull();
  expect(saved?.sessionId).toBe("test-session-002");
  expect(saved?.styleType.slug).toBe("test-cool-mode");
});
