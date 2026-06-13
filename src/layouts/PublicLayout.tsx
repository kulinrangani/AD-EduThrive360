import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function PublicLayout() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <p className="text-ink/60 text-sm">Loading session…</p>
      </div>
    );
  }

  if (isAuthenticated) {
    const dest = location.state?.from ?? "/dashboard";
    return <Navigate to={dest} replace />;
  }

  return <Outlet />;
}
