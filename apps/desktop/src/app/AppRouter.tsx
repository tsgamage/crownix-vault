import { HashRouter, Routes, Route } from "react-router-dom";
import StartScreen from "@/screens/StartScreen";
import UnlockScreen from "@/screens/UnlockScreen";
import VaultScreen from "@/screens/VaultScreen";
import LockedScreen from "@/screens/LockedScreen";

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/unlock" element={<UnlockScreen />} />
        <Route path="/vault" element={<VaultScreen />} />
        <Route path="/locked" element={<LockedScreen />} />
        <Route path="*" element={<UnlockScreen />} />
      </Routes>
    </HashRouter>
  );
}
