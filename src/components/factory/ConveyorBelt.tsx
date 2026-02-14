/**
 * ConveyorBelt — Conveyor belt system with slats and part spawning.
 * Performance: Pre-allocated scratch vectors, granular store selectors.
 */
import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useSimulationStore } from "../../store/simulationStore";
import {
  computeBaseVelocity,
  SLAT_COUNT,
  SPAWN_T,
  SORT_THRESHOLD,
  COLLECT_THRESHOLD,
  END_OF_LINE_T,
  DEFECT_PROBABILITY,
  CONVEYOR_CURVE_POINTS,
  CONVEYOR_CURVE_TENSION,
  SLAT_GEOMETRY,
  TILE_GEOMETRY,
  TILE_Y_OFFSET,
  COLORS,
  MATERIALS,
  TEXT_SIZES,
  SORT_ANIMATION_SPEED,
  COLLECT_ANIMATION_SPEED,
  SORT_ARC_HEIGHT,
  COLLECT_ARC_HEIGHT,
  TILE_SCALE_SPEED,
  SORT_FADE_THRESHOLD,
  SORT_FADE_RATE,
  COLLECT_FADE_THRESHOLD,
  COLLECT_FADE_RATE,
  COLLECT_TARGET_Y,
  SORT_TARGET_Y,
  TRASH_BIN_POSITION,
  SHIPMENT_BOX_POSITION,
} from "../../lib/params";

