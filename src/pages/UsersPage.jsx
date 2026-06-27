import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { cn, Input, Select, Button, Card, Avatar, Badge } from "../component/UI.jsx";
import { IconSearch, IconFilter, IconPlus, IconDots, IconArrowLeft, IconArrowRight } from "../component/Icons.jsx";
import * as orgApi from "../api/organizations.js";
import * as analyticsApi from "../api/analytics.js";
import { ResultViewerModal } from "../component/ResultViewerModal.jsx";
import { Table } from "../component/Table";

function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(() => {
    const t = searchParams.get("tab");
    return t === "counselors" || t === "members" ? t : "members";
  });
  const [query, setQuery] = useState(() => searchParams.get("search") || "");
  const [orgs, setOrgs] = useState([]);
  const [highRisk, setHighRisk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewResultId, setViewResultId] = useState(null);

  useEffect(() => {
    const q = searchParams.get("search") || "";
    setQuery(q);
    const t = searchParams.get("tab");
    if (t === "counselors" || t === "members") {
      setTab(t);
    }
  }, [searchParams]);

  const handleTabChange = (t) => {
    setTab(t);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", t);
      return next;
    }, { replace: true });
  };

  const handleQueryChange = (q) => {
    setQuery(q);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (q) {
        next.set("search", q);
      } else {
        next.delete("search");
      }
      return next;
    }, { replace: true });
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
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
          setHighRisk(risks ?? []);
        }
      } catch (err) {
        console.error("Failed to load users page data:", err);
        if (!cancelled) {
          setError(err.response?.data?.error ?? "Failed to load users data");
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

  // Reusable Table definitions
  const counselorColumns = [
    {
      key: "counselor",
      header: "Counselor",
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.name} />
          <div>
            <div className="font-semibold text-ink">{u.name}</div>
            <div className="text-xs text-ink/50">{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "school",
      header: "Organization",
    },
    {
      key: "status",
      header: "Status",
      render: (u) => (
        <Badge tone={u.status === "Online" ? "green" : "orange"} dot>
          {u.status}
        </Badge>
      ),
    },
  ];

  const renderMobileCounselor = (u, i) => (
    <div key={i} className="border border-ink/5 rounded-xl p-4 space-y-2 bg-white">
      <div className="flex items-center gap-3">
        <Avatar name={u.name} />
        <div>
          <div className="font-semibold text-ink">{u.name}</div>
          <div className="text-xs text-ink/50">{u.email}</div>
        </div>
        <div className="ml-auto">
          <Badge tone={u.status === "Online" ? "green" : "orange"} dot>
            {u.status}
          </Badge>
        </div>
      </div>
      <div className="text-sm text-ink/70 pt-2 border-t border-ink/5 flex justify-between">
        <span className="font-medium text-ink/50 text-xs uppercase">Organization</span>
        <span>{u.school}</span>
      </div>
    </div>
  );

  const memberColumns = [
    {
      key: "name",
      header: "Member",
      render: (u) => <span className="font-semibold text-ink">{u.name}</span>,
    },
    {
      key: "school",
      header: "Organization",
    },
    {
      key: "wellness",
      header: "Wellness",
      className: "font-mono",
      render: (u) => u.wellness ?? "—",
    },
    {
      key: "flag",
      header: "Flag",
      render: (u) =>
        u.flag ? (
          <Badge tone={u.flag === "Critical" ? "red" : "orange"} dot>
            {u.flag}
          </Badge>
        ) : (
          "—"
        ),
    },
    {
      key: "result",
      header: "Result",
      className: "text-right",
      render: (u) =>
        u.resultId ? (
          <Button variant="outline" size="sm" onClick={() => setViewResultId(u.resultId)}>
            View
          </Button>
        ) : (
          "—"
        ),
    },
  ];

  const renderMobileMember = (u) => (
    <div key={u.id} className="border border-ink/5 rounded-xl p-4 space-y-3 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold text-ink">{u.name}</div>
          <div className="text-xs text-ink/50 mt-0.5">{u.school}</div>
        </div>
        <div>
          {u.flag ? (
            <Badge tone={u.flag === "Critical" ? "red" : "orange"} dot>
              {u.flag}
            </Badge>
          ) : (
            <Badge tone="beige">Healthy</Badge>
          )}
        </div>
      </div>
      <div className="text-sm pt-2 border-t border-ink/5 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <span className="text-ink/50 text-xs uppercase font-semibold">Wellness Score</span>
          <span className="font-mono font-semibold text-teal">{u.wellness ?? "—"}</span>
        </div>
        {u.resultId && (
          <Button variant="outline" size="sm" onClick={() => setViewResultId(u.resultId)}>
            View Result
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 fade-in">
      {loading && <p className="text-sm text-ink/50">Loading users…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="bg-white rounded-2xl p-2 border border-ink/5 inline-flex flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => handleTabChange(t.key)}
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
            onChange={(e) => handleQueryChange(e.target.value)}
          />
        </div>
      </div>

      <Card padded={false}>
        {tab === "counselors" && (
          <Table
            columns={counselorColumns}
            data={filteredCounselors}
            loading={loading}
            loadingText="Loading counselors…"
            emptyText="No counselors found."
            renderMobileItem={renderMobileCounselor}
          />
        )}
        {tab === "members" && (
          <Table
            columns={memberColumns}
            data={filteredMembers}
            loading={loading}
            loadingText="Loading members…"
            emptyText="No members found."
            renderMobileItem={renderMobileMember}
          />
        )}
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
