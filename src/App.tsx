import { lazy, Suspense, useLayoutEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router";
import { gsap } from "gsap";
import Loading from "./components/loading";

const Park = lazy(() => import("./pages/Park"));

function App() {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.6, ease: "power3.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [location.key]);

  return (
    <div ref={containerRef} style={{ willChange: "transform, opacity" }}>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Park />} />
          <Route path="*" element={<Park />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
