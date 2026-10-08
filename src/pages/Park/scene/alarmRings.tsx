import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { AdditiveBlending, type Group } from "three";
import { alarmBuildingIds, buildingMap } from "@/data/park";
import { theme } from "@/theme";

import ringImg from "@/assets/guangquan01.png";

/** 有未关闭告警的楼宇脚下显示红色脉冲光圈 */
export default function AlarmRings() {
  const ref = useRef<Group>(null!);
  const tex = useTexture(ringImg);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((c, i) => {
      c.scale.setScalar(1 + 0.3 * Math.sin(t * 3 + i * 1.3));
      c.rotation.z = t * 0.8 + i;
    });
  });

  return (
    <group ref={ref}>
      {alarmBuildingIds.map((id) => {
        const b = buildingMap[id];
        const size = Math.max(b.size[0], b.size[2]) * 1.4;
        return (
          <mesh
            key={id}
            rotation-x={-Math.PI / 2}
            position={[b.position[0], 0.05, b.position[1]]}
            raycast={() => null}>
            <planeGeometry args={[size, size]} />
            <meshBasicMaterial
              transparent
              color={theme.danger}
              alphaMap={tex}
              opacity={0.7}
              depthWrite={false}
              blending={AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
}
