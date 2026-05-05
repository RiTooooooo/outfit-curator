import Link from "next/link";
import styles from "./page.module.css";

const STYLE_TYPES = [
  {
    slug: "mode",
    name: "モード",
    desc: "シャープなシルエットと抑えた配色で洗練された印象",
    emoji: "■",
  },
  {
    slug: "casual",
    name: "カジュアル",
    desc: "動きやすさと抜け感を大切にした日常スタイル",
    emoji: "◐",
  },
  {
    slug: "classic",
    name: "クラシック",
    desc: "上品なアイテムと端正なバランスで品格を演出",
    emoji: "◆",
  },
  {
    slug: "real-clothes",
    name: "リアルクローズ",
    desc: "実用性と今っぽさを両立する毎日のコーデ",
    emoji: "●",
  },
  {
    slug: "normcore",
    name: "ノームコア",
    desc: "ベーシックを自然体で着こなすミニマルスタイル",
    emoji: "□",
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
      <section className={styles.hero}>
        <header className={styles.heroNav}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMark} aria-hidden="true">
              OC
            </span>
            <span>Outfit Curator</span>
          </Link>
          <nav className={styles.navLinks} aria-label="メインナビゲーション">
            <a href="#flow">Flow</a>
            <a href="#styles">Styles</a>
            <Link href="/diagnosis">Diagnosis</Link>
          </nav>
        </header>

        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Personal style diagnosis</p>
            <h1 className={styles.heroTitle}>
              CURATED STYLE.
              <br />
              DEFINED BY YOU.
            </h1>
            <p className={styles.heroSub}>
              たった5問で、あなたの好み・日常・似合うムードを整理。
              青とグレーの静かなトーンで、毎日のコーディネートを提案します。
            </p>
            <div className={styles.ctaRow}>
              <Link href="/diagnosis" className={styles.ctaBtn}>
                診断を始める
              </Link>
              <span className={styles.ctaNote}>所要時間：約1分</span>
            </div>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.visualBack}>
              <img src="/design-patterns-images/classic-03.png" alt="" />
            </div>
            <div className={styles.visualFront}>
              <img src="/design-patterns-images/mode-01.png" alt="" />
            </div>
          </div>
        </div>
      </section>

      <section id="flow" className={styles.section}>
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

      <section id="styles" className={styles.sectionAlt}>
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

      <section className={styles.bottomCta}>
        <h2 className={styles.bottomCtaTitle}>さっそく診断してみる</h2>
        <Link href="/diagnosis" className={styles.ctaBtn}>
          診断スタート
        </Link>
      </section>
    </div>
  );
}
