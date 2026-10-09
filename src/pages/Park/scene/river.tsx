import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import { AdditiveBlending, type ShaderMaterial } from "three";
import { waters } from "@/data/bund";
import { theme } from "@/theme";
import { RippleMaterial } from "./materials";

/** 黄浦江（镜面反射 + 流动波光）与苏州河 */
export default function River() {
  const rippleRef = useRef<ShaderMaterial>(null!);
  const [huangpu, suzhou] = waters;
  const hw = huangpu.x[1] - huangpu.x[0] + 12;
  const hd = huangpu.z[1] - huangpu.z[0];
  const hx = (huangpu.x[0] + huangpu.x[1]) / 2;
  const hz = (huangpu.z[0] + huangpu.z[1]) / 2;
  const sw = suzhou.x[1] - suzhou.x[0];
  const sd = suzhou.z[1] - suzhou.z[0];
  const sx = (suzhou.x[0] + suzhou.x[1]) / 2;
  const sz = (suzhou.z[0] + suzhou.z[1]) / 2;

  useFrame((_, delta) => {
    rippleRef.current.uniforms.uTime.value += delta;
  });

  return (
    <group>
      {/* 黄浦江镜面 */}
      <mesh rotation-x={-Math.PI / 2} position={[hx, -0.16, hz]}>
        <planeGeometry args={[hw, hd]} />
        <MeshReflectorMaterial
          blur={[240, 80]}
          resolution={1024}
          mixBlur={1.6}
          mixStrength={3}
          mirror={0.45}
          depthScale={0.6}
          minDepthThreshold={0.6}
          maxDepthThreshold={1.3}
          color="#061f3d"
          metalness={0.4}
          roughness={0.55}
        />
      </mesh>
      {/* 波光 */}
      <mesh rotation-x={-Math.PI / 2} position={[hx, -0.1, hz]} raycast={() => null}>
        <planeGeometry args={[hw, hd]} />
        <RippleMaterial
          ref={rippleRef}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          uColor={theme.glow}
          uOpacity={0.28}
          uScale={hw / hd}
        />
      </mesh>
      {/* 苏州河 */}
      <mesh rotation-x={-Math.PI / 2} position={[sx, -0.16, sz]}>
        <planeGeometry args={[sw, sd]} />
        <meshStandardMaterial color="#071d3a" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}
