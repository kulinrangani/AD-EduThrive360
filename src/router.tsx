import { createBrowserRouter, Navigate, useNavigate, useLocation } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout.tsx";
import { ProtectedLayout } from "./layouts/ProtectedLayout.tsx";
import { LoginPage, ForgotPage } from "./pages/AuthPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { OrganizationsPage } from "./pages/organization/OrganizationsPage.jsx";
import { CreateOrganizationPage } from "./pages/organization/CreateOrganizationPage.jsx";
import { OrganizationDetailPage } from "./pages/organization/OrganizationDetailPage.jsx";
import { QuizzesPage } from "./pages/quiz/QuizzesPage.jsx";
import { QuizBuilderPage } from "./pages/quiz/QuizBuilderPage.jsx";
import { UsersPage } from "./pages/UsersPage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";
import { WellnessPage } from "./pages/WellnessPage.jsx";
import { AlertsPage } from "./pages/AlertsPage.jsx";
import { ReportsPage } from "./pages/ReportsPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";

// Wrapper for login actions to handle navigation hooks properly
function LoginRouteWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  return (
    <LoginPage
      onLogin={async (email: string, password: string) => {
        await login(email, password);
        const state = location.state as { from?: string } | null;
        navigate(state?.from ?? "/dashboard", { replace: true });
      }}
      onForgot={() => navigate("/forgot")}
    />
  );
}

// Wrapper for forgot password actions to handle navigation hooks properly
function ForgotRouteWrapper() {
  const navigate = useNavigate();
  return <ForgotPage onBack={() => navigate("/login")} />;
}

export const router = createBrowserRouter([
  // Public/Open Pages Layout
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/login",
        element: <LoginRouteWrapper />,
      },
      {
        path: "/forgot",
        element: <ForgotRouteWrapper />,
      },
    ],
  },
  
  // Protected Routes Layout
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "quizzes",
        element: <QuizzesPage />,
      },
      {
        path: "quizzes/:quizId",
        element: <QuizBuilderPage />,
      },
      {
        path: "organizations",
        element: <OrganizationsPage />,
      },
      {
        path: "organizations/new",
        element: <CreateOrganizationPage />,
      },
      {
        path: "organizations/:orgId",
        element: <OrganizationDetailPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "wellness",
        element: <WellnessPage />,
      },
      {
        path: "alerts",
        element: <AlertsPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
    ],
  },

  // Legacy Redirects
  {
    path: "/schools",
    element: <Navigate to="/organizations" replace />,
  },

  // Catch-all Redirect
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
