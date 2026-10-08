import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import {
  BoxGeometry,
  Color,
  MathUtils,
  type Group,
  type ShaderMaterial,
} from "three";
import { buildings, BUILDING_PALETTE, type Building } from "@/data/park";
import { useConfigStore } from "@/stores";
import { BuildingMaterial } from "./materials";
import Label from "./label";

/** 根据 id 生成稳定的随机种子，让每栋楼的扫光/窗户错开 */
function seedOf(id: string) {
  let n = 0;
  for (let i = 0; i < id.length; i++) n = (n * 31 + id.charCodeAt(i)) % 1000;
  return n / 1000;
}

export default function Buildings() {
  const groupRef = useRef<Group>(null!);

  // 开场：楼宇依次"生长"出来
  useLayoutEffect(() => {
    const scales = groupRef.current.children.map((c) => c.scale);
    const tl = gsap.timeline({ delay: 0.9 });
    tl.fromTo(
      scales,
      { y: 0.001 },
      { y: 1, duration: 1.1, ease: "back.out(1.3)", stagger: 0.05 }
    );
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <group ref={groupRef}>
      {buildings.map((b) => (
        <BuildingMesh key={b.id} data={b} />
      ))}
    </group>
  );
}

function BuildingMesh({ data }: { data: Building }) {
  const [w, h, d] = data.size;
  const [x, z] = data.position;
  const matRef = useRef<ShaderMaterial>(null!);
  const { select, hover } = useConfigStore.getState();
  const isActive = useConfigStore(
    (s) => s.selected === data.id || s.hovered === data.id
  );
  const isDimmed = useConfigStore(
    (s) => s.selected !== null && s.selected !== data.id
  );

  const geometry = useMemo(() => new BoxGeometry(w, h, d), [w, h, d]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const [bottom, top, scan] = useMemo(
    () => BUILDING_PALETTE[data.type].map((c) => new Color(c)),
    [data.type]
  );
  const seed = useMemo(() => seedOf(data.id), [data.id]);

  useFrame((_, delta) => {
    const u = matRef.current.uniforms;
    u.uTime.value += delta;
    u.uHighlight.value = MathUtils.lerp(
      u.uHighlight.value,
      isActive ? 1 : 0,
      0.12
    );
    u.uOpacity.value = MathUtils.lerp(
      u.uOpacity.value,
      isDimmed ? 0.5 : 1,
      0.1
    );
  });

  return (
    <group position={[x, 0, z]}>
      <mesh
        position-y={h / 2}
        geometry={geometry}
        onPointerOver={(e) => {
          e.stopPropagation();
          hover(data.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          hover(null);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          select(data.id);
        }}>
        <BuildingMaterial
          ref={matRef}
          transparent
          uHeight={h}
          uSeed={seed}
          uBottom={bottom}
          uTop={top}
          uScan={scan}
        />
      </mesh>
      <lineSegments position-y={h / 2} raycast={() => null}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial color={scan} transparent opacity={0.5} />
      </lineSegments>
      <Label building={data} active={isActive} />
    </group>
  );
}
