import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  IconArrowLeft,
  IconEdit,
  IconSearch,
  IconSpark,
  IconSchool,
  IconUsers,
} from "../../component/Icons.jsx";
import { Avatar, Badge, Button, Card, Input, Modal, Select, Toggle } from "../../component/UI.jsx";
import * as orgApi from "../../api/organizations.js";
import * as resultsApi from "../../api/results.js";
import { ResultViewerModal } from "../../component/ResultViewerModal.jsx";

const TYPE_LABELS = { school: "School", corporate: "Corporate" };
const TYPE_TONES = { school: "teal", corporate: "ink" };

const ROLE_LABELS = {
  org_admin: "Org admin",
  org_counselor: "Counselor",
  user: "Member",
};

const ROLE_TONES = {
  org_admin: "green",
  org_counselor: "teal",
  user: "orange",
};

const PEOPLE_TABS = [
  { key: "all", label: "All people" },
  { key: "org_admin", label: "Admins" },
  { key: "org_counselor", label: "Counselors" },
  { key: "user", label: "Members" },
];

function StatCard({ label, value, tone = "teal" }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-ink/5">
      <Badge tone={tone} dot className="mb-2">
        {label}
      </Badge>
      <p className="font-display text-3xl text-ink">{value}</p>
    </div>
  );
}

function buildPeopleList(org) {
  const admins = (org?.admins ?? []).map((p) => ({ ...p, role: p.role ?? "org_admin" }));
  const counselors = (org?.counselors ?? []).map((p) => ({
    ...p,
    role: p.role ?? "org_counselor",
  }));
  const members = (org?.members ?? []).map((p) => ({ ...p, role: p.role ?? "user" }));
  return [...admins, ...counselors, ...members];
}

