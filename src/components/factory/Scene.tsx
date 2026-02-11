import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Grid,
  Html,
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

      {/* Station Label */}
      <Html
        position={[0, 4, 0]}
        center
        distanceFactor={10}
        style={{
          color: "white",
          fontSize: "30px",
          fontWeight: "black",
          whiteSpace: "nowrap",
          textShadow: "0 0 10px rgba(0,0,0,0.9)",
          pointerEvents: "none",
        }}
      >
        {label}
      </Html>
    </group>
  );
};

const TrashBin = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh castShadow receiveShadow>
      <boxGeometry args={[2, 1.5, 2]} />
      <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
      {/* Open top effect */}
      <mesh position={[0, 0.76, 0]}>
        <boxGeometry args={[1.8, 0.01, 1.8]} />
        <meshStandardMaterial color="#000" />
      </mesh>
    </mesh>
    <Html
      position={[0, 1.2, 0]}
      center
      distanceFactor={10}
      style={{
        color: "#f9a8d4",
        fontSize: "20px",
        fontWeight: "bold",
        whiteSpace: "nowrap",
        textShadow: "0 0 10px rgba(0,0,0,0.9)",
        pointerEvents: "none",
      }}
    >
      REJECTS
    </Html>
  </group>
);

export const Scene = () => {
  const stations = useFactoryStore((state) => state.stations);

  return (
    <Canvas shadows className="w-full h-full bg-black">
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[20, 15, 20]} fov={40} />
        <OrbitControls
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
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
            {station.id === "sorting" && (
              <TrashBin position={[(index - 3) * 4, 0, 2.5]} />
            )}
          </group>
        ))}

        {/* Conveyor Belt System */}
        <ConveyorBelt />
      </Suspense>
    </Canvas>
  );
};
