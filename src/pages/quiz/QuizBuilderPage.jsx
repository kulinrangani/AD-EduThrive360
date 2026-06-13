import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IconArrowLeft, IconPlus, IconX } from "../../component/Icons.jsx";
import { Badge, Button, Card, Input, Select } from "../../component/UI.jsx";
import * as quizApi from "../../api/quizzes.js";

const STEPS = ["metadata", "groups", "questions", "quotes"];
const STEP_LABELS = {
  metadata: "Metadata",
  groups: "Groups",
  questions: "Questions",
  quotes: "Quotes",
};

const DEFAULT_OPTIONS = [
  { label: "Not At All True", value: 1 },
  { label: "A Little True", value: 2 },
  { label: "Pretty Much True", value: 3 },
  { label: "Very Much True", value: 4 },
];

function RiskRangesEditor({ ranges, onChange }) {
  const update = (index, field, value) => {
    const next = [...ranges];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const add = () => {
    onChange([...ranges, { label: "Medium", min: 2, max: 3 }]);
  };

  const remove = (index) => {
    onChange(ranges.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {ranges.map((r, i) => (
        <div key={i} className="flex flex-wrap gap-2 items-center">
          <Input
            className="w-28"
            placeholder="Label"
            value={r.label}
            onChange={(e) => update(i, "label", e.target.value)}
          />
          <Input
            type="number"
            className="w-20"
            step="0.1"
            value={r.min}
            onChange={(e) => update(i, "min", parseFloat(e.target.value))}
          />
          <span className="text-ink/40">–</span>
          <Input
            type="number"
            className="w-20"
            step="0.1"
            value={r.max}
            onChange={(e) => update(i, "max", parseFloat(e.target.value))}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-ink/40 hover:text-red-600 p-1"
          >
            <IconX size={14} />
          </button>
        </div>
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={add}>
        Add risk band
      </Button>
    </div>
  );
}

function QuizBuilderPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState("metadata");
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [meta, setMeta] = useState({
    title: "",
    description: "",
    status: "draft",
    scoringModel: "weighted",
    estimatedTime: 15,
  });

  const [groupForm, setGroupForm] = useState({
    name: "",
    type: "positive",
    weight: 0.5,
    scoringMethod: "average",
    riskRanges: [
      { label: "Low", min: 3, max: 4 },
      { label: "Medium", min: 2, max: 3 },
      { label: "High", min: 1, max: 2 },
    ],
  });

  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [factorWeight, setFactorWeight] = useState(1);

  const [quoteForm, setQuoteForm] = useState({
    riskLevel: "Medium",
    type: "support",
    message: "",
    minScore: "",
    maxScore: "",
  });

  const load = useCallback(async () => {
    if (!quizId) return;
    setLoading(true);
    setError("");
    try {
      const data = await quizApi.getQuiz(quizId, { includeTree: true });
      setQuiz(data);
      setMeta({
        title: data.title,
        description: data.description ?? "",
        status: data.status,
        scoringModel: data.settings?.scoringModel ?? "weighted",
        estimatedTime: data.settings?.estimatedTime ?? 15,
      });
      setSelectedGroupId((prev) => {
        if (prev && data.groups?.some((g) => g.id === prev)) return prev;
        return data.groups?.[0]?.id ?? "";
      });
    } catch (err) {
      setError(err.response?.data?.error ?? "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    load();
  }, [load]);

  const saveMetadata = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await quizApi.updateQuiz(quizId, {
        title: meta.title,
        description: meta.description,
        status: meta.status,
        settings: {
          scoringModel: meta.scoringModel,
          estimatedTime: Number(meta.estimatedTime),
        },
      });
      setQuiz((q) => ({ ...q, ...updated }));
    } catch (err) {
      setError(err.response?.data?.error ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const setPublishStatus = async (status) => {
    setSaving(true);
    setError("");
    try {
      const updated = await quizApi.updateQuiz(quizId, { status });
      setMeta((m) => ({ ...m, status }));
      setQuiz((q) => ({ ...q, ...updated }));
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not update status");
    } finally {
      setSaving(false);
    }
  };

  const addGroup = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await quizApi.createGroup(quizId, {
        ...groupForm,
        weight: Number(groupForm.weight),
        order: quiz?.groups?.length ?? 0,
      });
      setGroupForm({
        name: "",
        type: "negative",
        weight: 0.5,
        scoringMethod: "average",
        riskRanges: groupForm.riskRanges,
      });
      await load();
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not add group");
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    if (!selectedGroupId) {
      setError("Select a group first");
      return;
    }
    setSaving(true);
    try {
      const group = quiz.groups.find((g) => g.id === selectedGroupId);
      await quizApi.createQuestion(quizId, selectedGroupId, {
        questionText,
        factorWeight: Number(factorWeight),
        options: DEFAULT_OPTIONS,
        order: group?.questions?.length ?? 0,
      });
      setQuestionText("");
      await load();
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not add question");
    } finally {
      setSaving(false);
    }
  };

  const addQuote = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const orgId =
        typeof quiz.organizationId === "object"
          ? quiz.organizationId.id
          : quiz.organizationId;
      await quizApi.createQuote({
        organizationId: orgId,
        quizId,
        riskLevel: quoteForm.riskLevel,
        type: quoteForm.type,
        message: quoteForm.message,
        minScore: quoteForm.minScore === "" ? undefined : Number(quoteForm.minScore),
        maxScore: quoteForm.maxScore === "" ? undefined : Number(quoteForm.maxScore),
      });
      setQuoteForm({ ...quoteForm, message: "", minScore: "", maxScore: "" });
      await load();
    } catch (err) {
      setError(err.response?.data?.error ?? "Could not add quote");
    } finally {
      setSaving(false);
    }
  };

  const removeGroup = async (groupId) => {
    if (!confirm("Delete this group and all its questions?")) return;
    await quizApi.deleteGroup(quizId, groupId);
    await load();
  };

  const removeQuestion = async (groupId, questionId) => {
    await quizApi.deleteQuestion(quizId, groupId, questionId);
    await load();
  };

  const removeQuote = async (quoteId) => {
    await quizApi.deleteQuote(quoteId);
    await load();
  };

  if (loading) {
    return <p className="text-sm text-ink/50 fade-in">Loading quiz builder…</p>;
  }

  if (error && !quiz) {
    return (
      <div className="fade-in">
        <p className="text-sm text-red-600">{error}</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate("/quizzes")}>
          Back to quizzes
        </Button>
      </div>
    );
  }

  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="fade-in space-y-6 max-w-4xl">
      <Link
        to="/quizzes"
        className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-teal font-medium"
      >
        <IconArrowLeft size={16} />
        Back to quizzes
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-ink">{quiz.title}</h1>
          <p className="text-sm text-ink/50 mt-1">
            {quiz.organizationId?.name ?? "Organization"} · Builder
          </p>
        </div>
        <Badge tone={quiz.status === "published" ? "green" : "beige"}>{quiz.status}</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => setStep(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              step === s
                ? "bg-teal text-white"
                : "bg-white border border-ink/10 text-ink/70 hover:border-teal/30"
            }`}
          >
            {i + 1}. {STEP_LABELS[s]}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {step === "metadata" && (
        <Card className="space-y-4">
          <Input
            value={meta.title}
            onChange={(e) => setMeta({ ...meta, title: e.target.value })}
            placeholder="Quiz title"
          />
          <textarea
            className="w-full min-h-[100px] rounded-xl border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:border-teal focus:ring-4 focus:ring-teal/10"
            placeholder="Description for participants"
            value={meta.description}
            onChange={(e) => setMeta({ ...meta, description: e.target.value })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-ink/50 uppercase">Status</label>
              <Select
                className="mt-2"
                value={meta.status}
                onChange={(e) => setMeta({ ...meta, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink/50 uppercase">Scoring model</label>
              <Select
                className="mt-2"
                value={meta.scoringModel}
                onChange={(e) => setMeta({ ...meta, scoringModel: e.target.value })}
              >
                <option value="weighted">Weighted</option>
                <option value="raw">Raw</option>
                <option value="normalized">Normalized</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink/50 uppercase">
                Est. time (min)
              </label>
              <Input
                type="number"
                className="mt-2"
                min={1}
                value={meta.estimatedTime}
                onChange={(e) => setMeta({ ...meta, estimatedTime: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={saveMetadata} disabled={saving}>
              {saving ? "Saving…" : "Save metadata"}
            </Button>
            {meta.status !== "published" && (
              <Button
                variant="outline"
                onClick={() => setPublishStatus("published")}
                disabled={saving}
              >
                Publish quiz
              </Button>
            )}
            {meta.status === "published" && (
              <Button
                variant="ghost"
                onClick={() => setPublishStatus("draft")}
                disabled={saving}
              >
                Unpublish (draft)
              </Button>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-ink/8">
            <h4 className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
              Scoring preview (read-only)
            </h4>
            <p className="text-sm text-ink/60 mt-2">
              Model: <strong className="text-ink">{meta.scoringModel}</strong> — weighted
              group scores are direction-normalized (negative groups invert via 5 − average),
              then combined by group weights.
            </p>
            {quiz?.groups?.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm">
                {quiz.groups.map((g) => (
                  <li
                    key={g.id}
                    className="flex flex-wrap justify-between gap-2 py-2 border-b border-ink/5 last:border-0"
                  >
                    <span className="font-medium text-ink">
                      {g.name}{" "}
                      <span className="text-ink/40 font-normal">
                        ({g.type}, {g.scoringMethod})
                      </span>
                    </span>
                    <span className="text-ink/60">
                      weight {(g.weight * 100).toFixed(0)}% ·{" "}
                      {(g.riskRanges?.length ?? 0)} risk band
                      {(g.riskRanges?.length ?? 0) === 1 ? "" : "s"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink/45 mt-2">Add groups in step 2 to configure scoring.</p>
            )}
          </div>
        </Card>
      )}

      {step === "groups" && (
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-ink mb-4">Add question group</h3>
            <form onSubmit={addGroup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  placeholder="Group name (e.g. SEHS-S)"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                  required
                />
                <Select
                  value={groupForm.type}
                  onChange={(e) => setGroupForm({ ...groupForm, type: e.target.value })}
                >
                  <option value="positive">Positive (higher = better)</option>
                  <option value="negative">Negative (higher = worse)</option>
                </Select>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  max={1}
                  placeholder="Weight (0–1)"
                  value={groupForm.weight}
                  onChange={(e) => setGroupForm({ ...groupForm, weight: e.target.value })}
                />
                <Select
                  value={groupForm.scoringMethod}
                  onChange={(e) =>
                    setGroupForm({ ...groupForm, scoringMethod: e.target.value })
                  }
                >
                  <option value="average">Average</option>
                  <option value="sum">Sum</option>
                </Select>
              </div>
              <div>
                <p className="text-xs font-semibold text-ink/50 uppercase mb-2">Risk ranges</p>
                <RiskRangesEditor
                  ranges={groupForm.riskRanges}
                  onChange={(riskRanges) => setGroupForm({ ...groupForm, riskRanges })}
                />
              </div>
              <Button type="submit" icon={<IconPlus size={16} />} disabled={saving}>
                Add group
              </Button>
            </form>
          </Card>

          {(quiz.groups ?? []).map((g) => (
            <Card key={g.id} className="flex justify-between gap-4 items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-ink">{g.name}</h4>
                  <Badge tone={g.type === "positive" ? "green" : "orange"}>{g.type}</Badge>
                </div>
                <p className="text-sm text-ink/50 mt-1">
                  Weight {g.weight} · {g.scoringMethod} · {g.questions?.length ?? 0} questions
                </p>
                <p className="text-xs text-ink/40 mt-2">
                  Risk bands:{" "}
                  {(g.riskRanges ?? [])
                    .map((r) => `${r.label} (${r.min}–${r.max})`)
                    .join(", ") || "—"}
                </p>
              </div>
              <Button variant="danger" size="sm" onClick={() => removeGroup(g.id)}>
                Remove
              </Button>
            </Card>
          ))}
        </div>
      )}

      {step === "questions" && (
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-ink mb-4">Add question</h3>
            {(quiz.groups ?? []).length === 0 ? (
              <p className="text-sm text-ink/50">Add at least one group first.</p>
            ) : (
              <form onSubmit={addQuestion} className="space-y-4">
                <Select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                >
                  {(quiz.groups ?? []).map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </Select>
                <textarea
                  className="w-full min-h-[80px] rounded-xl border border-ink/15 px-4 py-3 text-sm focus:outline-none focus:border-teal"
                  placeholder="Question text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                />
                <div>
                  <label className="text-xs text-ink/50">Factor weight</label>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    className="mt-1 max-w-[140px]"
                    value={factorWeight}
                    onChange={(e) => setFactorWeight(e.target.value)}
                  />
                </div>
                <p className="text-xs text-ink/50">
                  Uses standard 4-point Likert options (1–4).
                </p>
                <Button type="submit" disabled={saving}>
                  Add question
                </Button>
              </form>
            )}
          </Card>

          {(quiz.groups ?? []).map((g) => (
            <Card key={g.id} padded={false}>
              <div className="px-6 py-4 border-b border-ink/5 font-semibold">{g.name}</div>
              <ul className="divide-y divide-ink/5">
                {(g.questions ?? []).length === 0 ? (
                  <li className="px-6 py-4 text-sm text-ink/50">No questions in this group.</li>
                ) : (
                  g.questions.map((q, idx) => (
                    <li
                      key={q.id}
                      className="px-6 py-4 flex justify-between gap-4 items-start"
                    >
                      <div>
                        <span className="text-xs text-ink/40 font-mono">Q{idx + 1}</span>
                        <p className="text-sm text-ink mt-1">{q.questionText}</p>
                        <p className="text-xs text-ink/40 mt-1">Weight {q.factorWeight}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(g.id, q.id)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))
                )}
              </ul>
            </Card>
          ))}
        </div>
      )}

      {step === "quotes" && (
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-ink mb-4">Add quote</h3>
            <form onSubmit={addQuote} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  value={quoteForm.riskLevel}
                  onChange={(e) => setQuoteForm({ ...quoteForm, riskLevel: e.target.value })}
                >
                  <option value="Low">Low risk</option>
                  <option value="Medium">Medium risk</option>
                  <option value="High">High risk</option>
                </Select>
                <Select
                  value={quoteForm.type}
                  onChange={(e) => setQuoteForm({ ...quoteForm, type: e.target.value })}
                >
                  <option value="motivation">Motivation</option>
                  <option value="support">Support</option>
                  <option value="warning">Warning</option>
                </Select>
              </div>
              <textarea
                className="w-full min-h-[80px] rounded-xl border border-ink/15 px-4 py-3 text-sm"
                placeholder="Message shown after quiz"
                value={quoteForm.message}
                onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Min score (optional)"
                  value={quoteForm.minScore}
                  onChange={(e) => setQuoteForm({ ...quoteForm, minScore: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Max score (optional)"
                  value={quoteForm.maxScore}
                  onChange={(e) => setQuoteForm({ ...quoteForm, maxScore: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={saving}>
                Add quote
              </Button>
            </form>
          </Card>

          <Card padded={false}>
            <div className="px-6 py-4 border-b border-ink/5 font-semibold">Mapped quotes</div>
            <ul className="divide-y divide-ink/5">
              {(quiz.quotes ?? []).length === 0 ? (
                <li className="px-6 py-4 text-sm text-ink/50">No quotes yet.</li>
              ) : (
                quiz.quotes.map((q) => (
                  <li key={q.id} className="px-6 py-4 flex justify-between gap-4">
                    <div>
                      <Badge tone="teal" className="mb-2">
                        {q.riskLevel} · {q.type}
                      </Badge>
                      <p className="text-sm text-ink">{q.message}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeQuote(q.id)}>
                      Remove
                    </Button>
                  </li>
                ))
              )}
            </ul>
          </Card>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          disabled={stepIndex === 0}
          onClick={() => setStep(STEPS[stepIndex - 1])}
        >
          Previous
        </Button>
        <Button
          disabled={stepIndex === STEPS.length - 1}
          onClick={() => setStep(STEPS[stepIndex + 1])}
        >
          Next step
        </Button>
      </div>
    </div>
  );
}

export { QuizBuilderPage };
