import { motion } from 'framer-motion';
import { Download, RefreshCw, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportMetrics, loadMetrics, resetMetrics } from '../lib/storage';

function MetricCard({ label, value, sub }) {
  return (
    <div
      className="flex flex-col gap-1 p-4 rounded-xl"
      style={{ background: 'rgba(14,26,46,0.7)', border: '1px solid rgba(201,162,39,0.18)' }}
    >
      <p className="text-xs uppercase tracking-wider" style={{ color: '#9DAEC8', letterSpacing: '0.12em' }}>
        {label}
      </p>
      <p className="text-2xl font-bold" style={{ color: '#E0C060' }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: 'rgba(157,174,200,0.6)' }}>{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(() => loadMetrics());
  const [confirmReset, setConfirmReset] = useState(false);

  const load = useCallback(() => { setMetrics(loadMetrics()); }, []);
  useEffect(() => { load(); }, [load]);

  const handleExport = () => {
    const data = exportMetrics();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `larets-metrics-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    resetMetrics();
    load();
    setConfirmReset(false);
  };

  if (!metrics) return null;

  const avgRating = metrics.ratings?.length
    ? (metrics.ratings.reduce((s, r) => s + r.rating, 0) / metrics.ratings.length).toFixed(1)
    : '—';

  return (
    <div className="relative min-h-svh w-full" style={{ background: 'linear-gradient(160deg, #0B1525 0%, #0E1A2E 100%)' }}>
      <div className="relative max-w-[600px] mx-auto px-4 py-6" style={{ zIndex: 1 }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-semibold" style={{ color: '#E0C060', fontSize: 'clamp(1rem,3vw,1.25rem)', fontFamily: 'Georgia, serif' }}>
              Дашборд
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(157,174,200,0.6)' }}>
              Ларец волшебницы · Аналитика
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} aria-label="Обновить"
              style={{ width: 36, height: 36, minWidth: 36, display:'flex', alignItems:'center', justifyContent:'center', background: 'rgba(14,26,46,0.6)', border: '1px solid rgba(157,174,200,0.25)', color: '#9DAEC8', cursor: 'pointer', borderRadius: '50%' }}>
              <RefreshCw size={15} />
            </button>
            <button onClick={() => navigate('/')} aria-label="Закрыть дашборд"
              style={{ width: 36, height: 36, minWidth: 36, display:'flex', alignItems:'center', justifyContent:'center', background: 'rgba(14,26,46,0.6)', border: '1px solid rgba(157,174,200,0.25)', color: '#9DAEC8', cursor: 'pointer', borderRadius: '50%' }}>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Metrics grid */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="grid grid-cols-2 gap-3 mb-6">
          <MetricCard label="Посетители"        value={metrics.visitors   || 0} />
          <MetricCard label="Пользователи"      value={metrics.users      || 0} />
          <MetricCard label="Ключевые действия" value={metrics.keyActions || 0} />
          <MetricCard label="Возвраты"          value={metrics.returns    || 0} />
          <MetricCard label="Средняя оценка"    value={avgRating} sub={`${metrics.ratings?.length || 0} оценок`} />
        </motion.div>

        {/* Contacts note */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl p-4 mb-5"
          style={{ background: 'rgba(14,26,46,0.7)', border: '1px solid rgba(201,162,39,0.18)' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: '#C9D3E7' }}>Контакты</p>
          <p className="text-xs" style={{ color: 'rgba(157,174,200,0.6)' }}>
            Контакты хранятся в Supabase и доступны только через серверный дашборд на Beget.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex flex-col gap-3 sm:flex-row">
          <button className="btn-primary flex-1 flex items-center justify-center gap-2" onClick={handleExport}>
            <Download size={16} /> Экспорт метрик
          </button>
          <button className="btn-secondary flex-1 flex items-center justify-center gap-2" onClick={handleReset}
            style={{ borderColor: confirmReset ? '#B87185' : undefined, color: confirmReset ? '#B87185' : undefined }}>
            <RefreshCw size={16} />
            {confirmReset ? 'Подтвердить сброс' : 'Сбросить метрики'}
          </button>
        </motion.div>

        {confirmReset && (
          <p className="text-xs text-center mt-2" style={{ color: '#B87185' }}>
            Нажмите ещё раз для подтверждения. Это действие необратимо.
          </p>
        )}
      </div>
    </div>
  );
}
