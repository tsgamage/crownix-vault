import { Navigate } from "react-router-dom";
import { SessionService } from "@/services/session.service";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!SessionService.isUnlocked()) {
    return <Navigate to="/unlock" replace />;
  }

  return children;
}
