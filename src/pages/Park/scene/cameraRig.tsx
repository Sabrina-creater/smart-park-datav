import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { Vector3 } from "three";
import { buildingMap } from "@/data/bund";
import { useConfigStore } from "@/stores";

const HOME_POS = new Vector3(0, 80, 142);
const HOME_TARGET = new Vector3(0, 2, 4);

type Controls = { target: Vector3; update: () => void } | null;

/** 开场镜头 + 选中建筑时的镜头飞行 */
export default function CameraRig() {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as unknown as Controls;

  useEffect(() => {
    if (!controls) return;
    camera.position.set(0, 220, 300);
    controls.target.copy(HOME_TARGET);

    const tl = gsap.timeline({ onUpdate: () => controls.update() });
    tl.to(camera.position, {
      x: HOME_POS.x,
      y: HOME_POS.y,
      z: HOME_POS.z,
      duration: 3,
      delay: 0.3,
      ease: "power3.inOut",
    });
    tl.call(() => useConfigStore.setState({ sceneReady: true }), [], 2.4);

    return () => {
      tl.kill();
    };
  }, [camera, controls]);

  useEffect(() => {
    if (!controls) return;
    const dir = new Vector3();

    return useConfigStore.subscribe(
      (s) => s.selected,
      (id) => {
        const target = HOME_TARGET.clone();
        const pos = HOME_POS.clone();

        if (id) {
          const b = buildingMap[id];
          target.set(b.position[0], b.size[1] * 0.45, b.position[1]);
          dir.subVectors(camera.position, controls.target).setY(0);
          if (dir.lengthSq() < 0.01) dir.set(0, 0, 1);
          dir.normalize();
          const dist = Math.max(b.size[1] * 1.3, 26);
          pos.copy(target).addScaledVector(dir, dist).setY(target.y + dist * 0.55);
        }

        gsap.to(camera.position, {
          x: pos.x,
          y: pos.y,
          z: pos.z,
          duration: 1.4,
          ease: "power2.inOut",
          overwrite: true,
        });
        gsap.to(controls.target, {
          x: target.x,
          y: target.y,
          z: target.z,
          duration: 1.4,
          ease: "power2.inOut",
          overwrite: true,
          onUpdate: () => controls.update(),
        });
      }
    );
  }, [camera, controls]);

  return null;
}
