import { AnimatePresence, motion } from 'framer-motion';
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
          width: 140, height: 140,
          boxShadow: `0 0 36px rgba(${sym.colorRgb},0.5)`,
          border: `2px solid rgba(${sym.colorRgb},0.55)`,
        }}
      >
        <img
          src={ASSET.artifacts[symbolId]}
          alt={sym.artifact}
          onError={() => setImgFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{
        width: 120, height: 120,
        background: `radial-gradient(circle, rgba(${sym.colorRgb},0.2) 0%, transparent 70%)`,
        border: `2px solid rgba(${sym.colorRgb},0.55)`,
        fontSize: 54, color: sym.color,
      }}
    >
      {sym.emoji}
    </div>
  );
}

// ── Phase 1: pick one of 3 scenario cards ─────────────────────────────────────

function ScenarioPicker({ scenarios, sym, onPick }) {
  return (
    <motion.div
      key="scenario-picker"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-3"
    >
      <p className="text-center mb-1 font-medium"
        style={{ color: 'rgba(201,211,231,0.65)', fontSize: '0.8125rem' }}>
        Выберите шаг, который откликается прямо сейчас
      </p>
      {scenarios.map((scenario, i) => (
        <motion.button
          key={scenario.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          onClick={() => onPick(i)}
          className="text-left rounded-xl px-4 py-3.5 transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, rgba(14,26,46,0.85) 0%, rgba(20,35,60,0.9) 100%)',
            border: `1.5px solid rgba(${sym.colorRgb},0.2)`,
            boxShadow: '0 2px 16px rgba(14,26,46,0.35)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.border = `1.5px solid rgba(${sym.colorRgb},0.55)`;
            e.currentTarget.style.boxShadow = `0 0 18px rgba(${sym.colorRgb},0.2)`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.border = `1.5px solid rgba(${sym.colorRgb},0.2)`;
            e.currentTarget.style.boxShadow = '0 2px 16px rgba(14,26,46,0.35)';
          }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 flex items-center justify-center rounded-full mt-0.5"
              style={{
                width: 26, height: 26, minWidth: 26,
                background: `rgba(${sym.colorRgb},0.12)`,
                border: `1px solid rgba(${sym.colorRgb},0.4)`,
                color: sym.color, fontSize: 11, fontWeight: 700,
              }}>
              {i + 1}
            </div>
            <p style={{
              color: '#F5F0E8',
              fontSize: 'clamp(0.875rem,2.4vw,1rem)',
              lineHeight: 1.4,
              fontStyle: 'italic',
              fontFamily: 'Georgia, serif',
            }}>
              {scenario.question}
            </p>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}

// ── Phase 2: multi-select option pills ────────────────────────────────────────

function OptionMultiSelect({ scenario, sym, selected, onToggle }) {
  return (
    <motion.div
      key="option-picker"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-2"
    >
      <p className="text-center font-medium leading-snug mb-2"
        style={{
          color: '#F5F0E8',
          fontSize: 'clamp(0.9375rem,2.8vw,1.0625rem)',
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
        }}>
        {scenario.question}
      </p>
      <p className="text-center text-xs mb-3" style={{ color: 'rgba(157,174,200,0.5)' }}>
        Можно выбрать несколько
      </p>
      {scenario.options.map((opt, i) => {
        const isSelected = selected.has(opt.text);
        return (
          <motion.button
            key={opt.text}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.055 }}
            onClick={() => onToggle(opt.text)}
            aria-pressed={isSelected}
            style={{
              padding: '11px 18px',
              borderRadius: 999,
              border: isSelected
                ? `2px solid ${sym.color}`
                : '1.5px solid rgba(157,174,200,0.28)',
              background: isSelected
                ? `rgba(${sym.colorRgb},0.18)`
                : 'rgba(14,26,46,0.55)',
              color: isSelected ? sym.color : '#C9D3E7',
              fontSize: 'clamp(0.875rem,2.2vw,1rem)',
              cursor: 'pointer',
              minHeight: 48,
              textAlign: 'left',
              lineHeight: 1.35,
              fontWeight: isSelected ? 600 : 400,
              transition: 'all 160ms',
              boxShadow: isSelected ? `0 0 16px rgba(${sym.colorRgb},0.28)` : 'none',
            }}
          >
            <span style={{ marginRight: 8, opacity: isSelected ? 1 : 0.3 }}>
              {isSelected ? '✦' : '◇'}
            </span>
            {opt.text}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function Screen3() {
  const navigate = useNavigate();
  const { state, completeSymbol, clearCurrentSymbol } = useGame();
  const symbolId = state.currentSymbol;

  const [phase, setPhase] = useState('scenario'); // 'scenario' | 'options'
  const [chosenScenarioIdx, setChosenScenarioIdx] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(new Set());

  if (!symbolId || !SYMBOLS[symbolId] || !SECTIONS[symbolId]) {
    navigate('/symbols', { replace: true });
    return null;
  }

  const sym = SYMBOLS[symbolId];
  const section = SECTIONS[symbolId];
  const scenario = chosenScenarioIdx !== null ? section.scenarios[chosenScenarioIdx] : null;

  const handlePickScenario = (idx) => {
    setChosenScenarioIdx(idx);
    setSelectedOptions(new Set());
    setPhase('options');
  };

  const handleToggleOption = (text) => {
    setSelectedOptions(prev => {
      const next = new Set(prev);
      if (next.has(text)) next.delete(text);
      else next.add(text);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!scenario || selectedOptions.size === 0) return;

    const chosenTexts = [...selectedOptions];
    const scrollEntry = `${scenario.question}\n${chosenTexts.join(', ')}`;

    // Tally dominant tags from all selected options
    const selectedOpts = scenario.options.filter(o => selectedOptions.has(o.text));
    const covenCounts = {};
    const typeCounts = {};
    for (const o of selectedOpts) {
      covenCounts[o.covenTag] = (covenCounts[o.covenTag] || 0) + 1;
      typeCounts[o.typeTag] = (typeCounts[o.typeTag] || 0) + 1;
    }
    const covenTag = Object.entries(covenCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const typeTag  = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    completeSymbol(symbolId, scrollEntry, { covenTag, typeTag });
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
        <div className="pt-[max(env(safe-area-inset-top,0px),1rem)] pb-2 flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => {
              if (phase === 'options') {
                setPhase('scenario');
                setChosenScenarioIdx(null);
                setSelectedOptions(new Set());
              } else {
                clearCurrentSymbol();
                navigate('/symbols');
              }
            }}
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
            <p className="text-xs uppercase tracking-wider font-semibold"
              style={{ color: sym.color, letterSpacing: '0.15em' }}>
              {sym.name} · {section.sectionTitle}
            </p>
          </div>
          <div style={{ width: 36 }} />
        </div>

        {/* Artifact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 160 }}
          className="flex flex-col items-center gap-2 py-3 flex-shrink-0"
        >
          <ArtifactVisual symbolId={symbolId} />
          <p className="font-semibold text-center" style={{
            color: sym.color,
            fontSize: 'clamp(0.875rem,2.4vw,1rem)',
            textShadow: `0 0 18px rgba(${sym.colorRgb},0.5)`,
          }}>
            {sym.artifact}
          </p>
          <p className="text-xs" style={{ color: 'rgba(201,162,39,0.65)' }}>
            {state.completedSymbols.length + 1}-й артефакт силы пробуждён
          </p>
        </motion.div>

        <div className="ornament-line mb-4 flex-shrink-0" />

        {/* Phase content */}
        <div className="flex-1 flex flex-col overflow-y-auto pb-2">
          <AnimatePresence mode="wait">
            {phase === 'scenario' && (
              <ScenarioPicker
                key="scenario"
                scenarios={section.scenarios}
                sym={sym}
                onPick={handlePickScenario}
              />
            )}
            {phase === 'options' && scenario && (
              <OptionMultiSelect
                key="options"
                scenario={scenario}
                sym={sym}
                selected={selectedOptions}
                onToggle={handleToggleOption}
              />
            )}
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="pb-[max(env(safe-area-inset-bottom,0px),1.5rem)] pt-3 flex-shrink-0">
          <AnimatePresence>
            {phase === 'options' && (
              <motion.button
                className="btn-primary w-full"
                onClick={handleSubmit}
                disabled={selectedOptions.size === 0}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: selectedOptions.size > 0 ? 1 : 0.4, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                Хочу сделать этот шаг
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
