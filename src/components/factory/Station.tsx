/**
 * Station — Individual factory station 3D component.
 */
import { useRef, useEffect } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import {
  COLORS,
  MATERIALS,
  STATION_BASE_SIZE,
  STATION_BASE_Y,
  STATION_BODY_SIZE,
  STATION_BODY_Y,
  STATION_LIGHT_RADIUS,
  STATION_LIGHT_SEGMENTS,
  STATION_LIGHT_Y,
  STATION_LABEL_Y,
  TEXT_SIZES,
} from "../../lib/params";

interface StationProps {
  position: [number, number, number];
  label: string;
  index: number;
  stationRefs: React.MutableRefObject<(THREE.Group | null)[]>;
}

export const Station = ({
  position,
  label,
  index,
  stationRefs,
}: StationProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    stationRefs.current[index] = groupRef.current;
  }, [index, stationRefs]);

  return (
    <group position={position} ref={groupRef}>
      {/* Base */}
      <mesh position={[0, STATION_BASE_Y, 0]} castShadow receiveShadow>
        <boxGeometry args={STATION_BASE_SIZE} />
        <meshStandardMaterial
          color={COLORS.stationBase}
          roughness={MATERIALS.stationBase.roughness}
          metalness={MATERIALS.stationBase.metalness}
        />
      </mesh>

      {/* Reactive Body */}
      <mesh
        position={[0, STATION_BODY_Y, 0]}
        name="body"
        castShadow
        receiveShadow
      >
        <boxGeometry args={STATION_BODY_SIZE} />
        <meshStandardMaterial
          color={COLORS.stationBodyInactive}
          emissive={COLORS.stationBodyEmissiveOff}
          emissiveIntensity={MATERIALS.stationBody.emissiveIntensity}
          roughness={MATERIALS.stationBody.roughness}
          metalness={MATERIALS.stationBody.metalness}
          transparent
          opacity={MATERIALS.stationBody.opacity}
        />
      </mesh>

      {/* Status Light */}
      <mesh position={[0, STATION_LIGHT_Y, 0]} name="light">
        <sphereGeometry
          args={[
            STATION_LIGHT_RADIUS,
            STATION_LIGHT_SEGMENTS,
            STATION_LIGHT_SEGMENTS,
          ]}
        />
        <meshBasicMaterial color={COLORS.lightOff} />
      </mesh>

      {/* Station Label */}
      <Text
        position={[0, STATION_LABEL_Y, 0]}
        fontSize={TEXT_SIZES.stationLabel}
        color={COLORS.textWhite}
        anchorX="center"
        anchorY="middle"
        outlineWidth={TEXT_SIZES.stationLabelOutline}
        outlineColor={COLORS.textOutline}
      >
        {label}
      </Text>
    </group>
  );
};
