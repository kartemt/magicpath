import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurBgImage from '../components/BlurBgImage';
import MagicBackground from '../components/MagicBackground';
import { useGame } from '../contexts/GameContext';
import { SYMBOLS } from '../data/symbols';
import { ASSET } from '../lib/assets';
import { trackKeyAction } from '../lib/storage';

const ROW1_SIZE = 130;
const ROW2_SIZE = 105;

function SymbolButton({ symbolId, isCompleted, onSelect, size }) {
  const s = SYMBOLS[symbolId];
  const [imgFailed, setImgFailed] = useState(false);
  const isPending = !isCompleted;

  return (
    <button
      onClick={() => onSelect(symbolId)}
      aria-label={s.name}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      <div className="flex flex-col items-center gap-1.5" style={{ minWidth: size }}>
        <motion.div
          animate={isPending ? {
            boxShadow: [
              `0 0 0px rgba(${s.colorRgb},0)`,
              `0 0 28px rgba(${s.colorRgb},0.65)`,
              `0 0 0px rgba(${s.colorRgb},0)`,
            ],
          } : { boxShadow: '0 0 0px rgba(0,0,0,0)' }}
          transition={isPending ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : {}}
          className="relative flex items-center justify-center rounded-full overflow-hidden"
          style={{
            width: size, height: size,
            border: isPending
              ? `2.5px solid rgba(${s.colorRgb},0.6)`
              : '2px solid rgba(245,240,232,0.15)',
            opacity: isCompleted ? 0.5 : 1,
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
                filter: isCompleted ? 'grayscale(0.45)' : 'none',
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: `rgba(${s.colorRgb},0.15)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: size * 0.45, color: s.color,
            }}>
              {s.emoji}
            </div>
          )}

          {isCompleted && (
            <div
              className="absolute flex items-center justify-center rounded-full"
              style={{
                top: 5, right: 5,
                width: 22, height: 22,
                background: '#C9A227', fontSize: 10, color: '#0E1A2E', fontWeight: 800, zIndex: 2,
              }}
            >
              ✓
            </div>
          )}
        </motion.div>

        <span
          className="font-semibold text-center leading-tight"
          style={{
            fontSize: size >= 130 ? 14 : 12,
            color: isPending ? s.color : 'rgba(245,240,232,0.4)',
            textShadow: '0 1px 8px rgba(8,15,30,0.98)',
          }}
        >
          {s.name}
        </span>

        <span
          className="text-center leading-tight"
          style={{
            fontSize: 10,
            color: isPending ? `rgba(${s.colorRgb},0.6)` : 'rgba(157,174,200,0.3)',
            textShadow: '0 1px 6px rgba(8,15,30,0.9)',
            maxWidth: size,
          }}
        >
          {s.artifact}
        </span>
      </div>
    </button>
  );
}

export default function Screen2() {
  const navigate = useNavigate();
  const { state, setCurrentSymbol } = useGame();

  const completedCount = state.completedSymbols.length;

  const handleSelect = (symbolId) => {
    setCurrentSymbol(symbolId);
    trackKeyAction();
    navigate('/choices');
  };

  const isCompleted = (id) => state.completedSymbols.includes(id);

  return (
    <div className="relative flex flex-col min-h-svh w-full overflow-hidden" style={{ background: '#080F1E' }}>
      <MagicBackground noBase />

      <BlurBgImage
        src={ASSET.screen2}
        imgPosition="center top"
        darkOverlay="linear-gradient(to bottom, rgba(8,15,30,0.5) 0%, rgba(8,15,30,0.08) 30%, rgba(8,15,30,0.1) 52%, rgba(8,15,30,0.82) 70%, rgba(8,15,30,0.97) 100%)"
        style={{ zIndex: 1 }}
      />

      <div
        className="relative flex flex-col min-h-svh w-full max-w-[430px] mx-auto px-4"
        style={{ zIndex: 2 }}
      >
        {/* Header */}
        <div className="pt-[max(env(safe-area-inset-top,0px),1.25rem)] pb-1 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-bold uppercase"
            style={{
              color: '#F5F0E8',
              fontSize: 'clamp(0.875rem, 3.2vw, 1.25rem)',
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

        {/* Spacer — fills the upper portion (sorceress image area) */}
        <div className="flex-1" />

        {/* Symbols — 2 rows pinned to the lower section */}
        <div className="flex flex-col gap-4 pb-[max(env(safe-area-inset-bottom,0px),1.5rem)]">
          {/* Row 1: spark + star */}
          <div className="flex justify-around">
            <SymbolButton symbolId="spark" size={ROW1_SIZE} isCompleted={isCompleted('spark')} onSelect={handleSelect} />
            <SymbolButton symbolId="star"  size={ROW1_SIZE} isCompleted={isCompleted('star')}  onSelect={handleSelect} />
          </div>
          {/* Row 2: heart + key + moon */}
          <div className="flex justify-around">
            <SymbolButton symbolId="heart" size={ROW2_SIZE} isCompleted={isCompleted('heart')} onSelect={handleSelect} />
            <SymbolButton symbolId="key"   size={ROW2_SIZE} isCompleted={isCompleted('key')}   onSelect={handleSelect} />
            <SymbolButton symbolId="moon"  size={ROW2_SIZE} isCompleted={isCompleted('moon')}  onSelect={handleSelect} />
          </div>

          <p className="text-center text-xs" style={{ color: 'rgba(201,211,231,0.4)' }}>
            Нажми на символ, который откликается
          </p>
        </div>
      </div>
    </div>
  );
}
