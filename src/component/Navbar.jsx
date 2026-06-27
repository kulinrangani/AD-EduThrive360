import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconMenu,
  IconChevron,
  IconSearch,
  IconBell,
  IconPlus,
} from "./Icons.jsx";
import { Input, Button, Avatar, Select, Modal } from "./UI.jsx";
import * as orgApi from "../api/organizations.js";
import * as quizApi from "../api/quizzes.js";
import * as searchApi from "../api/search.js";

function Navbar({ title, subtitle, user, onOpenMobileNav }) {
  const navigate = useNavigate();

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // New Dropdown state
  const [newDropdownOpen, setNewDropdownOpen] = useState(false);

  // Modals state
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // Modals form state
  const [organizations, setOrganizations] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  // Create User form state
  const [userOrgId, setUserOrgId] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [userFullName, setUserFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userError, setUserError] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);

  // Create Category form state
  const [categoryQuizId, setCategoryQuizId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("positive");
  const [categoryWeight, setCategoryWeight] = useState(0.5);
  const [categoryError, setCategoryError] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Load organizations for User modal
  useEffect(() => {
    if (userModalOpen) {
      orgApi
        .listOrganizations()
        .then((list) => setOrganizations(list.filter((o) => o.status !== false)))
        .catch((err) => console.error("Failed to load organizations:", err));
    }
  }, [userModalOpen]);

  // Load quizzes for Category modal
  useEffect(() => {
    if (categoryModalOpen) {
      quizApi
        .listQuizzes()
        .then((list) => setQuizzes(list.filter((q) => q.isDeleted !== true)))
        .catch((err) => console.error("Failed to load quizzes:", err));
    }
  }, [categoryModalOpen]);

  // Global search debounce effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await searchApi.globalSearch(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error("Global search error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleCreateUser = async (e) => {
    if (e) e.preventDefault();
    setUserError("");

    if (!userOrgId) {
      setUserError("Please select an organization");
      return;
    }
    if (!userFullName.trim()) {
      setUserError("Please enter full name");
      return;
    }
    if (!userEmail.trim()) {
      setUserError("Please enter email address");
      return;
    }
    if (userPassword.length < 8) {
      setUserError("Password must be at least 8 characters");
      return;
    }

    setCreatingUser(true);
    try {
      const payload = {
        fullName: userFullName.trim(),
        email: userEmail.trim().toLowerCase(),
        password: userPassword,
        role: userRole,
      };

      await orgApi.addOrganizationMember(userOrgId, payload);
      setUserModalOpen(false);

      // Reset fields
      setUserOrgId("");
      setUserFullName("");
      setUserEmail("");
      setUserPassword("");

      // Redirect to /users with search filters and refetch state
      navigate(
        `/users?search=${encodeURIComponent(payload.fullName)}&tab=${payload.role === "org_counselor" ? "counselors" : "members"}`,
        { state: { refetch: true } }
      );
    } catch (err) {
      setUserError(err.response?.data?.error ?? err.message ?? "Could not create user");
    } finally {
      setCreatingUser(false);
    }
  };

  const handleCreateCategory = async (e) => {
    if (e) e.preventDefault();
    setCategoryError("");

    if (!categoryQuizId) {
      setCategoryError("Please select a quiz");
      return;
    }
    if (!categoryName.trim()) {
      setCategoryError("Please enter a category name");
      return;
    }

    setCreatingCategory(true);
    try {
      const payload = {
        name: categoryName.trim(),
        type: categoryType,
        weight: Number(categoryWeight),
        scoringMethod: "average",
        riskRanges: [
          { label: "Low", min: 3, max: 4 },
          { label: "Medium", min: 2, max: 3 },
          { label: "High", min: 1, max: 2 },
        ],
      };

      await quizApi.createGroup(categoryQuizId, payload);
      setCategoryModalOpen(false);

      // Reset fields
      setCategoryQuizId("");
      setCategoryName("");

      // Navigate directly to quiz builder
      navigate(`/quizzes/${categoryQuizId}`);
    } catch (err) {
      setCategoryError(
        err.response?.data?.error ?? err.message ?? "Could not create category"
      );
    } finally {
      setCreatingCategory(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-beige/85 backdrop-blur-md border-b border-ink/5">
        <div className="px-5 lg:px-8 h-[72px] flex items-center gap-4">
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden w-10 h-10 rounded-xl bg-white border border-ink/10 flex items-center justify-center text-ink/70 shrink-0"
          >
            <IconMenu size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <div className="hidden md:flex items-center gap-2 text-xs text-ink/50 mb-0.5">
              <span>EM360</span>
              <IconChevron size={12} />
              <span className="text-ink/70 font-medium">{title}</span>
            </div>
            <h1 className="font-display text-xl md:text-2xl text-ink leading-tight truncate">
              {subtitle ?? title}
            </h1>
          </div>

          {/* Search */}
          <div className="hidden md:block w-[320px] relative">
            <Input
              icon={<IconSearch size={16} />}
              placeholder="Search schools, users, reports…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => {
                // Short delay to allow clicking search items before close
                setTimeout(() => setSearchFocused(false), 200);
              }}
            />

            {searchFocused && (searchQuery.trim() || searchLoading) && (
              <div className="absolute top-12 left-0 right-0 bg-white rounded-xl shadow-lift border border-ink/10 z-50 max-h-80 overflow-y-auto p-2 space-y-1">
                {searchLoading ? (
                  <div className="p-3 text-xs text-ink/50 text-center">
                    Loading matches...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-3 text-xs text-ink/50 text-center">
                    No results found for "{searchQuery}"
                  </div>
                ) : (
                  searchResults.map((item) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      type="button"
                      onMouseDown={() => {
                        navigate(item.link);
                        setSearchQuery("");
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-beige transition flex flex-col"
                    >
                      <span className="font-semibold text-ink">{item.name}</span>
                      <span className="text-[10px] text-ink/50 mt-0.5">
                        {item.subtitle}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Alerts */}
          <button className="relative w-11 h-11 rounded-xl bg-white border border-ink/10 flex items-center justify-center text-ink/70 hover:text-teal hover:border-teal transition shrink-0">
            <IconBell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange pulse-dot" />
          </button>

          {/* Quick action */}
          <div className="hidden md:block relative shrink-0">
            <Button
              size="md"
              icon={<IconPlus size={16} />}
              onClick={() => setNewDropdownOpen(!newDropdownOpen)}
              onBlur={() => {
                setTimeout(() => setNewDropdownOpen(false), 200);
              }}
            >
              New
            </Button>

            {newDropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white border border-ink/10 shadow-lift rounded-xl z-50 p-2 space-y-1">
                <button
                  type="button"
                  onMouseDown={() => navigate("/organizations/new")}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-beige text-ink font-medium transition"
                >
                  New Organization
                </button>
                <button
                  type="button"
                  onMouseDown={() => navigate("/quizzes?create=true")}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-beige text-ink font-medium transition"
                >
                  New Quiz
                </button>
                <button
                  type="button"
                  onMouseDown={() => setUserModalOpen(true)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-beige text-ink font-medium transition"
                >
                  New User
                </button>
                <button
                  type="button"
                  onMouseDown={() => setCategoryModalOpen(true)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-beige text-ink font-medium transition"
                >
                  New Category
                </button>
              </div>
            )}
          </div>

          {/* Profile */}
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 pl-3 border-l border-ink/10 hover:opacity-85 transition text-left group shrink-0"
          >
            <Avatar
              name={user?.fullName ?? "Super Admin"}
              src={user?.avatarUrl}
              size={40}
            />
            <div className="hidden lg:block">
              <div className="text-sm font-semibold leading-none text-ink group-hover:text-teal transition">
                {user?.fullName ?? "Super Admin"}
              </div>
              <div className="text-[11px] text-ink/50 mt-1">
                Super Admin · India
              </div>
            </div>
          </button>
        </div>
      </header>

      {/* New User Modal */}
      <Modal
        open={userModalOpen}
        onClose={() => {
          setUserModalOpen(false);
          setUserOrgId("");
          setUserRole("user");
          setUserFullName("");
          setUserEmail("");
          setUserPassword("");
          setUserError("");
        }}
        title="New User"
        subtitle="Create a counselor or member under an organization"
        footer={
          <>
            <Button variant="ghost" onClick={() => setUserModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser} disabled={creatingUser}>
              {creatingUser ? "Creating..." : "Create User"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          {userError && (
            <p className="text-xs text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
              {userError}
            </p>
          )}

          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase block mb-2">
              Organization
            </label>
            <Select
              value={userOrgId}
              onChange={(e) => setUserOrgId(e.target.value)}
              required
            >
              <option value="">Select organization...</option>
              {organizations.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.type})
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-ink/50 uppercase block mb-2">
                Role
              </label>
              <Select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
              >
                <option value="user">Member (Student/Employee)</option>
                <option value="org_counselor">Counselor</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink/50 uppercase block mb-2">
                Full Name
              </label>
              <Input
                placeholder="e.g. John Doe"
                value={userFullName}
                onChange={(e) => setUserFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase block mb-2">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="e.g. john@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase block mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="Min. 8 characters"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
        </form>
      </Modal>

      {/* New Category Modal */}
      <Modal
        open={categoryModalOpen}
        onClose={() => {
          setCategoryModalOpen(false);
          setCategoryQuizId("");
          setCategoryName("");
          setCategoryType("positive");
          setCategoryWeight(0.5);
          setCategoryError("");
        }}
        title="New Category"
        subtitle="Create a question group (category) under a quiz"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCategory} disabled={creatingCategory}>
              {creatingCategory ? "Creating..." : "Create Category"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          {categoryError && (
            <p className="text-xs text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
              {categoryError}
            </p>
          )}

          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase block mb-2">
              Quiz
            </label>
            <Select
              value={categoryQuizId}
              onChange={(e) => setCategoryQuizId(e.target.value)}
              required
            >
              <option value="">Select quiz...</option>
              {quizzes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title} ({q.organizationId?.name || "Global"})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink/50 uppercase block mb-2">
              Category Name
            </label>
            <Input
              placeholder="e.g. Sleep quality"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-ink/50 uppercase block mb-2">
                Type
              </label>
              <Select
                value={categoryType}
                onChange={(e) => setCategoryType(e.target.value)}
              >
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink/50 uppercase block mb-2">
                Weight (0.0 - 1.0)
              </label>
              <Input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={categoryWeight}
                onChange={(e) => setCategoryWeight(parseFloat(e.target.value))}
                required
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}

export { Navbar };
