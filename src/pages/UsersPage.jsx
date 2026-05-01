import { useState } from "react";
import { cn, Input, Select, Button, Card, Avatar, Badge } from "../component/UI.jsx";
import { IconSearch, IconFilter, IconPlus, IconDots, IconArrowLeft, IconArrowRight } from "../component/Icons.jsx";

const COUNSELORS = [
  { name: "Dr. Meera Iyer", school: "Willowbrook Intl.", cases: 34, rating: 4.9, status: "Online", email: "meera@willowbrook.edu" },
  { name: "Rahul Varma", school: "Heritage Public", cases: 28, rating: 4.7, status: "Online", email: "rahul@heritage.edu" },
  { name: "Ananya Kapoor", school: "Lotus Valley", cases: 41, rating: 4.8, status: "Busy", email: "ananya@lotus.edu" },
];
const STUDENTS = [
  { name: "Aarav Nair", grade: "9-B", school: "Willowbrook Intl.", wellness: 78, last: "Today, 9:12", flag: null },
  { name: "Isha Reddy", grade: "11-A", school: "Lotus Valley", wellness: 62, last: "Yesterday", flag: "Attention" },
  { name: "Dhruv Malhotra", grade: "9-A", school: "Oak Ridge", wellness: 54, last: "2 days ago", flag: "Critical" },
];
const PARENTS = [
  { name: "Priya Nair", student: "Aarav Nair", relation: "Mother", engagement: "High", last: "Today", phone: "+91 98•••••12" },
  { name: "Rohit Reddy", student: "Isha Reddy", relation: "Father", engagement: "Medium", last: "4 days ago", phone: "+91 99•••••44" },
];

function UsersPage() {
  const [tab, setTab] = useState("counselors");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const tabs = [{ key: "counselors", label: "Counselors", count: 186 }, { key: "students", label: "Students", count: 11484 }, { key: "parents", label: "Parents", count: 9220 }];

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-white rounded-2xl p-2 border border-ink/5 inline-flex flex-wrap">
        {tabs.map(t => <button key={t.key} onClick={()=>setTab(t.key)} className={cn("px-5 h-11 rounded-xl text-sm font-semibold flex items-center gap-2 transition", tab === t.key ? "bg-ink text-beige" : "text-ink/60 hover:text-ink")}>{t.label}<span className={cn("text-[10px] font-bold px-1.5 min-w-[22px] h-5 rounded-md flex items-center justify-center", tab === t.key ? "bg-teal text-white" : "bg-beige text-ink/60")}>{t.count.toLocaleString()}</span></button>)}
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 max-w-lg"><Input icon={<IconSearch size={16}/>} placeholder={`Search ${tab}…`} value={query} onChange={e=>setQuery(e.target.value)}/></div>
        <div className="flex gap-3"><Select value={filter} onChange={e=>setFilter(e.target.value)} className="w-44"><option>All</option></Select><Button variant="outline" icon={<IconFilter size={16}/>}>More filters</Button><Button icon={<IconPlus size={16}/>}>Invite</Button></div>
      </div>
      <Card padded={false}>
        <div className="overflow-x-auto scrollbar">
          {tab === "counselors" && <table className="w-full text-sm"><thead><tr className="text-left text-xs uppercase tracking-wider text-ink/50"><th className="px-6 py-4 font-semibold">Counselor</th><th className="px-6 py-4 font-semibold">School</th><th className="px-6 py-4 font-semibold">Cases</th><th className="px-6 py-4 font-semibold">Status</th></tr></thead><tbody className="divide-y divide-ink/5">{COUNSELORS.map((u,i)=><tr key={i} className="row-hover"><td className="px-6 py-4"><div className="flex items-center gap-3"><Avatar name={u.name}/><div><div className="font-semibold">{u.name}</div><div className="text-xs text-ink/50">{u.email}</div></div></div></td><td className="px-6 py-4">{u.school}</td><td className="px-6 py-4 font-mono">{u.cases}</td><td className="px-6 py-4"><Badge tone={u.status === "Online" ? "green" : "orange"} dot>{u.status}</Badge></td></tr>)}</tbody></table>}
          {tab === "students" && <table className="w-full text-sm"><thead><tr className="text-left text-xs uppercase tracking-wider text-ink/50"><th className="px-6 py-4 font-semibold">Student</th><th className="px-6 py-4 font-semibold">Grade</th><th className="px-6 py-4 font-semibold">School</th><th className="px-6 py-4 font-semibold">Flag</th></tr></thead><tbody className="divide-y divide-ink/5">{STUDENTS.map((u,i)=><tr key={i}><td className="px-6 py-4">{u.name}</td><td className="px-6 py-4">{u.grade}</td><td className="px-6 py-4">{u.school}</td><td className="px-6 py-4">{u.flag ? <Badge tone={u.flag === "Critical" ? "red" : "orange"} dot>{u.flag}</Badge> : "—"}</td></tr>)}</tbody></table>}
          {tab === "parents" && <table className="w-full text-sm"><thead><tr className="text-left text-xs uppercase tracking-wider text-ink/50"><th className="px-6 py-4 font-semibold">Parent</th><th className="px-6 py-4 font-semibold">Linked to</th><th className="px-6 py-4 font-semibold">Engagement</th></tr></thead><tbody className="divide-y divide-ink/5">{PARENTS.map((u,i)=><tr key={i}><td className="px-6 py-4">{u.name}</td><td className="px-6 py-4">{u.student}</td><td className="px-6 py-4"><Badge tone={u.engagement === "High" ? "green" : "yellow"} dot>{u.engagement}</Badge></td></tr>)}</tbody></table>}
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-ink/5"><div className="text-xs text-ink/50">Bulk actions available on selection</div><div className="flex gap-1"><button className="w-9 h-9 rounded-lg hover:bg-beige text-ink/50 flex items-center justify-center"><IconArrowLeft size={14}/></button><button className="w-9 h-9 rounded-lg bg-ink text-beige text-sm font-semibold">1</button><button className="w-9 h-9 rounded-lg hover:bg-beige text-ink/60 text-sm">2</button><button className="w-9 h-9 rounded-lg hover:bg-beige text-ink/50 flex items-center justify-center"><IconArrowRight size={14}/></button><button className="w-9 h-9 rounded-lg hover:bg-beige text-ink/50 flex items-center justify-center"><IconDots size={14}/></button></div></div>
      </Card>
    </div>
  );
}

export { UsersPage };
