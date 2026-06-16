import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Sidebar } from "../component/Sidebar.jsx";
import { Navbar } from "../component/Navbar.jsx";

const APP_PAGE_SET = new Set([
  "dashboard",
  "quizzes",
  "organizations",
  "users",
  "wellness",
  "alerts",
  "reports",
  "settings",
]);
const DEFAULT_APP_PAGE = "dashboard";

interface PageTitle {
  title: string;
  sub: string;
}

const PAGE_TITLES: Record<string, PageTitle> = {
  dashboard: { title: "Dashboard", sub: "Overview" },
  quizzes: { title: "Quizzes", sub: "Builder & configuration" },
  "quizzes/:quizId": { title: "Quiz builder", sub: "Quizzes" },
  organizations: { title: "Organizations", sub: "Schools & corporates" },
  "organizations/new": { title: "Add organization", sub: "Organizations" },
  "organizations/:orgId": { title: "Organization", sub: "Detail" },
  users: { title: "Users", sub: "Counselors, students & parents" },
  wellness: { title: "Wellness", sub: "Programs & insights" },
  alerts: { title: "Alerts", sub: "Active flags & reviews" },
  reports: { title: "Reports", sub: "Exports & analytics" },
  settings: { title: "Settings", sub: "Workspace configuration" },
};

export function ProtectedLayout() {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("et_collapsed") === "1"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("et_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <p className="text-ink/60 text-sm">Loading session…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const pathKey = location.pathname.replace(/^\//, "").replace(/\/$/, "") || DEFAULT_APP_PAGE;
  const seg = pathKey.split("/")[0] || DEFAULT_APP_PAGE;
  const page = APP_PAGE_SET.has(seg) ? seg : DEFAULT_APP_PAGE;
  const isOrgDetail =
    pathKey.startsWith("organizations/") && pathKey !== "organizations/new";
  const isQuizBuilder =
    pathKey.startsWith("quizzes/") && pathKey !== "quizzes/new";
  const { title, sub } = isOrgDetail
    ? { title: "Organization", sub: "Detail view" }
    : isQuizBuilder
      ? { title: "Quiz builder", sub: "Quizzes" }
      : PAGE_TITLES[pathKey] || PAGE_TITLES[page] || PAGE_TITLES.dashboard;

  return (
    <div
      data-screen-label={`App ${title}`}
      className="min-h-screen flex bg-beige"
    >
      <div className="hidden lg:flex sticky top-0 h-screen relative z-40">
        <Sidebar
          current={page}
          onNav={(k) => navigate(`/${k}`)}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
          onLogout={handleLogout}
          user={user}
        />
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="absolute top-16 -right-3 w-6 h-6 rounded-full bg-white border border-ink/10 shadow-soft flex items-center justify-center text-ink/60 hover:text-teal z-50"
          title={collapsed ? "Expand" : "Collapse"}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: collapsed ? "none" : "rotate(180deg)" }}
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex" onClick={(e) => e.stopPropagation()}>
            <Sidebar
              current={page}
              onNav={(k) => {
                navigate(`/${k}`);
                setMobileOpen(false);
              }}
              collapsed={false}
              onToggleCollapsed={() => {}}
              onLogout={handleLogout}
              user={user}
            />
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 flex flex-col">
        <Navbar
          title={sub}
          subtitle={title}
          onOpenMobileNav={() => setMobileOpen(true)}
        />
        <div className="p-5 lg:p-8 flex-1">
          <Outlet />
        </div>
        <footer className="px-8 py-5 text-xs text-ink/40 flex items-center justify-between border-t border-ink/5">
          <div>© 2026 EM360 · India region</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-teal">
              Status
            </a>
            <a href="#" className="hover:text-teal">
              Help
            </a>
            <a href="#" className="hover:text-teal">
              API
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
