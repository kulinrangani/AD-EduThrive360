import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Button, Card, Input, Avatar } from "../component/UI.jsx";
import { IconMail, IconLock } from "../component/Icons.jsx";
import * as authApi from "../api/auth.js";

function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Initialize fields from current user data
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
      setAvatarUrl(user.avatarUrl || "");
      setAvatarFile(null);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB");
      setSuccess("");
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl("");
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("email", email.trim().toLowerCase());
      formData.append("phoneNumber", phoneNumber.trim());
      
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      } else {
        formData.append("avatarUrl", avatarUrl);
      }

      await authApi.updateProfile(formData);
      await refreshProfile();

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.error ?? err.message ?? "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordSaving(true);

    try {
      const payload = {
        password: password,
      };

      await authApi.updateProfile(payload);

      setPasswordSuccess("Password changed successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.response?.data?.error ?? err.message ?? "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="fade-in max-w-3xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="font-display text-3xl md:text-4xl text-ink leading-tight">Profile Settings</h1>
        <p className="text-ink/60 mt-1">Manage your administrator account credentials and personal details.</p>
      </div>

      {/* Profile Details Form */}
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100">
            {success}
          </p>
        )}

        {/* Profile Picture Card */}
        <Card>
          <h2 className="font-display text-xl text-ink mb-4">Profile Photo</h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar name={fullName || "Super Admin"} src={avatarUrl} size={80} />
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload new photo
                </Button>
                {avatarUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={handleRemovePhoto}
                  >
                    Remove photo
                  </Button>
                )}
              </div>
              <p className="text-xs text-ink/40">JPG, PNG, or GIF. Max size 2MB.</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </Card>

        {/* Account Details Card */}
        <Card>
          <h2 className="font-display text-xl text-ink mb-4">Account Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aarav Mehta"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <Input
                type="email"
                icon={<IconMail size={16} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@em360.com"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wider mb-2">
                Phone Number (optional)
              </label>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. +91 98765 43210"
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving changes..." : "Save changes"}
          </Button>
        </div>
      </form>

      {/* Change Password Form */}
      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        {passwordError && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
            {passwordError}
          </p>
        )}

        {passwordSuccess && (
          <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100">
            {passwordSuccess}
          </p>
        )}

        <Card>
          <h2 className="font-display text-xl text-ink mb-2">Change Password</h2>
          <p className="text-xs text-ink/50 mb-4">Enter a new password to update your login credentials.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wider mb-2">
                New Password
              </label>
              <Input
                type="password"
                icon={<IconLock size={16} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                minLength={8}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink/50 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <Input
                type="password"
                icon={<IconLock size={16} />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Min. 8 characters"
                minLength={8}
                required
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={passwordSaving}>
            {passwordSaving ? "Updating password..." : "Update password"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export { ProfilePage };
