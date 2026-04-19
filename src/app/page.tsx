import Link from "next/link";
import styles from "./page.module.css";

const STYLE_TYPES = [
  {
    slug: "natural-relax",
    name: "ナチュラルリラックス",
    desc: "自然素材と穏やかな色使いで、心地よい日常を演出",
    emoji: "🌿",
  },
  {
    slug: "cool-mode",
    name: "クールモード",
    desc: "シャープなシルエットとモノトーンで洗練された印象",
    emoji: "🖤",
  },
  {
    slug: "elegant-formal",
    name: "エレガントフォーマル",
    desc: "上品なドレープと質感で特別な場を彩る",
    emoji: "✨",
  },
  {
    slug: "casual-street",
    name: "カジュアルストリート",
    desc: "トレンドと個性を自由にミックスした都会的スタイル",
    emoji: "🏙️",
  },
  {
    slug: "feminine-sweet",
    name: "フェミニンスウィート",
    desc: "柔らかなカラーとフェミニンなシルエットで可愛らしく",
    emoji: "🌸",
  },
] as const;

const STEPS = [
  {
    num: "01",
    title: "5問に答える",
    desc: "スタイル・カラー・シーンなど5つの質問に選択肢で回答",
  },
  {
    num: "02",
    title: "AIが分析",
    desc: "あなたの回答からファッションの傾向を瞬時に診断",
  },
  {
    num: "03",
    title: "コーデを発見",
    desc: "あなたのスタイルタイプにマッチするコーディネート一覧を表示",
  },
] as const;

export default function Home(): React.ReactNode {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Outfit Curator</p>
        <h1 className={styles.heroTitle}>
          あなただけの
          <br />
          スタイルを見つけよう
        </h1>
        <p className={styles.heroSub}>
          たった5問の診断で、あなたのファッションタイプが判明。
          <br className={styles.brDesktop} />
          ぴったりのコーディネートをご提案します。
        </p>
        <Link href="/diagnosis" className={styles.ctaBtn}>
          無料で診断する
        </Link>
        <p className={styles.ctaNote}>所要時間：約1分</p>
      </section>

      {/* How it works */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>診断の流れ</h2>
          <div className={styles.steps}>
            {STEPS.map((s) => (
              <div key={s.num} className={styles.step}>
                <span className={styles.stepNum}>{s.num}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Style types */}
      <section className={styles.sectionAlt}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>5つのスタイルタイプ</h2>
          <p className={styles.sectionSub}>
            診断結果はこの中のいずれかのタイプに決まります
          </p>
          <div className={styles.styleGrid}>
            {STYLE_TYPES.map((st) => (
              <div key={st.slug} className={styles.styleCard}>
                <span className={styles.styleEmoji}>{st.emoji}</span>
                <h3 className={styles.styleName}>{st.name}</h3>
                <p className={styles.styleDesc}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.bottomCta}>
        <h2 className={styles.bottomCtaTitle}>さっそく診断してみる</h2>
        <Link href="/diagnosis" className={styles.ctaBtn}>
          診断スタート
        </Link>
      </section>
    </div>
  );
}
