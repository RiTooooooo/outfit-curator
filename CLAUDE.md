@AGENTS.md

## アプリ概要

ステップ進行式の5問診断でユーザーの好みのスタイル・シーン・色・季節・雰囲気を判定し、マッチするコーディネート画像一覧を表示するWebアプリ。画像はフリー素材をMinIO（S3互換）に保存してSeedで投入。外部API依存なし。

## 技術スタック

- Next.js 16.2.1 (App Router) / TypeScript / React 19
- Prisma 6 + PostgreSQL（Docker）
- Frourio (@frourio/next) でAPI型安全化
- Zod v4 でバリデーション
- SWR でクライアントサイドデータフェッチ
- MinIO（S3互換）で画像ホスト
- Vitest + MSW + Testing Library でテスト
- CSS Modules のみ（外部アニメーションライブラリなし）

## 設計方針

- **軽量DDD**を採用:
  - `server/domain/` — ビジネスロジック（DBに依存しない純粋関数）
  - `server/service/` — ユースケース（DBアクセスとドメインロジックを繋ぐ）
  - `server/lib/` — インフラ（Prisma Client、S3 Client等）
- 診断ロジック: 選択肢の `tags` を集計 → `StyleTypeTag` の `weight` でスコア計算 → 最高スコアの `StyleType` が結果
- 認証は現時点では不要（将来追加前提で `DiagnosisResult.sessionId` を用意）
- 画像は `prisma/seeds/images/{slug}/` に配置 → Seedで MinIO にアップロード

## 現在の進捗

### 完了

- [x] `prisma/schema.prisma` にモデル定義（Question, Choice, StyleType, StyleTypeTag, Outfit, DiagnosisResult）
- [x] マイグレーション実行済み（`prisma/migrations/20260405060611_add_diagnosis_models/`）
- [x] `server/lib/s3Client.ts` 作成済み（`putObject`, `getPresignedUrl`）
- [x] `server/lib/transaction.ts` 作成済み（P2028/P2034 エラー時に最大3回再帰リトライ）
- [x] `package.json` に `prisma.seed` 設定と `tsx ^4.19.4` を追加
- [x] `prisma/seed.ts` 作成済み（StyleType + tags, Question + Choice, Outfit/MinIO アップロード）
  - データ定義は `prisma/seeds/styleTypesData.ts` と `prisma/seeds/questionsData.ts` に分離
- [x] `GET /api/questions` を Frourio パターンで実装（`frourio.ts` + `route.ts` + `route.test.ts`）
- [x] git commit: `feat: add transaction helper, seed, and GET /api/questions` [main d7f7b4d]
- [x] `server/domain/diagnosis/diagnosisLogic.ts` 作成済み（純粋関数、テスト4件合格）
- [x] git commit: `feat: add diagnosisLogic domain function and tests` [main 2c80dae]
- [x] `POST /api/diagnoses` を Frourio パターンで実装（`frourio.ts` + `route.ts` + `server/service/diagnosisService.ts` + テスト）
- [x] git commit: `feat: add POST /api/diagnoses with service layer and tests` [main e6bc794]
- [x] Phase 1: デザインシステム（`src/app/globals.css` CSS変数、`src/app/layout.tsx` に Inter フォント追加、メタデータ日本語化）

### 既知のESLint設定（要注意）

- `eslint.config.ts` にて以下のファイルパターンで `no-unsafe-*` ルールを緩和済み:
  - `prisma/**/*.ts` — Prismaの動的生成型をESLintが解決できないため
  - `src/app/**/route.ts` — 同上、`require-await: off` も追加
  - `**/*.test.{ts,tsx}` — `explicit-function-return-type: off` も追加済み
- VS Code エディタ上のESLintエラーは `npx tsc` / `npx eslint` で実害がないか確認してから判断すること

### デザインシステム（globals.css）で定義した主なCSS変数

```css
--color-blue: #0071e3; /* Appleシグネチャーブルー */
--color-bg-secondary: #f5f5f7; /* ライトグレー背景 */
--color-text-primary: #1d1d1f; /* ほぼブラック */
--color-text-secondary: #6e6e73; /* サブテキスト */
--max-width: 980px;
--font-sans: var(--font-inter), -apple-system, ...;
```

### 次のタスク（この順で進める）

1. Phase 4: トップページ刷新（`src/app/page.tsx` + `src/app/page.module.css`）
2. Phase 5: 診断ページ（`src/app/diagnosis/page.tsx`）
3. Phase 6: 結果ページ（`src/app/diagnosis/result/page.tsx`）

## データモデル概要

```
Question (質問マスタ)
  └── Choice[] (選択肢。tags: String[] でスコアに影響するラベルを持つ)

StyleType (診断結果タイプ。固定5種)
  ├── StyleTypeTag[] (タグと重み。スコア計算に使う)
  ├── Outfit[] (コーディネート画像。s3Key でMinIOを参照)
  └── DiagnosisResult[] (診断ログ)

DiagnosisResult (診断結果ログ。sessionId で匿名ユーザー識別)
```

## スタイルタイプ一覧（Seedで投入予定）

| slug           | name                 |
| -------------- | -------------------- |
| natural-relax  | ナチュラルリラックス |
| cool-mode      | クールモード         |
| elegant-formal | エレガントフォーマル |
| casual-street  | カジュアルストリート |
| feminine-sweet | フェミニンスウィート |

## Frourioパターン（APIの書き方）

```typescript
// frourio.ts (型定義)
import { z } from 'zod'
import { defineRoute } from '@frourio/next'

export default defineRoute({
  get: { resBody: z.array(questionSchema) }
})

// route.ts (実装)
import { createRoute } from './frourio.server'

export const { GET } = createRoute({
  GET: async () => {
    const questions = await prismaClient.question.findMany(...)
    return { status: 200, body: questions }
  }
})
```

## 開発コマンド

```bash
docker compose up -d          # DB + MinIO 起動
npx prisma migrate dev        # マイグレーション
npx prisma db seed            # Seedデータ投入
npm run dev                   # 開発サーバー起動
npm test                      # テスト実行
```
