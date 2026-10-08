import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  AdditiveBlending,
  QuadraticBezierCurve3,
  RepeatWrapping,
  Vector3,
} from "three";
import { buildingMap, buildings } from "@/data/park";
import { useConfigStore } from "@/stores";
import { theme } from "@/theme";

import flyLineImg from "@/assets/fly_line.png";

const CENTER_ID = "A1";

/** 各楼宇 → 运营中心 的数据飞线 */
export default function FlyLines() {
  const visible = useConfigStore((s) => s.flyLine && s.sceneReady);
  const texture = useTexture(flyLineImg, (tex) => {
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(0.4, 1);
  });

  const curves = useMemo(() => {
    const center = buildingMap[CENTER_ID];
    const end = new Vector3(
      center.position[0],
      center.size[1] + 0.6,
      center.position[1]
    );
    return buildings
      .filter((b) => b.id !== CENTER_ID)
      .map((b) => {
        const start = new Vector3(b.position[0], b.size[1] + 0.3, b.position[1]);
        const mid = new Vector3().addVectors(start, end).multiplyScalar(0.5);
        mid.y = Math.max(start.y, end.y) + start.distanceTo(end) * 0.32;
        return new QuadraticBezierCurve3(start, mid, end);
      });
  }, []);

  useFrame((_, delta) => {
    texture.offset.x -= delta * 0.35;
  });

  return (
    <group visible={visible}>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 48, 0.14, 4, false]} />
          <meshBasicMaterial
            transparent
            map={texture}
            color={theme.glow}
            opacity={0.95}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
