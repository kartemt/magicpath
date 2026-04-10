import React, { useMemo } from 'react';

function Star({ style }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        width: style.size,
        height: style.size,
        top: style.top,
        left: style.left,
        background: style.color || '#C9D3E7',
        animation: `twinkle ${style.duration}s ease-in-out ${style.delay}s infinite`,
        opacity: 0.4,
        ...style,
      }}
    />
  );
}

// noBase=true: skip dark gradient (use when screen has its own image background)
export default function MagicBackground({ variant = 'night', colorWash = null, noBase = false }) {
  const stars = useMemo(() =>
    Array.from({ length: 38 }, (_, i) => ({
      id: i,
      size: `${1 + Math.random() * 2.5}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 4,
      color: Math.random() > 0.7 ? '#C9A227' : '#C9D3E7',
    })), []);

  const gradients = {
    night: 'radial-gradient(ellipse 80% 60% at 50% 0%, #162340 0%, #0E1A2E 60%, #080F1E 100%)',
    path: 'radial-gradient(ellipse 90% 70% at 50% 0%, #192A40 0%, #0E1A2E 55%, #070E1C 100%)',
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Base gradient — skipped when screen provides its own image */}
      {!noBase && (
        <div
          className="absolute inset-0"
          style={{ background: gradients[variant] || gradients.night }}
        />
      )}

      {/* Subtle nebula glow top */}
      <div
        className="absolute"
        style={{
          top: '-10%',
          left: '10%',
          width: '80%',
          height: '50%',
          background: 'radial-gradient(ellipse, rgba(201,162,39,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Subtle nebula glow bottom-right */}
      <div
        className="absolute"
        style={{
          bottom: '5%',
          right: '-10%',
          width: '60%',
          height: '40%',
          background: 'radial-gradient(ellipse, rgba(157,174,200,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Stars */}
      {stars.map((s) => (
        <Star key={s.id} style={s} />
      ))}

      {/* Ornamental top seal */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: '60%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(201,162,39,0.25), transparent)',
          top: '0',
        }}
      />

      {/* Color wash overlay */}
      {colorWash && (
        <div
          className="absolute inset-0 color-wash"
          style={{ background: colorWash }}
        />
      )}
    </div>
  );
}
