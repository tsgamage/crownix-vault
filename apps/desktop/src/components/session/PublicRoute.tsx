import { SessionService } from "@/services/session.service";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  if (SessionService.isUnlocked()) {
    return <Navigate to="/vault" replace />;
  }

  return children;
}
