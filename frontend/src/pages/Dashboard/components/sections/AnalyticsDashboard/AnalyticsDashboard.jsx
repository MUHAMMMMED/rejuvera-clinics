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

// ✅ Safe array checker
const safeArray = (arr) => Array.isArray(arr) ? arr : [];

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
  // ✅ Safe check for data
  const safeData = safeArray(data);
  
  if (safeData.length === 0) {
    return <p className="ad-empty">لا توجد بيانات كافية</p>;
  }
  
  const max = Math.max(...safeData.map((d) => d[valueKey] || 0), 1);
  
  return (
    <div className="ad-minibar">
      {safeData.map((row, i) => (
        <div key={row.id || i} className="ad-minibar__row">
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
  // ✅ Safe check for data
  const safeData = safeArray(data);
  
  if (safeData.length === 0) {
    return <p className="ad-empty">لا توجد بيانات كافية للرسم البياني</p>;
  }
  
  const max = Math.max(...safeData.map((d) => d[valueKey] || 0), 1);
  const pts = safeData.map((d, i) => ({
    x: (i / Math.max(safeData.length - 1, 1)) * 100,
    y: 100 - (d[valueKey] / max) * 88,
    label: d[labelKey],
    val: d[valueKey],
  }));

  const path = pts.length > 1 ? pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ') : '';
  const area = pts.length > 1 ? `${path} L ${pts[pts.length - 1].x} 100 L ${pts[0].x} 100 Z` : '';

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
  // ✅ Safe check for slices
  const safeSlices = safeArray(slices);
  let offset = 0;
  const r = 15.9;
  const circ = 2 * Math.PI * r;
  const cleaned = safeSlices.filter((s) => s.value > 0);
  const total = cleaned.reduce((a, s) => a + s.value, 0) || 1;

  if (cleaned.length === 0) {
    return <p className="ad-empty">لا توجد بيانات للرسم الدائري</p>;
  }

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
  const safeData = safeArray(data);
  
  if (safeData.length === 0) {
    return <p className="ad-empty">لا توجد بيانات للمصفوفة</p>;
  }
  
  const max = Math.max(...safeData.map((r) => r.count), 1);
  return (
    <div className="ad-matrix">
      {safeData.map((row, i) => (
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
  const [period, setPeriod] = useState('weekly');

  // ✅ Safe data extraction with fallbacks
  const reports = data?.reports || {};
  const overview = reports.overview ?? {
    total_count: 0,
    services_count: 0,
    packages_count: 0,
    this_week: 0,
    this_month: 0
  };
  
  const periodStats = reports.period_stats ?? {
    this_week: { total: 0, services: 0, packages: 0 },
    this_month: { total: 0, services: 0, packages: 0 },
    weekly_trend: [],
    monthly_trend: []
  };
  
  const servicesBd = safeArray(reports.services_breakdown);
  const packagesBd = safeArray(reports.packages_breakdown);
  const sourcesR = reports.sources ?? { breakdown: [], by_period: [], no_source: 0 };
  const campaignsR = reports.campaigns ?? { breakdown: [], by_period: [], no_campaign: 0 };
  const crossM = safeArray(reports.campaign_x_source);

  const trendData = useMemo(
    () => (period === 'weekly' ? periodStats.weekly_trend : periodStats.monthly_trend) ?? [],
    [period, periodStats.weekly_trend, periodStats.monthly_trend]
  );
  
  const trendLabelKey = period === 'weekly' ? 'week_label' : 'month_label';
  const currentPeriod = period === 'weekly' ? periodStats.this_week : periodStats.this_month;

  // ✅ Safe donut slices creation
  const donutSlices = [
    ...servicesBd.slice(0, 4).map((s) => ({ 
      name: s.service_name || 'خدمة', 
      value: s.count || 0 
    })),
    ...packagesBd.slice(0, 2).map((p) => ({ 
      name: p.package_name || 'باقة', 
      value: p.count || 0 
    }))
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
          <TrendChart data={trendData} valueKey="total" labelKey={trendLabelKey} />
        </div>

        <div className="ad-card">
          <h3 className="ad-card__title">توزيع الحجوزات</h3>
          <DonutChart slices={donutSlices} />
        </div>
      </div>

      {/* ── Services + Packages ── */}
      <div className="ad-row">
        <div className="ad-card">
          <h3 className="ad-card__title">أداء الخدمات</h3>
          <MiniBarChart data={servicesBd} valueKey="count" labelKey="service_name" />
        </div>
        <div className="ad-card">
          <h3 className="ad-card__title">أداء الباقات</h3>
          <MiniBarChart data={packagesBd} valueKey="count" labelKey="package_name" />
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
          <MiniBarChart data={sourcesR.breakdown} valueKey="count" labelKey="source_name" />

          {safeArray(sourcesR.by_period).length > 0 && (
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
          <MiniBarChart data={campaignsR.breakdown} valueKey="count" labelKey="campaign_name" />

          {safeArray(campaignsR.by_period).length > 0 && (
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