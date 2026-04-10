// DB に依存しない純粋関数。テストしやすいようにドメイン層に置く。

type ChoiceForDiagnosis = {
  tags: string[];
};

type StyleTypeTagForDiagnosis = {
  tag: string;
  weight: number;
};

type StyleTypeForDiagnosis = {
  slug: string;
  styleTypeTags: StyleTypeTagForDiagnosis[];
};

/**
 * 選択された選択肢のタグからスタイルタイプを診断する。
 *
 * @param choices   ユーザーが選んだ選択肢（各選択肢は tags を持つ）
 * @param styleTypes DBから取得したスタイルタイプ一覧（styleTypeTags 含む）
 * @returns 最も高いスコアのスタイルタイプの slug
 */
export function calcDiagnosis(
  choices: ChoiceForDiagnosis[],
  styleTypes: StyleTypeForDiagnosis[],
): string {
  if (styleTypes.length === 0) {
    throw new Error("styleTypes が空です");
  }

  // 1. 選択肢のタグ出現回数を集計
  //    例: { natural: 2, relax: 3, cool: 1 }
  const tagCounts: Record<string, number> = {};
  for (const choice of choices) {
    for (const tag of choice.tags) {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    }
  }

  // 2. 各スタイルタイプのスコアを計算
  //    スコア = Σ (タグ出現回数 × weight)
  const scores = styleTypes.map((st) => {
    const score = st.styleTypeTags.reduce((sum, { tag, weight }) => {
      return sum + (tagCounts[tag] ?? 0) * weight;
    }, 0);
    return { slug: st.slug, score };
  });

  // 3. 最高スコアの slug を返す（同スコアの場合は先頭を優先）
  const winner = scores.reduce((best, current) =>
    current.score > best.score ? current : best,
  );

  return winner.slug;
}
