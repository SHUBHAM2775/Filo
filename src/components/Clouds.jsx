import { useEffect, useRef, useState } from 'react';

const clouds = [
  { top: '30px', scale: 1, duration: 60 },
  { top: '60px', scale: 1.2, duration: 80 },
  { top: '20px', scale: 0.8, duration: 100 },
];

function useAnimatedLeft(duration) {
  const [left, setLeft] = useState(-10);
  useEffect(() => {
    let start = Date.now();
    let raf;
    function animate() {
      const elapsed = (Date.now() - start) / 1000;
      let percent = (elapsed % duration) / duration;
      setLeft(-10 + percent * 120); // from -10vw to 110vw
      raf = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, [duration]);
  return left;
}

export default function Clouds() {
  return (
    <>
      {clouds.map((cloud, i) => {
        const left = useAnimatedLeft(cloud.duration);
        return (
          <svg
            key={i}
            style={{
              position: 'absolute',
              left: `${left}vw`,
              top: cloud.top,
              transform: `scale(${cloud.scale})`,
              zIndex: 1,
              transition: 'none',
            }}
            width="80" height="40" viewBox="0 0 80 40"
          >
            <rect x="10" y="20" width="60" height="16" rx="8" fill="var(--cloud)" stroke="var(--primary)" strokeWidth="2" />
            <rect x="25" y="10" width="30" height="20" rx="10" fill="var(--cloud)" stroke="var(--primary)" strokeWidth="2" />
          </svg>
        );
      })}
    </>
  );
} 