import Providers from "@/components/providers/Providers";
import { AppRouter } from "./AppRouter";
import { useEffect } from "react";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { ask } from "@tauri-apps/plugin-dialog";

function App() {
  // Block keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      if (!ctrl) return;

      const blockedKeys = [
        "p", // print
        "s", // save page
        "r", // reload
        "f", // find
        "g",
        "j",
      ];

      if (blockedKeys.includes(e.key.toLowerCase())) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("keydown", handler, true);

    return () => {
      window.removeEventListener("keydown", handler, true);
    };
  }, []);

  // Block right click
  useEffect(() => {
    const blockContext = (e: MouseEvent) => e.preventDefault();
    window.addEventListener("contextmenu", blockContext);
    return () => window.removeEventListener("contextmenu", blockContext);
  }, []);

  // Check for updates
  useEffect(() => {
    async function checkForUpdates() {
      try {
        const update = await check();

        if (update !== null) {
          const confirm = await ask(`Update to ${update.version} is available!`, {
            title: "Update Available",
            kind: "info",
            okLabel: "Update",
            cancelLabel: "Later",
          });

          if (confirm) {
            await update.downloadAndInstall();
            await relaunch();
          }
        }
      } catch (error) {
        console.error("Failed to check for updates:", error);
      }
    }
    try {
      checkForUpdates();
    } catch (err) {
      console.log("Update check failed");
    }
  }, []);

  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}

export default App;
