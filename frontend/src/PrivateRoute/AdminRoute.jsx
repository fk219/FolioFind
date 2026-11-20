import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 animate-pulse rounded-full bg-oxblood" aria-hidden="true" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Opening the ledger</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
