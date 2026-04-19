"use client";

import Image from "next/image";
import useSWR from "swr";
import styles from "./page.module.css";

type Outfit = { id: string; title: string; imageUrl: string; order: number };

async function outfitFetcher(url: string): Promise<Outfit[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("fetch error");
  return res.json() as Promise<Outfit[]>;
}

function SkeletonGrid(): React.ReactNode {
  return (
    <div className={styles.outfitGrid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.outfitPlaceholder}>
          <div className={styles.skeleton} />
        </div>
      ))}
    </div>
  );
}

function PlaceholderGrid({ emoji }: { emoji: string }): React.ReactNode {
  return (
    <div className={styles.outfitGrid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.outfitPlaceholder}>
          <span className={styles.placeholderEmoji}>{emoji}</span>
          <p className={styles.placeholderText}>コーデ {i + 1}</p>
        </div>
      ))}
    </div>
  );
}

export function OutfitGrid({
  slug,
  emoji,
}: {
  slug: string;
  emoji: string;
}): React.ReactNode {
  const { data: outfits, isLoading } = useSWR<Outfit[], Error>(
    `/api/outfits?styleTypeSlug=${slug}`,
    outfitFetcher,
  );

  if (isLoading) return <SkeletonGrid />;
  if (outfits === undefined || outfits.length === 0) {
    return <PlaceholderGrid emoji={emoji} />;
  }

  return (
    <div className={styles.outfitGrid}>
      {outfits.map((outfit) => (
        <div key={outfit.id} className={styles.outfitCard}>
          <Image
            src={outfit.imageUrl}
            alt={outfit.title}
            fill
            className={styles.outfitImage}
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
}
