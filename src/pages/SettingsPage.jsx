import { useState } from "react";
import { cn, Card, Input, Select, Toggle, Badge, Button } from "../component/UI.jsx";
import { IconChevron, IconMail, IconDownload, IconCheck, IconShield } from "../component/Icons.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function SettingsPage() {
  const { user } = useAuth();
  const org = user?.organizationId;
  const orgName = typeof org === "object" && org?.name ? org.name : "EduThrive360 Platform";
  const [tab, setTab] = useState("general");
  const [branding, setBranding] = useState("#38938E");
  const [notif, setNotif] = useState({ email: true, sms: false, push: true, weekly: true });
  const [alerts, setAlerts] = useState({ critical: true, missed: true, sentiment: false });
  const tabs = [{ k: "general", label: "General" }, { k: "branding", label: "Branding" }, { k: "notifs", label: "Notifications" }, { k: "security", label: "Security" }, { k: "billing", label: "Billing" }];
  const palette = ["#38938E", "#EFAD1F", "#F8DD16", "#302F2F", "#9c6fe4", "#e85a71"];

  return (
    <div className="fade-in grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
      <div className="bg-white rounded-2xl p-3 border border-ink/5 h-max">
        {tabs.map(t => <button key={t.k} onClick={()=>setTab(t.k)} className={cn("w-full text-left px-4 h-11 rounded-xl text-sm font-medium transition flex items-center justify-between", tab === t.k ? "bg-beige text-ink" : "text-ink/60 hover:text-ink hover:bg-beige/60")}>{t.label}{tab === t.k && <IconChevron size={14}/>}</button>)}
      </div>
      <div className="space-y-5">
        {tab === "general" && <Card><h3 className="font-display text-2xl mb-1">Organization</h3><p className="text-sm text-ink/60 mb-6">Your workspace context from the signed-in account.</p><div className="grid grid-cols-1 md:grid-cols-2 gap-5"><div><label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">Organization name</label><Input className="mt-1.5" defaultValue={orgName} readOnly/></div><div><label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">Your email</label><Input className="mt-1.5" icon={<IconMail size={16}/>} defaultValue={user?.email ?? ""} readOnly/></div><div><label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">Role</label><Input className="mt-1.5" defaultValue={user?.role ?? ""} readOnly/></div><div><label className="text-xs uppercase tracking-wider text-ink/50 font-semibold">Org type</label><Input className="mt-1.5" defaultValue={typeof org === "object" && org?.type ? org.type : "platform"} readOnly/></div></div></Card>}
        {tab === "branding" && <Card><h3 className="font-display text-2xl mb-1">Branding</h3><p className="text-sm text-ink/60 mb-6">How EduThrive looks to your schools.</p><div className="flex gap-3 mt-2">{palette.map(c => <button key={c} onClick={()=>setBranding(c)} className={cn("w-11 h-11 rounded-xl transition", branding === c ? "ring-4 ring-ink/20 scale-105" : "hover:scale-105")} style={{ background: c }} />)}</div><div className="mt-6 border-2 border-dashed border-ink/15 rounded-xl p-6 text-center"><div className="w-10 h-10 mx-auto rounded-lg bg-beige flex items-center justify-center mb-2"><IconDownload size={18} className="text-ink/60"/></div><div className="text-sm font-medium">Drop SVG or PNG</div></div></Card>}
        {tab === "notifs" && <Card><h3 className="font-display text-2xl mb-1">Delivery channels</h3><div className="space-y-4 mt-4">{[["email","Email"],["sms","SMS"],["push","Push"],["weekly","Weekly digest"]].map(([k,l]) => <div key={k} className="flex items-center justify-between p-4 rounded-xl border border-ink/5"><div className="font-semibold">{l}</div><Toggle checked={notif[k]} onChange={(v)=>setNotif(n=>({...n,[k]:v}))}/></div>)}</div></Card>}
        {tab === "security" && <Card><h3 className="font-display text-2xl mb-1">Security</h3><div className="space-y-4 mt-4"><div className="flex items-center justify-between p-4 rounded-xl bg-beige/60"><div className="flex items-start gap-3"><span className="w-10 h-10 rounded-lg bg-teal/15 text-teal flex items-center justify-center"><IconShield size={18}/></span><div><div className="font-semibold">Two-factor authentication</div></div></div><Badge tone="green" dot>Enabled</Badge></div><div className="flex items-center justify-between p-4 rounded-xl bg-beige/60"><div className="font-semibold">Audit log</div><Button variant="outline" size="sm" icon={<IconDownload size={14}/>}>Export</Button></div></div></Card>}
        {tab === "billing" && <Card><div className="rounded-2xl p-6 bg-gradient-to-br from-ink to-inkSoft text-beige"><Badge tone="yellow" className="mb-3">Enterprise plan</Badge><div className="font-display text-4xl">₹ 18,40,000 <span className="text-xl text-beige/60">/ year</span></div></div><div className="grid grid-cols-3 gap-4 mt-4">{[{l:"Seats used",v:"11,484 / 15,000"},{l:"Storage",v:"142 GB / 1 TB"},{l:"API calls",v:"2.1M / 10M"}].map(s => <div key={s.l} className="p-4 bg-beige/60 rounded-xl"><div className="text-xs uppercase tracking-wider text-ink/50 font-semibold">{s.l}</div><div className="font-display text-xl mt-1">{s.v}</div></div>)}</div></Card>}
        <div className="flex justify-end gap-3"><Button variant="ghost">Discard</Button><Button>Save changes</Button></div>
      </div>
    </div>
  );
}

export { SettingsPage };
