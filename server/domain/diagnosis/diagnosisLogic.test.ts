import { expect, test } from "vitest";
import { calcDiagnosis } from "./diagnosisLogic";

const styleTypes = [
  {
    slug: "mode",
    styleTypeTags: [{ tag: "mode", weight: 1 }],
  },
  {
    slug: "casual",
    styleTypeTags: [{ tag: "casual", weight: 1 }],
  },
  {
    slug: "classic",
    styleTypeTags: [{ tag: "classic", weight: 1 }],
  },
];

test("最も多く票が入ったスタイルタイプを返す", () => {
  const choices = [
    { tags: ["mode"] },
    { tags: ["mode"] },
    { tags: ["casual"] },
  ];
  // mode: 2票, casual: 1票, classic: 0票
  expect(calcDiagnosis(choices, styleTypes)).toBe("mode");
});

test("選択肢が classic に偏っている場合は classic を返す", () => {
  const choices = [
    { tags: ["classic"] },
    { tags: ["classic"] },
    { tags: ["mode"] },
  ];
  // classic: 2票, mode: 1票
  expect(calcDiagnosis(choices, styleTypes)).toBe("classic");
});

test("全く無関係なタグのみの場合は最初のスタイルタイプを返す（スコア全員0）", () => {
  const choices = [{ tags: ["unknown-tag"] }];
  expect(calcDiagnosis(choices, styleTypes)).toBe("mode");
});

test("styleTypes が空のとき例外を投げる", () => {
  expect(() => calcDiagnosis([{ tags: ["mode"] }], [])).toThrow(
    "styleTypes が空です",
  );
});
