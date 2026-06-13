import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconPlus, IconSearch } from "../../component/Icons.jsx";
import { Badge, Button, Card, Input, Modal, Select } from "../../component/UI.jsx";
import { Table } from "../../component/Table";
import * as quizApi from "../../api/quizzes.js";
import * as orgApi from "../../api/organizations.js";

const STATUS_TONES = {
  draft: "beige",
  published: "green",
  archived: "ink",
};

function QuizzesPage() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [quizList, orgList] = await Promise.all([
        quizApi.listQuizzes(),
        orgApi.listOrganizations(),
      ]);
      setQuizzes(quizList);
      setOrgs(orgList.filter((o) => o.status !== "archived"));
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = quizzes.filter((q) => {
    const qLower = query.toLowerCase();
    return (
      !qLower ||
      q.title.toLowerCase().includes(qLower) ||
      (q.organizationId?.name && q.organizationId.name.toLowerCase().includes(qLower))
    );
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!organizationId) {
      setError("Select an organization");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const quiz = await quizApi.createQuiz({ title, organizationId });
      setCreateOpen(false);
      setTitle("");
      navigate(`/quizzes/${quiz.id}`);
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not create quiz");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: "title",
      header: "Quiz",
      className: "font-semibold",
    },
    {
      key: "organizationId",
      header: "Organization",
      className: "text-ink/70",
      render: (q) => q.organizationId?.name ?? "—",
    },
    {
      key: "status",
      header: "Status",
      render: (q) => (
        <Badge tone={STATUS_TONES[q.status] ?? "beige"}>{q.status}</Badge>
      ),
    },
    {
      key: "questions",
      header: "Questions",
      className: "font-mono",
      render: (q) => q.settings?.totalQuestions ?? 0,
    },
    {
      key: "updatedAt",
      header: "Updated",
      className: "text-ink/70",
      render: (q) => (q.updatedAt ? new Date(q.updatedAt).toLocaleDateString() : "—"),
    },
  ];

  const renderMobileItem = (q) => (
    <div
      key={q.id}
      role="button"
      tabIndex={0}
      className="border border-ink/5 rounded-xl p-4 cursor-pointer hover:border-teal/30 hover:bg-beige/30 transition"
      onClick={() => navigate(`/quizzes/${q.id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/quizzes/${q.id}`)}
    >
      <div className="font-semibold">{q.title}</div>
      <p className="text-xs text-ink/50 mt-1">{q.organizationId?.name ?? "—"}</p>
      <Badge tone={STATUS_TONES[q.status]} className="mt-2">
        {q.status}
      </Badge>
    </div>
  );

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex-1 max-w-md">
          <Input
            icon={<IconSearch size={16} />}
            placeholder="Search quizzes or organizations…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button icon={<IconPlus size={16} />} onClick={() => setCreateOpen(true)}>
          New quiz
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Card padded={false}>
        {filtered.length === 0 && quizzes.length === 0 && !loading ? (
          <div className="p-12 text-center">
            <p className="text-ink/60">No quizzes yet. Create one for an organization.</p>
            <Button className="mt-4" icon={<IconPlus size={16} />} onClick={() => setCreateOpen(true)}>
              Create quiz
            </Button>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filtered}
            onRowClick={(q) => navigate(`/quizzes/${q.id}`)}
            loading={loading}
            loadingText="Loading quizzes…"
            emptyText="No quizzes match your search."
            renderMobileItem={renderMobileItem}
          />
        )}
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New quiz"
        subtitle="Assign to a school or corporate organization"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? "Creating…" : "Create & open builder"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
              Organization
            </label>
            <Select
              className="mt-2"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              required
            >
              <option value="">Select organization…</option>
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.type})
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
              Quiz title
            </label>
            <Input
              className="mt-2"
              placeholder="e.g. Wellness screening"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export { QuizzesPage };
