import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Grid,
  Text,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";
import { useFactoryStore } from "../../store/factoryStore";
import { ConveyorBelt } from "./ConveyorBelt";
import { ProductionTable3D } from "./ProductionTable3D";
import { useSystemTimer } from "../../system-timer/useSystemTimer";
import { STATION_STAGES, LIGHT_TOLERANCE } from "../../lib/constants";

// React Station Component with ref-based updates
const Station = ({
  position,
  label,
  index,
  stationRefs,
}: {
  position: [number, number, number];
  label: string;
  index: number;
  stationRefs: React.MutableRefObject<(THREE.Group | null)[]>;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    stationRefs.current[index] = groupRef.current;
  }, [index, stationRefs]);

  return (
    <group position={position} ref={groupRef}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Reactive Body */}
      <mesh position={[0, 1.5, 0]} name="body" castShadow receiveShadow>
        <boxGeometry args={[1.8, 1, 1.8]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive="#000000"
          emissiveIntensity={0}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Status Light */}
      <mesh position={[0, 2.5, 0]} name="light">
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#330000" />
      </mesh>

      {/* Station Label (3D Text) */}
      <Text
        position={[0, 3.2, 0]}
        fontSize={0.45}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {label}
      </Text>
    </group>
  );
};

const TrashBin = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[1.7, 1.65, 1.7]} />
      <meshStandardMaterial color="#808080" metalness={0.6} roughness={0.4} />
      {/* Open top effect */}
      <mesh position={[0, 0.835, 0]}>
        <boxGeometry args={[1.53, 0.01, 1.53]} />
        <meshStandardMaterial color="#000" />
      </mesh>
    </mesh>

    {/* Fluorescent Visuals */}
    <group position={[0, 0.825, 0]}>
      {/* Thicker Top Rim */}
      <mesh position={[0, 0.01, 0.82]}>
        <boxGeometry args={[1.7, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#00cc66"
          emissive="#00cc66"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[0, 0.01, -0.82]}>
        <boxGeometry args={[1.7, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#00cc66"
          emissive="#00cc66"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[0.82, 0.01, 0]}>
        <boxGeometry args={[0.08, 0.08, 1.7]} />
        <meshStandardMaterial
          color="#00cc66"
          emissive="#00cc66"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[-0.82, 0.01, 0]}>
        <boxGeometry args={[0.08, 0.08, 1.7]} />
        <meshStandardMaterial
          color="#00cc66"
          emissive="#00cc66"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Secondary Wrapping Strip (slightly below the top) */}
      <group position={[0, -0.15, 0]}>
        <mesh position={[0, 0, 0.855]}>
          <boxGeometry args={[1.71, 0.045, 0.01]} />
          <meshStandardMaterial
            color="#00cc66"
            emissive="#00cc66"
            emissiveIntensity={1.5}
          />
        </mesh>
        <mesh position={[0, 0, -0.855]}>
          <boxGeometry args={[1.71, 0.045, 0.01]} />
          <meshStandardMaterial
            color="#00cc66"
            emissive="#00cc66"
            emissiveIntensity={1.5}
          />
        </mesh>
        <mesh position={[0.855, 0, 0]}>
          <boxGeometry args={[0.01, 0.045, 1.71]} />
          <meshStandardMaterial
            color="#00cc66"
            emissive="#00cc66"
            emissiveIntensity={1.5}
          />
        </mesh>
        <mesh position={[-0.855, 0, 0]}>
          <boxGeometry args={[0.01, 0.045, 1.71]} />
          <meshStandardMaterial
            color="#00cc66"
            emissive="#00cc66"
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>
    </group>

    {/* Label on body (3D Text) */}
    <Text
      position={[0, -0.65, 0.87]}
      rotation={[0, 0, 0]}
      fontSize={0.245}
      color="white"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.02}
      outlineColor="#000000"
    >
      WASTE BIN
    </Text>
  </group>
);

