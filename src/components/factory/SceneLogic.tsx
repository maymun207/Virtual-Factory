/**
 * SceneLogic — Per-frame station light/color update logic.
 * Must be rendered inside the R3F Canvas tree.
 */
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSimulationStore } from "../../store/simulationStore";
import { COLORS, MATERIALS, LIGHT_TOLERANCE } from "../../lib/params";

interface SceneLogicProps {
  stationRefs: React.MutableRefObject<(THREE.Group | null)[]>;
  activeStatesRef: React.MutableRefObject<boolean[]>;
  stationStages: number[];
}

export const SceneLogic = ({
  stationRefs,
  activeStatesRef,
  stationStages,
}: SceneLogicProps) => {
  const stations = useSimulationStore((s) => s.stations);
  const partPositionsRef = useSimulationStore((s) => s.partPositionsRef);

  useFrame(() => {
    if (!partPositionsRef.current || !stationRefs.current) return;

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
            bodyMat.emissiveIntensity =
              MATERIALS.stationBodyActive.emissiveIntensity;
            lightMat.color.set(COLORS.lightOn);
          } else {
            bodyMat.color.set(COLORS.stationBodyInactive);
            bodyMat.emissive.set(COLORS.stationBodyEmissiveOff);
            bodyMat.emissiveIntensity = MATERIALS.stationBody.emissiveIntensity;
            lightMat.color.set(COLORS.lightOff);
          }
        }
      }
    });
  });

  return null;
};
