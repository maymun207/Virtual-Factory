import { Scene } from './components/factory/Scene';
import { Dashboard } from './components/ui/Dashboard';
import { useSensorSimulation } from './hooks/useSensorSimulation';

function App() {
  // Start background simulation
  useSensorSimulation();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Enable pointer events only for interactive UI elements */}
        <div className="pointer-events-auto">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default App;
