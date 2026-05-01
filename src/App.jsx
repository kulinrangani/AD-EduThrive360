import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { IconSpark } from "./component/Icons.jsx";
import { Card } from "./component/UI.jsx";
import { Sidebar } from "./component/Sidebar.jsx";
import { Navbar } from "./component/Navbar.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { SchoolsPage } from "./pages/SchoolsPage.jsx";
import { UsersPage } from "./pages/UsersPage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";
import { WellnessPage } from "./pages/WellnessPage.jsx";
import { ReportsPage } from "./pages/ReportsPage.jsx";
import { AlertsPage } from "./pages/AlertsPage.jsx";
import { LoginPage, ForgotPage } from "./pages/AuthPage.jsx";

/**
 * react-router-dom paths ↔ src/pages/*Page.jsx
 * /login, /forgot → AuthPage.jsx
 * /dashboard, /schools, /users, /settings, /wellness, /alerts, /reports → *Page.jsx
 */
const APP_PAGE_SET = new Set([
  "dashboard",
  "schools",
  "users",
  "wellness",
  "alerts",
  "reports",
  "settings",
]);
const DEFAULT_APP_PAGE = "dashboard";

const PAGE_TITLES = {
  dashboard: { title: "Dashboard", sub: "Overview" },
  schools: { title: "Schools", sub: "School management" },
  users: { title: "Users", sub: "Counselors, students & parents" },
  wellness: { title: "Wellness", sub: "Programs & insights" },
  alerts: { title: "Alerts", sub: "Active flags & reviews" },
  reports: { title: "Reports", sub: "Exports & analytics" },
  settings: { title: "Settings", sub: "Workspace configuration" },
};

function PlaceholderPage({ label }) {
  return (
    <div className="fade-in">
      <Card className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-beige mx-auto flex items-center justify-center mb-4">
          <IconSpark size={24} className="text-teal" />
        </div>
        <h3 className="font-display text-3xl">{label} — coming next</h3>
        <p className="text-ink/60 mt-2 max-w-md mx-auto">
          This screen is wired up in navigation. Dashboard, Schools, Users and
          Settings are the hero flows for this review.
        </p>
      </Card>
    </div>
  );
}

function LoginRoute() {
  const navigate = useNavigate();
  return (
    <LoginPage
      onLogin={() => navigate("/dashboard")}
      onForgot={() => navigate("/forgot")}
    />
  );
}

function ForgotRoute() {
  const navigate = useNavigate();
  return <ForgotPage onBack={() => navigate("/login")} />;
}

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const seg =
    location.pathname.replace(/^\//, "").split("/")[0] || DEFAULT_APP_PAGE;
  const page = APP_PAGE_SET.has(seg) ? seg : DEFAULT_APP_PAGE;
  const { title, sub } = PAGE_TITLES[page] || PAGE_TITLES.dashboard;
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("et_collapsed") === "1"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("et_collapsed", collapsed ? "1" : "0");
  }, [collapsed]);

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
          onLogout={() => navigate("/login")}
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
              onLogout={() => navigate("/login")}
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
          <div>© 2026 EduThrive360 · India region</div>
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
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="hover:text-teal"
            >
              View auth flow
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/forgot" element={<ForgotRoute />} />
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="schools" element={<SchoolsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="wellness" element={<WellnessPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
