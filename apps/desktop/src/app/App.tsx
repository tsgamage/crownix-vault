import Providers from "@/components/providers/Providers";
import { AppRouter } from "./AppRouter";
import { useEffect } from "react";

function App() {
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

  useEffect(() => {
    const blockContext = (e: MouseEvent) => e.preventDefault();
    window.addEventListener("contextmenu", blockContext);
    return () => window.removeEventListener("contextmenu", blockContext);
  }, []);

  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}

export default App;
