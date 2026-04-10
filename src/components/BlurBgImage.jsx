import React from 'react';

/**
 * Shows a portrait image fully visible (object-fit: contain), centered.
 * Fills the remaining screen area with a blurred, darkened version of the same image.
 * Works correctly on any aspect ratio — portrait phone or wide laptop.
 *
 * Props:
 *   src          — image URL
 *   imgPosition  — CSS background-position for the sharp layer (default 'center top')
 *   darkOverlay  — gradient on top of image for text readability (optional CSS string)
 *   style        — extra styles for wrapper
 */
export default function BlurBgImage({ src, imgPosition = 'center top', darkOverlay, style }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={style}
      aria-hidden="true"
    >
      {/* ── Layer 1: blurred fill ──────────────────────────────────── */}
      {/* Extends -30px beyond edges to hide blur fringing */}
      <div
        style={{
          position: 'absolute',
          inset: -30,
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(28px) brightness(0.4) saturate(1.4)',
          transform: 'scale(1.05)',
        }}
      />

      {/* ── Layer 2: sharp image, fully contained ─────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${src})`,
          backgroundSize: 'contain',
          backgroundPosition: imgPosition,
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* ── Layer 3: optional dark gradient overlay ───────────────── */}
      {darkOverlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: darkOverlay,
          }}
        />
      )}
    </div>
  );
}
