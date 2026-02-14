/**
 * Scene — Lean composition file for the 3D factory scene.
 * All sub-components are imported from their own files.
 */
import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Grid,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";
import { useSimulationStore } from "../../store/simulationStore";
import { Station } from "./Station";
import { TrashBin } from "./TrashBin";
import { ShipmentBox } from "./ShipmentBox";
import { SceneLogic } from "./SceneLogic";
import { ConveyorBelt } from "./ConveyorBelt";
import { ProductionTable3D } from "./ProductionTable3D";
import { useSystemTimer } from "../../system-timer/useSystemTimer";
import {
  STATION_STAGES,
  STATION_COUNT,
  CAMERA_POSITION,
  CAMERA_FOV,
  ORBIT_CONTROLS,
  AMBIENT_INTENSITY,
  SPOT_LIGHT,
  POINT_LIGHT,
  ENVIRONMENT_PRESET,
  GRID_CONFIG,
  TRASH_BIN_POSITION,
  SHIPMENT_BOX_POSITION,
  getStationPosition,
} from "../../lib/params";

// System Timer driver — must be inside Canvas tree
const SystemTimerDriver = () => {
  useSystemTimer();
  return null;
};

export const Scene = () => {
  const stations = useSimulationStore((s) => s.stations);
  const resetVersion = useSimulationStore((s) => s.resetVersion);

  // Central Station Ref Management
  const stationRefs = useRef<(THREE.Group | null)[]>(
    new Array(STATION_COUNT).fill(null),
  );
  const activeStatesRef = useRef<boolean[]>(
    new Array(STATION_COUNT).fill(false),
  );

  return (
    <Canvas shadows className="w-full h-full bg-black">
      <Suspense fallback={null}>
        <SystemTimerDriver />
        <SceneLogic
          stationRefs={stationRefs}
          activeStatesRef={activeStatesRef}
          stationStages={STATION_STAGES}
        />
        <PerspectiveCamera
          makeDefault
          position={CAMERA_POSITION}
          fov={CAMERA_FOV}
        />
        <OrbitControls
          minPolarAngle={ORBIT_CONTROLS.minPolarAngle}
          maxPolarAngle={ORBIT_CONTROLS.maxPolarAngle}
          minDistance={ORBIT_CONTROLS.minDistance}
          maxDistance={ORBIT_CONTROLS.maxDistance}
          enableDamping
          dampingFactor={ORBIT_CONTROLS.dampingFactor}
        />

        {/* Lighting */}
        <ambientLight intensity={AMBIENT_INTENSITY} />
        <spotLight
          position={SPOT_LIGHT.position}
          angle={SPOT_LIGHT.angle}
          penumbra={SPOT_LIGHT.penumbra}
          intensity={SPOT_LIGHT.intensity}
          castShadow
          shadow-mapSize={[SPOT_LIGHT.shadowMapSize, SPOT_LIGHT.shadowMapSize]}
        />
        <pointLight
          position={POINT_LIGHT.position}
          intensity={POINT_LIGHT.intensity}
        />
        <Environment preset={ENVIRONMENT_PRESET} />

        {/* Floor */}
        <Grid
          infiniteGrid
          followCamera
          position={GRID_CONFIG.position}
          cellSize={GRID_CONFIG.cellSize}
          cellThickness={GRID_CONFIG.cellThickness}
          cellColor={GRID_CONFIG.cellColor}
          sectionSize={GRID_CONFIG.sectionSize}
          sectionThickness={GRID_CONFIG.sectionThickness}
          sectionColor={GRID_CONFIG.sectionColor}
          fadeDistance={GRID_CONFIG.fadeDistance}
          fadeStrength={GRID_CONFIG.fadeStrength}
        />

        {/* Stations */}
        {stations.map((station, index) => (
          <group key={station.id}>
            <Station
              index={index}
              position={getStationPosition(index)}
              label={station.name.en}
              stationRefs={stationRefs}
            />
          </group>
        ))}

        <TrashBin position={TRASH_BIN_POSITION} />
        <ConveyorBelt key={resetVersion} />
        <ShipmentBox position={SHIPMENT_BOX_POSITION} />
        <ProductionTable3D />
      </Suspense>
    </Canvas>
  );
};
