import { useMemo, useState } from "react";
import {
  IconDownload,
  IconCalendar,
  IconChart,
  IconArrowRight,
  IconSchool,
  IconUsers,
} from "../component/Icons.jsx";
import { Card, Badge, Button, Select } from "../component/UI.jsx";

const REPORTS = [
  { id: "R-2401", name: "Student Wellness Baseline Survey", scope: "All schools", type: "Survey", lastRun: "Today, 09:10", status: "Ready" },
  { id: "R-2394", name: "Parent Feedback Pulse Survey", scope: "Enterprise schools", type: "Survey", lastRun: "Yesterday, 18:22", status: "Ready" },
  { id: "R-2380", name: "Mindful Mornings Campaign Performance", scope: "All schools", type: "Campaign", lastRun: "2 days ago", status: "Scheduled" },
  { id: "R-2375", name: "Exam Calm Campaign Impact", scope: "Growth schools", type: "Campaign", lastRun: "3 days ago", status: "Failed" },
];

const METRICS = [
  { label: "Survey reports", value: "42", sub: "Launched survey outcomes this month", icon: <IconChart size={20} />, tone: "bg-teal/10 text-teal" },
  { label: "Campaign reports", value: "31", sub: "Program and campaign performance reports", icon: <IconCalendar size={20} />, tone: "bg-yellow/25 text-ink" },
  { label: "Schools covered", value: "24", sub: "Survey and campaign participation", icon: <IconSchool size={20} />, tone: "bg-orange/15 text-orange" },
  { label: "Respondents", value: "5,842", sub: "Students + parents in survey dataset", icon: <IconUsers size={20} />, tone: "bg-ink/10 text-ink" },
];

function ReportsPage() {
  const [period, setPeriod] = useState("This month");
  const [scope, setScope] = useState("All schools");
  const readyCount = useMemo(() => REPORTS.filter((r) => r.status === "Ready").length, []);

  return (
    <div className="space-y-6 fade-in">
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-ink to-inkSoft text-beige relative overflow-hidden grain">
        <div className="absolute -right-14 -top-8 w-64 h-64 rounded-full bg-teal/30 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <Badge tone="yellow" className="mb-3">Reporting Hub</Badge>
            <h2 className="font-display text-3xl md:text-5xl leading-[1.05]">{readyCount} survey and campaign reports are ready.</h2>
            <p className="text-beige/70 mt-3 max-w-2xl">Track outcomes of launched surveys and campaign performance in one place.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="beige" icon={<IconDownload size={16} />}>Export all</Button>
            <Button iconRight={<IconArrowRight size={16} />}>Create report</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {METRICS.map((m) => (
          <Card key={m.label}>
            <div className="flex items-start justify-between gap-4">
              <div><div className="text-xs uppercase tracking-wider text-ink/50 font-semibold">{m.label}</div><div className="font-display text-[40px] leading-none mt-3">{m.value}</div><p className="text-xs text-ink/50 mt-3">{m.sub}</p></div>
              <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${m.tone}`}>{m.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div><h3 className="font-display text-2xl">Survey & campaign templates</h3><p className="text-sm text-ink/60">Generate reports for launched surveys and active campaigns</p></div>
          <div className="flex gap-2">
            <Select value={scope} onChange={(e) => setScope(e.target.value)} className="w-44"><option>All schools</option><option>Enterprise schools</option><option>Growth schools</option></Select>
            <Select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-36"><option>This week</option><option>This month</option><option>This quarter</option></Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-ink/10 p-4"><div className="text-xs uppercase tracking-wide text-ink/50 font-semibold">Survey report</div><h4 className="font-semibold mt-1">Wellness Baseline Survey Results</h4><p className="text-sm text-ink/60 mt-2">Response rate, average score, and segment breakdown by grade and school.</p><Button size="sm" className="mt-4">Run now</Button></div>
          <div className="rounded-2xl border border-ink/10 p-4"><div className="text-xs uppercase tracking-wide text-ink/50 font-semibold">Survey report</div><h4 className="font-semibold mt-1">Parent Pulse Survey Analysis</h4><p className="text-sm text-ink/60 mt-2">Sentiment trends, top concerns, and response quality by region.</p><Button size="sm" className="mt-4">Run now</Button></div>
          <div className="rounded-2xl border border-ink/10 p-4"><div className="text-xs uppercase tracking-wide text-ink/50 font-semibold">Campaign report</div><h4 className="font-semibold mt-1">Campaign Effectiveness Summary</h4><p className="text-sm text-ink/60 mt-2">Reach, participation, completion, and pre/post wellbeing lift.</p><Button size="sm" className="mt-4">Run now</Button></div>
        </div>
      </Card>

      <Card padded={false}>
        <div className="px-6 py-5 border-b border-ink/5"><h3 className="font-display text-2xl">Recent runs</h3><p className="text-sm text-ink/60">Track execution status and download generated files</p></div>
        <div className="divide-y divide-ink/5">
          {REPORTS.map((r) => (
            <div key={r.id} className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div><div className="font-semibold">{r.name}</div><div className="text-sm text-ink/60">{r.id} • {r.scope} • {r.type}</div></div>
              <div className="flex items-center gap-3"><span className="text-xs text-ink/50">{r.lastRun}</span><Badge tone={r.status === "Ready" ? "green" : r.status === "Scheduled" ? "yellow" : "red"} dot>{r.status}</Badge><Button variant="outline" size="sm" icon={<IconDownload size={14} />}>Download</Button></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export { ReportsPage };
