import { useEffect, useMemo, useState } from "react";
import { IconHeart, IconFlag, IconCalendar, IconArrowRight } from "../component/Icons.jsx";
import { Card, Badge, Button, Select } from "../component/UI.jsx";
import * as analyticsApi from "../api/analytics.js";

function WellnessPage() {
  const [groups, setGroups] = useState([]);
  const [highRisk, setHighRisk] = useState([]);
  const [overall, setOverall] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [g, risks, o] = await Promise.all([
          analyticsApi.getGroupWise(),
          analyticsApi.getHighRiskUsers({ limit: 20 }),
          analyticsApi.getOverall(),
        ]);
        if (!cancelled) {
          setGroups(g);
          setHighRisk(risks);
          setOverall(o);
        }
      } catch {
        if (!cancelled) {
          setGroups([]);
          setHighRisk([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const risk = overall?.results?.riskDistribution ?? { Low: 0, Medium: 0, High: 0 };
  const total = Object.values(risk).reduce((a, b) => a + b, 0) || 1;

  const RISK_GROUPS = useMemo(
    () => [
      { label: "Low risk", value: Math.round((risk.Low / total) * 100), tone: "green" },
      { label: "Medium risk", value: Math.round((risk.Medium / total) * 100), tone: "yellow" },
      { label: "High risk", value: Math.round((risk.High / total) * 100), tone: "red" },
    ],
    [risk, total],
  );

  const avgScore = useMemo(() => {
    if (!groups.length) return "—";
    const sum = groups.reduce((acc, g) => acc + g.avgNormalizedScore, 0);
    return (sum / groups.length).toFixed(2);
  }, [groups]);

  return (
    <div className="space-y-6 fade-in">
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-teal to-tealDeep text-white relative overflow-hidden">
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <Badge tone="yellow" className="mb-3">Wellness Intelligence</Badge>
            <h2 className="font-display text-3xl md:text-5xl leading-[1.05]">
              Network wellness avg <span className="text-yellow">{avgScore}</span>
            </h2>
            <p className="text-white/80 mt-3 max-w-2xl">
              Live data from quiz results across organizations. {overall?.results?.total ?? 0} scored
              attempts on record.
            </p>
          </div>
        </div>
      </div>

      {loading && <p className="text-sm text-ink/50">Loading wellness data…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {RISK_GROUPS.map((r) => (
          <Card key={r.label}>
            <Badge tone={r.tone} dot>
              {r.label}
            </Badge>
            <p className="font-display text-4xl mt-2">{r.value}%</p>
            <p className="text-xs text-ink/50 mt-1">of latest results</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h3 className="font-display text-2xl mb-4">Category trends</h3>
          {groups.length === 0 ? (
            <p className="text-sm text-ink/50">No group scores yet.</p>
          ) : (
            <ul className="space-y-3">
              {groups.map((g) => (
                <li key={g.groupId} className="flex justify-between gap-2 text-sm border-b border-ink/5 pb-2">
                  <span className="font-medium text-ink">{g.groupName}</span>
                  <span className="text-ink/60 font-mono">
                    avg {g.avgNormalizedScore} · {g.resultCount} results
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h3 className="font-display text-2xl mb-4">Intervention queue</h3>
          <ul className="space-y-3">
            {highRisk.length === 0 && (
              <li className="text-sm text-ink/50">No high-risk members flagged.</li>
            )}
            {highRisk.map((c) => (
              <li
                key={c.userId}
                className="flex items-start gap-3 py-2 border-b border-ink/5 last:border-0"
              >
                <IconFlag size={16} className="text-red-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-ink text-sm">{c.fullName}</p>
                  <p className="text-xs text-ink/60">
                    {c.organizationName} · {c.riskLevel} · score {Number(c.normalizedScore).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

export { WellnessPage };
