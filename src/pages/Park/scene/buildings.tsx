import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { Color, MathUtils, type Group, type Mesh, type ShaderMaterial } from "three";
import {
  buildings,
  fillers,
  BUILDING_PALETTE,
  type Building,
  type BuildingType,
} from "@/data/bund";
import { useConfigStore } from "@/stores";
import Landmark, { type Colors } from "./landmarks";
import { BuildingMaterial } from "./materials";
import Label from "./label";

/** 根据 id 生成稳定的随机种子，让每栋楼的扫光/窗户错开 */
function seedOf(id: string) {
  let n = 0;
  for (let i = 0; i < id.length; i++) n = (n * 31 + id.charCodeAt(i)) % 1000;
  return n / 1000;
}

const paletteCache = new Map<BuildingType, Colors>();
function paletteOf(type: BuildingType): Colors {
  let c = paletteCache.get(type);
  if (!c) {
    c = BUILDING_PALETTE[type].map((hex) => new Color(hex)) as Colors;
    paletteCache.set(type, c);
  }
  return c;
}

/** 东方明珠的灯光在粉 / 紫 / 蓝之间缓慢流转 */
function cyclePearl(colors: Colors, t: number) {
  const hue = 0.74 + 0.14 * Math.sin(t * 0.25);
  colors[0].setHSL(hue, 0.85, 0.18);
  colors[1].setHSL(hue, 0.95, 0.62);
  colors[2].setHSL(hue, 0.9, 0.82);
}

/** 遍历组内所有自定义着色器材质并更新 uniforms */
function updateUniforms(
  root: Group,
  delta: number,
  highlight: number,
  opacity: number,
  tint?: Colors
) {
  root.traverse((o) => {
    const mat = (o as Mesh).material as ShaderMaterial | undefined;
    const u = mat?.uniforms;
    if (!u?.uTime) return;
    u.uTime.value += delta;
    // drei 的 shaderMaterial 会复制颜色 prop，逐帧变色需直接写入 uniform
    if (tint && u.uBottom && u.uTop && u.uScan) {
      (u.uBottom.value as Color).copy(tint[0]);
      (u.uTop.value as Color).copy(tint[1]);
      (u.uScan.value as Color).copy(tint[2]);
    }
    if (u.uHighlight) {
      u.uHighlight.value = MathUtils.lerp(u.uHighlight.value, highlight, 0.12);
    }
    if (u.uOpacity) {
      u.uOpacity.value = MathUtils.lerp(u.uOpacity.value, opacity, 0.1);
    }
  });
}

export default function Buildings() {
  const groupRef = useRef<Group>(null!);

  // 开场：建筑依次"生长"出来
  useLayoutEffect(() => {
    const scales = groupRef.current.children.map((c) => c.scale);
    const tl = gsap.timeline({ delay: 0.9 });
    tl.fromTo(
      scales,
      { y: 0.001 },
      { y: 1, duration: 1.1, ease: "back.out(1.3)", stagger: 0.04 }
    );
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <group ref={groupRef}>
        {buildings.map((b) => (
          <BuildingMesh key={b.id} data={b} />
        ))}
      </group>
      <Fillers />
    </>
  );
}

function BuildingMesh({ data }: { data: Building }) {
  const [x, z] = data.position;
  const groupRef = useRef<Group>(null!);
  const { select, hover } = useConfigStore.getState();
  const isActive = useConfigStore(
    (s) => s.selected === data.id || s.hovered === data.id
  );
  const isDimmed = useConfigStore(
    (s) => s.selected !== null && s.selected !== data.id
  );
  const pearl = data.shape === "pearl";
  // 东方明珠使用独立的颜色实例，便于逐帧改色而不影响同类型建筑
  const colors = useMemo<Colors>(
    () => (pearl ? (paletteOf(data.type).map((c) => c.clone()) as Colors) : paletteOf(data.type)),
    [pearl, data.type]
  );
  const seed = useMemo(() => seedOf(data.id), [data.id]);

  useFrame((state, delta) => {
    if (pearl) cyclePearl(colors, state.clock.elapsedTime);
    updateUniforms(
      groupRef.current,
      delta,
      isActive ? 1 : 0,
      isDimmed ? 0.5 : 1,
      pearl ? colors : undefined
    );
  });

  return (
    <group
      ref={groupRef}
      position={[x, 0, z]}
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
      <Landmark data={data} colors={colors} seed={seed} />
      <Label building={data} active={isActive} />
    </group>
  );
}

/** 背景填充楼块：不可交互，只参与扫光动画 */
function Fillers() {
  const ref = useRef<Group>(null!);

  useFrame((_, delta) => {
    updateUniforms(ref.current, delta, 0, 0.85);
  });

  return (
    <group ref={ref} raycast={() => null}>
      {fillers.map((f, i) => {
        const [w, h, d] = f.size;
        const colors = paletteOf(f.type);
        return (
          <mesh key={i} position={[f.position[0], h / 2, f.position[1]]} raycast={() => null}>
            <boxGeometry args={[w, h, d]} />
            <BuildingMaterial
              transparent
              uHeight={h}
              uSeed={(i * 0.137) % 1}
              uOpacity={0.85}
              uBottom={colors[0]}
              uTop={colors[1]}
              uScan={colors[2]}
              uWindow={colors[3]}
              uFlood={f.type === "historic" ? 1 : 0}
            />
          </mesh>
        );
      })}
    </group>
  );
}
