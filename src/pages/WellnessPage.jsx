import { useMemo, useState } from "react";
import {
  IconHeart,
  IconFlag,
  IconCalendar,
  IconSpark,
  IconArrowRight,
} from "../component/Icons.jsx";
import { Card, Badge, Button, Select } from "../component/UI.jsx";

const TREND = [
  { day: "Mon", score: 68 },
  { day: "Tue", score: 72 },
  { day: "Wed", score: 70 },
  { day: "Thu", score: 74 },
  { day: "Fri", score: 77 },
  { day: "Sat", score: 73 },
  { day: "Sun", score: 76 },
];

const RISK_GROUPS = [
  { label: "Healthy", value: 68, tone: "green" },
  { label: "Watchlist", value: 24, tone: "yellow" },
  { label: "Critical", value: 8, tone: "red" },
];

const CASES = [
  { student: "Isha Reddy", school: "Lotus Valley", risk: "Critical", note: "Low check-ins for 5 days", owner: "Ananya Kapoor" },
  { student: "Dhruv Malhotra", school: "Oak Ridge", risk: "Critical", note: "Sentiment dropped 32%", owner: "Nisha D'Souza" },
  { student: "Zara Shaikh", school: "Willowbrook Intl.", risk: "Watchlist", note: "Attendance + mood variance", owner: "Dr. Meera Iyer" },
  { student: "Kian Arora", school: "Heritage Public", risk: "Watchlist", note: "3 missed reflections", owner: "Rahul Varma" },
];

function WellnessPage() {
  const [range, setRange] = useState("7d");
  const [focus, setFocus] = useState("All schools");

  const avgScore = useMemo(() => {
    const sum = TREND.reduce((acc, x) => acc + x.score, 0);
    return (sum / TREND.length).toFixed(1);
  }, []);

  return (
    <div className="space-y-6 fade-in">
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-teal to-tealDeep text-white relative overflow-hidden">
        <div className="absolute -right-16 -top-10 w-56 h-56 rounded-full bg-yellow/20 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <Badge tone="yellow" className="mb-3">Wellness Intelligence</Badge>
            <h2 className="font-display text-3xl md:text-5xl leading-[1.05]">
              Whole-network wellness is at <span className="text-yellow">{avgScore}</span>.
            </h2>
            <p className="text-white/80 mt-3 max-w-2xl">
              Focus on at-risk cohorts, compare weekly changes, and assign interventions before escalation.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="beige" icon={<IconCalendar size={16} />}>Schedule check-in</Button>
            <Button iconRight={<IconArrowRight size={16} />}>Publish summary</Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card><div className="flex items-center justify-between"><div><div className="text-xs uppercase tracking-wider text-ink/50 font-semibold">Average score</div><div className="font-display text-5xl mt-3">{avgScore}</div></div><span className="w-12 h-12 rounded-xl bg-teal/10 text-teal flex items-center justify-center"><IconHeart size={22} /></span></div><p className="text-xs text-ink/50 mt-4">+2.4 vs previous week</p></Card>
        <Card><div className="flex items-center justify-between"><div><div className="text-xs uppercase tracking-wider text-ink/50 font-semibold">Active alerts</div><div className="font-display text-5xl mt-3">31</div></div><span className="w-12 h-12 rounded-xl bg-orange/15 text-orange flex items-center justify-center"><IconFlag size={22} /></span></div><p className="text-xs text-ink/50 mt-4">8 critical, 23 watchlist</p></Card>
        <Card><div className="flex items-center justify-between"><div><div className="text-xs uppercase tracking-wider text-ink/50 font-semibold">Engagement streak</div><div className="font-display text-5xl mt-3">84%</div></div><span className="w-12 h-12 rounded-xl bg-yellow/20 text-ink flex items-center justify-center"><IconSpark size={22} /></span></div><p className="text-xs text-ink/50 mt-4">+6% completion of weekly reflections</p></Card>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
        <Card>
          <div className="flex flex-wrap gap-3 justify-between items-center mb-5">
            <div><h3 className="font-display text-2xl">Wellness trend</h3><p className="text-sm text-ink/60">Average score across selected schools</p></div>
            <div className="flex gap-2">
              <Select value={focus} onChange={(e) => setFocus(e.target.value)} className="w-44"><option>All schools</option><option>Enterprise schools</option><option>Growth schools</option></Select>
              <Select value={range} onChange={(e) => setRange(e.target.value)} className="w-28"><option value="7d">7 days</option><option value="30d">30 days</option><option value="90d">90 days</option></Select>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-3 items-end h-56">{TREND.map((p) => (<div key={p.day} className="flex flex-col items-center gap-2"><div className="text-[11px] text-ink/50 font-mono">{p.score}</div><div className="w-full rounded-t-xl bg-gradient-to-t from-teal to-teal/60" style={{ height: `${Math.max(14, p.score)}%` }} /><div className="text-[11px] text-ink/60 font-medium">{p.day}</div></div>))}</div>
        </Card>
        <Card>
          <h3 className="font-display text-2xl mb-1">Risk distribution</h3><p className="text-sm text-ink/60 mb-5">Current active student cases</p>
          <div className="space-y-4">{RISK_GROUPS.map((g) => (<div key={g.label}><div className="flex items-center justify-between text-sm mb-1.5"><span className="font-medium">{g.label}</span><span className="text-ink/60">{g.value}%</span></div><div className="w-full h-2.5 rounded-full bg-beige overflow-hidden"><div className={g.tone === "green" ? "h-full bg-emerald-500" : g.tone === "yellow" ? "h-full bg-orange" : "h-full bg-red-500"} style={{ width: `${g.value}%` }} /></div></div>))}</div>
        </Card>
      </div>
      <Card padded={false}>
        <div className="px-6 py-5 border-b border-ink/5 flex items-center justify-between"><div><h3 className="font-display text-2xl">Priority interventions</h3><p className="text-sm text-ink/60">Students that need immediate counselor action</p></div><Button variant="outline" size="sm">Export list</Button></div>
        <div className="divide-y divide-ink/5">{CASES.map((item) => (<div key={item.student} className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"><div><div className="font-semibold">{item.student}</div><div className="text-sm text-ink/60">{item.school} • {item.note}</div></div><div className="flex items-center gap-3"><Badge tone={item.risk === "Critical" ? "red" : "yellow"} dot>{item.risk}</Badge><span className="text-sm text-ink/60">{item.owner}</span><Button size="sm">Assign</Button></div></div>))}</div>
      </Card>
    </div>
  );
}

export { WellnessPage };
