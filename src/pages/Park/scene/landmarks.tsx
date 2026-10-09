import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  Quaternion,
  Vector3,
  type BufferGeometry,
  type Mesh,
  type MeshBasicMaterial,
} from "three";
import { FLOODLIT_TYPES, type Building, type BuildingShape } from "@/data/bund";
import { theme } from "@/theme";
import { BuildingMaterial, LandmarkMaterial, LedMaterial } from "./materials";

/** [底部色, 顶部色, 扫光色, 窗灯色] */
export type Colors = [Color, Color, Color, Color];

const noRaycast = () => null;
const UP = new Vector3(0, 1, 0);

interface ShapeProps {
  data: Building;
  colors: Colors;
  seed: number;
}

interface FacadeProps {
  h: number;
  colors: Colors;
  seed: number;
  flood?: boolean;
  stripe?: boolean;
}

/** 立面材质（渐变 + 窗户 + 扫光；可选泛光照明 / 螺旋灯带） */
function Facade({ h, colors, seed, flood, stripe }: FacadeProps) {
  return (
    <BuildingMaterial
      transparent
      uHeight={h}
      uSeed={seed}
      uBottom={colors[0]}
      uTop={colors[1]}
      uScan={colors[2]}
      uWindow={colors[3]}
      uFlood={flood ? 1 : 0}
      uStripe={stripe ? 1 : 0}
    />
  );
}

/** 曲面材质（渐变 + 菲涅尔辉光 + 扫光） */
function Glow({ h, colors, seed }: { h: number; colors: Colors; seed: number }) {
  return (
    <LandmarkMaterial
      transparent
      uHeight={h}
      uSeed={seed}
      uBottom={colors[0]}
      uTop={colors[1]}
      uScan={colors[2]}
    />
  );
}

const isFloodlit = (d: Building) => FLOODLIT_TYPES.includes(d.type);

function useDisposable<T extends BufferGeometry>(factory: () => T, deps: unknown[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const geo = useMemo(factory, deps);
  useEffect(() => () => geo.dispose(), [geo]);
  return geo;
}

/** 朝向外滩（+z）的 LED 巨幕 */
function LedScreen({ w, h, d, seed }: { w: number; h: number; d: number; seed: number }) {
  return (
    <mesh position={[0, h * 0.52, d / 2 + 0.03]} raycast={noRaycast}>
      <planeGeometry args={[w * 0.86, h * 0.72]} />
      <LedMaterial uSeed={seed} toneMapped={false} />
    </mesh>
  );
}

/** 楼顶航空障碍灯：红色闪烁 */
function Beacon({ y, phase }: { y: number; phase: number }) {
  const ref = useRef<Mesh>(null!);
  useFrame((state) => {
    const on = Math.sin(state.clock.elapsedTime * 2.2 + phase) > 0.2;
    (ref.current.material as MeshBasicMaterial).opacity = on ? 1 : 0.15;
    ref.current.scale.setScalar(on ? 1.3 : 0.8);
  });
  return (
    <mesh ref={ref} position-y={y + 0.35} raycast={noRaycast}>
      <sphereGeometry args={[0.22, 8, 6]} />
      <meshBasicMaterial color="#ff2a3a" transparent />
    </mesh>
  );
}

/** 普通方体楼：带描边；历史建筑额外加檐口；可带 LED 巨幕 */
export function BoxBuilding({ data, colors, seed }: ShapeProps) {
  const [w, h, d] = data.size;
  const geometry = useDisposable(() => new BoxGeometry(w, h, d), [w, h, d]);
  const flood = isFloodlit(data);

  return (
    <>
      <mesh position-y={h / 2} geometry={geometry}>
        <Facade h={h} colors={colors} seed={seed} flood={flood} />
      </mesh>
      <lineSegments position-y={h / 2} raycast={noRaycast}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial color={colors[2]} transparent opacity={0.5} />
      </lineSegments>
      {flood && (
        <mesh position-y={h + 0.08} raycast={noRaycast}>
          <boxGeometry args={[w + 0.3, 0.16, d + 0.3]} />
          <meshBasicMaterial color={colors[2]} />
        </mesh>
      )}
      {data.screen && <LedScreen w={w} h={h} d={d} seed={seed} />}
    </>
  );
}

/** 东方明珠：三根斜撑 + 主柱 + 大小球体 + 天线 */
function Pearl({ data, colors, seed }: ShapeProps) {
  const [w, h] = data.size;
  const legH = h * 0.3;
  const legs = useMemo(
    () =>
      [0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
        const from = new Vector3(Math.cos(a) * w * 0.4, 0, Math.sin(a) * w * 0.4);
        const to = new Vector3(Math.cos(a) * 0.5, legH, Math.sin(a) * 0.5);
        const dir = new Vector3().subVectors(to, from);
        const len = dir.length();
        const q = new Quaternion().setFromUnitVectors(UP, dir.normalize());
        const mid = new Vector3().addVectors(from, to).multiplyScalar(0.5);
        return { q, mid, len };
      }),
    [w, legH]
  );
  const big = w * 0.55;
  const small = w * 0.3;

  return (
    <>
      {legs.map((leg, i) => (
        <mesh key={i} position={leg.mid} quaternion={leg.q}>
          <cylinderGeometry args={[0.22, 0.3, leg.len, 8]} />
          <Glow h={leg.len} colors={colors} seed={seed + i * 0.1} />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
        return (
          <mesh key={`s${i}`} position={[Math.cos(a) * 1.1, legH, Math.sin(a) * 1.1]}>
            <sphereGeometry args={[0.55, 16, 12]} />
            <Glow h={1.1} colors={colors} seed={seed} />
          </mesh>
        );
      })}
      <mesh position-y={h * 0.39}>
        <cylinderGeometry args={[0.45, 0.55, h * 0.78, 12]} />
        <Glow h={h * 0.78} colors={colors} seed={seed} />
      </mesh>
      <mesh position-y={h * 0.34}>
        <sphereGeometry args={[big, 32, 24]} />
        <Glow h={big * 2} colors={colors} seed={seed + 0.3} />
      </mesh>
      <mesh position-y={h * 0.66}>
        <sphereGeometry args={[small, 24, 18]} />
        <Glow h={small * 2} colors={colors} seed={seed + 0.5} />
      </mesh>
      <mesh position-y={h * 0.85}>
        <sphereGeometry args={[0.65, 16, 12]} />
        <Glow h={1.3} colors={colors} seed={seed + 0.7} />
      </mesh>
      <mesh position-y={h * 0.89}>
        <cylinderGeometry args={[0.06, 0.12, h * 0.22, 8]} />
        <Glow h={h * 0.22} colors={colors} seed={seed} />
      </mesh>
    </>
  );
}

