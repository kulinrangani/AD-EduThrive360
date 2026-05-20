import { useEffect, useState } from "react";
import { Badge, Modal } from "./UI.jsx";
import * as resultsApi from "../api/results.js";

function riskTone(level) {
  if (level === "High") return "red";
  if (level === "Medium") return "orange";
  return "green";
}

function GroupBreakdown({ groupScores = [] }) {
  if (groupScores.length === 0) return null;
  const max = 4;
  return (
    <div className="space-y-3 mt-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Category breakdown</p>
      {groupScores.map((g) => {
        const pct = Math.min(100, Math.round((g.normalizedScore / max) * 100));
        return (
          <div key={g.groupId}>
            <div className="flex justify-between text-sm mb-1 gap-2">
              <span className="text-ink/80 truncate">{g.groupName ?? "Category"}</span>
              <Badge tone={riskTone(g.riskLevel)} dot>
                {g.riskLevel}
              </Badge>
            </div>
            <div className="h-2 rounded-full bg-beige overflow-hidden">
              <div
                className="h-full rounded-full bg-teal transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-[10px] text-ink/40 mt-0.5 font-mono">
              Score {Number(g.normalizedScore).toFixed(2)}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ResultViewerModal({ resultId, open, onClose }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !resultId) {
      setResult(null);
      setError("");
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await resultsApi.getResult(resultId);
        if (!cancelled) setResult(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error ?? "Could not load result");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, resultId]);

  const quoteLabel =
    result?.quoteType === "warning"
      ? "Important"
      : result?.quoteType === "motivation"
        ? "Encouragement"
        : "For them";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={result?.user?.fullName ?? result?.quizTitle ?? "Quiz result"}
      subtitle={
        result
          ? `${result.quizTitle ?? "Quiz"} · ${result.createdAt ? new Date(result.createdAt).toLocaleString() : ""}`
          : "Read-only assessment outcome"
      }
      width="max-w-xl"
    >
      {loading && <p className="text-sm text-ink/50">Loading result…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && !loading && (
        <div className="space-y-4">
          {result.user && (
            <p className="text-sm text-ink/60">
              {result.user.fullName} · {result.user.email}
              {result.user.memberType && (
                <span className="capitalize"> · {result.user.memberType}</span>
              )}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={riskTone(result.riskLevel)} dot>
              {result.riskLevel} risk
            </Badge>
            <span className="text-sm text-ink/60">
              Overall{" "}
              <strong className="font-mono text-ink">
                {Number(result.normalizedScore).toFixed(2)}
              </strong>
            </span>
          </div>
          {result.quote && (
            <div className="rounded-2xl border border-teal/20 bg-gradient-to-br from-teal/8 to-beige/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal">
                {quoteLabel}
              </p>
              <p className="mt-3 text-ink font-display text-lg leading-snug">
                &ldquo;{result.quote}&rdquo;
              </p>
            </div>
          )}
          <GroupBreakdown groupScores={result.groupScores} />
        </div>
      )}
    </Modal>
  );
}

export { ResultViewerModal };
