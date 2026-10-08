import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, DoubleSide, type Group } from "three";
import { PARK_SIZE } from "@/data/park";
import { useConfigStore } from "@/stores";
import { BeamMaterial } from "./materials";

const COUNT = 26;

/** 园区上空缓缓上升的光束粒子 */
export default function BeamLight() {
  const ref = useRef<Group>(null!);
  const visible = useConfigStore((s) => s.beam);
  const [rangeX, rangeZ] = PARK_SIZE;

  const beams = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        x: (Math.random() - 0.5) * rangeX,
        z: (Math.random() - 0.5) * rangeZ,
        y: Math.random() * 14,
        len: 2 + Math.random() * 4,
        speed: 1.5 + Math.random() * 1.5,
        resetHeight: 16 + Math.random() * 10,
        opacity: 0.35 + Math.random() * 0.3,
      })),
    [rangeX, rangeZ]
  );

  useFrame((_, delta) => {
    if (!useConfigStore.getState().beam) return;
    ref.current.children.forEach((beam) => {
      beam.position.y += beam.userData.speed * delta;
      if (beam.position.y > beam.userData.resetHeight) {
        beam.position.x = (Math.random() - 0.5) * rangeX;
        beam.position.z = (Math.random() - 0.5) * rangeZ;
        beam.position.y = -2 - Math.random() * 4;
        beam.scale.y = 2 + Math.random() * 4;
      }
    });
  });

  return (
    <group ref={ref} visible={visible}>
      {beams.map((b, k) => (
        <mesh
          key={k}
          position={[b.x, b.y, b.z]}
          scale={[1, b.len, 1]}
          userData={{ speed: b.speed, resetHeight: b.resetHeight }}>
          <cylinderGeometry args={[0.04, 0.04, 1, 6, 1, true]} />
          <BeamMaterial
            transparent
            depthWrite={false}
            side={DoubleSide}
            blending={AdditiveBlending}
            uColor="#8fc2ff"
            uOpacity={b.opacity}
          />
        </mesh>
      ))}
    </group>
  );
}
