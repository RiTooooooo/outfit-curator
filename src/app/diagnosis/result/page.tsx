"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

// ---- types ----
type StyleType = {
  slug: string;
  name: string;
  description: string;
  catchphrase: string;
};
type DiagnosisResult = { id: string; styleType: StyleType };

const SLUG_EMOJI: Record<string, string> = {
  "natural-relax": "🌿",
  "cool-mode": "🖤",
  "elegant-formal": "✨",
  "casual-street": "🏙️",
  "feminine-sweet": "🌸",
};

export default function ResultPage(): React.ReactNode {
  const router = useRouter();
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = sessionStorage.getItem("diagnosisResult");
    if (!raw) {
      router.replace("/diagnosis");
      return;
    }
    try {
      setResult(JSON.parse(raw) as DiagnosisResult);
    } catch {
      router.replace("/diagnosis");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner} role="status" aria-label="読み込み中" />
      </div>
    );
  }

  if (!result) return null;

  const { styleType } = result;
  const emoji = SLUG_EMOJI[styleType.slug] ?? "👗";

  return (
    <div className={styles.page}>
      {/* Result Hero */}
      <section className={styles.hero}>
        <p className={styles.eyebrow}>診断結果</p>
        <div className={styles.emojiCircle} aria-hidden>
          {emoji}
        </div>
        <h1 className={styles.styleName}>{styleType.name}</h1>
        <p className={styles.catchphrase}>"{styleType.catchphrase}"</p>
        <p className={styles.description}>{styleType.description}</p>
      </section>

      {/* Outfits placeholder */}
      <section className={styles.outfitsSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>あなたへのコーディネート提案</h2>
          <p className={styles.sectionSub}>
            {styleType.name} スタイルにぴったりのコーディネートを準備しています
          </p>
          <div className={styles.outfitGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.outfitPlaceholder}>
                <span className={styles.placeholderEmoji}>{emoji}</span>
                <p className={styles.placeholderText}>コーデ {i + 1}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className={styles.actions}>
        <Link href="/diagnosis" className={styles.retryBtn}>
          もう一度診断する
        </Link>
        <Link href="/" className={styles.homeLink}>
          トップに戻る
        </Link>
      </section>
    </div>
  );
}
