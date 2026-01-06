import { HashRouter, Routes, Route } from "react-router-dom";
import StartScreen from "@/screens/StartScreen";
import UnlockScreen from "@/screens/UnlockScreen";
import VaultScreen from "@/screens/VaultScreen";
import LockedScreen from "@/screens/LockedScreen";

export const AppRoutes = {
  unlock: "/unlock",
  setup: "/setup",
  vault: "/vault",
  locked: "/locked",
};

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path={AppRoutes.unlock} element={<UnlockScreen />} />
        <Route path={AppRoutes.setup} element={<StartScreen />} />
        <Route path={AppRoutes.vault} element={<VaultScreen />} />
        <Route path={AppRoutes.locked} element={<LockedScreen />} />
        <Route path="*" element={<UnlockScreen />} />
      </Routes>
    </HashRouter>
  );
}
