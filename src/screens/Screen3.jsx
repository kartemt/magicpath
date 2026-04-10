import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MagicBackground from '../components/MagicBackground';
import { useGame } from '../contexts/GameContext';
import { SECTIONS } from '../data/sections';
import { SYMBOLS } from '../data/symbols';
import { ASSET } from '../lib/assets';

// ── Artifact image ────────────────────────────────────────────────────────────

function ArtifactVisual({ symbolId }) {
  const sym = SYMBOLS[symbolId];
  const [imgFailed, setImgFailed] = useState(false);

  if (!imgFailed) {
    return (
      <div
        className="relative flex items-center justify-center rounded-2xl overflow-hidden"
        style={{
          width: 96, height: 96,
          boxShadow: `0 0 28px rgba(${sym.colorRgb},0.45)`,
          border: `1.5px solid rgba(${sym.colorRgb},0.5)`,
        }}
      >
        <img
          src={ASSET.artifacts[symbolId]}
          alt={sym.artifact}
          onError={() => setImgFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 flex justify-center pb-1.5 px-2"
          style={{ background: 'linear-gradient(to top, rgba(14,26,46,0.75) 0%, transparent 100%)' }}
        >
          <span style={{ color: sym.color, fontSize: 9, fontWeight: 600, textShadow: '0 1px 4px rgba(14,26,46,0.9)' }}>
            {sym.artifact}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{
        width: 88, height: 88,
        background: `radial-gradient(circle, rgba(${sym.colorRgb},0.2) 0%, transparent 70%)`,
        border: `2px solid rgba(${sym.colorRgb},0.55)`,
        boxShadow: `0 0 24px rgba(${sym.colorRgb},0.35)`,
        fontSize: 38, color: sym.color,
      }}
    >
      {sym.emoji}
    </div>
  );
}

// ── Option pill button ────────────────────────────────────────────────────────

function OptionPill({ text, isSelected, onSelect, color, colorRgb }) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={isSelected}
      style={{
        padding: '10px 18px',
        borderRadius: 999,
        border: isSelected
          ? `2px solid ${color}`
          : '1.5px solid rgba(157,174,200,0.28)',
        background: isSelected
          ? `rgba(${colorRgb},0.18)`
          : 'rgba(14,26,46,0.55)',
        color: isSelected ? color : '#C9D3E7',
        fontSize: 'clamp(0.8125rem,2vw,0.9375rem)',
        cursor: 'pointer',
        minHeight: 44,
        transition: 'all 180ms',
        boxShadow: isSelected ? `0 0 14px rgba(${colorRgb},0.3)` : 'none',
        textAlign: 'left',
        lineHeight: 1.35,
        fontWeight: isSelected ? 600 : 400,
      }}
    >
      {text}
    </button>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function Screen3() {
  const navigate = useNavigate();
  const { state, completeSymbol, clearCurrentSymbol } = useGame();
  const symbolId = state.currentSymbol;

  // Pick a random scenario index once per mount
  const [scenarioIdx] = useState(() => Math.floor(Math.random() * 3));
  const [selectedOption, setSelectedOption] = useState(null);

  if (!symbolId || !SYMBOLS[symbolId] || !SECTIONS[symbolId]) {
    navigate('/symbols', { replace: true });
    return null;
  }

  const sym = SYMBOLS[symbolId];
  const section = SECTIONS[symbolId];
  const scenario = section.scenarios[scenarioIdx] || section.scenarios[0];

  const handleSubmit = () => {
    if (!selectedOption) return;
    const scrollEntry = `${scenario.question}\n${selectedOption.text}`;
    const tags = { covenTag: selectedOption.covenTag, typeTag: selectedOption.typeTag };
    completeSymbol(symbolId, scrollEntry, tags);
    navigate('/path');
  };

  return (
    <div className="relative flex flex-col min-h-svh w-full" style={{ background: '#0E1A2E' }}>
      <MagicBackground />

      <div
        className="relative flex flex-col min-h-svh w-full max-w-[430px] mx-auto px-4"
        style={{ zIndex: 1 }}
      >
        {/* Header */}
        <div className="pt-[max(env(safe-area-inset-top,0px),1rem)] pb-2 flex items-center gap-3">
          <button
            onClick={() => { clearCurrentSymbol(); navigate('/symbols'); }}
            aria-label="Назад"
            style={{
              width: 36, height: 36, minWidth: 36, borderRadius: '50%',
              background: 'rgba(14,26,46,0.6)', border: '1px solid rgba(157,174,200,0.25)',
              color: '#9DAEC8', cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ←
          </button>
          <div className="flex-1 text-center">
            <p
              className="text-xs uppercase tracking-wider font-semibold"
              style={{ color: sym.color, letterSpacing: '0.15em' }}
            >
              {sym.name} · {section.sectionTitle}
            </p>
          </div>
          <div style={{ width: 36 }} />
        </div>

        {/* Artifact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, type: 'spring', stiffness: 160 }}
          className="flex items-center justify-center py-3"
        >
          <ArtifactVisual symbolId={symbolId} />
        </motion.div>

        <div className="ornament-line mb-4" />

        {/* Question */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-center mb-4 font-medium leading-snug"
          style={{
            color: '#F5F0E8',
            fontSize: 'clamp(0.9375rem,2.8vw,1.0625rem)',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
          }}
        >
          {scenario.question}
        </motion.p>

        {/* Options */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col gap-2.5 flex-1"
        >
          {scenario.options.map((opt, i) => (
            <motion.div
              key={opt.text}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28 + i * 0.06, duration: 0.3 }}
            >
              <OptionPill
                text={opt.text}
                isSelected={selectedOption?.text === opt.text}
                onSelect={() => setSelectedOption(opt)}
                color={sym.color}
                colorRgb={sym.colorRgb}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="pb-[max(env(safe-area-inset-bottom,0px),1.5rem)] pt-4">
          <motion.button
            className="btn-primary w-full"
            onClick={handleSubmit}
            disabled={!selectedOption}
            initial={{ opacity: 0 }}
            animate={{ opacity: selectedOption ? 1 : 0.4 }}
            transition={{ duration: 0.25 }}
          >
            Принять этот шаг
          </motion.button>
        </div>
      </div>
    </div>
  );
}
