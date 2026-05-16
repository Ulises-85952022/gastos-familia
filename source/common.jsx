// Primitives & helpers for the family finance prototype

const fmt = (n, opts = {}) => {
  const { sign = false, abbr = false, cents = false } = opts;
  const abs = Math.abs(n);
  let s;
  if (abbr && abs >= 1000) {
    s = abs >= 1000 ? (abs / 1000).toFixed(abs >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k' : abs.toString();
  } else {
    s = abs.toLocaleString('es-MX', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });
  }
  const prefix = sign ? (n > 0 ? '+' : n < 0 ? '−' : '') : (n < 0 ? '−' : '');
  return prefix + '$' + s;
};
window.fmt = fmt;

// Theme tokens
window.T = {
  bg:      '#FAF7F2',
  card:    '#FFFFFF',
  ink:     '#1A1815',
  muted:   '#837E78',
  border:  'rgba(26,24,21,0.08)',
  soft:    '#F1ECE4',
  ink2:    '#3F3A33',
  green:   '#2F9E44',
  greenSoft: '#E6F4EA',
  red:     '#D6336C',
  redSoft: '#FCE7EE',
  blue:    '#3B5BDB',
  blueSoft:'#E7ECFB',
  gold:    '#C97A2A',
  goldSoft:'#FBEFDC',
  purple:  '#7048E8',
};

// ─── Card ────────────────────────────────────────────────────
function Card({ children, style = {}, pad = 16, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: T.card, borderRadius: 22, padding: pad,
      boxShadow: '0 1px 0 rgba(26,24,21,0.04), 0 6px 16px rgba(26,24,21,0.04)',
      border: '1px solid ' + T.border,
      ...style,
    }}>{children}</div>
  );
}

// ─── Pill / Chip ─────────────────────────────────────────────
function Chip({ children, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      border: 'none', cursor: 'pointer',
      padding: '8px 14px', borderRadius: 999,
      background: active ? (color || T.ink) : T.soft,
      color: active ? '#fff' : T.ink2,
      fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
      whiteSpace: 'nowrap',
    }}>{children}</button>
  );
}

// ─── Progress bar ────────────────────────────────────────────
function Progress({ value, color = T.ink, track = T.soft, height = 6 }) {
  return (
    <div style={{ height, background: track, borderRadius: 999, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: Math.min(100, Math.max(0, value)) + '%',
        background: color, borderRadius: 999,
        transition: 'width 600ms cubic-bezier(.2,.7,.3,1)',
      }} />
    </div>
  );
}

// ─── Avatar ──────────────────────────────────────────────────
function Avatar({ member, size = 28, ring }) {
  const m = APP_DATA.members.find(x => x.id === member || x.name === member);
  if (!m) return null;
  return (
    <div style={{
      width: size, height: size, borderRadius: size,
      background: m.color, color: '#fff',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.42,
      border: ring ? `2px solid ${ring}` : '0',
      flexShrink: 0,
    }}>{m.initials}</div>
  );
}

// ─── CategoryIcon ────────────────────────────────────────────
function CatIcon({ cat, size = 38, kind }) {
  const c = cat ? (APP_DATA.categories[cat] || APP_DATA.incomeSources[cat]) : null;
  const isIncome = kind === 'ingreso';
  const isSaving = kind === 'ahorro';
  const meta = isIncome
    ? (APP_DATA.incomeSources[cat] || { icon: '💰', color: T.green })
    : isSaving
    ? { icon: '🐷', color: T.blue }
    : (c || { icon: '✨', color: T.muted });
  return (
    <div style={{
      width: size, height: size, borderRadius: 12,
      background: meta.color + '22',
      color: meta.color,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.5, flexShrink: 0,
    }}>{meta.icon}</div>
  );
}

// ─── Donut chart (SVG) ───────────────────────────────────────
function Donut({ segments, size = 168, thickness = 18, children }) {
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let acc = 0;
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
                stroke={T.soft} strokeWidth={thickness} />
        {segments.map((s, i) => {
          const len = (s.value / total) * C;
          const dash = `${len} ${C - len}`;
          const off = -acc;
          acc += len;
          return (
            <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
                    stroke={s.color} strokeWidth={thickness}
                    strokeDasharray={dash} strokeDashoffset={off}
                    strokeLinecap="butt" />
          );
        })}
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>{children}</div>
    </div>
  );
}

