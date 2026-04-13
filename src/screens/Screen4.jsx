import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import BlurBgImage from '../components/BlurBgImage';
import MagicBackground from '../components/MagicBackground';
import { useGame } from '../contexts/GameContext';
import { COVEN_NAMES, DIVINATION_MESSAGES, SYMBOLS } from '../data/symbols';
import { buildManifestFields, buildPrintHTML, resolveCovenByOptions, resolveTypeByOptions } from '../data/manifest';
import { ASSET } from '../lib/assets';
import { trackRating, trackKeyAction } from '../lib/storage';
import { submitContact } from '../lib/contactSubmit.js';

const SCROLL_KEYS_ORDER = ['spark', 'star', 'key', 'heart', 'moon'];

function parseEntry(raw) {
  if (!raw) return { stepTitle: null, answer: null };
  const idx = raw.indexOf('\n');
  if (idx === -1) return { stepTitle: null, answer: raw };
  return { stepTitle: raw.slice(0, idx).trim(), answer: raw.slice(idx + 1).trim() };
}

// ── Compact scroll segment ────────────────────────────────────────────────────

function ScrollSegment({ symbolId, entryRaw }) {
  const sym = SYMBOLS[symbolId];
  const { stepTitle, answer } = parseEntry(entryRaw);
  const isFilled = !!answer;

  return (
    <div
      className="flex items-start gap-2.5 py-2"
      style={{ borderBottom: '1px solid rgba(201,162,39,0.08)' }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full"
        style={{
          width: 24, height: 24, minWidth: 24, marginTop: 1,
          background: isFilled ? `rgba(${sym.colorRgb},0.18)` : 'rgba(14,26,46,0.4)',
          border: isFilled ? `1.5px solid ${sym.color}` : '1.5px solid rgba(157,174,200,0.12)',
          fontSize: 11, color: isFilled ? sym.color : 'rgba(157,174,200,0.3)',
        }}
      >
        {sym.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-wider leading-none mb-0.5"
          style={{ color: isFilled ? sym.color : 'rgba(157,174,200,0.3)', letterSpacing: '0.08em', fontSize: 10 }}>
          {sym.scrollLabel}
        </p>
        {isFilled ? (
          <>
            {stepTitle && (
              <p className="italic leading-snug mb-0.5"
                style={{ color: 'rgba(201,211,231,0.55)', fontSize: 10 }}>
                {stepTitle}
              </p>
            )}
            <p className="leading-snug break-words"
              style={{
                color: '#F5F0E8',
                fontSize: 'clamp(0.75rem,1.8vw,0.875rem)',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
              {answer}
            </p>
          </>
        ) : (
          <p className="italic" style={{ color: 'rgba(157,174,200,0.28)', fontSize: 11 }}>Ждёт пробуждения…</p>
        )}
      </div>
    </div>
  );
}

// ── Star rating ───────────────────────────────────────────────────────────────

function StarRating({ value, onChange }) {
  const labels = ['', 'Ерунда, не зацепило', '', '', '', 'Отлично, напишите, где взять продолжение'];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex">
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => onChange(n)} aria-label={`Оценка ${n}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 28,
              color: n <= value ? '#C9A227' : 'rgba(157,174,200,0.3)',
              minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform 150ms' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>★</button>
        ))}
      </div>
      {value > 0 && <p className="text-xs text-center" style={{ color: '#9DAEC8' }}>{labels[value]}</p>}
    </div>
  );
}

// ── Contact dialog ────────────────────────────────────────────────────────────

function ContactDialog({ open, onOpenChange }) {
  const [contact, setContact] = useState('');
  const [step, setStep] = useState('input');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-4 max-w-sm">
        <DialogHeader>
          <DialogTitle>Продолжить путь</DialogTitle>
          <DialogDescription>Оставь контакт, и мы свяжемся, когда откроется следующая ступень</DialogDescription>
        </DialogHeader>
        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div key="i" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-3">
              <label htmlFor="ci" className="text-sm" style={{ color: '#C9D3E7' }}>Email или ссылка на соцсеть</label>
              <input id="ci" className="magic-input" type="text" placeholder="example@email.com или @username"
                value={contact} onChange={e => { setContact(e.target.value); setError(''); }} maxLength={200} autoComplete="email" />
              {error && <p className="text-xs" style={{ color: '#B87185' }}>{error}</p>}
              <button className="btn-primary w-full" disabled={!contact.trim() || submitting}
                onClick={async () => {
                  const t = contact.trim();
                  if (!t || t.length < 4) { setError('Введите почту или ссылку на соцсеть'); return; }
                  setSubmitting(true);
                  const result = await submitContact(t);
                  if (result === 'ok') trackKeyAction();
                  setSubmitting(false);
                  setStep('rating');
                }}>{submitting ? 'Отправка…' : 'Отправить'}</button>
            </motion.div>
          )}
          {step === 'rating' && (
            <motion.div key="r" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4 items-center">
              <p className="text-center text-sm" style={{ color: '#C9D3E7' }}>Как вам эта практика?</p>
              <StarRating value={rating} onChange={setRating} />
              <button className="btn-primary w-full" disabled={rating === 0} onClick={() => { if (rating > 0) trackRating(rating); setStep('done'); }}>Готово</button>
              <button className="btn-secondary w-full" style={{ minHeight: 44 }} onClick={() => setStep('done')}>Пропустить</button>
            </motion.div>
          )}
          {step === 'done' && (
            <motion.div key="d" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-3 items-center py-2">
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(201,162,39,0.15)', border: '2px solid rgba(201,162,39,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#C9A227' }}>✦</div>
              <p className="text-center font-semibold text-gradient-gold" style={{ fontSize: '1.0625rem' }}>Благодарим вас</p>
              <p className="text-center text-sm" style={{ color: '#9DAEC8' }}>Мы свяжемся с вами, когда откроется следующая ступень.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// ── Divination dialog ─────────────────────────────────────────────────────────

function DivinationDialog({ open, onOpenChange }) {
  const [msg] = useState(() => DIVINATION_MESSAGES[Math.floor(Math.random() * DIVINATION_MESSAGES.length)]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-4 max-w-sm">
        <DialogHeader><DialogTitle>Прорицание</DialogTitle><DialogDescription>Послание пути</DialogDescription></DialogHeader>
        <div className="premium-card p-5 mt-2 text-center" style={{ border: '1px solid rgba(201,162,39,0.35)' }}>
          <p className="italic leading-relaxed" style={{ color: '#F5F0E8', fontSize: 'clamp(0.875rem,2.5vw,1rem)' }}>«{msg}»</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Reset dialog ──────────────────────────────────────────────────────────────

function ResetDialog({ open, onOpenChange, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-4 max-w-sm">
        <DialogHeader>
          <DialogTitle>Начать заново?</DialogTitle>
          <DialogDescription>Весь прогресс и свиток проявления будут очищены. Это действие необратимо.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2">
          <button className="btn-secondary w-full" onClick={onConfirm} style={{ borderColor: '#B87185', color: '#B87185' }}>
            Да, начать сначала
          </button>
          <button className="btn-primary w-full" onClick={() => onOpenChange(false)}>Нет, остаться</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Manifest dialog ───────────────────────────────────────────────────────────

function ManifestDialog({ open, onOpenChange, scrollEntries, chosenOptions }) {
  const fields = buildManifestFields(scrollEntries);
  const coven  = resolveCovenByOptions(chosenOptions);
  const type   = resolveTypeByOptions(chosenOptions);

  const handlePrint = () => {
    const lightBgUrl = `${window.location.origin}${ASSET.manifestLight}`;
    const html = buildPrintHTML(fields, coven, type, lightBgUrl);
    const win  = window.open('', '_blank', 'width=680,height=920');
    if (!win) {
      alert('Разрешите открытие всплывающих окон в браузере и попробуйте снова.');
      return;
    }
    win.document.write(html);
    win.document.close();
    // Give the browser time to render before showing print dialog
    setTimeout(() => { win.focus(); win.print(); }, 600);
  };

  const fieldStyle = {
    background: 'rgba(14,26,46,0.65)',
    border: '1px solid rgba(201,162,39,0.22)',
    borderRadius: 14,
    padding: '13px 16px',
  };
  const labelStyle = {
    color: 'rgba(201,162,39,0.75)',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.11em',
    textTransform: 'uppercase',
    marginBottom: 6,
  };
  const valueStyle = {
    color: '#F5F0E8',
    fontSize: 'clamp(1rem,2.8vw,1.0625rem)',
    lineHeight: 1.5,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="mx-3 max-w-lg max-h-[92vh] overflow-y-auto"
        style={{
          backgroundImage: `linear-gradient(rgba(8,15,30,0.78) 0%, rgba(8,15,30,0.72) 100%), url(${ASSET.manifestDark})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.04em', fontSize: 'clamp(1rem,3vw,1.2rem)' }}>
            ✦ Моя магия проявления
          </DialogTitle>
          <DialogDescription>Ваш личный профиль — итог пяти ступеней пути</DialogDescription>
        </DialogHeader>

        {/* Manifest fields */}
        <div className="flex flex-col gap-3 mt-1">
          {fields.map(({ label, value }) => (
            <div key={label} style={fieldStyle}>
              <p style={labelStyle}>{label}</p>
              {value ? (
                <p style={valueStyle}>{value}</p>
              ) : (
                <p className="italic" style={{ color: 'rgba(157,174,200,0.4)', fontSize: '0.9375rem' }}>
                  не заполнено
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="ornament-line my-4" />

        {/* Coven */}
        <div className="rounded-2xl px-4 py-4 mb-3"
          style={{ background: 'rgba(201,162,39,0.09)', border: '1.5px solid rgba(201,162,39,0.32)' }}>
          <p style={{ ...labelStyle }}>Ваш ковен</p>
          <p style={{ color: '#E0C060', fontSize: 'clamp(1rem,2.8vw,1.125rem)', fontWeight: 700, marginBottom: 8, fontFamily: 'Georgia, serif' }}>
            {coven.name}
          </p>
          <p style={{ color: 'rgba(201,211,231,0.8)', fontSize: 'clamp(0.9rem,2.4vw,0.9375rem)', lineHeight: 1.55, fontStyle: 'italic' }}>
            {coven.description}
          </p>
        </div>

        {/* Type */}
        <div className="rounded-2xl px-4 py-4"
          style={{ background: 'rgba(14,26,46,0.65)', border: '1px solid rgba(157,174,200,0.22)' }}>
          <p style={{ ...labelStyle }}>Тип проявления</p>
          <p style={{ color: '#C9D3E7', fontSize: 'clamp(1rem,2.8vw,1.125rem)', fontWeight: 700, marginBottom: 8, fontFamily: 'Georgia, serif' }}>
            {type.name}
          </p>
          <p style={{ color: 'rgba(201,211,231,0.8)', fontSize: 'clamp(0.9rem,2.4vw,0.9375rem)', lineHeight: 1.55, fontStyle: 'italic', marginBottom: 10 }}>
            {type.description}
          </p>
          {type.risk && (
            <p style={{ color: 'rgba(184,113,133,0.75)', fontSize: '0.875rem', lineHeight: 1.45, marginBottom: 10 }}>
              <span style={{ fontWeight: 600 }}>Риск:</span> {type.risk}
            </p>
          )}
          <p style={{ color: '#C9D3E7', fontSize: 'clamp(0.9rem,2.4vw,0.9375rem)', lineHeight: 1.5 }}>
            <span style={{ color: '#C9A227', fontWeight: 600 }}>Следующий шаг:</span> {type.nextStep}
          </p>
        </div>

        {/* PDF export */}
        <button className="btn-primary w-full mt-4" onClick={handlePrint} style={{ fontSize: '0.9375rem' }}>
          Сохранить как PDF
        </button>
        <p className="text-center text-xs mt-1.5" style={{ color: 'rgba(157,174,200,0.45)' }}>
          Откроется окно печати — выберите «Сохранить как PDF»
        </p>
      </DialogContent>
    </Dialog>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function Screen4() {
  const navigate = useNavigate();
  const { state, resetGame } = useGame();
  const [contactOpen, setContactOpen]       = useState(false);
  const [divinationOpen, setDivinationOpen] = useState(false);
  const [resetOpen, setResetOpen]           = useState(false);
  const [manifestOpen, setManifestOpen]     = useState(false);

  const completedCount = state.completedSymbols.length;
  const covenName = COVEN_NAMES[completedCount] || COVEN_NAMES[1];
  const allDone = completedCount === 5;

  const handleReset = () => {
    resetGame();
    setResetOpen(false);
    navigate('/', { replace: true });
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: '#0E1A2E',
        minHeight: '100svh',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
      }}
    >
      <MagicBackground variant="path" noBase />

      <BlurBgImage
        src={ASSET.screen4}
        imgPosition="center 30%"
        darkOverlay="linear-gradient(to bottom, rgba(8,15,30,0.65) 0%, rgba(8,15,30,0.15) 30%, rgba(8,15,30,0.1) 55%, rgba(8,15,30,0.92) 82%, rgba(8,15,30,0.98) 100%)"
        style={{ zIndex: 1 }}
      />

      {/* ── ROW 1: Header ──────────────────────────────────────────── */}
      <div
        className="relative flex flex-col items-center gap-1.5 px-4 w-full max-w-[430px] mx-auto"
        style={{ zIndex: 3, paddingTop: 'max(env(safe-area-inset-top,0px), 1.25rem)', paddingBottom: '0.5rem' }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="font-bold uppercase text-center"
          style={{
            fontSize: 'clamp(1.125rem, 4.5vw, 1.625rem)',
            fontFamily: 'Georgia, serif',
            letterSpacing: '0.07em',
            color: '#F5F0E8',
          }}
        >
          Ваш путь открыт
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{ background: 'rgba(201,162,39,0.13)', border: '1px solid rgba(201,162,39,0.38)' }}
        >
          <span style={{ color: '#C9A227', fontSize: 10 }}>✦</span>
          <span style={{ color: '#E0C060', fontSize: 'clamp(0.7rem,1.8vw,0.8125rem)', fontWeight: 600 }}>
            Мой ковен — {covenName}
          </span>
        </motion.div>

        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map(n => (
            <div key={n} className="rounded-full transition-all duration-500"
              style={{
                width: n <= completedCount ? 18 : 10, height: 5,
                background: n <= completedCount ? 'linear-gradient(90deg,#C9A227,#D4813A)' : 'rgba(157,174,200,0.18)',
              }} />
          ))}
          <span className="ml-1 text-xs" style={{ color: '#9DAEC8', fontSize: 10 }}>{completedCount}/5</span>
        </div>
      </div>

      {/* ── ROW 2: Scroll ──────────────────────────────────────────── */}
      <div
        className="relative px-4 w-full max-w-[430px] mx-auto flex flex-col"
        style={{ zIndex: 3, overflow: 'hidden', paddingTop: '0.25rem', paddingBottom: '0.25rem' }}
      >
        <p
          className="text-center font-bold uppercase tracking-wider mb-2 flex-shrink-0"
          style={{ color: '#C9A227', fontSize: 'clamp(0.7rem,2vw,0.8125rem)', letterSpacing: '0.14em', fontFamily: 'Georgia, serif' }}
        >
          Мой свиток проявления
        </p>

        <div
          className="flex-1 rounded-2xl px-3 overflow-y-auto"
          style={{
            background: 'linear-gradient(160deg, rgba(18,30,52,0.95) 0%, rgba(12,22,42,0.97) 100%)',
            border: '1px solid rgba(201,162,39,0.2)',
            boxShadow: '0 4px 28px rgba(14,26,46,0.45), inset 0 1px 0 rgba(201,162,39,0.07)',
            paddingTop: '0.5rem',
            paddingBottom: '0.25rem',
          }}
        >
          {SCROLL_KEYS_ORDER.map(key => (
            <ScrollSegment key={key} symbolId={key} entryRaw={state.scrollEntries?.[key] || ''} />
          ))}
        </div>
      </div>

      {/* ── ROW 3: CTAs ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="relative flex flex-col gap-2.5 px-4 w-full max-w-[430px] mx-auto"
        style={{
          zIndex: 3,
          paddingTop: '0.75rem',
          paddingBottom: 'max(env(safe-area-inset-bottom,0px), 1.25rem)',
        }}
      >
        <div className="ornament-line" />

        {!allDone && (
          <button className="btn-primary w-full" onClick={() => navigate('/symbols')}>
            Сделать ещё шаг
          </button>
        )}

        {allDone && (
          <>
            <button className="btn-primary w-full" onClick={() => setManifestOpen(true)}>
              ✦ Моя магия проявления
            </button>
            <div className="flex gap-2.5">
              <button className="btn-secondary flex-1" onClick={() => setContactOpen(true)}>
                Хочу продолжить путь
              </button>
              <button className="btn-secondary flex-1" onClick={() => setDivinationOpen(true)}>
                Прорицание
              </button>
            </div>
          </>
        )}

        {allDone && (
          <button
            onClick={() => setResetOpen(true)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(157,174,200,0.4)', fontSize: '0.75rem',
              padding: '2px 0', textAlign: 'center', transition: 'color 200ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(184,113,133,0.75)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(157,174,200,0.4)'; }}
          >
            Пройти заново
          </button>
        )}
      </motion.div>

      <ContactDialog    open={contactOpen}    onOpenChange={setContactOpen} />
      <DivinationDialog open={divinationOpen} onOpenChange={setDivinationOpen} />
      <ResetDialog      open={resetOpen}      onOpenChange={setResetOpen} onConfirm={handleReset} />
      <ManifestDialog
        open={manifestOpen}
        onOpenChange={setManifestOpen}
        scrollEntries={state.scrollEntries}
        chosenOptions={state.chosenOptions || {}}
      />
    </div>
  );
}
