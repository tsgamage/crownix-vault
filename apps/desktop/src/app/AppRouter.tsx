import { HashRouter, Routes, Route } from "react-router-dom";
import StartScreen from "@/screens/StartScreen";
import UnlockScreen from "@/screens/UnlockScreen";
import VaultScreen from "@/screens/VaultScreen";
import PublicRoute from "@/components/session/PublicRoute";
import ProtectedRoute from "@/components/session/ProtectedRoute";

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <StartScreen />
            </PublicRoute>
          }
        />
        <Route
          path="/unlock"
          element={
            <PublicRoute>
              <UnlockScreen />
            </PublicRoute>
          }
        />
        <Route
          path="/vault"
          element={
            <ProtectedRoute>
              <VaultScreen />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<UnlockScreen />} />
      </Routes>
    </HashRouter>
  );
}
