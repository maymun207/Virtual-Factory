import { useEffect } from "react";
import { Scene } from "./components/factory/Scene";
import { Dashboard } from "./components/ui/Dashboard";
import { useTelemetryStore } from "./store/telemetryStore";

function App() {
  useEffect(() => {
    useTelemetryStore.getState().startTelemetrySync();
    return () => {
      useTelemetryStore.getState().stopTelemetrySync();
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <Scene />
      <Dashboard />
    </div>
  );
}

export default App;
