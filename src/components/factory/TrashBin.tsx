/**
 * TrashBin — Waste bin 3D component with counter and fluorescent visuals.
 */
import { Text } from "@react-three/drei";
import { useSimulationStore } from "../../store/simulationStore";
import {
  COLORS,
  MATERIALS,
  TEXT_SIZES,
  TRASH_BIN_SIZE,
  TRASH_BIN_INSIDE_SIZE,
  TRASH_BIN_INSIDE_Y,
  TRASH_BIN_COUNTER_Y,
  TRASH_BIN_RIM_Y,
  TRASH_BIN_RIM_THICKNESS,
  TRASH_BIN_RIM_OFFSET,
  TRASH_BIN_STRIP_OFFSET_Y,
  TRASH_BIN_STRIP_OFFSET_Z,
  TRASH_BIN_STRIP_THICKNESS,
  TRASH_BIN_STRIP_DEPTH,
  TRASH_BIN_STRIP_LENGTH,
  TRASH_BIN_LABEL_Y,
  TRASH_BIN_LABEL_Z,
  LABEL_WASTE_BIN,
} from "../../lib/params";

export const TrashBin = ({
  position,
}: {
  position: [number, number, number];
}) => {
  const wasteCount = useSimulationStore((s) => s.wasteCount);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={TRASH_BIN_SIZE} />
        <meshStandardMaterial
          color={COLORS.trashBin}
          metalness={MATERIALS.trashBin.metalness}
          roughness={MATERIALS.trashBin.roughness}
        />
        {/* Open top effect */}
        <mesh position={[0, TRASH_BIN_INSIDE_Y, 0]}>
          <boxGeometry args={TRASH_BIN_INSIDE_SIZE} />
          <meshStandardMaterial color={COLORS.trashBinInside} />
        </mesh>
      </mesh>

      {/* Counter above bin */}
      <Text
        position={[0, TRASH_BIN_COUNTER_Y, 0]}
        fontSize={TEXT_SIZES.counter}
        color={COLORS.trashBinCounter}
        anchorX="center"
        anchorY="middle"
        outlineWidth={TEXT_SIZES.counterOutline}
        outlineColor={COLORS.textOutline}
      >
        {wasteCount}
      </Text>

      {/* Fluorescent Rim */}
      <group position={[0, TRASH_BIN_RIM_Y, 0]}>
        {/* Top rim - 4 sides */}
        {[
          {
            pos: [0, 0.01, TRASH_BIN_RIM_OFFSET] as [number, number, number],
            args: [
              TRASH_BIN_SIZE[0],
              TRASH_BIN_RIM_THICKNESS,
              TRASH_BIN_RIM_THICKNESS,
            ] as [number, number, number],
          },
          {
            pos: [0, 0.01, -TRASH_BIN_RIM_OFFSET] as [number, number, number],
            args: [
              TRASH_BIN_SIZE[0],
              TRASH_BIN_RIM_THICKNESS,
              TRASH_BIN_RIM_THICKNESS,
            ] as [number, number, number],
          },
          {
            pos: [TRASH_BIN_RIM_OFFSET, 0.01, 0] as [number, number, number],
            args: [
              TRASH_BIN_RIM_THICKNESS,
              TRASH_BIN_RIM_THICKNESS,
              TRASH_BIN_SIZE[0],
            ] as [number, number, number],
          },
          {
            pos: [-TRASH_BIN_RIM_OFFSET, 0.01, 0] as [number, number, number],
            args: [
              TRASH_BIN_RIM_THICKNESS,
              TRASH_BIN_RIM_THICKNESS,
              TRASH_BIN_SIZE[0],
            ] as [number, number, number],
          },
        ].map((rim, i) => (
          <mesh key={`rim-${i}`} position={rim.pos}>
            <boxGeometry args={rim.args} />
            <meshStandardMaterial
              color={COLORS.trashBinGlow}
              emissive={COLORS.trashBinGlow}
              emissiveIntensity={MATERIALS.trashBinGlow.emissiveIntensity}
            />
          </mesh>
        ))}

        {/* Secondary wrapping strip */}
        <group position={[0, TRASH_BIN_STRIP_OFFSET_Y, 0]}>
          {[
            {
              pos: [0, 0, TRASH_BIN_STRIP_OFFSET_Z] as [number, number, number],
              args: [
                TRASH_BIN_STRIP_LENGTH,
                TRASH_BIN_STRIP_THICKNESS,
                TRASH_BIN_STRIP_DEPTH,
              ] as [number, number, number],
            },
            {
              pos: [0, 0, -TRASH_BIN_STRIP_OFFSET_Z] as [
                number,
                number,
                number,
              ],
              args: [
                TRASH_BIN_STRIP_LENGTH,
                TRASH_BIN_STRIP_THICKNESS,
                TRASH_BIN_STRIP_DEPTH,
              ] as [number, number, number],
            },
            {
              pos: [TRASH_BIN_STRIP_OFFSET_Z, 0, 0] as [number, number, number],
              args: [
                TRASH_BIN_STRIP_DEPTH,
                TRASH_BIN_STRIP_THICKNESS,
                TRASH_BIN_STRIP_LENGTH,
              ] as [number, number, number],
            },
            {
              pos: [-TRASH_BIN_STRIP_OFFSET_Z, 0, 0] as [
                number,
                number,
                number,
              ],
              args: [
                TRASH_BIN_STRIP_DEPTH,
                TRASH_BIN_STRIP_THICKNESS,
                TRASH_BIN_STRIP_LENGTH,
              ] as [number, number, number],
            },
          ].map((strip, i) => (
            <mesh key={`strip-${i}`} position={strip.pos}>
              <boxGeometry args={strip.args} />
              <meshStandardMaterial
                color={COLORS.trashBinGlow}
                emissive={COLORS.trashBinGlow}
                emissiveIntensity={MATERIALS.trashBinStrip.emissiveIntensity}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Label on body */}
      <Text
        position={[0, TRASH_BIN_LABEL_Y, TRASH_BIN_LABEL_Z]}
        fontSize={TEXT_SIZES.trashBinLabel}
        color={COLORS.textWhite}
        anchorX="center"
        anchorY="middle"
        outlineWidth={TEXT_SIZES.trashBinLabelOutline}
        outlineColor={COLORS.textOutline}
      >
        {LABEL_WASTE_BIN}
      </Text>
    </group>
  );
};