function PeopleTable({
  people,
  orgArchived,
  onEditCounselor,
  onToggleCounselor,
  actionId,
}) {
  if (!people.length) return null;

  return (
    <>
      <div className="hidden md:block overflow-x-auto scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-ink/50">
              <th className="px-6 py-4 font-semibold">Person</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Joined</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {people.map((person) => {
              const inactive = person.status === "inactive";
              const isCounselor = person.role === "org_counselor";
              return (
                <tr key={person.id} className={inactive ? "opacity-75" : ""}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={person.fullName} size={40} />
                      <div className="min-w-0">
                        <p className="font-semibold text-ink truncate">{person.fullName}</p>
                        <p className="text-ink/50 truncate">{person.email}</p>
                        {person.memberType && (
                          <p className="text-xs text-ink/40 capitalize mt-0.5">
                            {person.memberType}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge tone={ROLE_TONES[person.role] ?? "beige"}>
                      {ROLE_LABELS[person.role] ?? person.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge tone={inactive ? "red" : "green"} dot>
                      {inactive ? "Inactive" : "Active"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-ink/60 whitespace-nowrap">
                    {person.createdAt
                      ? new Date(person.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isCounselor && !orgArchived ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<IconEdit size={14} />}
                          onClick={() => onEditCounselor(person)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant={inactive ? "primary" : "danger"}
                          size="sm"
                          onClick={() => onToggleCounselor(person)}
                          disabled={actionId === person.id}
                        >
                          {actionId === person.id
                            ? "…"
                            : inactive
                              ? "Reactivate"
                              : "Deactivate"}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-ink/35">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="md:hidden divide-y divide-ink/5">
        {people.map((person) => {
          const inactive = person.status === "inactive";
          const isCounselor = person.role === "org_counselor";
          return (
            <li key={person.id} className="px-4 py-4">
              <div className="flex gap-3">
                <Avatar name={person.fullName} size={44} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink truncate">{person.fullName}</p>
                    <Badge tone={ROLE_TONES[person.role]}>{ROLE_LABELS[person.role]}</Badge>
                    {inactive && <Badge tone="red">Inactive</Badge>}
                  </div>
                  <p className="text-sm text-ink/50 truncate">{person.email}</p>
                  {isCounselor && !orgArchived && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => onEditCounselor(person)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant={inactive ? "primary" : "danger"}
                        size="sm"
                        className="flex-1"
                        onClick={() => onToggleCounselor(person)}
                        disabled={actionId === person.id}
                      >
                        {inactive ? "Reactivate" : "Deactivate"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function OrganizationDetailPage() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [pageTab, setPageTab] = useState("overview");
  const [peopleTab, setPeopleTab] = useState("all");
  const [peopleQuery, setPeopleQuery] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("school");
  const [editStatus, setEditStatus] = useState(true);
  const [saving, setSaving] = useState(false);


  const [counselorEdit, setCounselorEdit] = useState(null);
  const [counselorName, setCounselorName] = useState("");
  const [counselorEmail, setCounselorEmail] = useState("");
  const [counselorPassword, setCounselorPassword] = useState("");
  const [counselorActionId, setCounselorActionId] = useState(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState(null);
  const [orgResults, setOrgResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [viewResultId, setViewResultId] = useState(null);

  const load = useCallback(async () => {
    if (!orgId) return;
    setLoading(true);
    setError("");
    try {
      const data = await orgApi.getOrganization(orgId);
      setOrg(data);
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to load organization");
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!orgId || pageTab !== "results") return;
    let cancelled = false;
    (async () => {
      setResultsLoading(true);
      try {
        const rows = await resultsApi.listOrgResults(orgId, { limit: 30 });
        if (!cancelled) setOrgResults(rows);
      } catch {
        if (!cancelled) setOrgResults([]);
      } finally {
        if (!cancelled) setResultsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orgId, pageTab]);

  const allPeople = useMemo(() => (org ? buildPeopleList(org) : []), [org]);

  const filteredPeople = useMemo(() => {
    const q = peopleQuery.trim().toLowerCase();
    return allPeople.filter((p) => {
      const matchTab = peopleTab === "all" || p.role === peopleTab;
      const matchQuery =
        !q ||
        p.fullName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        (p.memberType && p.memberType.toLowerCase().includes(q));
      return matchTab && matchQuery;
    });
  }, [allPeople, peopleTab, peopleQuery]);

  const tabCounts = useMemo(
    () => ({
      all: allPeople.length,
      org_admin: allPeople.filter((p) => p.role === "org_admin").length,
      org_counselor: allPeople.filter((p) => p.role === "org_counselor").length,
      user: allPeople.filter((p) => p.role === "user").length,
    }),
    [allPeople],
  );

  const copyCode = async () => {
    if (!org?.code) return;
    await navigator.clipboard.writeText(org.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openEdit = () => {
    setEditName(org.name);
    setEditType(org.type);
    setEditStatus(org.status ?? true);
    setEditOpen(true);
  };

  const saveEdit = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await orgApi.updateOrganization(orgId, {
        name: editName,
        type: editType,
        status: editStatus,
      });
      setOrg((o) => ({ ...o, ...updated }));
      setEditOpen(false);
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not update organization");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete the organization "${org.name}"? This action cannot be undone.`)) return;
    setSaving(true);
    setError("");
    try {
      await orgApi.deleteOrganization(orgId);
      navigate("/organizations");
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not delete organization");
    } finally {
      setSaving(false);
    }
  };


  const openCounselorEdit = (person) => {
    setCounselorEdit(person);
    setCounselorName(person.fullName);
    setCounselorEmail(person.email);
    setCounselorPassword("");
  };

  const saveCounselorEdit = async () => {
    if (!counselorEdit) return;
    setSaving(true);
    setError("");
    try {
      const payload = { fullName: counselorName, email: counselorEmail };
      if (counselorPassword.length >= 8) payload.password = counselorPassword;
      await orgApi.updateOrganizationMember(orgId, counselorEdit.id, payload);
      setCounselorEdit(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not update counselor");
    } finally {
      setSaving(false);
    }
  };

  const toggleCounselor = async (person) => {
    if (person.status !== "inactive" && !confirmDeactivate) {
      setConfirmDeactivate(person);
      return;
    }
    setCounselorActionId(person.id);
    setError("");
    try {
      if (person.status === "inactive") {
        await orgApi.updateOrganizationMember(orgId, person.id, { status: "active" });
      } else {
        await orgApi.deactivateOrganizationMember(orgId, person.id);
      }
      setConfirmDeactivate(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not update counselor");
    } finally {
      setCounselorActionId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-ink/50 fade-in">Loading organization…</p>;
  }

  if (error && !org) {
    return (
      <div className="fade-in max-w-lg">
        <p className="text-sm text-red-600">{error}</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/organizations")}>
          Back to organizations
        </Button>
      </div>
    );
  }

  const created = org.createdAt ? new Date(org.createdAt).toLocaleString() : "—";
  const updated = org.updatedAt ? new Date(org.updatedAt).toLocaleString() : "—";
  const orgArchived = org.status === false;
  const memberLabel = org.type === "corporate" ? "Employees" : "Students";

  const emptyMessages = {
    all: "No accounts in this organization yet.",
    org_admin: "No organization admin linked.",
    org_counselor: "No counselors yet. The org admin adds them in the User app, or you can manage them here.",
    user: `No ${memberLabel.toLowerCase()} registered with this organization's code yet.`,
  };

  return (
    <div className="fade-in space-y-6 ">
      <Link
        to="/organizations"
        className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-teal font-medium"
      >
        <IconArrowLeft size={16} />
        Back to organizations
      </Link>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-beige flex items-center justify-center font-display text-2xl text-ink shrink-0">
            {org.name[0]}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-4xl text-ink leading-tight">{org.name}</h1>
              <Badge tone={TYPE_TONES[org.type] ?? "beige"}>
                {TYPE_LABELS[org.type] ?? org.type}
              </Badge>
              {orgArchived && <Badge tone="red">Inactive</Badge>}
            </div>
            <p className="text-sm text-ink/50 mt-2 font-mono">ID · {org.id}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button variant="outline" onClick={openEdit}>
            Edit organization
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={saving}>
            Delete organization
          </Button>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-white rounded-xl border border-ink/5 w-fit max-w-full overflow-x-auto scrollbar">
        {[
          { key: "overview", label: "Overview" },
          { key: "people", label: "Team & members" },
          { key: "results", label: "Quiz results" },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setPageTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              pageTab === t.key
                ? "bg-teal text-white shadow-sm"
                : "text-ink/60 hover:text-ink hover:bg-beige/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {pageTab === "overview" && (
        <>
          <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink/50 font-semibold">
                  Registration code
                </p>
                <p className="font-mono text-2xl font-bold text-teal mt-2 tracking-wider">
                  {org.code ?? "—"}
                </p>
                <p className="text-sm text-ink/60 mt-2 max-w-md">
                  Share with the org admin only. They onboard counselors and {memberLabel.toLowerCase()}{" "}
                  via the User app.
                </p>
              </div>
              {org.code && (
                <Button variant="outline" onClick={copyCode} className="shrink-0 self-start">
                  {copied ? "Copied!" : "Copy code"}
                </Button>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label={memberLabel} value={org.stats?.members ?? 0} tone="orange" />
            <StatCard label="Counselors" value={org.stats?.counselors ?? 0} tone="teal" />
            <StatCard label="Admins" value={org.stats?.admins ?? 0} tone="green" />
            <StatCard
              label="Total accounts"
              value={
                (org.stats?.members ?? 0) +
                (org.stats?.counselors ?? 0) +
                (org.stats?.admins ?? 0)
              }
              tone="yellow"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <IconSchool size={18} className="text-teal" />
                <h3 className="font-semibold text-ink">Details</h3>
              </div>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/50">Type</dt>
                  <dd>{TYPE_LABELS[org.type]}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/50">Status</dt>
                  <dd className="capitalize">{org.status ?? "active"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/50">Created</dt>
                  <dd className="text-right">{created}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/50">Last updated</dt>
                  <dd className="text-right">{updated}</dd>
                </div>
              </dl>
            </Card>

            <Card className="bg-beige/50">
              <div className="flex items-start gap-3">
                <span className="w-9 h-9 rounded-lg bg-teal/15 text-teal flex items-center justify-center shrink-0">
                  <IconSpark size={18} />
                </span>
                <div className="text-sm text-ink/70">
                  <p className="font-semibold text-ink mb-1">Onboarding flow</p>
                  <ol className="list-decimal list-inside space-y-1 text-ink/65">
                    <li>Org admin signs in on the User app</li>
                    <li>They add counselors under Manage counselors</li>
                    <li>{memberLabel} self-register with the code above</li>
                  </ol>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3"
                    onClick={() => setPageTab("people")}
                  >
                    View all people →
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {pageTab === "results" && (
        <Card padded={false}>
          {resultsLoading && (
            <p className="px-6 py-8 text-sm text-ink/50">Loading quiz results…</p>
          )}
          {!resultsLoading && orgResults.length === 0 && (
            <p className="px-6 py-8 text-sm text-ink/50">No completed quiz results for this organization yet.</p>
          )}
          {!resultsLoading && orgResults.length > 0 && (
            <div className="overflow-x-auto scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-ink/50">
                    <th className="px-6 py-4 font-semibold">Member</th>
                    <th className="px-6 py-4 font-semibold">Quiz</th>
                    <th className="px-6 py-4 font-semibold">Risk</th>
                    <th className="px-6 py-4 font-semibold">Score</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {orgResults.map((r) => (
                    <tr key={r.id}>
                      <td className="px-6 py-4">
                        <div className="font-semibold">{r.user?.fullName ?? "—"}</div>
                        <div className="text-xs text-ink/50">{r.user?.email}</div>
                      </td>
                      <td className="px-6 py-4">{r.quizTitle ?? "Quiz"}</td>
                      <td className="px-6 py-4">
                        <Badge tone={r.riskLevel === "High" ? "red" : r.riskLevel === "Medium" ? "orange" : "green"} dot>
                          {r.riskLevel}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-mono">{Number(r.normalizedScore).toFixed(2)}</td>
                      <td className="px-6 py-4 text-ink/60">
                        {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="outline" size="sm" onClick={() => setViewResultId(r.id)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {pageTab === "people" && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="flex-1 max-w-md">
              <Input
                icon={<IconSearch size={16} />}
                placeholder="Search name, email, or type…"
                value={peopleQuery}
                onChange={(e) => setPeopleQuery(e.target.value)}
              />
            </div>
            <p className="text-xs text-ink/50 lg:ml-auto">
              Super admin can edit or deactivate counselors for support
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {PEOPLE_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setPeopleTab(t.key)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                  peopleTab === t.key
                    ? "bg-ink text-beige border-ink"
                    : "bg-white border-ink/10 text-ink/70 hover:border-teal/30"
                }`}
              >
                {t.label}
                <span
                  className={`text-[10px] font-bold px-1.5 min-w-[18px] h-5 rounded-md flex items-center justify-center ${
                    peopleTab === t.key ? "bg-white/20" : "bg-beige text-ink/60"
                  }`}
                >
                  {tabCounts[t.key]}
                </span>
              </button>
            ))}
          </div>

          <Card padded={false}>
            {filteredPeople.length === 0 ? (
              <div className="py-16 text-center px-6">
                <div className="flex justify-center text-ink/20 mb-4">
                  <IconUsers size={48} />
                </div>
                <p className="font-semibold text-ink">No people in this view</p>
                <p className="text-sm text-ink/50 mt-2 max-w-md mx-auto">
                  {peopleQuery ? "Try a different search term." : emptyMessages[peopleTab]}
                </p>
                {peopleTab === "org_counselor" && !orgArchived && (
                  <p className="text-xs text-ink/40 mt-4">
                    Primary management happens in the User app → Manage counselors
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="px-6 py-3 border-b border-ink/5 flex items-center justify-between">
                  <p className="text-xs text-ink/50">
                    Showing <span className="font-semibold text-ink">{filteredPeople.length}</span>{" "}
                    of {tabCounts[peopleTab]} in this tab
                  </p>
                </div>
                <PeopleTable
                  people={filteredPeople}
                  orgArchived={orgArchived}
                  onEditCounselor={openCounselorEdit}
                  onToggleCounselor={toggleCounselor}
                  actionId={counselorActionId}
                />
              </>
            )}
          </Card>
        </div>
      )}

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
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase block mb-2">Status</label>
            <Toggle
              checked={editStatus}
              onChange={setEditStatus}
              label={editStatus ? "Active" : "Inactive"}
            />
          </div>
        </div>

      </Modal>

      <Modal
        open={!!counselorEdit}
        onClose={() => setCounselorEdit(null)}
        title="Edit counselor"
        subtitle="Platform support — changes apply immediately"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCounselorEdit(null)}>
              Cancel
            </Button>
            <Button onClick={saveCounselorEdit} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase">Full name</label>
            <Input
              className="mt-2"
              value={counselorName}
              onChange={(e) => setCounselorName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase">Email</label>
            <Input
              className="mt-2"
              type="email"
              value={counselorEmail}
              onChange={(e) => setCounselorEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase">
              New password (optional)
            </label>
            <Input
              className="mt-2"
              type="password"
              value={counselorPassword}
              onChange={(e) => setCounselorPassword(e.target.value)}
              placeholder="Min. 8 characters"
              minLength={8}
            />
          </div>
        </div>
      </Modal>

      <ResultViewerModal
        resultId={viewResultId}
        open={!!viewResultId}
        onClose={() => setViewResultId(null)}
      />

      <Modal
        open={!!confirmDeactivate}
        onClose={() => setConfirmDeactivate(null)}
        title="Deactivate counselor?"
        subtitle={confirmDeactivate?.fullName}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDeactivate(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => confirmDeactivate && toggleCounselor(confirmDeactivate)}
              disabled={counselorActionId === confirmDeactivate?.id}
            >
              Deactivate
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink/70">
          This counselor will not be able to sign in until reactivated. The org admin can also
          manage this from the User app.
        </p>
      </Modal>
    </div>
  );
}

export { OrganizationDetailPage };
