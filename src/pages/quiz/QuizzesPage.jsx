import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  IconPlus,
  IconSearch,
  IconEye,
  IconEdit,
  IconTrash,
} from "../../component/Icons.jsx";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [quizzes, setQuizzes] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(() => searchParams.get("create") === "true");
  const [title, setTitle] = useState("");
  const [organizationId, setOrganizationId] = useState("");

  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setCreateOpen(true);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("create");
        return next;
      }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Edit states
  const [editOpen, setEditOpen] = useState(false);
  const [editQuiz, setEditQuiz] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editStatus, setEditStatus] = useState("draft");
  const [editScoringModel, setEditScoringModel] = useState("weighted");
  const [editTime, setEditTime] = useState(15);
  
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
      setOrgs(orgList.filter((o) => o.status !== false));

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

  const openEdit = (q) => {
    setEditQuiz(q);
    setEditTitle(q.title);
    setEditStatus(q.status);
    setEditScoringModel(q.settings?.scoringModel ?? "weighted");
    setEditTime(q.settings?.estimatedTime ?? 15);
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editQuiz) return;
    setSaving(true);
    setError("");
    try {
      await quizApi.updateQuiz(editQuiz.id, {
        title: editTitle.trim(),
        status: editStatus,
        settings: {
          scoringModel: editScoringModel,
          estimatedTime: Number(editTime),
        },
      });
      setEditOpen(false);
      await load();
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not update quiz");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (q) => {
    if (!window.confirm(`Are you sure you want to delete the quiz "${q.title}"? This action cannot be undone.`)) return;
    try {
      await quizApi.deleteQuiz(q.id);
      await load();
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not delete quiz");
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
    {
      key: "actions",
      header: "Actions",
      className: "text-right whitespace-nowrap",
      render: (q) => (
        <div className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => navigate(`/quizzes/${q.id}`)}
            title="Open Builder"
            className="w-8 h-8 rounded-lg hover:bg-beige text-ink/60 hover:text-teal flex items-center justify-center transition"
          >
            <IconEye size={16} />
          </button>
          <button
            type="button"
            onClick={() => openEdit(q)}
            title="Edit Settings"
            className="w-8 h-8 rounded-lg hover:bg-beige text-ink/60 hover:text-teal flex items-center justify-center transition"
          >
            <IconEdit size={16} />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(q)}
            title="Delete Quiz"
            className="w-8 h-8 rounded-lg hover:bg-red-50 text-ink/60 hover:text-red-600 flex items-center justify-center transition"
          >
            <IconTrash size={16} />
          </button>
        </div>
      ),
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
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold text-ink">{q.title}</div>
          <p className="text-xs text-ink/50 mt-1">{q.organizationId?.name ?? "—"}</p>
        </div>
        <Badge tone={STATUS_TONES[q.status]}>
          {q.status}
        </Badge>
      </div>
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

      {/* Edit Quiz Modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit quiz metadata"
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
        <form onSubmit={(e) => { e.preventDefault(); saveEdit(); }} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
              Quiz title
            </label>
            <Input
              className="mt-2"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Status
              </label>
              <Select
                className="mt-2"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Scoring model
              </label>
              <Select
                className="mt-2"
                value={editScoringModel}
                onChange={(e) => setEditScoringModel(e.target.value)}
              >
                <option value="weighted">Weighted</option>
                <option value="raw">Raw</option>
                <option value="normalized">Normalized</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                Est. time (min)
              </label>
              <Input
                type="number"
                className="mt-2"
                min={1}
                value={editTime}
                onChange={(e) => setEditTime(Number(e.target.value))}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export { QuizzesPage };
