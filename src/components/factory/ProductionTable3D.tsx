import { Text } from "@react-three/drei";
import { useFactoryStore } from "../../store/factoryStore";

export const ProductionTable3D = () => {
  const statusMatrix = useFactoryStore((state) => state.statusMatrix);
  const pClockCount = useFactoryStore((state) => state.pClockCount);
  const stations = useFactoryStore((state) => state.stations);
  const currentLang = useFactoryStore((state) => state.currentLang);

  // Layout Constants (Based on Scene.tsx station positions)
  const stationX = [-12, -8, -4, 0, 4, 8, 12];
  const clockX = -15.5;
  const vLinesBoundaries = [-17, -14, -10, -6, -2, 2, 6, 10, 14];

  const tableHeight = 10;
  const rowCount = 9;
  const cellHeight = tableHeight / (rowCount + 1); // +1 for header
  const tableWidth = 31; // From -17 to 14
  const centerX = -1.5; // Offset to center the table mesh relative to the group

  return (
    <group position={[0, 0.05, 8.5]} rotation={[-Math.PI / 2.5, 0, 0]}>
      {/* Table Base - Semi-transparent Industrial Black */}
      <mesh position={[centerX, 0, 0]} receiveShadow>
        <boxGeometry args={[tableWidth + 0.6, tableHeight + 0.6, 0.1]} />
        <meshStandardMaterial
          color="#0a0a0a"
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Outer Glow Border */}
      <mesh position={[centerX, 0, -0.06]}>
        <boxGeometry args={[tableWidth + 0.8, tableHeight + 0.8, 0.05]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Header Row Content */}
      <group position={[0, tableHeight / 2 - cellHeight / 2, 0.1]}>
        {/* P_clk Header */}
        <Text
          position={[clockX, 0, 0]}
          fontSize={0.32}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          {currentLang === "tr" ? "SAAT" : "CLOCK"}
        </Text>

        {/* Station Headers */}
        {stations.map((station, i) => (
          <Text
            key={station.id}
            position={[stationX[i], 0, 0]}
            fontSize={0.28}
            color={station.color}
            anchorX="center"
            anchorY="middle"
            maxWidth={3.5}
            textAlign="center"
          >
            {station.name[currentLang]}
          </Text>
        ))}
      </group>

      {/* Grid Lines - Horizontal */}
      {Array.from({ length: rowCount + 2 }).map((_, i) => (
        <mesh
          key={`h-line-${i}`}
          position={[centerX, tableHeight / 2 - i * cellHeight, 0.06]}
        >
          <planeGeometry args={[tableWidth, 0.025]} />
          <meshBasicMaterial color="#333" transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Grid Lines - Vertical */}
      {vLinesBoundaries.map((x, i) => (
        <mesh key={`v-line-${i}`} position={[x, 0, 0.06]}>
          <planeGeometry args={[0.025, tableHeight]} />
          <meshBasicMaterial color="#333" transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Matrix Data Rows */}
      <group position={[0, tableHeight / 2 - cellHeight * 1.5, 0.1]}>
        {statusMatrix.map((row, rIdx) => {
          const displayTick = pClockCount > rIdx ? pClockCount - rIdx : null;

          return (
            <group key={`row-${rIdx}`} position={[0, -rIdx * cellHeight, 0]}>
              {/* Tick/Clock ID */}
              <Text
                position={[clockX, 0, 0]}
                fontSize={0.26}
                color={rIdx === 0 ? "#fff" : "#666"}
                anchorX="center"
                anchorY="middle"
              >
                {displayTick ? `P_clk -> ${displayTick}` : "-"}
              </Text>

              {/* Station Occupancy Cells */}
              {row.map((cell, cIdx) => (
                <Text
                  key={`cell-${rIdx}-${cIdx}`}
                  position={[stationX[cIdx], 0, 0]}
                  fontSize={0.24}
                  color={rIdx === 0 ? "#00ff88" : cell ? "#ffffff" : "#222"}
                  anchorX="center"
                  anchorY="middle"
                >
                  {cell || "-"}
                </Text>
              ))}
            </group>
          );
        })}
      </group>
    </group>
  );
};
