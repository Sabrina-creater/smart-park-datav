import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshBasicMaterial, Vector3, type CatmullRomCurve3, type Group } from "three";
import { boatRoutes } from "@/data/bund";
import { useConfigStore } from "@/stores";
import { makeLoopCurve } from "./paths";

/** 黄浦江游船与轮渡 */
export default function Boats() {
  const visible = useConfigStore((s) => s.boats);
  const routes = useMemo(
    () => boatRoutes.map((r) => ({ ...r, curve: makeLoopCurve(r.points, 2) })),
    []
  );

  return (
    <group visible={visible}>
      {routes.map((r, i) =>
        Array.from({ length: r.count }, (_, k) => (
          <Boat
            key={`${i}-${k}`}
            curve={r.curve}
            offset={(k + 0.3 * i) / r.count}
            speed={r.speed}
            kind={r.kind}
            phase={i * 1.7 + k}
          />
        ))
      )}
    </group>
  );
}

interface BoatProps {
  curve: CatmullRomCurve3;
  offset: number;
  speed: number;
  kind: "cruise" | "ferry";
  phase: number;
}

function Boat({ curve, offset, speed, kind, phase }: BoatProps) {
  const ref = useRef<Group>(null!);
  const t = useRef(offset);
  const pos = useMemo(() => new Vector3(), []);
  const tan = useMemo(() => new Vector3(), []);
  const cruise = kind === "cruise";
  const len = cruise ? 4.6 : 2.8;
  const wid = cruise ? 1.5 : 1.1;
  const light = cruise ? "#ffd166" : "#9be4ff";
  // 游船灯带：游船随时间变色，轮渡固定冷白
  const lightMat = useMemo(() => new MeshBasicMaterial({ color: light }), [light]);
  useEffect(() => () => lightMat.dispose(), [lightMat]);

  useFrame((state, delta) => {
    if (!useConfigStore.getState().boats) return;
    t.current = (t.current + delta * speed) % 1;
    curve.getPointAt(t.current, pos);
    curve.getTangentAt(t.current, tan);
    const bob = Math.sin(state.clock.elapsedTime * 1.4 + phase) * 0.04;
    ref.current.position.set(pos.x, 0.05 + bob, pos.z);
    ref.current.lookAt(pos.x + tan.x, 0.05 + bob, pos.z + tan.z);
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.9 + phase) * 0.03;
    if (cruise) {
      lightMat.color.setHSL((state.clock.elapsedTime * 0.04 + phase * 0.17) % 1, 0.9, 0.62);
    }
  });

  return (
    <group ref={ref}>
      {/* 船体 */}
      <mesh position-y={0.22}>
        <boxGeometry args={[wid, 0.44, len]} />
        <meshStandardMaterial color="#132545" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* 船艏 */}
      <mesh position={[0, 0.22, len / 2 + 0.3]} rotation-x={Math.PI / 2}>
        <coneGeometry args={[wid / 2, 0.6, 4]} />
        <meshStandardMaterial color="#132545" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* 客舱 */}
      <mesh position={[0, 0.66, -0.2]}>
        <boxGeometry args={[wid * 0.8, cruise ? 0.5 : 0.36, len * 0.62]} />
        <meshStandardMaterial
          color="#223a66"
          emissive={light}
          emissiveIntensity={0.25}
          roughness={0.4}
        />
      </mesh>
      {/* 舱顶灯带 */}
      <mesh position={[0, cruise ? 0.94 : 0.86, -0.2]} material={lightMat}>
        <boxGeometry args={[wid * 0.84, 0.05, len * 0.66]} />
      </mesh>
      {/* 船舷串灯 */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * wid) / 2, 0.46, 0]} material={lightMat}>
          <boxGeometry args={[0.06, 0.06, len * 0.96]} />
        </mesh>
      ))}
      {cruise && (
        <mesh position={[0, 1.15, -0.2]}>
          <boxGeometry args={[wid * 0.5, 0.36, len * 0.4]} />
          <meshStandardMaterial
            color="#2b4a7a"
            emissive="#ff8fa3"
            emissiveIntensity={0.35}
          />
        </mesh>
      )}
      {/* 桅灯 */}
      <mesh position={[0, cruise ? 1.5 : 1.1, 0.6]}>
        <sphereGeometry args={[0.08, 8, 6]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
