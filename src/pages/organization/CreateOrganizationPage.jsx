import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IconArrowLeft,
  IconCheck,
  IconMail,
  IconLock,
  IconSpark,
  IconSchool,
} from "../../component/Icons.jsx";
import { Badge, Button, Card, Input, Select } from "../../component/UI.jsx";
import * as orgApi from "../../api/organizations.js";

function SuccessView({ result, onDone }) {
  const { organization, admin } = result;
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (!organization?.code) return;
    await navigator.clipboard.writeText(organization.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fade-in max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <span className="w-12 h-12 rounded-2xl bg-teal/15 text-teal flex items-center justify-center">
          <IconCheck size={28} />
        </span>
        <div>
          <h2 className="font-display text-3xl text-ink">Organization created</h2>
          <p className="text-sm text-ink/60 mt-1">
            {organization?.name} is ready. Share the code with the org admin only.
          </p>
        </div>
      </div>

      <Card className="text-center">
        <p className="text-xs uppercase tracking-wider text-ink/50 font-semibold">
          Organization code
        </p>
        <p className="font-mono text-3xl font-bold text-teal mt-3 tracking-wider">
          {organization?.code}
        </p>
        <Button variant="outline" className="mt-4" onClick={copyCode}>
          {copied ? "Copied!" : "Copy code"}
        </Button>
        <p className="text-sm text-ink/60 mt-4 max-w-md mx-auto">
          The org admin signs in on the <strong>User app</strong> (not Admin). They will see this
          code in their workspace to share with students or employees.
        </p>
      </Card>

      <Card>
        <h3 className="font-semibold text-ink">Organization admin account</h3>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink/50">Name</dt>
            <dd className="font-medium">{admin?.fullName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink/50">Email</dt>
            <dd className="font-mono text-right break-all">{admin?.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink/50">Type</dt>
            <dd>
              <Badge tone={organization?.type === "corporate" ? "ink" : "teal"}>
                {organization?.type === "corporate" ? "Corporate" : "School"}
              </Badge>
            </dd>
          </div>
        </dl>
      </Card>

      <div className="flex flex-wrap gap-3 justify-end">
        <Button variant="ghost" onClick={onDone}>
          Back to organizations
        </Button>
        <Button onClick={onDone} icon={<IconCheck size={16} />}>
          Done
        </Button>
      </div>
    </div>
  );
}

function CreateOrganizationPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState("school");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(null);

  const passwordsMatch = adminPassword === confirmPassword;
  const passwordValid = adminPassword.length >= 8;
  const canSubmit =
    name.trim() &&
    adminName.trim() &&
    adminEmail.trim() &&
    passwordValid &&
    passwordsMatch &&
    !saving;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setError("");
    try {
      const result = await orgApi.createOrganization({
        name: name.trim(),
        type,
        admin: {
          fullName: adminName.trim(),
          email: adminEmail.trim(),
          password: adminPassword,
        },
      });
      setCreated(result);
    } catch (err) {
      setError(err.response?.data?.error ?? err.message ?? "Failed to create organization");
    } finally {
      setSaving(false);
    }
  };

  if (created) {
    return (
      <SuccessView
        result={created}
        onDone={() => navigate("/organizations", { replace: true })}
      />
    );
  }

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <Link
        to="/organizations"
        className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-teal font-medium mb-6"
      >
        <IconArrowLeft size={16} />
        Back to organizations
      </Link>

      <div className="mb-8">
        <Badge tone="teal" className="mb-3">
          New organization
        </Badge>
        <h1 className="font-display text-4xl text-ink leading-tight">Add organization</h1>
        <p className="text-ink/60 mt-2 max-w-xl">
          Create the organization and its admin in one step. A unique registration code is generated
          automatically.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
            {error}
          </p>
        )}

        <Card>
          <div className="flex items-start gap-3 mb-5">
            <span className="w-10 h-10 rounded-xl bg-teal/15 text-teal flex items-center justify-center shrink-0">
              <IconSchool size={20} />
            </span>
            <div>
              <h2 className="font-display text-xl text-ink">Organization</h2>
              <p className="text-sm text-ink/60">School or corporate — minimal details only.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="org-name"
                className="text-xs uppercase tracking-wider text-ink/50 font-semibold"
              >
                Organization name
              </label>
              <Input
                id="org-name"
                className="mt-1.5"
                placeholder="e.g. Willowbrook International"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label
                htmlFor="org-type"
                className="text-xs uppercase tracking-wider text-ink/50 font-semibold"
              >
                Type
              </label>
              <Select
                id="org-type"
                className="mt-1.5"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="school">School — students & counselors</option>
                <option value="corporate">Corporate — employees & HR</option>
              </Select>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3 mb-5">
            <span className="w-10 h-10 rounded-xl bg-orange/15 text-orange flex items-center justify-center shrink-0">
              <IconMail size={20} />
            </span>
            <div>
              <h2 className="font-display text-xl text-ink">Organization admin</h2>
              <p className="text-sm text-ink/60">
                This person signs in on the <strong>User app</strong> to manage counselors and view
                the registration code.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="admin-name"
                className="text-xs uppercase tracking-wider text-ink/50 font-semibold"
              >
                Full name
              </label>
              <Input
                id="admin-name"
                className="mt-1.5"
                placeholder="Priya Sharma"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="admin-email"
                className="text-xs uppercase tracking-wider text-ink/50 font-semibold"
              >
                Work email
              </label>
              <Input
                id="admin-email"
                className="mt-1.5"
                icon={<IconMail size={16} />}
                type="email"
                placeholder="principal@school.edu"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
            <div>
              <label
                htmlFor="admin-password"
                className="text-xs uppercase tracking-wider text-ink/50 font-semibold"
              >
                Password
              </label>
              <Input
                id="admin-password"
                className="mt-1.5"
                icon={<IconLock size={16} />}
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                minLength={8}
                required
                autoComplete="new-password"
              />
              {adminPassword.length > 0 && !passwordValid && (
                <p className="text-xs text-orange mt-1">At least 8 characters</p>
              )}
            </div>
            <div>
              <label
                htmlFor="admin-password-confirm"
                className="text-xs uppercase tracking-wider text-ink/50 font-semibold"
              >
                Confirm password
              </label>
              <Input
                id="admin-password-confirm"
                className="mt-1.5"
                icon={<IconLock size={16} />}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                required
                autoComplete="new-password"
              />
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-orange mt-1">Passwords do not match</p>
              )}
            </div>
          </div>
        </Card>

        <div className="rounded-xl bg-beige p-4 flex items-start gap-3">
          <span className="w-8 h-8 rounded-lg bg-teal/15 text-teal flex items-center justify-center shrink-0">
            <IconSpark size={16} />
          </span>
          <p className="text-sm text-ink/70">
            After creation you will see the organization code once. The org admin also sees it in
            their User app workspace — not in this Admin console.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={() => navigate("/organizations")}>
            Cancel
          </Button>
          <Button type="submit" disabled={!canSubmit} icon={<IconCheck size={16} />}>
            {saving ? "Creating…" : "Create organization"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export { CreateOrganizationPage };
