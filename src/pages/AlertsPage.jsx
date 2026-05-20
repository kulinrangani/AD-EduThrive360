import { useEffect, useMemo, useState } from "react";
import { IconCalendar, IconSearch, IconArrowRight } from "../component/Icons.jsx";
import { Card, Badge, Button, Input, Select } from "../component/UI.jsx";
import * as analyticsApi from "../api/analytics.js";

function mapSeverity(riskLevel) {
  if (riskLevel === "High") return "Critical";
  if (riskLevel === "Medium") return "Attention";
  return "Low";
}

function AlertsPage() {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("All severities");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await analyticsApi.getHighRiskUsers({ limit: 50 });
        if (!cancelled) setUsers(list);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const alerts = useMemo(
    () =>
      users.map((u) => ({
        id: u.resultId,
        student: u.fullName,
        school: u.organizationName ?? "—",
        type: "Quiz risk flag",
        severity: mapSeverity(u.riskLevel),
        owner: "—",
        age: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—",
        status: "Open",
        memberType: u.memberType,
      })),
    [users],
  );

  const filtered = useMemo(
    () =>
      alerts.filter((a) => {
        const q = query.trim().toLowerCase();
        const passQ =
          !q ||
          a.student.toLowerCase().includes(q) ||
          a.school.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q);
        return (
          passQ &&
          (severity === "All severities" || a.severity === severity) &&
          a.severity !== "Low"
        );
      }),
    [alerts, query, severity],
  );

  const criticalCount = useMemo(
    () => filtered.filter((a) => a.severity === "Critical").length,
    [filtered],
  );

  const board = useMemo(
    () => ({
      Open: filtered,
      Investigating: [],
      Resolved: [],
    }),
    [filtered],
  );

  return (
    <div className="fade-in grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-6">
      <aside className="space-y-5">
        <Card className="bg-ink text-beige border-0">
          <Badge tone="orange">Alert Command Center</Badge>
          <h2 className="font-display text-3xl leading-tight mt-4">
            {criticalCount} critical
            <br />
            cases active
          </h2>
          <p className="text-beige/70 text-sm mt-3">
            Auto-generated from quiz scoring when risk is Medium or High.
          </p>
        </Card>
        {loading && <p className="text-sm text-ink/50">Loading alerts…</p>}
      </aside>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 max-w-md">
            <Input
              icon={<IconSearch size={16} />}
              placeholder="Search alerts…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-44">
            <option>All severities</option>
            <option>Critical</option>
            <option>Attention</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Open", "Investigating", "Resolved"].map((col) => (
            <Card key={col} padded={false} className="p-4">
              <div className="text-xs uppercase tracking-wider text-ink/50 font-semibold mb-3">
                {col} ({board[col]?.length ?? 0})
              </div>
              <div className="space-y-3">
                {(board[col] ?? []).map((a) => (
                  <div key={a.id} className="p-3 rounded-xl bg-beige/60 border border-ink/5">
                    <div className="font-semibold text-sm text-ink">{a.student}</div>
                    <div className="text-xs text-ink/60 mt-1">{a.school}</div>
                    <Badge
                      tone={a.severity === "Critical" ? "red" : "orange"}
                      dot
                      className="mt-2"
                    >
                      {a.severity}
                    </Badge>
                    <p className="text-xs text-ink/50 mt-2">{a.type}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export { AlertsPage };
