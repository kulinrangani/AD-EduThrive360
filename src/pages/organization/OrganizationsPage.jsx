import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IconSearch,
  IconDownload,
  IconPlus,
  IconArrowLeft,
  IconArrowRight,
  IconEye,
  IconEdit,
  IconTrash,
} from "../../component/Icons.jsx";
import { Button, Input, Select, Badge, Card, Modal } from "../../component/UI.jsx";
import { Table } from "../../component/Table";
import * as orgApi from "../../api/organizations.js";

const TYPE_LABELS = { school: "School", corporate: "Corporate" };
const TYPE_TONES = { school: "teal", corporate: "ink" };

function OrganizationsPage() {
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");

  // Edit organization state
  const [editOpen, setEditOpen] = useState(false);
  const [editOrg, setEditOrg] = useState(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("school");
  const [saving, setSaving] = useState(false);

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

  const openEdit = (o) => {
    setEditOrg(o);
    setEditName(o.name);
    setEditType(o.type);
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editOrg) return;
    setSaving(true);
    setError("");
    try {
      await orgApi.updateOrganization(editOrg.id, { name: editName.trim(), type: editType });
      setEditOpen(false);
      await load();
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not update organization");
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (o) => {
    if (!window.confirm(`Are you sure you want to archive "${o.name}"? This blocks all organization users.`)) return;
    try {
      await orgApi.updateOrganization(o.id, { status: "archived" });
      await load();
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not archive organization");
    }
  };

  const columns = [
    {
      key: "name",
      header: "Organization",
      render: (o) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-beige flex items-center justify-center font-display text-ink">
            {o.name[0]}
          </div>
          <div className="font-semibold">{o.name}</div>
        </div>
      ),
    },
    {
      key: "code",
      header: "Code",
      render: (o) => (
        <span className="font-mono text-teal font-semibold">{o.code ?? "—"}</span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (o) => (
        <div className="flex flex-wrap gap-1">
          <Badge tone={TYPE_TONES[o.type] ?? "beige"}>
            {TYPE_LABELS[o.type] ?? o.type}
          </Badge>
          {o.status === "archived" && <Badge tone="red">Archived</Badge>}
        </div>
      ),
    },
    {
      key: "memberCount",
      header: "Members",
      className: "font-mono",
      render: (o) => o.memberCount ?? 0,
    },
    {
      key: "createdAt",
      header: "Created",
      className: "text-ink/70",
      render: (o) => (o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—"),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right whitespace-nowrap",
      render: (o) => (
        <div className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => navigate(`/organizations/${o.id}`)}
            title="View Details"
            className="w-8 h-8 rounded-lg hover:bg-beige text-ink/60 hover:text-teal flex items-center justify-center transition"
          >
            <IconEye size={16} />
          </button>
          <button
            type="button"
            onClick={() => openEdit(o)}
            title="Edit"
            disabled={o.status === "archived"}
            className="w-8 h-8 rounded-lg hover:bg-beige text-ink/60 hover:text-teal flex items-center justify-center transition disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <IconEdit size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleArchive(o)}
            title="Archive"
            disabled={o.status === "archived"}
            className="w-8 h-8 rounded-lg hover:bg-red-50 text-ink/60 hover:text-red-600 flex items-center justify-center transition disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <IconTrash size={16} />
          </button>
        </div>
      ),
    },
  ];

  const renderMobileItem = (o) => (
    <div
      key={o.id}
      role="button"
      tabIndex={0}
      className="border border-ink/5 rounded-xl p-4 cursor-pointer hover:border-teal/30 hover:bg-beige/30 transition"
      onClick={() => navigate(`/organizations/${o.id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/organizations/${o.id}`)}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold text-ink">{o.name}</div>
          <p className="font-mono text-teal text-xs mt-1">{o.code}</p>
        </div>
        <div className="flex gap-1">
          <Badge tone={TYPE_TONES[o.type]}>
            {TYPE_LABELS[o.type]}
          </Badge>
          {o.status === "archived" && <Badge tone="red">Archived</Badge>}
        </div>
      </div>
    </div>
  );

  const tableFooter = (
    <>
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
    </>
  );

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
        {filtered.length === 0 && orgs.length === 0 && !loading ? (
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
          <Table
            columns={columns}
            data={filtered}
            onRowClick={(o) => navigate(`/organizations/${o.id}`)}
            loading={loading}
            loadingText="Loading organizations…"
            emptyText="No organizations match your filters."
            renderMobileItem={renderMobileItem}
            footer={tableFooter}
          />
        )}
      </Card>

      {/* Edit Organization Modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit organization"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEdit} disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase">Name</label>
            <Input
              className="mt-2"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase">Type</label>
            <Select
              className="mt-2"
              value={editType}
              onChange={(e) => setEditType(e.target.value)}
            >
              <option value="school">School</option>
              <option value="corporate">Corporate</option>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export { OrganizationsPage };
