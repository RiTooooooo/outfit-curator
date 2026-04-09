export const questions = [
  {
    order: 1,
    text: "好みのファッションスタイルは？",
    choices: [
      { text: "自然素材・ゆったりシルエット", tags: ["natural", "relax"] },
      { text: "スッキリ・モノトーン", tags: ["cool", "monochrome"] },
      { text: "きちんと感・上品系", tags: ["elegant", "formal"] },
      { text: "カジュアル・動きやすい系", tags: ["casual", "street"] },
      { text: "ふわっと・かわいい系", tags: ["feminine", "sweet"] },
    ],
  },
  {
    order: 2,
    text: "よく着ていく場所・シーンは？",
    choices: [
      { text: "カフェ・公園・日常のお出かけ", tags: ["relax", "casual"] },
      { text: "オフィス・仕事の場面", tags: ["formal", "cool"] },
      { text: "デート・特別なお出かけ", tags: ["feminine", "elegant"] },
      { text: "ショッピング・街歩き", tags: ["street", "casual"] },
      { text: "アウトドア・旅行", tags: ["natural", "active"] },
    ],
  },
  {
    order: 3,
    text: "好きな色の系統は？",
    choices: [
      { text: "アースカラー（ベージュ・カーキ）", tags: ["natural", "earth"] },
      { text: "モノクロ・グレー", tags: ["cool", "monochrome"] },
      {
        text: "ダーク・ディープカラー（ネイビー・ブラック）",
        tags: ["elegant", "dark"],
      },
      { text: "ビビッド・原色系（赤・青・黄）", tags: ["street", "colorful"] },
      { text: "パステル（ピンク・ラベンダー）", tags: ["feminine", "pastel"] },
    ],
  },
  {
    order: 4,
    text: "好きな季節のファッションは？",
    choices: [
      { text: "春（軽やかなレイヤード）", tags: ["natural", "soft"] },
      { text: "夏（涼しげ・爽快なスタイル）", tags: ["casual", "colorful"] },
      { text: "秋（落ち着いた深みのある色合い）", tags: ["cool", "classic"] },
      { text: "冬（重ね着・温かみのあるコーデ）", tags: ["elegant", "relax"] },
    ],
  },
  {
    order: 5,
    text: "自分が憧れる雰囲気は？",
    choices: [
      { text: "森の中にいるような自然体", tags: ["natural", "relax", "earth"] },
      { text: "洗練されたモード系", tags: ["cool", "monochrome", "minimal"] },
      {
        text: "大人っぽい品のあるスタイル",
        tags: ["elegant", "sophisticated", "formal"],
      },
      {
        text: "個性的でエネルギッシュ",
        tags: ["street", "colorful", "active"],
      },
      {
        text: "ふわっとしたガーリーな雰囲気",
        tags: ["feminine", "sweet", "cute"],
      },
    ],
  },
];
