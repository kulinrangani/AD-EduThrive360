import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IconSearch,
  IconDownload,
  IconPlus,
  IconArrowLeft,
  IconArrowRight,
} from "../component/Icons.jsx";
import { Button, Input, Select, Badge, Card } from "../component/UI.jsx";
import * as orgApi from "../api/organizations.js";

const TYPE_LABELS = { school: "School", corporate: "Corporate" };
const TYPE_TONES = { school: "teal", corporate: "ink" };

function OrganizationsPage() {
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await orgApi.listOrganizations();
      setOrgs(list);
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to load organizations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = orgs.filter((o) => {
    const matchType = typeFilter === "All types" || TYPE_LABELS[o.type] === typeFilter;
    const q = query.toLowerCase();
    const matchQuery =
      !q ||
      o.name.toLowerCase().includes(q) ||
      (o.code && o.code.toLowerCase().includes(q));
    return matchType && matchQuery;
  });

  const schoolCount = orgs.filter((o) => o.type === "school").length;
  const corpCount = orgs.filter((o) => o.type === "corporate").length;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex gap-3 flex-1">
          <div className="flex-1 max-w-md">
            <Input
              icon={<IconSearch size={16} />}
              placeholder="Search name or code…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-44">
            <option>All types</option>
            <option>School</option>
            <option>Corporate</option>
          </Select>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<IconDownload size={16} />}>
            Export
          </Button>
          <Button icon={<IconPlus size={16} />} onClick={() => navigate("/organizations/new")}>
            Add organization
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Total", v: String(orgs.length), t: "teal" },
          { l: "Schools", v: String(schoolCount), t: "green" },
          { l: "Corporate", v: String(corpCount), t: "yellow" },
          { l: "Members", v: String(orgs.reduce((n, o) => n + (o.memberCount ?? 0), 0)), t: "orange" },
        ].map((s) => (
          <div key={s.l} className="bg-white rounded-2xl p-5 border border-ink/5 flex items-center gap-4">
            <Badge tone={s.t} dot>
              {s.l}
            </Badge>
            <span className="font-display text-3xl ml-auto">{s.v}</span>
          </div>
        ))}
      </div>

      <Card padded={false}>
        {loading ? (
          <p className="p-8 text-sm text-ink/50">Loading organizations…</p>
        ) : filtered.length === 0 && orgs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-ink/60">No organizations yet.</p>
            <Button
              className="mt-4"
              icon={<IconPlus size={16} />}
              onClick={() => navigate("/organizations/new")}
            >
              Create your first organization
            </Button>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-ink/50">
                    <th className="px-6 py-4 font-semibold">Organization</th>
                    <th className="px-6 py-4 font-semibold">Code</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Members</th>
                    <th className="px-6 py-4 font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {filtered.map((o) => (
                    <tr
                      key={o.id}
                      className="row-hover cursor-pointer"
                      onClick={() => navigate(`/organizations/${o.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-beige flex items-center justify-center font-display text-ink">
                            {o.name[0]}
                          </div>
                          <div className="font-semibold">{o.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-teal font-semibold">{o.code ?? "—"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          <Badge tone={TYPE_TONES[o.type] ?? "beige"}>
                            {TYPE_LABELS[o.type] ?? o.type}
                          </Badge>
                          {o.status === "archived" && <Badge tone="red">Archived</Badge>}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono">{o.memberCount ?? 0}</td>
                      <td className="px-6 py-4 text-ink/70">
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden p-4 space-y-3">
              {filtered.map((o) => (
                <div
                  key={o.id}
                  role="button"
                  tabIndex={0}
                  className="border border-ink/5 rounded-xl p-4 cursor-pointer hover:border-teal/30 hover:bg-beige/30 transition"
                  onClick={() => navigate(`/organizations/${o.id}`)}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/organizations/${o.id}`)}
                >
                  <div className="font-semibold">{o.name}</div>
                  <p className="font-mono text-teal text-sm mt-1">{o.code}</p>
                  <Badge tone={TYPE_TONES[o.type]} className="mt-2">
                    {TYPE_LABELS[o.type]}
                  </Badge>
                </div>
              ))}
            </div>
            {filtered.length === 0 && orgs.length > 0 && (
              <p className="p-8 text-center text-sm text-ink/50">No organizations match your filters.</p>
            )}
            <div className="flex items-center justify-between px-6 py-4 border-t border-ink/5">
              <div className="text-xs text-ink/50">
                Showing <span className="font-semibold text-ink">{filtered.length}</span> of {orgs.length}
              </div>
              <div className="flex gap-1 opacity-40 pointer-events-none">
                <button type="button" className="w-9 h-9 rounded-lg hover:bg-beige text-ink/50 flex items-center justify-center">
                  <IconArrowLeft size={14} />
                </button>
                <button type="button" className="w-9 h-9 rounded-lg bg-ink text-beige text-sm font-semibold">
                  1
                </button>
                <button type="button" className="w-9 h-9 rounded-lg hover:bg-beige text-ink/50 flex items-center justify-center">
                  <IconArrowRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export { OrganizationsPage };