// ─── Section title ───────────────────────────────────────────
function Section({ title, action, onAction, children, gap = 12 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {(title || action) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: T.muted }}>{title}</div>
          {action && (
            <div onClick={onAction} style={{ fontSize: 13, fontWeight: 600, color: T.blue, cursor: onAction ? 'pointer' : 'default' }}>{action}</div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Bottom tab bar ──────────────────────────────────────────
function TabBar({ tab, onTab, onAdd, hideAdd }) {
  const items = [
    { id: 'inicio',     icon: HomeIcon,    label: 'Inicio' },
    { id: 'movimientos',icon: ListIcon,    label: 'Movimientos' },
    { id: 'add',        icon: null,        label: '' },
    { id: 'ahorros',    icon: PiggyIcon,   label: 'Ahorros' },
    { id: 'familia',    icon: FamilyIcon,  label: 'Familia' },
  ];
  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 0,
      padding: '8px 12px 22px',
      background: 'rgba(250,247,242,0.92)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      borderTop: '1px solid ' + T.border,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
      zIndex: 30,
    }}>
      {items.map(it => {
        if (it.id === 'add') {
          if (hideAdd) return <div key="add" style={{ width: 54 }} />;
          return (
            <button key="add" onClick={onAdd} style={{
              border: 'none', cursor: 'pointer',
              width: 54, height: 54, borderRadius: 27,
              background: T.ink, color: '#fff',
              boxShadow: '0 10px 22px rgba(26,24,21,0.25), 0 2px 6px rgba(26,24,21,0.15)',
              transform: 'translateY(-14px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 300, lineHeight: 1,
            }}>+</button>
          );
        }
        const active = tab === it.id;
        const Icon = it.icon;
        return (
          <button key={it.id} onClick={() => onTab(it.id)} style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: active ? T.ink : T.muted, padding: '6px 8px',
            fontFamily: 'inherit',
          }}>
            <Icon active={active} />
            <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Icons (line) ────────────────────────────────────────────
const iconStroke = (active) => ({
  width: 24, height: 24, fill: 'none',
  stroke: 'currentColor', strokeWidth: active ? 2.2 : 1.8,
  strokeLinecap: 'round', strokeLinejoin: 'round',
});
function HomeIcon({ active }) {
  return <svg {...iconStroke(active)}><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-4v-6h-8v6H4a1 1 0 01-1-1v-9z"/></svg>;
}
function ListIcon({ active }) {
  return <svg {...iconStroke(active)}>
    <path d="M4 7h16M4 12h16M4 17h10"/>
  </svg>;
}
function PiggyIcon({ active }) {
  return <svg {...iconStroke(active)}>
    <path d="M5 12c0-3.5 3.5-6 8-6 1.5 0 2.8.3 3.8.7L19 5v3.2c.6.8 1 1.7 1 2.8 0 .8-.2 1.5-.6 2.2L20 16h-2l-.7-1.2c-.6.3-1.3.6-2 .8V18h-3v-1.6c-1 .1-2 .1-3 0V18H6v-2.5C5.4 14.4 5 13.3 5 12z"/>
    <circle cx="9" cy="11" r=".7" fill="currentColor"/>
  </svg>;
}
function FamilyIcon({ active }) {
  return <svg {...iconStroke(active)}>
    <circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.2"/>
    <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5"/>
    <path d="M15 19c0-1.8 1.3-3.5 4-3.5 1.5 0 2.5.5 3 1.3"/>
  </svg>;
}
function PlusIcon() {
  return <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M9 3v12M3 9h12"/></svg>;
}
function ChevronRight() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4l4 4-4 4"/></svg>;
}
function ChevronLeft() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5l-5 5 5 5"/></svg>;
}
function BellIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9z"/><path d="M10 21a2 2 0 004 0"/>
  </svg>;
}
function SearchIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>;
}

Object.assign(window, {
  Card, Chip, Progress, Avatar, CatIcon, Donut, Section, TabBar,
  PlusIcon, ChevronRight, ChevronLeft, BellIcon, SearchIcon,
  HomeIcon, ListIcon, PiggyIcon, FamilyIcon,
});
