import { useState } from "react";
import {
  IconCheck, IconMail, IconSpark, IconSearch, IconDownload, IconPlus, IconEdit, IconTrash, IconDots, IconArrowLeft, IconArrowRight,
} from "../../component/Icons.jsx";
import { Modal, Button, Input, Select, Badge, Card } from "../../component/UI.jsx";

const SCHOOLS = [
  { id: 1, name: "Willowbrook International", city: "Mumbai", students: 1240, counselors: 14, plan: "Enterprise", status: "Active", wellness: 82 },
  { id: 2, name: "Heritage Public School", city: "Delhi", students: 980, counselors: 11, plan: "Growth", status: "Active", wellness: 78 },
  { id: 3, name: "Lotus Valley", city: "Noida", students: 1510, counselors: 17, plan: "Enterprise", status: "Active", wellness: 71 },
  { id: 4, name: "Sunrise Academy", city: "Pune", students: 720, counselors: 8, plan: "Growth", status: "Active", wellness: 86 },
  { id: 5, name: "Greenfield High", city: "Bengaluru", students: 430, counselors: 6, plan: "Starter", status: "Onboarding", wellness: 0 },
  { id: 6, name: "St. Anselm's", city: "Jaipur", students: 860, counselors: 10, plan: "Growth", status: "Active", wellness: 74 },
  { id: 7, name: "Oak Ridge Public", city: "Chennai", students: 1100, counselors: 13, plan: "Enterprise", status: "Active", wellness: 79 },
  { id: 8, name: "Bloomfield Day School", city: "Kolkata", students: 640, counselors: 7, plan: "Growth", status: "Paused", wellness: 68 },
];

function SchoolModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Add a new school" subtitle="Once onboarded, it'll take ~5 minutes for data to sync." width="max-w-2xl" footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={onClose} icon={<IconCheck size={16}/>}>Create school</Button></>}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">School name</label><Input className="mt-1.5" placeholder="e.g. Greenfield High"/></div>
        <div><label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">City</label><Input className="mt-1.5" placeholder="Bengaluru"/></div>
        <div><label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">Admin email</label><Input className="mt-1.5" icon={<IconMail size={16}/>} placeholder="principal@school.edu"/></div>
        <div><label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">Plan</label><Select className="mt-1.5"><option>Starter — up to 500 students</option><option>Growth — up to 1,500 students</option><option>Enterprise — unlimited</option></Select></div>
        <div className="md:col-span-2"><label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">Wellness program focus</label><div className="mt-2 flex flex-wrap gap-2">{["Anxiety & stress","Peer support","Academic pressure","Sleep & habits","Career guidance","Digital wellbeing"].map(t => (<label key={t} className="inline-flex items-center gap-2 px-3 h-9 rounded-full border border-ink/15 bg-beige/60 cursor-pointer hover:border-teal text-sm"><input type="checkbox" className="accent-teal"/> {t}</label>))}</div></div>
        <div className="md:col-span-2 bg-beige rounded-xl p-4 flex items-start gap-3"><span className="w-8 h-8 rounded-lg bg-teal/15 text-teal flex items-center justify-center shrink-0"><IconSpark size={16}/></span><div className="text-sm text-ink/70">A welcome kit and onboarding tasks will be emailed to the admin. You can edit this later in <span className="font-semibold text-ink">School settings</span>.</div></div>
      </div>
    </Modal>
  );
}

function WellnessRing({ value }) {
  const r = 14, c = 2 * Math.PI * r;
  const color = value >= 80 ? "#38938E" : value >= 70 ? "#EFAD1F" : "#ef4444";
  return <div className="inline-flex items-center gap-2"><svg width="36" height="36" className="-rotate-90"><circle cx="18" cy="18" r={r} stroke="#F5EEDA" strokeWidth="4" fill="none"/><circle cx="18" cy="18" r={r} stroke={color} strokeWidth="4" fill="none" strokeDasharray={`${(value/100)*c} ${c}`} strokeLinecap="round"/></svg><span className="font-mono text-sm">{value || "—"}</span></div>;
}

