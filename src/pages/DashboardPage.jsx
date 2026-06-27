import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconSchool, IconUsers, IconHeart, IconBell, IconArrowRight, IconFlag } from "../component/Icons.jsx";
import { cn, Button, Card, Badge, Sparkline } from "../component/UI.jsx";
import * as analyticsApi from "../api/analytics.js";

function StatCard({ label, value, delta, tone, icon, spark, to }) {
  const content = (
    <Card className={cn("relative overflow-hidden transition-all duration-200 h-full", to && "hover:shadow-lift hover:-translate-y-0.5 hover:border-teal/30 cursor-pointer")}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink/50 font-semibold">{label}</div>
          <div className="font-display text-[40px] leading-none text-ink mt-3">{value}</div>
          {delta != null && (
            <div className="mt-3 flex items-center gap-2">
              <Badge tone={delta >= 0 ? "green" : "red"}>
                {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
              </Badge>
              <span className="text-xs text-ink/50">vs prior period</span>
            </div>
          )}
        </div>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", tone)}>{icon}</div>
      </div>
      {spark?.length > 0 && (
        <div className="mt-4 -mx-2">
          <Sparkline data={spark} w={260} h={42} />
        </div>
      )}
    </Card>
  );

  if (to) {
    return (
      <Link to={to} className="block no-underline h-full">
        {content}
      </Link>
    );
  }

  return content;
}

function DashboardPage() {
  const [data, setData] = useState(null);
  const [highRisk, setHighRisk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [overall, risks] = await Promise.all([
          analyticsApi.getOverall(),
          analyticsApi.getHighRiskUsers({ limit: 5 }),
        ]);
        if (!cancelled) {
          setData(overall);
          setHighRisk(risks);
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.error ?? "Failed to load dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const risk = data?.results?.riskDistribution ?? { Low: 0, Medium: 0, High: 0 };
  const sparkAttempts = [
    risk.Low,
    risk.Medium,
    risk.High,
    data?.attempts?.completed ?? 0,
  ].filter((n) => n > 0);
  if (sparkAttempts.length < 2) sparkAttempts.push(1, 2, 3);

  return (
    <div className="space-y-6 fade-in">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && <p className="text-sm text-ink/50">Loading platform overview…</p>}

      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-ink to-inkSoft text-beige relative overflow-hidden grain">
        <div className="absolute -right-20 -bottom-20 w-[360px] h-[360px] rounded-full bg-teal/30 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Badge tone="yellow" className="mb-3">Platform overview</Badge>
            <h2 className="font-display text-3xl md:text-5xl leading-[1.05] text-beige">
              {data?.organizations ?? "—"} organizations ·{" "}
              <span className="text-orange">{data?.results?.total ?? 0}</span> quiz results
            </h2>
            <p className="text-beige/70 mt-3 max-w-xl">
              {highRisk.length} members flagged at elevated risk. Review wellness and alerts for follow-up.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/alerts">
              <Button variant="beige" size="lg">View alerts</Button>
            </Link>
            <Link to="/reports">
              <Button size="lg" iconRight={<IconArrowRight size={16} />}>Reports</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label="Organizations"
          value={String(data?.organizations ?? "—")}
          tone="bg-teal/10 text-teal"
          icon={<IconSchool size={22} />}
          spark={sparkAttempts}
          to="/organizations"
        />
        <StatCard
          label="Members"
          value={String(data?.members ?? "—")}
          tone="bg-orange/15 text-orange"
          icon={<IconUsers size={22} />}
          to="/users"
        />
        <StatCard
          label="Published quizzes"
          value={String(data?.publishedQuizzes ?? "—")}
          tone="bg-yellow/25 text-ink"
          icon={<IconHeart size={22} />}
          to="/quizzes"
        />
        <StatCard
          label="High risk (latest)"
          value={String(risk.High ?? 0)}
          tone="bg-ink text-beige"
          icon={<IconBell size={22} />}
          to="/alerts"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-xs uppercase tracking-wider text-ink/50 font-semibold">Priority queue</div>
              <h3 className="font-display text-2xl mt-1">High-risk members</h3>
            </div>
            <Link to="/alerts">
              <Button variant="ghost" size="sm" iconRight={<IconArrowRight size={14} />}>
                View all
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-ink/5">
            {highRisk.length === 0 && (
              <p className="text-sm text-ink/50 py-6">No elevated-risk results yet.</p>
            )}
            {highRisk.map((a) => (
              <div key={a.userId} className="py-4 flex items-start gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    a.riskLevel === "High" ? "bg-red-50 text-red-600" : "bg-orange/15 text-orange",
                  )}
                >
                  <IconFlag size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-ink">{a.fullName}</span>
                    <Badge tone={a.riskLevel === "High" ? "red" : "orange"} dot>
                      {a.riskLevel}
                    </Badge>
                  </div>
                  <div className="text-sm text-ink/70 mt-0.5">
                    {a.organizationName} · Score {Number(a.normalizedScore).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-2xl">Recent activity</h3>
          </div>
          <ol className="relative border-l-2 border-beigeDeep ml-2 space-y-5">
            {(data?.recentActivity ?? []).length === 0 && (
              <li className="pl-5 text-sm text-ink/50">No completed attempts yet.</li>
            )}
            {(data?.recentActivity ?? []).map((e, i) => (
              <li key={i} className="pl-5 relative">
                <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-teal" />
                <div className="text-sm">
                  <span className="font-semibold">{e.user}</span> completed {e.quizTitle}
                </div>
                <div className="text-xs text-ink/50 mt-0.5">
                  {e.completedAt ? new Date(e.completedAt).toLocaleString() : "—"}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}

export { DashboardPage };
