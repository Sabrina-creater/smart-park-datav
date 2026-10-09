import { useMemo } from "react";
import { Instance, Instances } from "@react-three/drei";
import { AdditiveBlending } from "three";
import { lampLines } from "@/data/bund";
import { getRadialTexture } from "./textures";

const WARM = "#ffd58a";

function generateLamps() {
  const pts: [number, number][] = [];
  lampLines.forEach((l) => {
    const dx = l.to[0] - l.from[0];
    const dz = l.to[1] - l.from[1];
    const len = Math.hypot(dx, dz);
    const n = Math.floor(len / l.step);
    for (let i = 0; i <= n; i++) {
      const t = (i * l.step) / len;
      pts.push([l.from[0] + dx * t, l.from[1] + dz * t]);
    }
  });
  return pts;
}

/** 路灯：灯杆 + 暖光灯头 + 光晕 + 地面光斑 */
export default function Lamps() {
  const lamps = useMemo(generateLamps, []);
  const tex = getRadialTexture();
  const poleH = 2.2;

  return (
    <group raycast={() => null}>
      <Instances limit={lamps.length} range={lamps.length}>
        <cylinderGeometry args={[0.04, 0.06, poleH, 6]} />
        <meshStandardMaterial color="#2a3a55" roughness={0.8} metalness={0.4} />
        {lamps.map(([x, z], i) => (
          <Instance key={i} position={[x, poleH / 2, z]} />
        ))}
      </Instances>
      <Instances limit={lamps.length} range={lamps.length}>
        <sphereGeometry args={[0.14, 10, 8]} />
        <meshBasicMaterial color="#fff2c8" />
        {lamps.map(([x, z], i) => (
          <Instance key={i} position={[x, poleH + 0.08, z]} />
        ))}
      </Instances>
      {/* 灯头光晕 */}
      <Instances limit={lamps.length} range={lamps.length}>
        <sphereGeometry args={[0.5, 10, 8]} />
        <meshBasicMaterial
          transparent
          color={WARM}
          opacity={0.16}
          depthWrite={false}
          blending={AdditiveBlending}
        />
        {lamps.map(([x, z], i) => (
          <Instance key={i} position={[x, poleH + 0.08, z]} />
        ))}
      </Instances>
      {/* 地面光斑 */}
      <Instances limit={lamps.length} range={lamps.length}>
        <planeGeometry args={[3.2, 3.2]} />
        <meshBasicMaterial
          transparent
          map={tex}
          color={WARM}
          opacity={0.35}
          depthWrite={false}
          blending={AdditiveBlending}
        />
        {lamps.map(([x, z], i) => (
          <Instance key={i} position={[x, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]} />
        ))}
      </Instances>
    </group>
  );
}
