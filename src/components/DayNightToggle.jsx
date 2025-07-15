export default function DayNightToggle({ isNight, onToggle }) {
  return (
    <button
      className="pixel-btn"
      style={{
        position: 'absolute',
        left: 24,
        top: 24,
        zIndex: 20,
        width: 56,
        height: 56,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isNight ? '#23243a' : '#ffe066',
        border: '3px solid var(--primary)',
        boxShadow: '2px 2px 0 var(--primary)',
        cursor: 'pointer',
      }}
      onClick={onToggle}
      aria-label="Toggle day/night"
    >
      {isNight ? (
        // Pixel moon
        <svg width="32" height="32" viewBox="0 0 32 32">
          <rect x="8" y="8" width="16" height="16" rx="8" fill="#b3b3e6" stroke="#ffe066" strokeWidth="2" />
          <rect x="16" y="8" width="8" height="16" rx="8" fill="#23243a" />
        </svg>
      ) : (
        // Pixel sun
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="10" fill="#ffe066" stroke="#ffb347" strokeWidth="2" />
          {/* Rays */}
          <rect x="15" y="2" width="2" height="6" fill="#ffb347" />
          <rect x="15" y="24" width="2" height="6" fill="#ffb347" />
          <rect x="2" y="15" width="6" height="2" fill="#ffb347" />
          <rect x="24" y="15" width="6" height="2" fill="#ffb347" />
        </svg>
      )}
    </button>
  );
} 