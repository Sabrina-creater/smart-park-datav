import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, type CatmullRomCurve3, type Group } from "three";
import { vehicleRoutes } from "@/data/bund";
import { useConfigStore } from "@/stores";
import { makeLoopCurve } from "./paths";

export default function Vehicles() {
  const visible = useConfigStore((s) => s.vehicles);
  const routes = useMemo(
    () => vehicleRoutes.map((r) => ({ ...r, curve: makeLoopCurve(r.points) })),
    []
  );

  return (
    <group visible={visible}>
      {routes.map((r, i) =>
        Array.from({ length: r.count }, (_, k) => (
          <Car
            key={`${i}-${k}`}
            curve={r.curve}
            offset={k / r.count}
            speed={r.speed}
            color={r.color}
          />
        ))
      )}
    </group>
  );
}

interface CarProps {
  curve: CatmullRomCurve3;
  offset: number;
  speed: number;
  color: string;
}

function Car({ curve, offset, speed, color }: CarProps) {
  const ref = useRef<Group>(null!);
  const t = useRef(offset);
  const pos = useMemo(() => new Vector3(), []);
  const tan = useMemo(() => new Vector3(), []);

  useFrame((_, delta) => {
    if (!useConfigStore.getState().vehicles) return;
    t.current = (t.current + delta * speed) % 1;
    curve.getPointAt(t.current, pos);
    curve.getTangentAt(t.current, tan);
    ref.current.position.set(pos.x, 0.22, pos.z);
    ref.current.lookAt(pos.x + tan.x, 0.22, pos.z + tan.z);
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.8, 0.34, 1.6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, 0.28, -0.1]}>
        <boxGeometry args={[0.68, 0.24, 0.8]} />
        <meshStandardMaterial color="#0a1a2e" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.82]}>
        <boxGeometry args={[0.7, 0.1, 0.05]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0, -0.82]}>
        <boxGeometry args={[0.7, 0.1, 0.05]} />
        <meshBasicMaterial color="#ff2a2a" />
      </mesh>
    </group>
  );
}
