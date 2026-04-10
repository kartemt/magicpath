import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurBgImage from '../components/BlurBgImage';
import MagicBackground from '../components/MagicBackground';
import { useGame } from '../contexts/GameContext';
import { SYMBOLS } from '../data/symbols';
import { ASSET } from '../lib/assets';
import { trackKeyAction } from '../lib/storage';

// ── Symbol button ────────────────────────────────────────────────────────────

function SymbolButton({ symbolId, isCompleted, isSelected, onSelect }) {
  const s = SYMBOLS[symbolId];
  const [imgFailed, setImgFailed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isActive = isSelected || isCompleted;

  return (
    <button
      onClick={() => onSelect(symbolId)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`${s.name}: ${s.short}`}
      aria-pressed={isSelected}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      <div className="flex flex-col items-center gap-1.5" style={{ minWidth: 80 }}>
        <motion.div
          animate={isSelected ? { scale: 1.15 } : hovered ? { scale: 1.08 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18 }}
          className="relative flex items-center justify-center rounded-full overflow-hidden"
          style={{
            width: 80, height: 80,
            border: isActive
              ? `2.5px solid ${s.color}`
              : hovered
              ? `2px solid rgba(${s.colorRgb},0.7)`
              : '1.5px solid rgba(245,240,232,0.2)',
            boxShadow: isSelected
              ? `0 0 28px rgba(${s.colorRgb},0.65), 0 0 60px rgba(${s.colorRgb},0.25)`
              : hovered
              ? `0 0 18px rgba(${s.colorRgb},0.45)`
              : isCompleted
              ? `0 0 12px rgba(${s.colorRgb},0.3)`
              : 'none',
            transition: 'border 200ms, box-shadow 200ms',
          }}
        >
          {!imgFailed ? (
            <img
              src={ASSET.artifacts[symbolId]}
              alt={s.name}
              onError={() => setImgFailed(true)}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center 20%',
                opacity: isActive || hovered ? 1 : 0.72,
                transition: 'opacity 200ms',
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: isActive ? `rgba(${s.colorRgb},0.22)` : 'rgba(14,26,46,0.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 34, color: s.color,
            }}>
              {s.emoji}
            </div>
          )}

          {/* Hover shimmer tint */}
          {(hovered || isSelected) && (
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: `rgba(${s.colorRgb},${isSelected ? 0.22 : 0.12})` }}
            />
          )}

          {/* Completed tick */}
          {isCompleted && (
            <div className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: '#C9A227', fontSize: 9, color: '#0E1A2E', fontWeight: 800, zIndex: 2 }}>
              ✓
            </div>
          )}
        </motion.div>

        <span
          className="font-semibold text-center leading-tight"
          style={{
            fontSize: 12,
            color: isActive ? s.color : hovered ? `rgba(${s.colorRgb},0.9)` : 'rgba(245,240,232,0.85)',
            textShadow: '0 1px 6px rgba(14,26,46,0.95)',
            transition: 'color 200ms',
          }}
        >
          {s.name}
        </span>
      </div>
    </button>
  );
}

// ── Full-screen magic reveal overlay ─────────────────────────────────────────

