import React, { useMemo } from 'react';

function getRandomPositions() {
  // Generate 3 visually spaced, non-overlapping positions between 20vw and 80vw
  let positions = [];
  while (positions.length < 3) {
    const pos = Math.floor(Math.random() * 61) + 20; // 20 to 80
    if (positions.every(p => Math.abs(p - pos) > 15)) {
      positions.push(pos);
    }
  }
  return positions.sort((a, b) => a - b);
}

export default function Clouds() {
  // Only randomize on mount
  const [left1, left2, left3] = useMemo(() => getRandomPositions(), []);
  return (
    <>
      {/* Center static cloud (slightly larger) */}
      <svg
        style={{
          position: 'absolute',
          left: `${left2}vw`,
          top: '30px',
          transform: 'translateX(-50%) scale(1.1)',
          zIndex: 1,
        }}
        width="80" height="40" viewBox="0 0 80 40"
      >
        <rect x="10" y="20" width="60" height="16" rx="8" fill="var(--cloud)" stroke="var(--primary)" strokeWidth="2" />
        <rect x="25" y="10" width="30" height="20" rx="10" fill="var(--cloud)" stroke="var(--primary)" strokeWidth="2" />
      </svg>
      {/* Left static cloud */}
      <svg
        style={{
          position: 'absolute',
          left: `${left1}vw`,
          top: '34px',
          transform: 'translateX(-50%) scale(0.9)',
          zIndex: 1,
        }}
        width="80" height="40" viewBox="0 0 80 40"
      >
        <rect x="10" y="20" width="60" height="16" rx="8" fill="var(--cloud)" stroke="var(--primary)" strokeWidth="2" />
        <rect x="25" y="10" width="30" height="20" rx="10" fill="var(--cloud)" stroke="var(--primary)" strokeWidth="2" />
      </svg>
      {/* Right static cloud */}
      <svg
        style={{
          position: 'absolute',
          left: `${left3}vw`,
          top: '36px',
          transform: 'translateX(-50%) scale(0.95)',
          zIndex: 1,
        }}
        width="80" height="40" viewBox="0 0 80 40"
      >
        <rect x="10" y="20" width="60" height="16" rx="8" fill="var(--cloud)" stroke="var(--primary)" strokeWidth="2" />
        <rect x="25" y="10" width="30" height="20" rx="10" fill="var(--cloud)" stroke="var(--primary)" strokeWidth="2" />
      </svg>
    </>
  );
} 