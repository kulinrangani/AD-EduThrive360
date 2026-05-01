import { IconSchool, IconUsers, IconHeart, IconBell, IconArrowRight, IconFlag, IconDots } from "../component/Icons.jsx";
import { cn, Button, Card, Badge, Sparkline } from "../component/UI.jsx";

function StatCard({ label, value, delta, tone, icon, spark }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink/50 font-semibold">{label}</div>
          <div className="font-display text-[40px] leading-none text-ink mt-3">{value}</div>
          <div className="mt-3 flex items-center gap-2"><Badge tone={delta >= 0 ? "green" : "red"}>{delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%</Badge><span className="text-xs text-ink/50">vs last month</span></div>
        </div>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", tone)}>{icon}</div>
      </div>
      <div className="mt-4 -mx-2"><Sparkline data={spark} w={260} h={42} /></div>
    </Card>
  );
}

function DashboardPage() {
  return (
    <div className="space-y-6 fade-in">
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-ink to-inkSoft text-beige relative overflow-hidden grain">
        <div className="absolute -right-20 -bottom-20 w-[360px] h-[360px] rounded-full bg-teal/30 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div><Badge tone="yellow" className="mb-3">Thursday · Apr 23, 2026</Badge><h2 className="font-display text-3xl md:text-5xl leading-[1.05] text-beige max-w-2xl">Good afternoon, Aarav. <span className="text-orange">24 schools</span> are thriving today.</h2><p className="text-beige/70 mt-3 max-w-xl">3 wellness alerts need review, and the April well-being report is ready to publish.</p></div>
          <div className="flex gap-3"><Button variant="beige" size="lg">View alerts</Button><Button size="lg" iconRight={<IconArrowRight size={16} />}>Publish report</Button></div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total Schools" value="24" delta={8.3} tone="bg-teal/10 text-teal" icon={<IconSchool size={22} />} spark={[12,14,13,16,18,20,19,22,21,23,22,24]} />
        <StatCard label="Total Students" value="11,484" delta={4.1} tone="bg-orange/15 text-orange" icon={<IconUsers size={22} />} spark={[8200,8600,9100,9300,9600,10000,10250,10600,10900,11100,11300,11484]} />
        <StatCard label="Active Counselors" value="186" delta={2.7} tone="bg-yellow/25 text-ink" icon={<IconHeart size={22} />} spark={[140,148,150,158,162,168,171,176,179,182,184,186]} />
        <StatCard label="Active Alerts" value="3" delta={-33.0} tone="bg-ink text-beige" icon={<IconBell size={22} />} spark={[9,8,7,10,6,5,8,4,6,5,4,3]} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5"><div><div className="text-xs uppercase tracking-wider text-ink/50 font-semibold">Priority queue</div><h3 className="font-display text-2xl mt-1">Active alerts</h3></div><Button variant="ghost" size="sm" iconRight={<IconArrowRight size={14} />}>View all</Button></div>
          <div className="divide-y divide-ink/5">{[{school:"Willowbrook International", msg:"Sustained negative sentiment across 5 check-ins", tone:"red", time:"12m ago"},{school:"Heritage Public School", msg:"Skipped 3 counselor sessions this month", tone:"orange", time:"1h ago"},{school:"Lotus Valley", msg:"Journal flagged for keywords · review suggested", tone:"orange", time:"3h ago"}].map((a,i)=><div key={i} className="py-4 flex items-start gap-4"><div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", a.tone==="red"?"bg-red-50 text-red-600":"bg-orange/15 text-orange")}><IconFlag size={18} /></div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 flex-wrap"><span className="font-semibold text-ink">{a.school}</span><Badge tone={a.tone==="red"?"red":"orange"} dot>{a.tone==="red"?"Critical":"Attention"}</Badge></div><div className="text-sm text-ink/70 mt-0.5">{a.msg}</div><div className="text-xs text-ink/50 mt-1">{a.time}</div></div><Button variant="outline" size="sm">Review</Button></div>)}</div>
        </Card>
        <Card><div className="flex items-center justify-between mb-5"><h3 className="font-display text-2xl">Recent activity</h3><IconDots size={18} className="text-ink/40" /></div><ol className="relative border-l-2 border-beigeDeep ml-2 space-y-5">{[{who:"Priya Shah",act:"onboarded Greenfield High",when:"8 min ago",tone:"bg-teal"},{who:"System",act:"April wellness report generated",when:"1 h ago",tone:"bg-orange"},{who:"System",act:"SSO sync completed · 11,484 users",when:"Yesterday",tone:"bg-ink"}].map((e,i)=><li key={i} className="pl-5 relative"><span className={cn("absolute -left-[7px] top-1 w-3 h-3 rounded-full", e.tone)} /><div className="text-sm"><span className="font-semibold">{e.who}</span> {e.act}</div><div className="text-xs text-ink/50 mt-0.5">{e.when}</div></li>)}</ol></Card>
      </div>
    </div>
  );
}

export { DashboardPage };
