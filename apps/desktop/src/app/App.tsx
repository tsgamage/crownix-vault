import { Button } from "@/components/ui/button";
import { helloCore } from "@crownix/core";

function App() {
  console.log(helloCore());
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div>Hello Princess</div>
      <Button onClick={() => console.log("Hello Princess")}>Hello</Button>
    </div>
  );
}

export default App;
