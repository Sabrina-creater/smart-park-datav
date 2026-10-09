import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, DoubleSide, type Group } from "three";
import { searchlights } from "@/data/bund";
import { useConfigStore } from "@/stores";
import { ConeLightMaterial } from "./materials";
import { getRadialTexture } from "./textures";

const LENGTH = 70;

/** 外滩观景平台上缓缓扫动的探照灯 */
export default function Searchlights() {
  const ref = useRef<Group>(null!);
  const visible = useConfigStore((s) => s.beam);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((g, i) => {
      g.rotation.z = Math.sin(t * 0.22 + i * 2.1) * 0.55;
      g.rotation.x = -0.35 + Math.sin(t * 0.17 + i * 1.3) * 0.3;
    });
  });

  return (
    <group ref={ref} visible={visible} raycast={() => null}>
      {searchlights.map(([x, z], i) => (
        <group key={i} position={[x, 0.3, z]}>
          {/* 锥体翻转：尖端在地面，底面朝天 */}
          <mesh position-y={LENGTH / 2} rotation-x={Math.PI}>
            <coneGeometry args={[1.4, LENGTH, 16, 1, true]} />
            <ConeLightMaterial
              transparent
              depthWrite={false}
              side={DoubleSide}
              blending={AdditiveBlending}
              uColor="#fff1cc"
              uOpacity={0.24}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.35, 10, 8]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
          <mesh rotation-x={-Math.PI / 2} position-y={-0.2}>
            <planeGeometry args={[2.6, 2.6]} />
            <meshBasicMaterial
              map={getRadialTexture()}
              color="#fff1cc"
              transparent
              opacity={0.5}
              depthWrite={false}
              blending={AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