// ── Pre-allocated scratch vectors (avoid GC in useFrame) ──
const _targetPos = new THREE.Vector3();
const _currentPos = new THREE.Vector3();
const _lookAtPos = new THREE.Vector3();
const _sortTarget = new THREE.Vector3(
  TRASH_BIN_POSITION[0],
  SORT_TARGET_Y,
  TRASH_BIN_POSITION[2],
);
const _collectTarget = new THREE.Vector3(
  SHIPMENT_BOX_POSITION[0],
  COLLECT_TARGET_Y,
  SHIPMENT_BOX_POSITION[2],
);

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
      _targetPos.copy(_sortTarget);
      _currentPos.lerpVectors(data.originalPos, _targetPos, data.sortProgress);
      const arc = Math.sin(data.sortProgress * Math.PI) * SORT_ARC_HEIGHT;
      meshRef.current.position.copy(_currentPos);
      meshRef.current.position.y += arc;
      meshRef.current.rotateX(0.1);

      if (data.sortProgress > SORT_FADE_THRESHOLD) {
        const s =
          1 - (data.sortProgress - SORT_FADE_THRESHOLD) * SORT_FADE_RATE;
        meshRef.current.scale.set(s, s, s);
      }
    } else if (data.isCollected) {
      _targetPos.copy(_collectTarget);
      _currentPos.lerpVectors(
        data.originalPos,
        _targetPos,
        data.collectProgress,
      );
      const arc = Math.sin(data.collectProgress * Math.PI) * COLLECT_ARC_HEIGHT;
      meshRef.current.position.copy(_currentPos);
      meshRef.current.position.y += arc;

      if (data.collectProgress > COLLECT_FADE_THRESHOLD) {
        const s =
          1 -
          (data.collectProgress - COLLECT_FADE_THRESHOLD) * COLLECT_FADE_RATE;
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
      meshRef.current.position.y += TILE_Y_OFFSET;
      _lookAtPos.copy(point).add(tangent);
      meshRef.current.lookAt(_lookAtPos);
      meshRef.current.scale.set(data.scale, data.scale, data.scale);
    }
  });

  return (
    <group ref={meshRef}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={TILE_GEOMETRY} />
        <meshStandardMaterial
          color={data.isDefected ? COLORS.tileDefected : COLORS.tileNormal}
          roughness={MATERIALS.tile.roughness}
          metalness={MATERIALS.tile.metalness}
        />
      </mesh>
      <Text
        position={[0, TEXT_SIZES.tileIdYOffset, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={TEXT_SIZES.tileId}
        color={COLORS.tileLabel}
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
  const pClockCount = useSimulationStore((s) => s.pClockCount);
  const sClockPeriod = useSimulationStore((s) => s.sClockPeriod);
  const stationInterval = useSimulationStore((s) => s.stationInterval);
  const conveyorSpeed = useSimulationStore((s) => s.conveyorSpeed);
  const incrementWasteCount = useSimulationStore((s) => s.incrementWasteCount);
  const incrementShipmentCount = useSimulationStore(
    (s) => s.incrementShipmentCount,
  );

  const [partIds, setPartIds] = useState<number[]>([]);
  const partsRef = useRef<Map<number, PartData>>(new Map());

  // Single source of truth for velocity
  const visualVelocity = useMemo(
    () => computeBaseVelocity(sClockPeriod, stationInterval) * conveyorSpeed,
    [sClockPeriod, stationInterval, conveyorSpeed],
  );

  // Interlocked Spawning Logic
  useEffect(() => {
    if (status !== "running" || pClockCount === 0) return;

    const id = pClockCount;
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

    const idsToRemove: number[] = [];
    partsRef.current.forEach((p, id) => {
      if (p.isSorted) {
        p.sortProgress = Math.min(
          1,
          p.sortProgress + delta * visualVelocity * SORT_ANIMATION_SPEED,
        );
        if (p.sortProgress >= 1) idsToRemove.push(id);
      } else if (p.isCollected) {
        p.collectProgress = Math.min(
          1,
          p.collectProgress + delta * visualVelocity * COLLECT_ANIMATION_SPEED,
        );
        if (p.collectProgress >= 1) idsToRemove.push(id);
      } else {
        p.t += delta * visualVelocity;
        p.scale = Math.min(1, p.scale + delta * TILE_SCALE_SPEED);

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

    if (idsToRemove.length > 0) {
      idsToRemove.forEach((id) => partsRef.current.delete(id));
      setPartIds((prev) => prev.filter((id) => partsRef.current.has(id)));
    }

    // Physical telemetry update for store matrix snapshots
    const positions: number[] = [];
    const ids: number[] = [];
    partsRef.current.forEach((p) => {
      if (!p.isSorted) {
        positions.push(p.t);
        ids.push(p.id);
      }
    });
    useSimulationStore.getState().partPositionsRef.current = positions;
    useSimulationStore.getState().partIdsRef.current = ids;
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
  const sClockPeriod = useSimulationStore((s) => s.sClockPeriod);
  const stationInterval = useSimulationStore((s) => s.stationInterval);
  const conveyorSpeed = useSimulationStore((s) => s.conveyorSpeed);
  const conveyorStatus = useSimulationStore((s) => s.conveyorStatus);

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const visualVelocity = useMemo(
    () => computeBaseVelocity(sClockPeriod, stationInterval) * conveyorSpeed,
    [sClockPeriod, stationInterval, conveyorSpeed],
  );

  const curve = useMemo(() => {
    const points = CONVEYOR_CURVE_POINTS.map(
      (p) => new THREE.Vector3(p[0], p[1], p[2]),
    );
    return new THREE.CatmullRomCurve3(
      points,
      true,
      "catmullrom",
      CONVEYOR_CURVE_TENSION,
    );
  }, []);

  const offsets = useRef(
    Float32Array.from({ length: SLAT_COUNT }, (_, i) => i / SLAT_COUNT),
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    if (conveyorStatus === "running") {
      for (let i = 0; i < SLAT_COUNT; i++) {
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
        <boxGeometry args={SLAT_GEOMETRY} />
        <meshStandardMaterial
          color={
            conveyorStatus === "jammed"
              ? COLORS.conveyorJammed
              : COLORS.conveyorSlat
          }
          metalness={MATERIALS.conveyorSlat.metalness}
          roughness={MATERIALS.conveyorSlat.roughness}
        />
      </instancedMesh>

      <PartSpawner curve={curve} status={conveyorStatus} />
    </group>
  );
};
