import { calcDiagnosis } from "../domain/diagnosis/diagnosisLogic";
import { prismaClient } from "../lib/prismaClient";
import { transaction } from "../lib/transaction";

type DiagnosisServiceResult = {
  id: string;
  styleType: {
    slug: string;
    name: string;
    description: string;
    catchphrase: string;
  };
};

export async function diagnosisService(
  choiceIds: string[],
  sessionId: string,
): Promise<DiagnosisServiceResult> {
  // 1. 選択された選択肢のタグを取得
  const choices = await prismaClient.choice.findMany({
    where: { id: { in: choiceIds } },
    select: { tags: true },
  });

  // 2. 全スタイルタイプとそのタグ・重みを取得
  const styleTypes = await prismaClient.styleType.findMany({
    include: {
      styleTypeTags: { select: { tag: true, weight: true } },
    },
  });

  // 3. ドメイン層でスタイルタイプを決定
  const winnerSlug = calcDiagnosis(choices, styleTypes);
  const winnerStyleType = styleTypes.find((st) => st.slug === winnerSlug);

  if (winnerStyleType === undefined) {
    throw new Error(`StyleType が見つかりません: ${winnerSlug}`);
  }

  // 4. トランザクション内で診断結果を保存
  const result = await transaction("RepeatableRead", async (tx) => {
    return tx.diagnosisResult.create({
      data: {
        sessionId,
        styleTypeId: winnerStyleType.id,
        answers: choiceIds,
      },
      select: {
        id: true,
        styleType: {
          select: {
            slug: true,
            name: true,
            description: true,
            catchphrase: true,
          },
        },
      },
    });
  });

  return result;
}
