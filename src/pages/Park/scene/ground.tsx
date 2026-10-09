import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid, useTexture } from "@react-three/drei";
import { AdditiveBlending, BoxGeometry, type Mesh } from "three";
import { PARK_SIZE, waters } from "@/data/bund";
import { theme } from "@/theme";

import ringImg from "@/assets/ring.png";

/** 两岸地块、滨江观景平台、无限网格与外圈光环 */
export default function Ground() {
  const ringRef = useRef<Mesh>(null!);
  const ringTex = useTexture(ringImg);
  const [pw, pd] = PARK_SIZE;
  const [river, creek] = waters;

  // 浦东地块：z 从 -pd/2 到江岸
  const pudong = useMemo(() => {
    const depth = river.z[0] + pd / 2;
    return { geo: new BoxGeometry(pw, 0.4, depth), z: river.z[0] - depth / 2 };
  }, [pw, pd, river]);
  // 浦西地块被苏州河切成两段
  const puxi = useMemo(() => {
    const depth = pd / 2 - river.z[1];
    const z = river.z[1] + depth / 2;
    const leftW = creek.x[0] + pw / 2;
    const rightW = pw / 2 - creek.x[1];
    return {
      left: { geo: new BoxGeometry(leftW, 0.4, depth), x: -pw / 2 + leftW / 2, z },
      right: { geo: new BoxGeometry(rightW, 0.4, depth), x: pw / 2 - rightW / 2, z },
    };
  }, [pw, pd, river, creek]);

  useEffect(
    () => () => {
      pudong.geo.dispose();
      puxi.left.geo.dispose();
      puxi.right.geo.dispose();
    },
    [pudong, puxi]
  );

  useFrame((_, delta) => {
    ringRef.current.rotation.z += delta / 8;
  });

  const pads = [
    { geo: pudong.geo, x: 0, z: pudong.z },
    { geo: puxi.left.geo, x: puxi.left.x, z: puxi.left.z },
    { geo: puxi.right.geo, x: puxi.right.x, z: puxi.right.z },
  ];

  return (
    <group>
      {/* 远景地面 */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.3}>
        <planeGeometry args={[600, 600]} />
        <meshStandardMaterial color="#03101f" roughness={1} />
      </mesh>

      {/* 地块 */}
      {pads.map((p, i) => (
        <group key={i} position={[p.x, -0.2, p.z]}>
          <mesh geometry={p.geo}>
            <meshStandardMaterial color="#061a33" roughness={0.9} metalness={0.2} />
          </mesh>
          <lineSegments raycast={() => null}>
            <edgesGeometry args={[p.geo]} />
            <lineBasicMaterial color={theme.primary} transparent opacity={0.7} />
          </lineSegments>
        </group>
      ))}

      {/* 外滩观景平台（浦西江岸） */}
      <mesh position={[(creek.x[0] - pw / 2) / 2, 0.07, river.z[1] + 1]}>
        <boxGeometry args={[creek.x[0] + pw / 2, 0.14, 2]} />
        <meshStandardMaterial color="#0f2d55" roughness={0.8} />
      </mesh>
      {/* 浦东滨江步道 */}
      <mesh position={[0, 0.05, river.z[0] - 0.8]}>
        <boxGeometry args={[pw, 0.1, 1.6]} />
        <meshStandardMaterial color="#0c2749" roughness={0.8} />
      </mesh>

      {/* 无限网格 */}
      <Grid
        infiniteGrid
        position-y={-0.28}
        cellSize={2}
        sectionSize={10}
        cellThickness={0.6}
        sectionThickness={1.2}
        cellColor="#0b2b4d"
        sectionColor="#174a7d"
        fadeDistance={260}
        fadeStrength={1.6}
      />

      {/* 外圈旋转光环 */}
      <mesh ref={ringRef} rotation-x={-Math.PI / 2} position-y={-0.27} raycast={() => null}>
        <planeGeometry args={[110, 110]} />
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
