import Providers from "@/components/providers/Providers";
import { AppRouter } from "./AppRouter";

function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}

export default App;
