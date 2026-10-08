import { Line } from "@react-three/drei";
import { roads } from "@/data/park";
import { theme } from "@/theme";

export default function Roads() {
  return (
    <group>
      {roads.map((r, i) => {
        const { from, to, width = 2.6 } = r;
        const dx = to[0] - from[0];
        const dz = to[1] - from[1];
        const len = Math.hypot(dx, dz);
        const angle = Math.atan2(dx, dz);
        const cx = (from[0] + to[0]) / 2;
        const cz = (from[1] + to[1]) / 2;
        const half = len / 2 + width / 2;

        return (
          <group key={i} position={[cx, 0.01, cz]} rotation-y={angle}>
            <mesh rotation-x={-Math.PI / 2}>
              <planeGeometry args={[width, len + width]} />
              <meshStandardMaterial color="#0a1c33" roughness={1} />
            </mesh>
            {/* 中心虚线 */}
            <Line
              points={[
                [0, 0.02, -len / 2],
                [0, 0.02, len / 2],
              ]}
              color={theme.primary}
              lineWidth={1}
              dashed
              dashSize={1.2}
              gapSize={0.9}
              transparent
              opacity={0.6}
            />
            {/* 路缘 */}
            <Line
              points={[
                [-width / 2, 0.02, -half],
                [-width / 2, 0.02, half],
              ]}
              color="#1d4f7f"
              lineWidth={1}
            />
            <Line
              points={[
                [width / 2, 0.02, -half],
                [width / 2, 0.02, half],
              ]}
              color="#1d4f7f"
              lineWidth={1}
            />
          </group>
        );
      })}
    </group>
  );
}
