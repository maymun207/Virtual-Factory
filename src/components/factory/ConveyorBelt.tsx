import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useFactoryStore } from "../../store/factoryStore";
import { computeBaseVelocity } from "../../system-timer/useSystemTimer";
import {
  SLAT_COUNT,
  SPAWN_T,
  SORT_THRESHOLD,
  COLLECT_THRESHOLD,
  END_OF_LINE_T,
  DEFECT_PROBABILITY,
} from "../../lib/constants";

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
    if (!meshRef.current || !data) return;

    if (data.isSorted) {
      // Throw animation logic (defective → trash)
      const targetPos = new THREE.Vector3(10, -0.2, -2.5);
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
        <boxGeometry args={[1.035, 0.071875, 1.035]} />
        <meshStandardMaterial
          color={data.isDefected ? "#f9a8d4" : "#e5e7eb"}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      <Text
        position={[0, 0.04, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {data.id}
      </Text>
    </group>
  );
}

function PartSpawner({
  curve,
  status,
}: {
  curve: THREE.CatmullRomCurve3;
  status: string;
}) {
  const pClockCount = useFactoryStore((state) => state.pClockCount);
  const sClockPeriod = useFactoryStore((state) => state.sClockPeriod);
  const stationInterval = useFactoryStore((state) => state.stationInterval);

  const [partIds, setPartIds] = useState<number[]>([]);
  const partsRef = useRef<Map<number, PartData>>(new Map());
  const { conveyorSpeed, incrementWasteCount, incrementShipmentCount } =
    useFactoryStore();

  // Single source of truth for velocity
  const visualVelocity = useMemo(
    () => computeBaseVelocity(sClockPeriod, stationInterval) * conveyorSpeed,
    [sClockPeriod, stationInterval, conveyorSpeed],
  );

  // Interlocked Spawning Logic
  useEffect(() => {
    if (status !== "running" || pClockCount === 0) return;

    const id = pClockCount; // Use pClockCount as ID for visual/logic sync
    const newPart: PartData = {
      id,
      t: SPAWN_T,
      isDefected: Math.random() < DEFECT_PROBABILITY,
      isSorted: false,
      sortProgress: 0,
      isCollected: false,
      collectProgress: 0,
      originalPos: new THREE.Vector3(),
      scale: 0,
    };
    partsRef.current.set(id, newPart);
    setPartIds((prev) => [...prev, id]);
  }, [pClockCount, status]);

  useFrame((_, delta) => {
    if (status !== "running") return;

    // 2. Movement logic (Imperative)
    const idsToRemove: number[] = [];
    partsRef.current.forEach((p, id) => {
      if (p.isSorted) {
        p.sortProgress = Math.min(
          1,
          p.sortProgress + delta * visualVelocity * 10,
        );
        if (p.sortProgress >= 1) {
          idsToRemove.push(id);
        }
      } else if (p.isCollected) {
        p.collectProgress = Math.min(
          1,
          p.collectProgress + delta * visualVelocity * 12,
        );
        if (p.collectProgress >= 1) {
          idsToRemove.push(id);
        }
      } else {
        p.t += delta * visualVelocity;
        p.scale = Math.min(1, p.scale + delta * 2);

        if (p.isDefected && p.t >= SORT_THRESHOLD && !p.isSorted) {
          p.isSorted = true;
          p.originalPos.copy(curve.getPointAt(p.t));
          incrementWasteCount();
        }

        if (!p.isDefected && p.t >= COLLECT_THRESHOLD && !p.isCollected) {
          p.isCollected = true;
          p.originalPos.copy(curve.getPointAt(Math.min(p.t, 0.49)));
          incrementShipmentCount();
        }

        if (p.t >= END_OF_LINE_T && !p.isSorted && !p.isCollected) {
          idsToRemove.push(id);
        }
      }
    });

    // 3. Removal logic
    if (idsToRemove.length > 0) {
      idsToRemove.forEach((id) => partsRef.current.delete(id));
      setPartIds((prev) => prev.filter((id) => partsRef.current.has(id)));
    }

    // 4. Physical telemetry update for store matrix snapshots
    const positions: number[] = [];
    const ids: number[] = [];
    partsRef.current.forEach((p) => {
      if (!p.isSorted) {
        positions.push(p.t);
        ids.push(p.id);
      }
    });
    useFactoryStore.getState().partPositionsRef.current = positions;
    useFactoryStore.getState().partIdsRef.current = ids;
  });

  return (
    <group>
      {partIds.map((id) => {
        const data = partsRef.current.get(id);
        if (!data) return null;
        return <Part key={id} data={data} curve={curve} />;
      })}
    </group>
  );
}

export const ConveyorBelt = () => {
  const { sClockPeriod, stationInterval, conveyorSpeed, conveyorStatus } =
    useFactoryStore();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Visual Slat Speed — uses the same formula as tile movement
  const visualVelocity = useMemo(
    () => computeBaseVelocity(sClockPeriod, stationInterval) * conveyorSpeed,
    [sClockPeriod, stationInterval, conveyorSpeed],
  );

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
        // Use the gearRatio directly for perfectly synced visual velocity
        offsets.current[i] = (offsets.current[i] + delta * visualVelocity) % 1;
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

      <PartSpawner curve={curve} status={conveyorStatus} />
    </group>
  );
};
