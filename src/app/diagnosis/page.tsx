"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import styles from "./page.module.css";

// ---- types ----
type Choice = { id: string; text: string; tags: string[] };
type Question = { id: string; order: number; text: string; choices: Choice[] };
type StyleType = {
  slug: string;
  name: string;
  description: string;
  catchphrase: string;
};
type DiagnosisResult = { id: string; styleType: StyleType };

// ---- helpers ----
async function fetcherFn(url: string): Promise<Question[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("fetch error");
  return res.json() as Promise<Question[]>;
}

async function submitDiagnosis(choiceIds: string[]): Promise<DiagnosisResult> {
  const sessionId = crypto.randomUUID();
  const res = await fetch("/api/diagnoses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ choiceIds, sessionId }),
  });
  if (!res.ok) throw new Error("診断に失敗しました");
  return res.json() as Promise<DiagnosisResult>;
}

// ---- sub-components ----
function LoadingView({ message }: { message: string }): React.ReactNode {
  return (
    <div className={styles.center}>
      <div className={styles.spinner} role="status" aria-label="読み込み中" />
      <p className={styles.loadingText}>{message}</p>
    </div>
  );
}

function ErrorView({ message }: { message: string }): React.ReactNode {
  return (
    <div className={styles.center}>
      <p className={styles.errorText}>{message}</p>
    </div>
  );
}

function QuizCard({ questions }: { questions: Question[] }): React.ReactNode {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [choiceIds, setChoiceIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const total = questions.length;
  const current = questions[step];
  const progressPct = Math.round((step / total) * 100);

  async function handleSelect(choiceId: string): Promise<void> {
    const next = [...choiceIds, choiceId];
    setChoiceIds(next);
    if (step < total - 1) {
      setStep((s) => s + 1);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitDiagnosis(next);
      sessionStorage.setItem("diagnosisResult", JSON.stringify(result));
      router.push("/diagnosis/result");
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "エラーが発生しました");
      setSubmitting(false);
    }
  }

  if (submitting) return <LoadingView message="診断中…" />;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>
            {step + 1} / {total}
          </span>
          <span className={styles.progressLabel}>{progressPct}%</span>
        </div>
        <div
          className={styles.progressBar}
          role="progressbar"
          aria-valuenow={step}
          aria-valuemax={total}
        >
          <div
            className={styles.progressFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <h1 className={styles.questionText}>{current.text}</h1>
        <ul className={styles.choiceList}>
          {current.choices.map((choice) => (
            <li key={choice.id}>
              <button
                className={styles.choiceBtn}
                onClick={() => void handleSelect(choice.id)}
              >
                {choice.text}
              </button>
            </li>
          ))}
        </ul>
        {submitError !== null && (
          <p className={styles.errorText}>{submitError}</p>
        )}
      </div>
    </div>
  );
}

// ---- page ----
export default function DiagnosisPage(): React.ReactNode {
  const {
    data: questions,
    error: fetchError,
    isLoading,
  } = useSWR<Question[], Error>("/api/questions", fetcherFn);

  if (fetchError !== undefined)
    return (
      <ErrorView message="質問の読み込みに失敗しました。再度お試しください。" />
    );
  if (isLoading || questions === undefined)
    return <LoadingView message="読み込み中…" />;

  return <QuizCard questions={questions} />;
}
