import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useFactoryStore } from "../../store/factoryStore";

const SLAT_COUNT = 100;

interface PartData {
  id: number;
  t: number;
  isDefected: boolean;
  isSorted: boolean;
  sortProgress: number;
  isCollected: boolean;
  collectProgress: number;
  originalPos: THREE.Vector3;
  scale: number;
}

function Part({
  data,
  curve,
}: {
  data: PartData;
  curve: THREE.CatmullRomCurve3;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!meshRef.current) return;

    if (data.isSorted) {
      // Throw animation logic (defective → trash)
      const targetPos = new THREE.Vector3(8, -0.2, 2.5);
      const currentPos = new THREE.Vector3().lerpVectors(
        data.originalPos,
        targetPos,
        data.sortProgress,
      );
      const arc = Math.sin(data.sortProgress * Math.PI) * 1.5;
      meshRef.current.position.copy(currentPos);
      meshRef.current.position.y += arc;
      meshRef.current.rotateX(0.1);

      if (data.sortProgress > 0.8) {
        const s = 1 - (data.sortProgress - 0.8) * 5;
        meshRef.current.scale.set(s, s, s);
      }
    } else if (data.isCollected) {
      // Drop animation (good tiles → shipment box)
      const targetPos = new THREE.Vector3(16, 0.5, 0);
      const currentPos = new THREE.Vector3().lerpVectors(
        data.originalPos,
        targetPos,
        data.collectProgress,
      );
      const arc = Math.sin(data.collectProgress * Math.PI) * 0.8;
      meshRef.current.position.copy(currentPos);
      meshRef.current.position.y += arc;

      if (data.collectProgress > 0.7) {
        const s = 1 - (data.collectProgress - 0.7) * 3.33;
        meshRef.current.scale.set(
          Math.max(0, s),
          Math.max(0, s),
          Math.max(0, s),
        );
      }
    } else {
      const point = curve.getPointAt(data.t);
      const tangent = curve.getTangentAt(data.t);
      meshRef.current.position.copy(point);
      meshRef.current.position.y += 0.07;
      const lookAtPos = point.clone().add(tangent);
      meshRef.current.lookAt(lookAtPos);
      meshRef.current.scale.set(data.scale, data.scale, data.scale);
    }
  });

  return (
    <group ref={meshRef}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.0625, 0.9]} />
        <meshStandardMaterial
          color={data.isDefected ? "#f9a8d4" : "#e5e7eb"}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      <Html
        position={[0, 0.08, 0]}
        center
        distanceFactor={10}
        style={{
          color: "black",
          fontSize: "32px",
          fontWeight: "black",
          pointerEvents: "none",
        }}
      >
        {data.id}
      </Html>
    </group>
  );
}

function PartSpawner({
  curve,
  speed,
  status,
}: {
  curve: THREE.CatmullRomCurve3;
  speed: number;
  status: string;
}) {
  const [parts, setParts] = useState<PartData[]>([]);
  const lastSpawnTime = useRef(0);
  const partCounter = useRef(1);

  const SPAWN_T = 0.0625;

  useFrame(({ clock }, delta) => {
    if (status !== "running") return;

    const time = clock.elapsedTime;
    const spawnInterval = (1.0 - ((speed - 0.3) / 1.7) * 0.5) / 0.77;

    // Spawning logic
    if (time - lastSpawnTime.current > spawnInterval) {
      const newPart: PartData = {
        id: partCounter.current++,
        t: SPAWN_T,
        isDefected: Math.random() < 0.05,
        isSorted: false,
        sortProgress: 0,
        isCollected: false,
        collectProgress: 0,
        originalPos: new THREE.Vector3(),
        scale: 0,
      };
      setParts((prev) => [...prev, newPart]);
      lastSpawnTime.current = time;
    }

    // Movement & Animation logic
    setParts((prev) => {
      const nextParts = prev
        .map((p) => {
          if (p.isSorted) {
            const newSortProgress = Math.min(
              1,
              p.sortProgress + delta * speed * 0.5,
            );
            return { ...p, sortProgress: newSortProgress };
          }

          if (p.isCollected) {
            const newCollectProgress = Math.min(
              1,
              p.collectProgress + delta * speed * 0.6,
            );
            return { ...p, collectProgress: newCollectProgress };
          }

          const newT = p.t + delta * speed * 0.05;
          const newScale = Math.min(1, p.scale + delta * 2);

          // Sorting check (at sorting station t=0.375)
          if (p.isDefected && newT >= 0.385 && !p.isSorted) {
            const point = curve.getPointAt(p.t);
            return {
              ...p,
              isSorted: true,
              originalPos: point.clone(),
              t: newT,
              scale: newScale,
            };
          }

          // Collection check (after packaging, at end of line)
          if (!p.isDefected && newT >= 0.47 && !p.isCollected) {
            const point = curve.getPointAt(Math.min(p.t, 0.49));
            return {
              ...p,
              isCollected: true,
              originalPos: point.clone(),
              t: newT,
              scale: newScale,
            };
          }

          return { ...p, t: newT, scale: newScale };
        })
        .filter((p) => {
          if (p.isSorted) return p.sortProgress < 1;
          if (p.isCollected) return p.collectProgress < 1;
          return p.t < 0.5;
        });

      // Update physical ref for high-speed proximity checks (non-rendering store update)
      useFactoryStore.getState().partPositionsRef.current = nextParts
        .filter((p) => !p.isSorted)
        .map((p) => p.t);

      return nextParts;
    });
  });

  return (
    <group>
      {parts.map((part) => (
        <Part key={part.id} data={part} curve={curve} />
      ))}
    </group>
  );
}

export const ConveyorBelt = () => {
  const { conveyorSpeed, conveyorStatus } = useFactoryStore();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(-16, 0.1, 0),
      new THREE.Vector3(16, 0.1, 0),
      new THREE.Vector3(16, -1, 0),
      new THREE.Vector3(-16, -1, 0),
    ];
    return new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.1);
  }, []);

  const offsets = useRef(
    Float32Array.from({ length: SLAT_COUNT }, (_, i) => i / SLAT_COUNT),
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (conveyorStatus === "running") {
      for (let i = 0; i < SLAT_COUNT; i++) {
        offsets.current[i] =
          (offsets.current[i] + delta * conveyorSpeed * 0.05) % 1;
      }
    }

    for (let i = 0; i < SLAT_COUNT; i++) {
      const t = offsets.current[i];
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      dummy.position.copy(point);
      dummy.lookAt(point.clone().add(tangent));
      dummy.rotateY(Math.PI / 2);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, SLAT_COUNT]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.3, 0.05, 2]} />
        <meshStandardMaterial
          color={conveyorStatus === "jammed" ? "#ff4444" : "#222"}
          metalness={0.6}
          roughness={0.4}
        />
      </instancedMesh>

      <PartSpawner
        curve={curve}
        speed={conveyorSpeed}
        status={conveyorStatus}
      />
    </group>
  );
};
