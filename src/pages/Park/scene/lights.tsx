export default function Lights() {
  return (
    <>
      <hemisphereLight args={["#1d3f6e", "#02060f", 0.7]} />
      <ambientLight intensity={1.1} color="#9ec5ff" />
      <directionalLight
        intensity={1.8}
        position={[40, 80, 30]}
        color="#dceeff"
      />
      {/* 东方明珠的粉紫色环境光，映在江面上 */}
      <pointLight
        intensity={900}
        distance={60}
        position={[15.5, 18, -8]}
        color="#ff5fd6"
      />
      {/* 外滩泛光的暖色环境光 */}
      <pointLight
        intensity={700}
        distance={70}
        position={[-6, 10, 12]}
        color="#ffb860"
      />
      <pointLight
        intensity={500}
        distance={60}
        position={[22, 10, 12]}
        color="#ffb860"
      />
    </>
  );
}
