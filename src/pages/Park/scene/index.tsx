import { Suspense } from "react";
import styled from "styled-components";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import { useConfigStore } from "@/stores";
import { theme } from "@/theme";
import Lights from "./lights";
import Ground from "./ground";
import River from "./river";
import Roads from "./roads";
import Bridge from "./bridge";
import Trees from "./trees";
import Buildings from "./buildings";
import Vehicles from "./vehicles";
import Boats from "./boats";
import FlyLines from "./flyLine";
import BeamLight from "./beamLight";
import AlarmRings from "./alarmRings";
import CameraRig from "./cameraRig";

const CanvasWrapper = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

export default function Scene() {
  const autoRotate = useConfigStore((s) => s.autoRotate);

  return (
    <CanvasWrapper>
      <Canvas
        camera={{ fov: 45, near: 0.1, far: 900, position: [0, 180, 240] }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onPointerMissed={() => useConfigStore.getState().select(null)}>
        <color attach="background" args={[theme.bg]} />
        <fog attach="fog" args={[theme.bg, 130, 320]} />
        <Lights />
        <Suspense fallback={null}>
          <Ground />
          <River />
          <Roads />
          <Bridge />
          <Trees />
          <Buildings />
          <Vehicles />
          <Boats />
          <FlyLines />
          <BeamLight />
          <AlarmRings />
          <Preload all />
        </Suspense>
        <CameraRig />
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          zoomSpeed={0.5}
          minDistance={20}
          maxDistance={240}
          maxPolarAngle={Math.PI / 2 - 0.06}
          autoRotate={autoRotate}
          autoRotateSpeed={0.4}
        />
      </Canvas>
    </CanvasWrapper>
  );
}