function MagicReveal({ symbolId, onDone }) {
  const s = SYMBOLS[symbolId];
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <motion.div
      key="magic-reveal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 flex flex-col items-center justify-center gap-6 px-6"
      style={{
        zIndex: 50,
        background: `radial-gradient(ellipse 80% 70% at 50% 50%, rgba(${s.colorRgb},0.38) 0%, rgba(8,15,30,0.97) 70%)`,
      }}
      onClick={onDone}
    >
      {/* Color light burst */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 2.5, opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 200, height: 200,
          background: `radial-gradient(circle, rgba(${s.colorRgb},0.7) 0%, transparent 70%)`,
        }}
      />

      {/* Artifact image */}
      <motion.div
        initial={{ scale: 0.55, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 1.08, opacity: 0, y: -16 }}
        transition={{ duration: 0.55, type: 'spring', stiffness: 160 }}
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{
          maxHeight: '52vh',
          maxWidth: '80vw',
          boxShadow: `0 0 60px rgba(${s.colorRgb},0.5)`,
          border: `2px solid rgba(${s.colorRgb},0.6)`,
        }}
      >
        {!imgFailed ? (
          <img
            src={ASSET.artifacts[symbolId]}
            alt={s.artifact}
            onError={() => setImgFailed(true)}
            style={{ display: 'block', maxHeight: '52vh', maxWidth: '80vw', objectFit: 'contain' }}
          />
        ) : (
          <div style={{
            width: 200, height: 240,
            background: `rgba(${s.colorRgb},0.15)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 72, color: s.color,
          }}>
            {s.emoji}
          </div>
        )}
      </motion.div>

      {/* "Вы выбрали не случайно" */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ delay: 0.3, duration: 0.45 }}
        className="text-center font-bold italic"
        style={{
          color: '#F5F0E8',
          fontSize: 'clamp(1.375rem, 5vw, 2rem)',
          fontFamily: 'Georgia, serif',
          textShadow: `0 0 32px rgba(${s.colorRgb},0.7), 0 2px 12px rgba(8,15,30,0.9)`,
          letterSpacing: '0.02em',
        }}
      >
        Вы выбрали не случайно.
      </motion.p>

      {/* Tap to continue hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.2 }}
        className="text-xs absolute bottom-8"
        style={{ color: '#C9D3E7' }}
      >
        Нажмите, чтобы продолжить
      </motion.p>
    </motion.div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function Screen2() {
  const navigate = useNavigate();
  const { state, setCurrentSymbol } = useGame();

  const [selected, setSelected] = useState(null);
  // 'idle' | 'revealing' | 'revealed'
  const [phase, setPhase] = useState('idle');

  const handleSelect = useCallback((symbolId) => {
    setSelected(symbolId);
    setPhase('revealing');
    // Auto-dismiss reveal after 3s if user doesn't tap
    setTimeout(() => setPhase('revealed'), 3000);
  }, []);

  const handleRevealDone = () => setPhase('revealed');

  const handleContinue = () => {
    if (!selected) return;
    setCurrentSymbol(selected);
    trackKeyAction();
    navigate('/choices');
  };

  const selectedSym = selected ? SYMBOLS[selected] : null;
  const completedCount = state.completedSymbols.length;

  return (
    <div className="relative flex flex-col min-h-svh w-full overflow-hidden" style={{ background: '#080F1E' }}>
      <MagicBackground noBase />

      {/* Portrait image — fully visible with blurred edges */}
      <BlurBgImage
        src={ASSET.screen2}
        imgPosition="center top"
        darkOverlay="linear-gradient(to bottom, rgba(8,15,30,0.6) 0%, rgba(8,15,30,0.12) 25%, rgba(8,15,30,0.08) 55%, rgba(8,15,30,0.92) 80%, rgba(8,15,30,0.98) 100%)"
        style={{ zIndex: 1 }}
      />

      {/* Content */}
      <div
        className="relative flex flex-col min-h-svh w-full max-w-[430px] mx-auto px-4"
        style={{ zIndex: 2 }}
      >
        {/* Header */}
        <div className="pt-[max(env(safe-area-inset-top,0px),1.25rem)] pb-2 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-bold uppercase"
            style={{
              color: '#F5F0E8',
              fontSize: 'clamp(1rem, 3.8vw, 1.375rem)',
              fontFamily: 'Georgia, serif',
              letterSpacing: '0.06em',
              textShadow: '0 2px 14px rgba(8,15,30,0.95)',
            }}
          >
            Что зовёт тебя сейчас сильнее всего?
          </motion.h1>
          {completedCount > 0 && (
            <p className="text-xs mt-1" style={{ color: 'rgba(201,162,39,0.7)' }}>
              Пробуждено: {completedCount}/5
            </p>
          )}
        </div>

        {/* Symbol grid — bigger buttons */}
        <div className="flex-1 flex flex-col justify-center gap-5 py-2">
          {/* Row 1 */}
          <div className="flex justify-between px-2">
            <SymbolButton symbolId="spark" isCompleted={state.completedSymbols.includes('spark')} isSelected={selected === 'spark'} onSelect={handleSelect} />
            <SymbolButton symbolId="star"  isCompleted={state.completedSymbols.includes('star')}  isSelected={selected === 'star'}  onSelect={handleSelect} />
          </div>
          {/* Row 2: center */}
          <div className="flex justify-center">
            <SymbolButton symbolId="key" isCompleted={state.completedSymbols.includes('key')} isSelected={selected === 'key'} onSelect={handleSelect} />
          </div>
          {/* Row 3 */}
          <div className="flex justify-between px-2">
            <SymbolButton symbolId="heart" isCompleted={state.completedSymbols.includes('heart')} isSelected={selected === 'heart'} onSelect={handleSelect} />
            <SymbolButton symbolId="moon"  isCompleted={state.completedSymbols.includes('moon')}  isSelected={selected === 'moon'}  onSelect={handleSelect} />
          </div>
        </div>

        {/* Info panel */}
        <div className="pb-[max(env(safe-area-inset-bottom,0px),1.75rem)] pt-2" style={{ minHeight: 100 }}>
          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
                <div className="ornament-line w-3/4" />
                <p className="text-center text-sm" style={{ color: 'rgba(201,211,231,0.5)' }}>
                  Нажми на символ, который откликается
                </p>
              </motion.div>
            )}

            {phase === 'revealed' && selectedSym && (
              <motion.div key="reveal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="flex flex-col items-center gap-3">
                <div className="ornament-line w-3/4" />
                <p className="text-center font-semibold" style={{ color: selectedSym.color, fontSize: 'clamp(0.875rem,2.5vw,1.0625rem)' }}>
                  Артефакт: {selectedSym.artifact}
                </p>
                {!state.completedSymbols.includes(selected) && (
                  <p className="text-xs" style={{ color: 'rgba(157,174,200,0.65)' }}>
                    {completedCount + 1}-й артефакт силы пробуждён: {completedCount + 1}/5
                  </p>
                )}
                <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="btn-primary w-full" onClick={handleContinue}>
                  Сделать ещё шаг на моём пути
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Magic reveal overlay — full screen, above everything */}
      <AnimatePresence>
        {phase === 'revealing' && (
          <MagicReveal symbolId={selected} onDone={handleRevealDone} />
        )}
      </AnimatePresence>
    </div>
  );
}
