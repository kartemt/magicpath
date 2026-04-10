import { motion } from 'framer-motion';
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurBgImage from '../components/BlurBgImage';
import MagicBackground from '../components/MagicBackground';
import { ASSET } from '../lib/assets';
import { setAdmin } from '../lib/storage';

// Hidden admin trigger: 5 rapid taps on top-right corner
function AdminTrigger() {
  const taps = useRef(0);
  const timer = useRef(null);
  const navigate = useNavigate();

  const handleTap = () => {
    taps.current += 1;
    clearTimeout(timer.current);
    if (taps.current >= 5) {
      taps.current = 0;
      setAdmin(true);
      navigate('/admin');
    } else {
      timer.current = setTimeout(() => { taps.current = 0; }, 2500);
    }
  };

  return (
    <button
      onClick={handleTap}
      aria-hidden="true"
      tabIndex={-1}
      style={{
        position: 'absolute',
        top: 'max(env(safe-area-inset-top,0px), 0.75rem)',
        right: '0.75rem',
        width: 36, height: 36,
        background: 'none', border: 'none', cursor: 'default',
        opacity: 0, zIndex: 10,
      }}
    />
  );
}

export default function Screen1() {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex flex-col min-h-svh w-full overflow-hidden"
      style={{ background: '#080F1E' }}
    >
      {/* Stars (no dark base — image provides background) */}
      <MagicBackground noBase />

      {/* Portrait image — fully visible, blurred edges fill wide screens */}
      <BlurBgImage
        src={ASSET.screen1}
        imgPosition="center top"
        darkOverlay="linear-gradient(to bottom, rgba(8,15,30,0.35) 0%, rgba(8,15,30,0.05) 30%, rgba(8,15,30,0.05) 60%, rgba(8,15,30,0.92) 88%, rgba(8,15,30,0.98) 100%)"
        style={{ zIndex: 1 }}
      />

      {/* Content */}
      <div
        className="relative flex flex-col min-h-svh w-full max-w-[430px] mx-auto px-5"
        style={{ zIndex: 2 }}
      >
        <AdminTrigger />

        {/* Top spacer */}
        <div className="pt-[max(env(safe-area-inset-top,0px),1.5rem)] flex justify-center">
          <div className="flex items-center gap-2 opacity-35" aria-hidden="true">
            {['✦', '◆', '✦'].map((s, i) => (
              <span key={i} style={{ color: '#C9A227', fontSize: 9, letterSpacing: 3 }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Spacer — image occupies the visual area */}
        <div className="flex-1" />

        {/* Bottom title + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center text-center gap-4 pb-[max(env(safe-area-inset-bottom,0px),2.25rem)]"
        >
          <h1
            className="text-gradient-gold font-bold leading-tight"
            style={{
              fontSize: 'clamp(1.875rem, 8vw, 2.75rem)',
              fontFamily: 'Georgia, serif',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            }}
          >
            Путь тихой магии
          </h1>

          <p
            className="max-w-xs leading-relaxed"
            style={{ color: 'rgba(201,211,231,0.8)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
          >
            Внутри каждой из нас живёт сила, которая ждёт имени
          </p>

          <div className="ornament-line w-3/4" />

          <button
            className="btn-primary w-full max-w-xs"
            onClick={() => navigate('/symbols')}
          >
            Прояви то, что уже есть в тебе
          </button>
        </motion.div>
      </div>
    </div>
  );
}
