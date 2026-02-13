import { Suspense, useRef } from "react";
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

// Physical Highlighting Logic for Station
const StationBody = ({ index, color }: { index: number; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.Mesh>(null);
  const partPositionsRef = useFactoryStore((state) => state.partPositionsRef);

  // Mapping of station indices to their curve progress positions (t)
  const stationStages = [0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375];

  // Track state in a ref for frame-to-frame stability
  const activeRef = useRef(false);

  useFrame(() => {
    if (!partPositionsRef.current || !meshRef.current || !lightRef.current)
      return;

    // Proximity check (Tight threshold for better visual sync)
    const isPhysicalActive = partPositionsRef.current.some(
      (t) => Math.abs(t - stationStages[index]) < 0.018,
    );

    // Only update if state changed to save performance
    if (isPhysicalActive !== activeRef.current) {
      activeRef.current = isPhysicalActive;

      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      const lightMat = lightRef.current.material as THREE.MeshBasicMaterial;

      if (isPhysicalActive) {
        mat.color.set(color);
        mat.emissive.set(color);
        mat.emissiveIntensity = 0.8;
        lightMat.color.set("#00ff88");
      } else {
        mat.color.set("#0a0a0a");
        mat.emissive.set("#000000");
        mat.emissiveIntensity = 0;
        lightMat.color.set("#330000");
      }
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={[0, 1.5, 0]} castShadow receiveShadow>
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

      <mesh ref={lightRef} position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#330000" />
      </mesh>
    </>
  );
};

// Simple Station Component
const Station = ({
  position,
  color,
  label,
  index,
  renderDefault = true,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  index: number;
  renderDefault?: boolean;
}) => {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#333" roughness={0.5} metalness={0.8} />
      </mesh>

      {/* Reactive Body & Status Light */}
      {renderDefault && <StationBody index={index} color={color} />}

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

export const Scene = () => {
  const stations = useFactoryStore((state) => state.stations);
  const resetVersion = useFactoryStore((state) => state.resetVersion);

  return (
    <Canvas shadows className="w-full h-full bg-black">
      <Suspense fallback={null}>
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
              color={station.color}
              label={station.name.en}
            />
          </group>
        ))}

        {/* Relocated Trash Bin: Behind conveyor, between Sorting and Packaging */}
        <TrashBin position={[10, 0, -2.5]} />

        {/* Conveyor Belt System */}
        <ConveyorBelt key={resetVersion} />

        {/* Shipment Box at end of line */}
        <ShipmentBox position={[16, 0, 0]} />
      </Suspense>
    </Canvas>
  );
};
