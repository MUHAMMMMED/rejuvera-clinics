import React, { useMemo, useState } from 'react';
import './AnalyticsDashboard.css';

// ─── helpers ─────────────────────────────────────────────────────────────────

const fmt = (n) => (n ?? 0).toLocaleString('ar-EG');
const pct = (part, total) => (total ? Math.round((part / total) * 100) : 0);

// Gold-anchored palette that still reads on white
const PALETTE = [
  '#c9a227', '#b8912c', '#d4b44e', '#e8cc7a',
  '#8b6914', '#f0dfa0', '#6b5210', '#a07820',
];

// ─── KPI Card ────────────────────────────────────────────────────────────────

const KpiCard = ({ label, value }) => (
  <div className="ad-kpi">
    <span className="ad-kpi__value">{fmt(value)}</span>
    <span className="ad-kpi__label">{label}</span>
    <div className="ad-kpi__bar" />
  </div>
);

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────

const MiniBarChart = ({ data, valueKey, labelKey }) => {
  const max = Math.max(...data.map((d) => d[valueKey] || 0), 1);
  return (
    <div className="ad-minibar">
      {data.map((row, i) => (
        <div key={i} className="ad-minibar__row">
          <span className="ad-minibar__label">{row[labelKey]}</span>
          <div className="ad-minibar__track">
            <div
              className="ad-minibar__fill"
              style={{
                width: `${(row[valueKey] / max) * 100}%`,
                background: PALETTE[i % PALETTE.length],
              }}
            />
          </div>
          <span className="ad-minibar__count">{fmt(row[valueKey])}</span>
          {row.percentage !== undefined && (
            <span className="ad-minibar__pct">{row.percentage}%</span>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Trend Chart ─────────────────────────────────────────────────────────────

const TrendChart = ({ data, valueKey, labelKey }) => {
  const max = Math.max(...data.map((d) => d[valueKey] || 0), 1);
  const pts = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * 100,
    y: 100 - (d[valueKey] / max) * 88,
    label: d[labelKey],
    val: d[valueKey],
  }));

  const path =
    pts.length > 1 ? pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ') : '';
  const area =
    pts.length > 1
      ? `${path} L ${pts[pts.length - 1].x} 100 L ${pts[0].x} 100 Z`
      : '';

  return (
    <div className="ad-trend">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="ad-trend__svg">
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a227" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
          </linearGradient>
        </defs>
        {area && <path d={area} fill="url(#trendGrad)" />}
        {path && <path d={path} fill="none" stroke="#c9a227" strokeWidth="0.8" />}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#c9a227" />
        ))}
      </svg>
      <div className="ad-trend__labels">
        {pts
          .filter((_, i) => i % Math.ceil(pts.length / 4) === 0 || i === pts.length - 1)
          .map((p, i) => (
            <span key={i} style={{ left: `${p.x}%` }}>{p.label}</span>
          ))}
      </div>
    </div>
  );
};

// ─── Donut Chart ──────────────────────────────────────────────────────────────

const DonutChart = ({ slices }) => {
  let offset = 0;
  const r = 15.9;
  const circ = 2 * Math.PI * r;
  const cleaned = slices.filter((s) => s.value > 0);
  const total = cleaned.reduce((a, s) => a + s.value, 0) || 1;

  return (
    <div className="ad-donut">
      <svg viewBox="0 0 36 36" className="ad-donut__svg">
        {cleaned.map((s, i) => {
          const dash = (s.value / total) * circ;
          const gap = circ - dash;
          const el = (
            <circle
              key={i}
              cx="18" cy="18" r={r}
              fill="none"
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth="3.2"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="ad-donut__legend">
        {cleaned.map((s, i) => (
          <div key={i} className="ad-donut__item">
            <span className="ad-donut__dot" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span className="ad-donut__name">{s.name}</span>
            <span className="ad-donut__val">{pct(s.value, total)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Cross Matrix ─────────────────────────────────────────────────────────────

const CrossMatrix = ({ data }) => {
  if (!data?.length) return <p className="ad-empty">لا توجد بيانات</p>;
  const max = Math.max(...data.map((r) => r.count), 1);
  return (
    <div className="ad-matrix">
      {data.map((row, i) => (
        <div key={i} className="ad-matrix__row">
          <span className="ad-matrix__campaign">{row.campaign}</span>
          <span className="ad-matrix__source">{row.source}</span>
          <div className="ad-matrix__bar-wrap">
            <div className="ad-matrix__bar" style={{ width: `${(row.count / max) * 100}%` }} />
          </div>
          <span className="ad-matrix__count">{row.count}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Period Toggle ────────────────────────────────────────────────────────────

const PeriodToggle = ({ value, onChange }) => (
  <div className="ad-toggle">
    <button className={value === 'weekly' ? 'active' : ''} onClick={() => onChange('weekly')}>أسبوعي</button>
    <button className={value === 'monthly' ? 'active' : ''} onClick={() => onChange('monthly')}>شهري</button>
  </div>
);

// ─── ChartIcon (inline svg) ───────────────────────────────────────────────────

const ChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6"  y1="20" x2="6"  y2="14" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AnalyticsDashboard({ data, showToast, onRefresh }) {
  const [period, setPeriod] = useState('monthly');

  const reports      = data?.reports;
  const overview     = reports?.overview        ?? {};
  const periodStats  = reports?.period_stats    ?? {};
  const servicesBd   = reports?.services_breakdown ?? [];
  const packagesBd   = reports?.packages_breakdown ?? [];
  const sourcesR     = reports?.sources         ?? {};
  const campaignsR   = reports?.campaigns       ?? {};
  const crossM       = reports?.campaign_x_source ?? [];

  const trendData = useMemo(
    () => (period === 'weekly' ? periodStats.weekly_trend : periodStats.monthly_trend) ?? [],
    [period, periodStats]
  );
  const trendLabelKey = period === 'weekly' ? 'week_label' : 'month_label';
  const currentPeriod = period === 'weekly' ? periodStats.this_week : periodStats.this_month;

  const donutSlices = [
    ...servicesBd.slice(0, 4).map((s) => ({ name: s.service_name, value: s.count })),
    ...packagesBd.slice(0, 2).map((p) => ({ name: p.package_name, value: p.count })),
  ];

  return (
    <div className="ad-root" dir="rtl">

      {/* ── Header ── */}
      <div className="ad-header">
        <div className="ad-header__text">
          <div className="ad-header__icon"><ChartIcon /></div>
          <div className="ad-header__titles">
            <h2 className="ad-header__title">التحليلات</h2>
            <p className="ad-header__sub">نظرة شاملة على الحجوزات والحملات</p>
          </div>
        </div>
        <button className="ad-refresh" onClick={onRefresh}>
          <RefreshIcon /> تحديث
        </button>
      </div>

      {/* ── Stat Bar ── */}
      <div className="ad-stat-bar">
        <strong>{fmt(overview.total_count)}</strong>
        <span>إجمالي الحجوزات</span>
        <span className="ad-stat-sep">|</span>
        <strong>{fmt(overview.this_week)}</strong>
        <span>هذا الأسبوع</span>
        <span className="ad-stat-sep">|</span>
        <strong>{fmt(overview.this_month)}</strong>
        <span>هذا الشهر</span>
      </div>

      {/* ── KPI row ── */}
      <div className="ad-kpi-row">
        <KpiCard label="إجمالي الحجوزات" value={overview.total_count} />
        <KpiCard label="خدمات"            value={overview.services_count} />
        <KpiCard label="باقات"            value={overview.packages_count} />
        <KpiCard label="هذا الأسبوع"      value={overview.this_week} />
        <KpiCard label="هذا الشهر"        value={overview.this_month} />
      </div>

      {/* ── Trend + Donut ── */}
      <div className="ad-row">
        <div className="ad-card">
          <div className="ad-card__top">
            <h3 className="ad-card__title">معدل الحجوزات</h3>
            <PeriodToggle value={period} onChange={setPeriod} />
          </div>
          {currentPeriod && (
            <div className="ad-period-pills">
              <span className="pill pill--gold">إجمالي: {fmt(currentPeriod.total)}</span>
              <span className="pill pill--gray">خدمات: {fmt(currentPeriod.services)}</span>
              <span className="pill pill--dark">باقات: {fmt(currentPeriod.packages)}</span>
            </div>
          )}
          {trendData.length > 0
            ? <TrendChart data={trendData} valueKey="total" labelKey={trendLabelKey} />
            : <p className="ad-empty">لا توجد بيانات كافية</p>}
        </div>

        <div className="ad-card">
          <h3 className="ad-card__title">توزيع الحجوزات</h3>
          {donutSlices.length > 0
            ? <DonutChart slices={donutSlices} />
            : <p className="ad-empty">لا توجد بيانات</p>}
        </div>
      </div>

      {/* ── Services + Packages ── */}
      <div className="ad-row">
        <div className="ad-card">
          <h3 className="ad-card__title">أداء الخدمات</h3>
          {servicesBd.length > 0
            ? <MiniBarChart data={servicesBd} valueKey="count" labelKey="service_name" />
            : <p className="ad-empty">لا توجد خدمات</p>}
        </div>
        <div className="ad-card">
          <h3 className="ad-card__title">أداء الباقات</h3>
          {packagesBd.length > 0
            ? <MiniBarChart data={packagesBd} valueKey="count" labelKey="package_name" />
            : <p className="ad-empty">لا توجد باقات</p>}
        </div>
      </div>

      {/* ── Sources + Campaigns ── */}
      <div className="ad-row">

        {/* Sources */}
        <div className="ad-card">
          <div className="ad-card__top">
            <h3 className="ad-card__title">المصادر</h3>
            <span className="ad-badge ad-badge--gray">بدون مصدر: {fmt(sourcesR.no_source)}</span>
          </div>
          {sourcesR.breakdown?.length > 0
            ? <MiniBarChart data={sourcesR.breakdown} valueKey="count" labelKey="source_name" />
            : <p className="ad-empty">لا توجد مصادر</p>}

          {sourcesR.by_period?.length > 0 && (
            <>
              <p className="ad-sub-title">أداء المصادر</p>
              <div className="ad-period-table">
                <div className="ad-period-table__head">
                  <span>المصدر</span><span>الأسبوع</span><span>الشهر</span><span>الكل</span>
                </div>
                {sourcesR.by_period.map((row, i) => (
                  <div key={i} className="ad-period-table__row">
                    <span>{row.source_name}</span>
                    <span>{fmt(row.this_week)}</span>
                    <span>{fmt(row.this_month)}</span>
                    <span className="bold">{fmt(row.total)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Campaigns */}
        <div className="ad-card">
          <div className="ad-card__top">
            <h3 className="ad-card__title">الحملات</h3>
            <span className="ad-badge ad-badge--gray">بدون حملة: {fmt(campaignsR.no_campaign)}</span>
          </div>
          {campaignsR.breakdown?.length > 0
            ? <MiniBarChart data={campaignsR.breakdown} valueKey="count" labelKey="campaign_name" />
            : <p className="ad-empty">لا توجد حملات</p>}

          {campaignsR.by_period?.length > 0 && (
            <>
              <p className="ad-sub-title">أداء الحملات</p>
              <div className="ad-period-table">
                <div className="ad-period-table__head">
                  <span>الحملة</span><span>الأسبوع</span><span>الشهر</span><span>الكل</span>
                </div>
                {campaignsR.by_period.map((row, i) => (
                  <div key={i} className="ad-period-table__row">
                    <span>{row.campaign_name}</span>
                    <span>{fmt(row.this_week)}</span>
                    <span>{fmt(row.this_month)}</span>
                    <span className="bold">{fmt(row.total)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Cross Matrix ── */}
      <div className="ad-card--full">
        <h3 className="ad-card__title">مصفوفة الحملة × المصدر</h3>
        <p className="ad-card__desc">أفضل 10 تركيبات من حيث عدد الحجوزات</p>
        <CrossMatrix data={crossM} />
      </div>

    </div>
  );
}