export default function Lights() {
  return (
    <>
      <ambientLight intensity={1.4} color="#9ec5ff" />
      <directionalLight
        intensity={2.2}
        position={[40, 80, 30]}
        color="#dceeff"
      />
      <pointLight
        intensity={400}
        distance={70}
        position={[0, 26, 0]}
        color="#3fb6ff"
      />
    </>
  );
}
