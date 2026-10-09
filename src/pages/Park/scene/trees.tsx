import { useMemo } from "react";
import { Instance, Instances } from "@react-three/drei";
import { buildings, fillers, PARK_SIZE, roads, waters } from "@/data/bund";

/** 可复现的伪随机 */
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function distToSegment(
  px: number,
  pz: number,
  [ax, az]: [number, number],
  [bx, bz]: [number, number]
) {
  const dx = bx - ax;
  const dz = bz - az;
  const l2 = dx * dx + dz * dz || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / l2));
  return Math.hypot(px - (ax + dx * t), pz - (az + dz * t));
}

const nearRoad = (x: number, z: number) =>
  roads.some((r) => distToSegment(x, z, r.from, r.to) < (r.width ?? 2.4) / 2 + 0.7);

const footprints = [...buildings, ...fillers];
const inBuilding = (x: number, z: number) =>
  footprints.some(
    (b) =>
      Math.abs(x - b.position[0]) < b.size[0] / 2 + 1 &&
      Math.abs(z - b.position[1]) < b.size[2] / 2 + 1
  );

const inWater = (x: number, z: number) =>
  waters.some(
    (w) => x >= w.x[0] - 0.6 && x <= w.x[1] + 0.6 && z >= w.z[0] - 0.6 && z <= w.z[1] + 0.6
  );

const blocked = (x: number, z: number) =>
  inBuilding(x, z) || nearRoad(x, z) || inWater(x, z);

function generateTrees() {
  const rnd = mulberry32(20261009);
  const pts: { x: number; z: number; s: number }[] = [];
  const [pw, pd] = PARK_SIZE;
  const halfW = pw / 2 - 1;
  const halfD = pd / 2 - 1;

  // 行道树
  roads.forEach((r) => {
    const dx = r.to[0] - r.from[0];
    const dz = r.to[1] - r.from[1];
    const len = Math.hypot(dx, dz);
    const ux = dx / len;
    const uz = dz / len;
    const nx = -uz;
    const nz = ux;
    const off = (r.width ?? 2.4) / 2 + 1;
    for (let t = 1.5; t < len - 1; t += 2.6) {
      for (const side of [-1, 1]) {
        const x = r.from[0] + ux * t + nx * side * off;
        const z = r.from[1] + uz * t + nz * side * off;
        if (Math.abs(x) > halfW || Math.abs(z) > halfD) continue;
        if (blocked(x, z)) continue;
        pts.push({
          x: x + (rnd() - 0.5) * 0.5,
          z: z + (rnd() - 0.5) * 0.5,
          s: 0.75 + rnd() * 0.5,
        });
      }
    }
  });

  // 陆家嘴中心绿地 / 滨江公园
  for (let i = 0; i < 90; i++) {
    const x = -4 + (rnd() - 0.5) * 20;
    const z = -11 + (rnd() - 0.5) * 7;
    if (blocked(x, z)) continue;
    pts.push({ x, z, s: 0.6 + rnd() * 0.6 });
  }
  for (let i = 0; i < 60; i++) {
    const x = (rnd() - 0.5) * 80;
    const z = -8.6 + (rnd() - 0.5) * 1.6;
    if (blocked(x, z)) continue;
    pts.push({ x, z, s: 0.6 + rnd() * 0.5 });
  }

  return pts;
}

export default function Trees() {
  const trees = useMemo(generateTrees, []);

  return (
    <group>
      <Instances limit={trees.length} range={trees.length}>
        <cylinderGeometry args={[0.08, 0.13, 0.8, 5]} />
        <meshStandardMaterial color="#4a3320" roughness={1} />
        {trees.map((t, i) => (
          <Instance key={i} position={[t.x, 0.4 * t.s, t.z]} scale={t.s} />
        ))}
      </Instances>
      <Instances limit={trees.length} range={trees.length}>
        <coneGeometry args={[0.55, 1.5, 6]} />
        <meshStandardMaterial
          color="#1f7a4d"
          emissive="#0b4a2c"
          emissiveIntensity={0.6}
          roughness={0.9}
          flatShading
        />
        {trees.map((t, i) => (
          <Instance
            key={i}
            position={[t.x, (0.8 + 0.75) * t.s, t.z]}
            scale={t.s}
          />
        ))}
      </Instances>
    </group>
  );
}
