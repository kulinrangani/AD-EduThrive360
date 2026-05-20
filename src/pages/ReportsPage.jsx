import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { IconDownload, IconChart, IconArrowRight, IconSchool, IconUsers } from "../component/Icons.jsx";
import { Card, Badge, Button } from "../component/UI.jsx";
import * as analyticsApi from "../api/analytics.js";
import * as quizApi from "../api/quizzes.js";

function ReportsPage() {
  const [overall, setOverall] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [o, q] = await Promise.all([
          analyticsApi.getOverall(),
          quizApi.listQuizzes(),
        ]);
        if (!cancelled) {
          setOverall(o);
          setQuizzes(Array.isArray(q) ? q : []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const reports = useMemo(
    () =>
      (Array.isArray(quizzes) ? quizzes : []).map((q) => ({
        id: q.id,
        name: q.title,
        scope: q.organizationId ? "Organization" : "Platform",
        type: "Survey",
        lastRun: q.updatedAt ? new Date(q.updatedAt).toLocaleString() : "—",
        status: q.status === "published" ? "Ready" : "Draft",
      })),
    [quizzes],
  );

  const readyCount = reports.filter((r) => r.status === "Ready").length;

  const METRICS = [
    {
      label: "Quiz results",
      value: String(overall?.results?.total ?? "—"),
      sub: "Scored attempts across platform",
      icon: <IconChart size={20} />,
      tone: "bg-teal/10 text-teal",
    },
    {
      label: "Completed attempts",
      value: String(overall?.attempts?.completed ?? "—"),
      sub: "Finished quiz sessions",
      icon: <IconChart size={20} />,
      tone: "bg-yellow/25 text-ink",
    },
    {
      label: "Organizations",
      value: String(overall?.organizations ?? "—"),
      sub: "Active tenants",
      icon: <IconSchool size={20} />,
      tone: "bg-orange/15 text-orange",
    },
    {
      label: "Members",
      value: String(overall?.members ?? "—"),
      sub: "End-users registered",
      icon: <IconUsers size={20} />,
      tone: "bg-ink/10 text-ink",
    },
  ];

  return (
    <div className="space-y-6 fade-in">
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-ink to-inkSoft text-beige relative overflow-hidden grain">
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <Badge tone="yellow" className="mb-3">Reporting Hub</Badge>
            <h2 className="font-display text-3xl md:text-5xl leading-[1.05]">
              {readyCount} published quizzes · {overall?.results?.total ?? 0} results
            </h2>
            <p className="text-beige/70 mt-3 max-w-2xl">
              Quiz outcomes and risk distribution from the psychological assessment engine.
            </p>
          </div>
          <Link to="/quizzes">
            <Button iconRight={<IconArrowRight size={16} />}>Manage quizzes</Button>
          </Link>
        </div>
      </div>

      {loading && <p className="text-sm text-ink/50">Loading reports…</p>}

      {overall?.results?.riskDistribution && (
        <Card>
          <h3 className="font-display text-2xl mb-4">Risk distribution</h3>
          <div className="grid grid-cols-3 gap-4">
            {(["Low", "Medium", "High"]).map((level) => {
              const count = overall.results.riskDistribution[level] ?? 0;
              const total = overall.results.total || 1;
              const pct = Math.round((count / total) * 100);
              const tone =
                level === "High" ? "red" : level === "Medium" ? "orange" : "green";
              return (
                <div key={level} className="text-center">
                  <Badge tone={tone} dot className="mb-2">
                    {level}
                  </Badge>
                  <p className="font-display text-3xl">{count}</p>
                  <p className="text-xs text-ink/50 mt-1">{pct}% of results</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {METRICS.map((m) => (
          <Card key={m.label}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.tone}`}>
              {m.icon}
            </div>
            <p className="text-xs uppercase tracking-wider text-ink/50 font-semibold mt-4">
              {m.label}
            </p>
            <p className="font-display text-3xl mt-1">{m.value}</p>
            <p className="text-xs text-ink/60 mt-2">{m.sub}</p>
          </Card>
        ))}
      </div>

      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-ink/50">
                <th className="px-6 py-4 font-semibold">Report</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {reports.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-ink/50">
                    No quizzes configured yet.
                  </td>
                </tr>
              )}
              {reports.map((r) => (
                <tr key={r.id} className="row-hover">
                  <td className="px-6 py-4 font-semibold">{r.name}</td>
                  <td className="px-6 py-4">{r.type}</td>
                  <td className="px-6 py-4">
                    <Badge tone={r.status === "Ready" ? "green" : "yellow"} dot>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-ink/60">{r.lastRun}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export { ReportsPage };
