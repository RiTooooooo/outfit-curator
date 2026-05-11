// DB に依存しない純粋関数。テストしやすいようにドメイン層に置く。

type ChoiceForDiagnosis = {
  tags: string[];
};

type StyleTypeForDiagnosis = {
  slug: string;
};

/**
 * 選択された選択肢のタグからスタイルタイプを診断する。
 *
 * choice.tags にはスタイルタイプの slug が入っている前提。
 * 各 slug の出現回数を数え、最も多く票が入った slug を返す。
 *
 * @param choices    ユーザーが選んだ選択肢（各選択肢は tags を持つ）
 * @param styleTypes 全スタイルタイプ（slug のみ参照）
 * @returns          最も多く票が入ったスタイルタイプの slug。
 *                   全員0票の場合は styleTypes 配列の先頭を返す。
 */
export function calcDiagnosis(
  choices: ChoiceForDiagnosis[],
  styleTypes: StyleTypeForDiagnosis[],
): string {
  if (styleTypes.length === 0) {
    throw new Error("styleTypes が空です");
  }

  // 1. 選択肢のタグ出現回数を集計
  //    例: { mode: 3, casual: 1, classic: 1 }
  const tagCounts: Record<string, number> = {};
  for (const choice of choices) {
    for (const tag of choice.tags) {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    }
  }

  // 2. 各スタイルタイプの票数を取得
  const scores = styleTypes.map((st) => ({
    slug: st.slug,
    score: tagCounts[st.slug] ?? 0,
  }));

  // 3. 最高得票の slug を返す（同点の場合は配列先頭を優先）
  const winner = scores.reduce((best, current) =>
    current.score > best.score ? current : best,
  );

  return winner.slug;
}
