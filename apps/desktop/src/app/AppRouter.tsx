import { HashRouter, Routes, Route } from "react-router-dom";
import StartScreen from "@/screens/StartScreen";
import UnlockScreen from "@/screens/UnlockScreen";
import VaultScreen from "@/screens/VaultScreen";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/unlock" element={<UnlockScreen />} />
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