/** 上海中心：圆角三角截面 + 自下而上约 120° 扭转、逐渐收分 */
function makeTwistGeometry(radius: number, height: number) {
  const geo = new CylinderGeometry(radius * 0.55, radius, height, 36, 48, false);
  const pos = geo.attributes.position;
  const v = new Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const t = (v.y + height / 2) / height;
    const theta = Math.atan2(v.z, v.x);
    const r = Math.hypot(v.x, v.z) * (1 + 0.16 * Math.cos(3 * theta));
    const twist = t * Math.PI * 0.66;
    pos.setXYZ(i, r * Math.cos(theta + twist), v.y, r * Math.sin(theta + twist));
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

function Twist({ data, colors, seed }: ShapeProps) {
  const [w, h] = data.size;
  const geometry = useDisposable(() => makeTwistGeometry(w / 2, h), [w, h]);
  return (
    <>
      <mesh position-y={h / 2} geometry={geometry}>
        <Facade h={h} colors={colors} seed={seed} stripe />
      </mesh>
      {/* 塔冠 */}
      <mesh position-y={h + 0.3} raycast={noRaycast}>
        <cylinderGeometry args={[0.08, w * 0.18, 0.6, 12]} />
        <Glow h={0.6} colors={colors} seed={seed} />
      </mesh>
    </>
  );
}

/** 环球金融中心：方形基座向上收成薄刃，顶部梯形开口 */
function makeBladeGeometry(w: number, h: number, d: number) {
  const geo = new BoxGeometry(w, h, d, 1, 24, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = (y + h / 2) / h;
    pos.setZ(i, pos.getZ(i) * (1 - 0.88 * t));
    pos.setX(i, pos.getX(i) * (1 - 0.12 * t));
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

function Swfc({ data, colors, seed }: ShapeProps) {
  const [w, h, d] = data.size;
  const geometry = useDisposable(() => makeBladeGeometry(w, h, d), [w, h, d]);
  return (
    <>
      <mesh position-y={h / 2} geometry={geometry}>
        <Facade h={h} colors={colors} seed={seed} />
      </mesh>
      {/* 顶部开口 */}
      <mesh position-y={h * 0.9} raycast={noRaycast}>
        <boxGeometry args={[w * 0.42, h * 0.09, d * 0.5]} />
        <meshBasicMaterial color={theme.bg} />
      </mesh>
      {/* 开口轮廓灯 */}
      <mesh position-y={h * 0.9} raycast={noRaycast}>
        <boxGeometry args={[w * 0.46, h * 0.1, d * 0.12]} />
        <meshBasicMaterial color={colors[2]} transparent opacity={0.6} />
      </mesh>
    </>
  );
}

/** 金茂大厦：逐级收分的塔身 + 尖顶 */
const JINMAO_TIERS = [0.3, 0.19, 0.14, 0.11, 0.08, 0.06, 0.045, 0.035];

function Jinmao({ data, colors, seed }: ShapeProps) {
  const [w, h, d] = data.size;
  const tiers = useMemo(() => {
    let y = 0;
    return JINMAO_TIERS.map((ratio, i) => {
      const th = h * ratio;
      const scale = 1 - i * 0.085;
      const tier = { y: y + th / 2, th, tw: w * scale, td: d * scale };
      y += th;
      return tier;
    });
  }, [w, h, d]);
  const top = tiers[tiers.length - 1];
  const spireBase = top.y + top.th / 2;

  return (
    <>
      {tiers.map((t, i) => (
        <mesh key={i} position-y={t.y}>
          <boxGeometry args={[t.tw, t.th, t.td]} />
          <Facade h={t.th} colors={colors} seed={seed + i * 0.07} />
        </mesh>
      ))}
      <mesh position-y={spireBase + h * 0.06} raycast={noRaycast}>
        <coneGeometry args={[w * 0.12, h * 0.12, 8]} />
        <Glow h={h * 0.12} colors={colors} seed={seed} />
      </mesh>
    </>
  );
}

/** 汇丰银行大楼：横向基座 + 鼓座 + 穹顶 */
function Dome({ data, colors, seed }: ShapeProps) {
  const [w, h, d] = data.size;
  const baseH = h * 0.8;
  const geometry = useDisposable(() => new BoxGeometry(w, baseH, d), [w, baseH, d]);
  const r = w * 0.2;
  return (
    <>
      <mesh position-y={baseH / 2} geometry={geometry}>
        <Facade h={baseH} colors={colors} seed={seed} flood />
      </mesh>
      <lineSegments position-y={baseH / 2} raycast={noRaycast}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial color={colors[2]} transparent opacity={0.5} />
      </lineSegments>
      <mesh position-y={baseH + 0.08} raycast={noRaycast}>
        <boxGeometry args={[w + 0.3, 0.16, d + 0.3]} />
        <meshBasicMaterial color={colors[2]} />
      </mesh>
      <mesh position-y={baseH + h * 0.09}>
        <cylinderGeometry args={[r, r, h * 0.18, 20]} />
        <Glow h={h * 0.18} colors={colors} seed={seed} />
      </mesh>
      <mesh position-y={baseH + h * 0.18}>
        <sphereGeometry args={[r * 1.15, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Glow h={r * 2.3} colors={colors} seed={seed + 0.4} />
      </mesh>
    </>
  );
}

/** 海关大楼：基座 + 钟楼 + 四面钟 + 尖顶 */
function Clock({ data, colors, seed }: ShapeProps) {
  const [w, h, d] = data.size;
  const baseH = h * 0.55;
  const towerH = h * 0.45;
  const tw = w * 0.42;
  const td = d * 0.55;
  const faceY = baseH + towerH * 0.8;
  const faceR = tw * 0.3;
  const faces: { pos: [number, number, number]; rot: [number, number, number] }[] = [
    { pos: [0, faceY, td / 2 + 0.02], rot: [0, 0, 0] },
    { pos: [0, faceY, -td / 2 - 0.02], rot: [0, Math.PI, 0] },
    { pos: [tw / 2 + 0.02, faceY, 0], rot: [0, Math.PI / 2, 0] },
    { pos: [-tw / 2 - 0.02, faceY, 0], rot: [0, -Math.PI / 2, 0] },
  ];
  const geometry = useDisposable(() => new BoxGeometry(w, baseH, d), [w, baseH, d]);

  return (
    <>
      <mesh position-y={baseH / 2} geometry={geometry}>
        <Facade h={baseH} colors={colors} seed={seed} flood />
      </mesh>
      <lineSegments position-y={baseH / 2} raycast={noRaycast}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial color={colors[2]} transparent opacity={0.5} />
      </lineSegments>
      <mesh position={[0, baseH + towerH / 2, 0]}>
        <boxGeometry args={[tw, towerH, td]} />
        <Facade h={towerH} colors={colors} seed={seed + 0.2} flood />
      </mesh>
      {faces.map((f, i) => (
        <mesh key={i} position={f.pos} rotation={f.rot} raycast={noRaycast}>
          <circleGeometry args={[faceR, 24]} />
          <meshBasicMaterial color="#fff4c2" />
        </mesh>
      ))}
      <mesh position-y={baseH + towerH + h * 0.05} raycast={noRaycast}>
        <boxGeometry args={[tw * 0.7, h * 0.1, td * 0.7]} />
        <Facade h={h * 0.1} colors={colors} seed={seed + 0.3} flood />
      </mesh>
      <mesh position-y={baseH + towerH + h * 0.16} raycast={noRaycast}>
        <coneGeometry args={[tw * 0.25, h * 0.12, 8]} />
        <Glow h={h * 0.12} colors={colors} seed={seed} />
      </mesh>
    </>
  );
}

/** 金字塔屋顶：和平饭店（绿铜顶）、中国银行（蓝琉璃顶） */
function Pyramid({ data, colors, seed }: ShapeProps) {
  const [w, h, d] = data.size;
  const baseH = h * 0.82;
  const geometry = useDisposable(() => new BoxGeometry(w, baseH, d), [w, baseH, d]);
  const roof = useMemo<Colors>(() => {
    const c = new Color(data.accent ?? colors[1]);
    return [
      c.clone().multiplyScalar(0.35),
      c,
      c.clone().lerp(new Color("#ffffff"), 0.4),
      colors[3],
    ];
  }, [data.accent, colors]);

  return (
    <>
      <mesh position-y={baseH / 2} geometry={geometry}>
        <Facade h={baseH} colors={colors} seed={seed} flood={isFloodlit(data)} />
      </mesh>
      <lineSegments position-y={baseH / 2} raycast={noRaycast}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial color={colors[2]} transparent opacity={0.5} />
      </lineSegments>
      <mesh position-y={baseH + h * 0.09} rotation-y={Math.PI / 4} raycast={noRaycast}>
        <coneGeometry args={[Math.max(w, d) * 0.66, h * 0.18, 4]} />
        <Glow h={h * 0.18} colors={roof} seed={seed} />
      </mesh>
    </>
  );
}

/** 上海国际会议中心：低层基座 + 两个玻璃球 */
function Globe({ data, colors, seed }: ShapeProps) {
  const [w, h, d] = data.size;
  const geometry = useDisposable(() => new BoxGeometry(w, h, d), [w, h, d]);
  const r1 = d * 0.5;
  const r2 = d * 0.38;
  return (
    <>
      <mesh position-y={h / 2} geometry={geometry}>
        <Facade h={h} colors={colors} seed={seed} />
      </mesh>
      <lineSegments position-y={h / 2} raycast={noRaycast}>
        <edgesGeometry args={[geometry]} />
        <lineBasicMaterial color={colors[2]} transparent opacity={0.5} />
      </lineSegments>
      <mesh position={[-w * 0.25, h + r1 * 0.75, 0]}>
        <sphereGeometry args={[r1, 28, 20]} />
        <Glow h={r1 * 2} colors={colors} seed={seed + 0.2} />
      </mesh>
      <mesh position={[w * 0.3, h + r2 * 0.75, 0]}>
        <sphereGeometry args={[r2, 24, 18]} />
        <Glow h={r2 * 2} colors={colors} seed={seed + 0.6} />
      </mesh>
    </>
  );
}

const SHAPES: Record<BuildingShape, (p: ShapeProps) => React.JSX.Element> = {
  box: BoxBuilding,
  pearl: Pearl,
  twist: Twist,
  swfc: Swfc,
  jinmao: Jinmao,
  dome: Dome,
  clock: Clock,
  pyramid: Pyramid,
  globe: Globe,
};

/** 按 data.shape 分发到具体形态，并附加楼顶障碍灯 */
export default function Landmark(props: ShapeProps) {
  const Shape = SHAPES[props.data.shape ?? "box"];
  return (
    <>
      <Shape {...props} />
      {props.data.beacon && <Beacon y={props.data.size[1]} phase={props.seed * 6} />}
    </>
  );
}
