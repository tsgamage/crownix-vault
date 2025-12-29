import { AppRouter } from "./AppRouter";
import { DialogProvider } from "@/context/DialogContext";

function App() {
  return (
    <DialogProvider>
      <AppRouter />
    </DialogProvider>
  );
}

export default App;
