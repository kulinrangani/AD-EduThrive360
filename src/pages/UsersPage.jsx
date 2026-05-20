import { useEffect, useMemo, useState } from "react";
import { cn, Input, Select, Button, Card, Avatar, Badge } from "../component/UI.jsx";
import { IconSearch, IconFilter, IconPlus, IconDots, IconArrowLeft, IconArrowRight } from "../component/Icons.jsx";
import * as orgApi from "../api/organizations.js";
import * as analyticsApi from "../api/analytics.js";
import { ResultViewerModal } from "../component/ResultViewerModal.jsx";

function UsersPage() {
  const [tab, setTab] = useState("members");
  const [query, setQuery] = useState("");
  const [orgs, setOrgs] = useState([]);
  const [highRisk, setHighRisk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewResultId, setViewResultId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [list, risks] = await Promise.all([
          orgApi.listOrganizations(),
          analyticsApi.getHighRiskUsers({ limit: 100 }),
        ]);
        const details = await Promise.all(
          (list ?? []).map((o) => orgApi.getOrganization(o.id)),
        );
        if (!cancelled) {
          setOrgs(details);
          setHighRisk(risks);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const counselors = useMemo(() => {
    const list = [];
    for (const org of orgs) {
      for (const c of org.counselors ?? []) {
        list.push({
          name: c.fullName,
          school: org.name,
          email: c.email,
          status: c.status === "inactive" ? "Inactive" : "Online",
        });
      }
    }
    return list;
  }, [orgs]);

  const members = useMemo(() => {
    const riskMap = new Map(highRisk.map((r) => [r.userId, r]));
    const list = [];
    for (const org of orgs) {
      for (const m of org.members ?? []) {
        const risk = riskMap.get(m.id);
        list.push({
          id: m.id,
          name: m.fullName,
          school: org.name,
          orgType: org.type,
          wellness: risk ? Math.round(risk.normalizedScore * 25) : null,
          flag: risk?.riskLevel === "High" ? "Critical" : risk?.riskLevel === "Medium" ? "Attention" : null,
          last: risk?.createdAt ? new Date(risk.createdAt).toLocaleDateString() : "—",
          resultId: risk?.resultId ?? null,
        });
      }
    }
    return list;
  }, [orgs, highRisk]);

  const filteredCounselors = counselors.filter((u) => {
    const q = query.trim().toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.school.toLowerCase().includes(q);
  });

  const filteredMembers = members.filter((u) => {
    const q = query.trim().toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.school.toLowerCase().includes(q);
  });

  const tabs = [
    { key: "counselors", label: "Counselors", count: counselors.length },
    { key: "members", label: "Members", count: members.length },
  ];

  return (
    <div className="space-y-6 fade-in">
      {loading && <p className="text-sm text-ink/50">Loading users…</p>}

      <div className="bg-white rounded-2xl p-2 border border-ink/5 inline-flex flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "px-5 h-11 rounded-xl text-sm font-semibold flex items-center gap-2 transition",
              tab === t.key ? "bg-ink text-beige" : "text-ink/60 hover:text-ink",
            )}
          >
            {t.label}
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 min-w-[22px] h-5 rounded-md flex items-center justify-center",
                tab === t.key ? "bg-teal text-white" : "bg-beige text-ink/60",
              )}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 max-w-lg">
          <Input
            icon={<IconSearch size={16} />}
            placeholder={`Search ${tab}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <Card padded={false}>
        <div className="overflow-x-auto scrollbar">
          {tab === "counselors" && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink/50">
                  <th className="px-6 py-4 font-semibold">Counselor</th>
                  <th className="px-6 py-4 font-semibold">Organization</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filteredCounselors.map((u, i) => (
                  <tr key={i} className="row-hover">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} />
                        <div>
                          <div className="font-semibold">{u.name}</div>
                          <div className="text-xs text-ink/50">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{u.school}</td>
                    <td className="px-6 py-4">
                      <Badge tone={u.status === "Online" ? "green" : "orange"} dot>
                        {u.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === "members" && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink/50">
                  <th className="px-6 py-4 font-semibold">Member</th>
                  <th className="px-6 py-4 font-semibold">Organization</th>
                  <th className="px-6 py-4 font-semibold">Wellness</th>
                  <th className="px-6 py-4 font-semibold">Flag</th>
                  <th className="px-6 py-4 font-semibold text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filteredMembers.map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4">{u.name}</td>
                    <td className="px-6 py-4">{u.school}</td>
                    <td className="px-6 py-4 font-mono">{u.wellness ?? "—"}</td>
                    <td className="px-6 py-4">
                      {u.flag ? (
                        <Badge tone={u.flag === "Critical" ? "red" : "orange"} dot>
                          {u.flag}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.resultId ? (
                        <Button variant="outline" size="sm" onClick={() => setViewResultId(u.resultId)}>
                          View
                        </Button>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <ResultViewerModal
        resultId={viewResultId}
        open={!!viewResultId}
        onClose={() => setViewResultId(null)}
      />
    </div>
  );
}

export { UsersPage };
