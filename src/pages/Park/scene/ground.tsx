import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid, MeshReflectorMaterial, useTexture } from "@react-three/drei";
import { AdditiveBlending, BoxGeometry, type Mesh } from "three";
import { PARK_SIZE } from "@/data/park";
import { theme } from "@/theme";

import ringImg from "@/assets/ring.png";

export default function Ground() {
  const ringRef = useRef<Mesh>(null!);
  const ringTex = useTexture(ringImg);
  const [pw, pd] = PARK_SIZE;

  const padGeometry = useMemo(() => new BoxGeometry(pw, 0.4, pd), [pw, pd]);
  useEffect(() => () => padGeometry.dispose(), [padGeometry]);

  useFrame((_, delta) => {
    ringRef.current.rotation.z += delta / 6;
  });

  return (
    <group>
      {/* 镜面地面 */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.25}>
        <planeGeometry args={[500, 500]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={8}
          mixStrength={6}
          depthScale={1}
          minDepthThreshold={0.85}
          color="#03101f"
          metalness={0.5}
          roughness={1}
        />
      </mesh>

      {/* 园区地块 */}
      <mesh position-y={-0.2} geometry={padGeometry}>
        <meshStandardMaterial color="#061a33" roughness={0.9} metalness={0.2} />
      </mesh>
      <lineSegments position-y={-0.2} raycast={() => null}>
        <edgesGeometry args={[padGeometry]} />
        <lineBasicMaterial color={theme.primary} transparent opacity={0.7} />
      </lineSegments>

      {/* 无限网格 */}
      <Grid
        infiniteGrid
        position-y={-0.23}
        cellSize={2}
        sectionSize={10}
        cellThickness={0.6}
        sectionThickness={1.2}
        cellColor="#0b2b4d"
        sectionColor="#174a7d"
        fadeDistance={180}
        fadeStrength={1.6}
      />

      {/* 园区外圈旋转光环 */}
      <mesh ref={ringRef} rotation-x={-Math.PI / 2} position-y={0.03}>
        <planeGeometry args={[66, 66]} />
        <meshBasicMaterial
          transparent
          map={ringTex}
          color={theme.glow}
          opacity={1}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