const ShipmentBox = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Box base */}
    <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
      <boxGeometry args={[2.5, 0.1, 2.5]} />
      <meshStandardMaterial color="#8B6914" roughness={0.8} metalness={0.1} />
    </mesh>
    {/* Back wall */}
    <mesh position={[0, 1.0, -1.2]} castShadow receiveShadow>
      <boxGeometry args={[2.5, 1.2, 0.1]} />
      <meshStandardMaterial color="#A0782C" roughness={0.8} metalness={0.1} />
    </mesh>
    {/* Front wall (shorter for visibility) */}
    <mesh position={[0, 0.65, 1.2]} castShadow receiveShadow>
      <boxGeometry args={[2.5, 0.5, 0.1]} />
      <meshStandardMaterial color="#A0782C" roughness={0.8} metalness={0.1} />
    </mesh>
    {/* Left wall */}
    <mesh position={[-1.2, 1.0, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.1, 1.2, 2.5]} />
      <meshStandardMaterial color="#96701E" roughness={0.8} metalness={0.1} />
    </mesh>
    {/* Right wall */}
    <mesh position={[1.2, 1.0, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.1, 1.2, 2.5]} />
      <meshStandardMaterial color="#96701E" roughness={0.8} metalness={0.1} />
    </mesh>
    {/* Label (3D Text) */}
    <Text
      position={[0, 2.2, 0]}
      fontSize={0.4}
      color="#fbbf24"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.015}
      outlineColor="#000000"
    >
      SHIPMENT
    </Text>
  </group>
);

const SceneLogic = ({
  stationRefs,
  activeStatesRef,
  stationStages,
}: {
  stationRefs: React.MutableRefObject<(THREE.Group | null)[]>;
  activeStatesRef: React.MutableRefObject<boolean[]>;
  stationStages: number[];
}) => {
  const stations = useFactoryStore((state) => state.stations);
  const partPositionsRef = useFactoryStore((state) => state.partPositionsRef);

  useFrame(() => {
    if (!partPositionsRef.current || !stationRefs.current) return;

    // Single pass over stations
    stationStages.forEach((stage, idx) => {
      const group = stationRefs.current[idx];
      if (!group || !stations[idx]) return;

      const isPhysicalActive = partPositionsRef.current.some(
        (t) => Math.abs(t - stage) < LIGHT_TOLERANCE,
      );

      if (isPhysicalActive !== activeStatesRef.current[idx]) {
        activeStatesRef.current[idx] = isPhysicalActive;

        const body = group.getObjectByName("body") as THREE.Mesh;
        const light = group.getObjectByName("light") as THREE.Mesh;

        if (body && light) {
          const bodyMat = body.material as THREE.MeshStandardMaterial;
          const lightMat = light.material as THREE.MeshBasicMaterial;
          const color = stations[idx].color;

          if (isPhysicalActive) {
            bodyMat.color.set(color);
            bodyMat.emissive.set(color);
            bodyMat.emissiveIntensity = 0.8;
            lightMat.color.set("#00ff88");
          } else {
            bodyMat.color.set("#0a0a0a");
            bodyMat.emissive.set("#000000");
            bodyMat.emissiveIntensity = 0;
            lightMat.color.set("#330000");
          }
        }
      }
    });
  });

  return null;
};

// System Timer driver — must be inside Canvas tree
const SystemTimerDriver = () => {
  useSystemTimer();
  return null;
};

export const Scene = () => {
  const stations = useFactoryStore((state) => state.stations);
  const resetVersion = useFactoryStore((state) => state.resetVersion);

  // Central Station Ref Management
  const stationRefs = useRef<(THREE.Group | null)[]>(new Array(7).fill(null));
  const activeStatesRef = useRef<boolean[]>(new Array(7).fill(false));

  return (
    <Canvas shadows className="w-full h-full bg-black">
      <Suspense fallback={null}>
        <SystemTimerDriver />
        <SceneLogic
          stationRefs={stationRefs}
          activeStatesRef={activeStatesRef}
          stationStages={STATION_STAGES}
        />
        <PerspectiveCamera makeDefault position={[25, 17.3, 21]} fov={40} />
        <OrbitControls
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={20}
          maxDistance={50}
          enableDamping
          dampingFactor={0.05}
        />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <spotLight
          position={[10, 20, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Environment preset="city" />

        {/* Floor */}
        <Grid
          infiniteGrid
          followCamera
          position={[0, -0.01, 0]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#202020"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#00ff88"
          fadeDistance={30}
          fadeStrength={1}
        />

        {/* Stations */}
        {stations.map((station, index) => (
          <group key={station.id}>
            <Station
              index={index}
              position={[(index - 3) * 4, 0, 0]}
              label={station.name.en}
              stationRefs={stationRefs}
            />
          </group>
        ))}

        {/* Relocated Trash Bin: Behind conveyor, between Sorting and Packaging */}
        <TrashBin position={[10, 0, -2.5]} />

        {/* Conveyor Belt System */}
        <ConveyorBelt key={resetVersion} />

        {/* Shipment Box at end of line */}
        <ShipmentBox position={[16, 0, 0]} />

        {/* 3D Status Table */}
        <ProductionTable3D />
      </Suspense>
    </Canvas>
  );
};