function SchoolsPage() {
  const [modal, setModal] = useState(false);
  const [query, setQuery] = useState("");
  const [plan, setPlan] = useState("All plans");
  const [status, setStatus] = useState("All statuses");
  const filtered = SCHOOLS.filter(s => (plan === "All plans" || s.plan === plan) && (status === "All statuses" || s.status === status) && (!query || s.name.toLowerCase().includes(query.toLowerCase()) || s.city.toLowerCase().includes(query.toLowerCase())));

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex gap-3 flex-1"><div className="flex-1 max-w-md"><Input icon={<IconSearch size={16}/>} placeholder="Search schools or cities…" value={query} onChange={e=>setQuery(e.target.value)}/></div><Select value={plan} onChange={e=>setPlan(e.target.value)} className="w-44"><option>All plans</option><option>Starter</option><option>Growth</option><option>Enterprise</option></Select><Select value={status} onChange={e=>setStatus(e.target.value)} className="w-48"><option>All statuses</option><option>Active</option><option>Onboarding</option><option>Paused</option></Select></div>
        <div className="flex gap-3"><Button variant="outline" icon={<IconDownload size={16}/>}>Export</Button><Button icon={<IconPlus size={16}/>} onClick={()=>setModal(true)}>Add school</Button></div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[{ l: "All schools", v: "24", t: "teal" },{ l: "Active", v: "21", t: "green" },{ l: "Onboarding", v: "2", t: "yellow" },{ l: "Paused", v: "1", t: "orange" }].map(s => (<div key={s.l} className="bg-white rounded-2xl p-5 border border-ink/5 flex items-center gap-4"><Badge tone={s.t} dot>{s.l}</Badge><span className="font-display text-3xl ml-auto">{s.v}</span></div>))}</div>
      <Card padded={false}>
        <div className="hidden md:block overflow-x-auto scrollbar">
          <table className="w-full text-sm"><thead><tr className="text-left text-xs uppercase tracking-wider text-ink/50"><th className="px-6 py-4 font-semibold">School</th><th className="px-6 py-4 font-semibold">City</th><th className="px-6 py-4 font-semibold">Students</th><th className="px-6 py-4 font-semibold">Counselors</th><th className="px-6 py-4 font-semibold">Plan</th><th className="px-6 py-4 font-semibold">Status</th><th className="px-6 py-4 font-semibold">Wellness</th><th className="px-6 py-4 font-semibold text-right">Actions</th></tr></thead><tbody className="divide-y divide-ink/5">{filtered.map(s => (<tr key={s.id} className="row-hover"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-beige flex items-center justify-center font-display text-ink">{s.name[0]}</div><div><div className="font-semibold">{s.name}</div><div className="text-xs text-ink/50">ID · ET-{String(s.id).padStart(4,"0")}</div></div></div></td><td className="px-6 py-4 text-ink/70">{s.city}</td><td className="px-6 py-4 font-mono">{s.students.toLocaleString()}</td><td className="px-6 py-4 font-mono">{s.counselors}</td><td className="px-6 py-4"><Badge tone={s.plan === "Enterprise" ? "ink" : s.plan === "Growth" ? "teal" : "beige"}>{s.plan}</Badge></td><td className="px-6 py-4"><Badge tone={s.status === "Active" ? "green" : s.status === "Onboarding" ? "yellow" : "orange"} dot>{s.status}</Badge></td><td className="px-6 py-4"><WellnessRing value={s.wellness}/></td><td className="px-6 py-4"><div className="flex items-center justify-end gap-1"><button className="w-9 h-9 rounded-lg hover:bg-beige text-ink/60 hover:text-teal flex items-center justify-center transition"><IconEdit size={16}/></button><button className="w-9 h-9 rounded-lg hover:bg-red-50 text-ink/60 hover:text-red-600 flex items-center justify-center transition"><IconTrash size={16}/></button><button className="w-9 h-9 rounded-lg hover:bg-beige text-ink/60 flex items-center justify-center transition"><IconDots size={16}/></button></div></td></tr>))}</tbody></table>
        </div>
        <div className="md:hidden p-4 space-y-3">{filtered.map(s => (<div key={s.id} className="border border-ink/5 rounded-xl p-4"><div className="flex items-start justify-between gap-3"><div><div className="font-semibold">{s.name}</div><div className="text-xs text-ink/50">{s.city} · ET-{String(s.id).padStart(4,"0")}</div></div><Badge tone={s.status === "Active" ? "green" : s.status === "Onboarding" ? "yellow" : "orange"} dot>{s.status}</Badge></div><div className="grid grid-cols-3 gap-2 mt-3 text-center"><div><div className="font-mono text-sm">{s.students}</div><div className="text-[10px] uppercase text-ink/50">Students</div></div><div><div className="font-mono text-sm">{s.counselors}</div><div className="text-[10px] uppercase text-ink/50">Counselors</div></div><div><div className="font-mono text-sm">{s.wellness||"—"}</div><div className="text-[10px] uppercase text-ink/50">Wellness</div></div></div></div>))}</div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-ink/5"><div className="text-xs text-ink/50">Showing <span className="font-semibold text-ink">1–{filtered.length}</span> of {SCHOOLS.length} schools</div><div className="flex gap-1"><button className="w-9 h-9 rounded-lg hover:bg-beige text-ink/50 flex items-center justify-center"><IconArrowLeft size={14}/></button><button className="w-9 h-9 rounded-lg bg-ink text-beige text-sm font-semibold">1</button><button className="w-9 h-9 rounded-lg hover:bg-beige text-ink/60 text-sm">2</button><button className="w-9 h-9 rounded-lg hover:bg-beige text-ink/60 text-sm">3</button><button className="w-9 h-9 rounded-lg hover:bg-beige text-ink/50 flex items-center justify-center"><IconArrowRight size={14}/></button></div></div>
      </Card>
      <SchoolModal open={modal} onClose={()=>setModal(false)} />
    </div>
  );
}

export { SchoolsPage };
