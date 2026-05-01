import { useMemo, useState } from "react";
import {
  IconCalendar,
  IconSearch,
  IconArrowRight,
} from "../component/Icons.jsx";
import { Card, Badge, Button, Input, Select } from "../component/UI.jsx";

const ALERTS = [
  { id: "AL-901", student: "Isha Reddy", school: "Lotus Valley", type: "Sentiment Drop", severity: "Critical", owner: "Ananya Kapoor", age: "2h", status: "Open" },
  { id: "AL-895", student: "Dhruv Malhotra", school: "Oak Ridge", type: "Missed Check-ins", severity: "Critical", owner: "Nisha D'Souza", age: "5h", status: "Open" },
  { id: "AL-884", student: "Zara Shaikh", school: "Willowbrook Intl.", type: "Attendance + Mood", severity: "Attention", owner: "Dr. Meera Iyer", age: "1d", status: "Investigating" },
  { id: "AL-870", student: "Kian Arora", school: "Heritage Public", type: "Low Engagement", severity: "Attention", owner: "Rahul Varma", age: "2d", status: "Open" },
  { id: "AL-862", student: "Riya Jain", school: "St. Anselm's", type: "Escalation Risk", severity: "Critical", owner: "Priya Menon", age: "3d", status: "Resolved" },
];

const TIMELINE = [
  { at: "09:12", action: "New critical alert created for Isha Reddy", actor: "Auto Risk Engine" },
  { at: "09:25", action: "Assigned to counselor Ananya Kapoor", actor: "Aarav Mehta" },
  { at: "10:03", action: "Parent outreach initiated", actor: "Ananya Kapoor" },
  { at: "10:47", action: "Follow-up session scheduled", actor: "Ananya Kapoor" },
];

function AlertsPage() {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("All severities");
  const [status, setStatus] = useState("All statuses");
  const filtered = useMemo(() => ALERTS.filter((a) => {
    const q = query.trim().toLowerCase();
    const passQ = !q || a.student.toLowerCase().includes(q) || a.school.toLowerCase().includes(q) || a.type.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
    return passQ && (severity === "All severities" || a.severity === severity) && (status === "All statuses" || a.status === status);
  }), [query, severity, status]);
  const criticalCount = useMemo(() => ALERTS.filter((a) => a.severity === "Critical" && a.status !== "Resolved").length, []);
  const board = useMemo(() => ({ Open: filtered.filter((a) => a.status === "Open"), Investigating: filtered.filter((a) => a.status === "Investigating"), Resolved: filtered.filter((a) => a.status === "Resolved") }), [filtered]);

  return (
    <div className="fade-in grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-6">
      <aside className="space-y-5">
        <Card className="bg-ink text-beige border-0">
          <Badge tone="orange">Alert Command Center</Badge>
          <h2 className="font-display text-3xl leading-tight mt-4">{criticalCount} critical<br />cases active</h2>
          <p className="text-beige/70 text-sm mt-3">Prioritize triage, assign owners, and close loops fast.</p>
          <div className="mt-5 flex flex-col gap-2">
            <Button variant="beige" size="sm" icon={<IconCalendar size={14} />}>Schedule standup</Button>
            <Button size="sm" iconRight={<IconArrowRight size={14} />}>Create escalation</Button>
          </div>
        </Card>
        <Card>
          <div className="text-xs uppercase tracking-wider text-ink/50 font-semibold">Live summary</div>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-red-50 border border-red-100 p-3"><div className="text-xs text-red-700 font-semibold uppercase tracking-wide">Critical</div><div className="font-display text-3xl text-red-700 mt-1">{criticalCount}</div></div>
            <div className="rounded-xl bg-beige p-3"><div className="text-xs text-ink/60 font-semibold uppercase tracking-wide">Open</div><div className="font-display text-3xl mt-1">{board.Open.length}</div></div>
            <div className="rounded-xl bg-yellow/20 p-3"><div className="text-xs text-ink/70 font-semibold uppercase tracking-wide">Investigating</div><div className="font-display text-3xl mt-1">{board.Investigating.length}</div></div>
            <div className="rounded-xl bg-emerald-50 p-3"><div className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">Resolved</div><div className="font-display text-3xl text-emerald-700 mt-1">{board.Resolved.length}</div></div>
          </div>
        </Card>
        <Card>
          <h3 className="font-display text-xl mb-1">Incident timeline</h3><p className="text-sm text-ink/60 mb-4">Latest critical thread</p>
          <ol className="space-y-3">{TIMELINE.map((t, i) => (<li key={`${t.at}-${i}`} className="flex items-start gap-3"><span className="mt-1.5 w-2 h-2 rounded-full bg-teal" /><div><div className="text-sm"><span className="font-semibold">{t.at}</span> — {t.action}</div><div className="text-xs text-ink/50 mt-0.5">{t.actor}</div></div></li>))}</ol>
        </Card>
      </aside>
      <section className="space-y-5">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h3 className="font-display text-2xl">Triage board</h3><p className="text-sm text-ink/60">Move through Open → Investigating → Resolved</p></div>
            <div className="flex flex-wrap gap-2">
              <Input icon={<IconSearch size={16} />} placeholder="Search student, school, type, ID" value={query} onChange={(e) => setQuery(e.target.value)} className="w-64" />
              <Select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-40"><option>All severities</option><option>Critical</option><option>Attention</option></Select>
              <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-40"><option>All statuses</option><option>Open</option><option>Investigating</option><option>Resolved</option></Select>
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Object.entries(board).map(([lane, items]) => (
            <div key={lane} className="rounded-2xl border border-ink/10 bg-white min-h-[420px]">
              <div className="px-4 py-3 border-b border-ink/10 flex items-center justify-between"><div className="font-semibold">{lane}</div><Badge tone={lane === "Resolved" ? "green" : lane === "Investigating" ? "orange" : "beige"}>{items.length}</Badge></div>
              <div className="p-3 space-y-3">
                {items.length === 0 && <div className="text-sm text-ink/50 px-2 py-6 text-center">No alerts in this lane.</div>}
                {items.map((a) => (
                  <div key={a.id} className="rounded-xl border border-ink/10 p-3 bg-beige/40">
                    <div className="flex items-start justify-between gap-2"><div><div className="font-semibold text-sm">{a.student}</div><div className="text-xs text-ink/55 mt-0.5">{a.id} • {a.school}</div></div><Badge tone={a.severity === "Critical" ? "red" : "yellow"} dot>{a.severity}</Badge></div>
                    <div className="text-sm mt-2">{a.type}</div><div className="text-xs text-ink/55 mt-1">Owner: {a.owner}</div>
                    <div className="mt-3 flex items-center justify-between"><span className="text-xs text-ink/50">{a.age}</span><div className="flex gap-2"><Button size="sm">Assign</Button>{a.status !== "Resolved" && <Button variant="outline" size="sm">Resolve</Button>}</div></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export { AlertsPage };
