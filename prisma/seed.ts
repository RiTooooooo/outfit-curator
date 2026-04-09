import fs from "fs";
import path from "path";
import { prismaClient } from "../server/lib/prismaClient";
import { putObject } from "../server/lib/s3Client";
import { questions } from "./seeds/questionsData";
import { styleTypes } from "./seeds/styleTypesData";

async function uploadOutfits(
  slug: string,
): Promise<{ title: string; s3Key: string; order: number }[]> {
  const imagesDir = path.join(__dirname, "seeds", "images", slug);
  const outfits: { title: string; s3Key: string; order: number }[] = [];

  if (!fs.existsSync(imagesDir)) {
    console.log(`  [skip] 画像ディレクトリが見つかりません: ${imagesDir}`);
    return outfits;
  }

  const files = fs
    .readdirSync(imagesDir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const s3Key = `outfits/${slug}/${file}`;
    const filePath = path.join(imagesDir, file);
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(file).toLowerCase();
    const contentType =
      ext === ".png"
        ? "image/png"
        : ext === ".webp"
          ? "image/webp"
          : "image/jpeg";

    await putObject(s3Key, buffer, contentType);
    console.log(`  [upload] ${s3Key}`);

    outfits.push({
      title: `${slug} コーデ ${i + 1}`,
      s3Key,
      order: i + 1,
    });
  }

  return outfits;
}

async function main(): Promise<void> {
  console.log("🌱 Seed 開始...\n");

  // 既存データをクリア（冪等性：何度実行しても同じ結果になるように）
  await prismaClient.diagnosisResult.deleteMany();
  await prismaClient.outfit.deleteMany();
  await prismaClient.styleTypeTag.deleteMany();
  await prismaClient.choice.deleteMany();
  await prismaClient.question.deleteMany();
  await prismaClient.styleType.deleteMany();

  // 1. StyleType + StyleTypeTag を投入
  console.log("StyleType を作成中...");
  const createdStyleTypes: Record<string, string> = {}; // slug → id

  for (const st of styleTypes) {
    const created = await prismaClient.styleType.create({
      data: {
        name: st.name,
        slug: st.slug,
        description: st.description,
        catchphrase: st.catchphrase,
        styleTypeTags: {
          create: st.tags,
        },
      },
    });
    createdStyleTypes[st.slug] = created.id;
    console.log(`  ✓ ${st.name} (${st.slug})`);
  }

  // 2. Question + Choice を投入
  console.log("\nQuestion を作成中...");
  for (const q of questions) {
    await prismaClient.question.create({
      data: {
        order: q.order,
        text: q.text,
        choices: {
          create: q.choices,
        },
      },
    });
    console.log(`  ✓ Q${q.order}: ${q.text}`);
  }

  // 3. Outfit を投入（画像アップロード含む）
  console.log("\nOutfit を作成中...");
  for (const st of styleTypes) {
    const styleTypeId = createdStyleTypes[st.slug];
    const outfits = await uploadOutfits(st.slug);

    if (outfits.length > 0) {
      await prismaClient.outfit.createMany({
        data: outfits.map((o) => ({ ...o, styleTypeId, description: null })),
      });
      console.log(`  ✓ ${st.slug}: ${outfits.length} 件`);
    }
  }

  console.log("\n✅ Seed 完了!");
}

main()
  .catch((e: unknown) => {
    console.error("❌ Seed 失敗:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
