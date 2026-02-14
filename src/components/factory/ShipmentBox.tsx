/**
 * ShipmentBox — End-of-line shipment box 3D component with counter.
 */
import { Text } from "@react-three/drei";
import { useSimulationStore } from "../../store/simulationStore";
import {
  COLORS,
  MATERIALS,
  TEXT_SIZES,
  SHIPMENT_BOX_BASE,
  SHIPMENT_BOX_BASE_Y,
  SHIPMENT_BOX_BACK_WALL,
  SHIPMENT_BOX_BACK_Y,
  SHIPMENT_BOX_BACK_Z,
  SHIPMENT_BOX_FRONT_WALL,
  SHIPMENT_BOX_FRONT_Y,
  SHIPMENT_BOX_FRONT_Z,
  SHIPMENT_BOX_SIDE_WALL,
  SHIPMENT_BOX_SIDE_Y,
  SHIPMENT_BOX_SIDE_X,
  SHIPMENT_BOX_COUNTER_Y,
  SHIPMENT_BOX_LABEL_Y,
  LABEL_SHIPMENT,
} from "../../lib/params";

export const ShipmentBox = ({
  position,
}: {
  position: [number, number, number];
}) => {
  const shipmentCount = useSimulationStore((s) => s.shipmentCount);

  return (
    <group position={position}>
      {/* Box base */}
      <mesh position={[0, SHIPMENT_BOX_BASE_Y, 0]} castShadow receiveShadow>
        <boxGeometry args={SHIPMENT_BOX_BASE} />
        <meshStandardMaterial
          color={COLORS.shipmentBoxBase}
          roughness={MATERIALS.shipmentBox.roughness}
          metalness={MATERIALS.shipmentBox.metalness}
        />
      </mesh>
      {/* Back wall */}
      <mesh
        position={[0, SHIPMENT_BOX_BACK_Y, SHIPMENT_BOX_BACK_Z]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={SHIPMENT_BOX_BACK_WALL} />
        <meshStandardMaterial
          color={COLORS.shipmentBoxBack}
          roughness={MATERIALS.shipmentBox.roughness}
          metalness={MATERIALS.shipmentBox.metalness}
        />
      </mesh>
      {/* Front wall */}
      <mesh
        position={[0, SHIPMENT_BOX_FRONT_Y, SHIPMENT_BOX_FRONT_Z]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={SHIPMENT_BOX_FRONT_WALL} />
        <meshStandardMaterial
          color={COLORS.shipmentBoxFront}
          roughness={MATERIALS.shipmentBox.roughness}
          metalness={MATERIALS.shipmentBox.metalness}
        />
      </mesh>
      {/* Left wall */}
      <mesh
        position={[-SHIPMENT_BOX_SIDE_X, SHIPMENT_BOX_SIDE_Y, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={SHIPMENT_BOX_SIDE_WALL} />
        <meshStandardMaterial
          color={COLORS.shipmentBoxSide}
          roughness={MATERIALS.shipmentBox.roughness}
          metalness={MATERIALS.shipmentBox.metalness}
        />
      </mesh>
      {/* Right wall */}
      <mesh
        position={[SHIPMENT_BOX_SIDE_X, SHIPMENT_BOX_SIDE_Y, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={SHIPMENT_BOX_SIDE_WALL} />
        <meshStandardMaterial
          color={COLORS.shipmentBoxSide}
          roughness={MATERIALS.shipmentBox.roughness}
          metalness={MATERIALS.shipmentBox.metalness}
        />
      </mesh>

      {/* Counter */}
      <Text
        position={[0, SHIPMENT_BOX_COUNTER_Y, 0]}
        fontSize={TEXT_SIZES.counter}
        color={COLORS.shipmentBoxCounter}
        anchorX="center"
        anchorY="middle"
        outlineWidth={TEXT_SIZES.counterOutline}
        outlineColor={COLORS.textOutline}
      >
        {shipmentCount}
      </Text>

      {/* Label */}
      <Text
        position={[0, SHIPMENT_BOX_LABEL_Y, 0]}
        fontSize={TEXT_SIZES.shipmentLabel}
        color={COLORS.shipmentBoxLabel}
        anchorX="center"
        anchorY="middle"
        outlineWidth={TEXT_SIZES.shipmentLabelOutline}
        outlineColor={COLORS.textOutline}
      >
        {LABEL_SHIPMENT}
      </Text>
    </group>
  );
};
