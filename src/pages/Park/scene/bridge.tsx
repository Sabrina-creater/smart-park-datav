import { useMemo } from "react";
import { Instance, Instances } from "@react-three/drei";
import { bridge } from "@/data/bund";

/** 外白渡桥：钢桁架拱桥，跨苏州河口 */
export default function Bridge() {
  const { x, z, span, width } = bridge;
  const r = span / 2;
  const struts = useMemo(
    () =>
      [-0.8, -0.4, 0, 0.4, 0.8].map((k) => ({
        dx: k * r,
        h: Math.sqrt(Math.max(r * r - (k * r) ** 2, 0.1)),
      })),
    [r]
  );
  // 拱上串灯
  const bulbs = useMemo(
    () => Array.from({ length: 15 }, (_, i) => {
      const a = (i / 14) * Math.PI;
      return [Math.cos(a) * r, Math.sin(a) * r] as [number, number];
    }),
    [r]
  );
  const steel = (
    <meshStandardMaterial
      color="#c9d8ff"
      emissive="#5ad8ff"
      emissiveIntensity={0.45}
      roughness={0.4}
      metalness={0.6}
    />
  );

  return (
    <group position={[x, -0.37, z]}>
      {/* 桥面 */}
      <mesh position-y={0.28}>
        <boxGeometry args={[span + 1, 0.2, width]} />
        <meshStandardMaterial color="#13284a" roughness={0.9} />
      </mesh>
      {/* 桥墩 */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (span / 2 + 0.3), -0.05, 0]}>
          <boxGeometry args={[0.6, 0.6, width + 0.4]} />
          <meshStandardMaterial color="#1b355f" roughness={0.9} />
        </mesh>
      ))}
      {/* 两侧钢拱与竖杆 */}
      {[-1, 1].map((s) => (
        <group key={s} position={[0, 0.38, (s * width) / 2]}>
          <mesh>
            <torusGeometry args={[r, 0.09, 8, 32, Math.PI]} />
            {steel}
          </mesh>
          {struts.map((st, i) => (
            <mesh key={i} position={[st.dx, st.h / 2, 0]}>
              <boxGeometry args={[0.06, st.h, 0.06]} />
              {steel}
            </mesh>
          ))}
          {/* 上弦杆 */}
          <mesh position-y={r * 0.5}>
            <boxGeometry args={[span * 0.72, 0.06, 0.06]} />
            {steel}
          </mesh>
          <Instances limit={bulbs.length} range={bulbs.length}>
            <sphereGeometry args={[0.09, 8, 6]} />
            <meshBasicMaterial color="#fff6d6" />
            {bulbs.map(([bx, by], i) => (
              <Instance key={i} position={[bx, by, 0]} />
            ))}
          </Instances>
        </group>
      ))}
    </group>
  );
}
