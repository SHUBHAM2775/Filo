import { useEffect, useState } from 'react';

const birds = [
  { top: 10, scale: 1, duration: 30 },
  { top: 40, scale: 0.9, duration: 40 },
  { top: 25, scale: 1.1, duration: 50 },
];

function useAnimatedBird(duration, topBase) {
  const [left, setLeft] = useState(-10);
  const [top, setTop] = useState(topBase);
  useEffect(() => {
    let start = Date.now();
    let raf;
    function animate() {
      const elapsed = (Date.now() - start) / 1000;
      let percent = (elapsed % duration) / duration;
      setLeft(-10 + percent * 120);
      setTop(topBase + Math.sin(elapsed / 2) * 10); // gentle up/down
      raf = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, [duration, topBase]);
  return { left, top };
}

export default function Birds() {
  return (
    <>
      {birds.map((bird, i) => {
        const { left, top } = useAnimatedBird(bird.duration, bird.top);
        return (
          <svg
            key={i}
            style={{
              position: 'absolute',
              left: `${left}vw`,
              top: `${top}px`,
              transform: `scale(${bird.scale})`,
              zIndex: 2,
              transition: 'none',
            }}
            width="32" height="24" viewBox="0 0 32 24"
          >
            {/* Pixel bird: body and wing */}
            <rect x="8" y="12" width="16" height="8" fill="var(--bird)" stroke="var(--primary)" strokeWidth="2" />
            <rect x="16" y="8" width="8" height="8" fill="var(--bird)" stroke="var(--primary)" strokeWidth="2" />
          </svg>
        );
      })}
    </>
  );
}

// Butterfly: blue, flies across once a minute
export function Butterfly() {
  const [left, setLeft] = useState(-10);
  const [top, setTop] = useState(80);
  useEffect(() => {
    let raf;
    let start = Date.now();
    function animate() {
      const elapsed = (Date.now() - start) / 1000;
      let percent = (elapsed % 60) / 60; // once per minute
      setLeft(-10 + percent * 120);
      setTop(80 + Math.sin(elapsed * 2) * 20); // flutter
      raf = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);
  // Only show when in visible range
  if (left < -5 || left > 105) return null;
  return (
    <svg
      style={{
        position: 'absolute',
        left: `${left}vw`,
        top: `${top}px`,
        zIndex: 3,
        transition: 'none',
      }}
      width="32" height="32" viewBox="0 0 32 32"
    >
      {/* Pixel butterfly: blue wings */}
      <rect x="8" y="14" width="8" height="8" fill="#3fa9f5" stroke="#222b44" strokeWidth="2" />
      <rect x="16" y="14" width="8" height="8" fill="#3fa9f5" stroke="#222b44" strokeWidth="2" />
      <rect x="14" y="16" width="4" height="4" fill="#fff" stroke="#222b44" strokeWidth="2" />
    </svg>
  );
} 