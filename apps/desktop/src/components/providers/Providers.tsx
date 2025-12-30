import { DialogProvider } from "@/context/DialogContext";
import { ThemeProvider } from "./ThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system">
      <DialogProvider>{children}</DialogProvider>
    </ThemeProvider>
  );
}
