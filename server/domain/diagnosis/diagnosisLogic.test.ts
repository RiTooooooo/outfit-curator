import { expect, test } from "vitest";
import { calcDiagnosis } from "./diagnosisLogic";

const styleTypes = [
  {
    slug: "natural-relax",
    styleTypeTags: [
      { tag: "natural", weight: 3 },
      { tag: "relax", weight: 3 },
      { tag: "earth", weight: 2 },
    ],
  },
  {
    slug: "cool-mode",
    styleTypeTags: [
      { tag: "cool", weight: 3 },
      { tag: "monochrome", weight: 3 },
      { tag: "minimal", weight: 2 },
    ],
  },
  {
    slug: "elegant-formal",
    styleTypeTags: [
      { tag: "elegant", weight: 3 },
      { tag: "formal", weight: 3 },
      { tag: "sophisticated", weight: 2 },
    ],
  },
];

test("最も多く選ばれたタグに対応するスタイルタイプを返す", () => {
  const choices = [
    { tags: ["natural", "relax"] }, // natural-relax に強く一致
    { tags: ["natural", "earth"] },
    { tags: ["cool", "monochrome"] },
  ];
  // natural: 2回, relax: 1回, earth: 1回, cool: 1回, monochrome: 1回
  // natural-relax スコア = 2*3 + 1*3 + 1*2 = 11
  // cool-mode スコア    = 1*3 + 1*3 + 0*2 = 6
  // elegant-formal スコア = 0
  expect(calcDiagnosis(choices, styleTypes)).toBe("natural-relax");
});

test("選択肢が cool 系に偏っている場合は cool-mode を返す", () => {
  const choices = [
    { tags: ["cool", "monochrome"] },
    { tags: ["cool", "minimal"] },
    { tags: ["monochrome"] },
  ];
  // cool: 2回, monochrome: 2回, minimal: 1回
  // cool-mode スコア = 2*3 + 2*3 + 1*2 = 14
  expect(calcDiagnosis(choices, styleTypes)).toBe("cool-mode");
});

test("全く無関係なタグのみの場合は最初のスタイルタイプを返す（スコア全員0）", () => {
  const choices = [{ tags: ["unknown-tag"] }];
  expect(calcDiagnosis(choices, styleTypes)).toBe("natural-relax");
});

test("styleTypes が空のとき例外を投げる", () => {
  expect(() => calcDiagnosis([{ tags: ["natural"] }], [])).toThrow(
    "styleTypes が空です",
  );
});
