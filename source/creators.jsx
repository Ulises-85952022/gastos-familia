// Creators — custom categories, income sources, and accounts with icon picker

const ICON_LIBRARY = [
  // Money
  '💰', '💵', '💸', '💳', '🏦', '🪙', '🧾', '📈', '📉', '💎',
  // Home
  '🏠', '🛋️', '🛏️', '🚪', '🔑', '🧹', '🧺', '🪑', '🚿', '🛁',
  // Food
  '🛒', '🍽️', '☕', '🍔', '🍕', '🥗', '🍣', '🍷', '🍺', '🥑',
  // Transport
  '🚗', '🚌', '🚇', '🚕', '⛽', '🛵', '🚲', '✈️', '🚆', '🛞',
  // Health & Sport
  '🩺', '💊', '🏥', '🧘', '🏋️', '⚽', '🎾', '🏊', '🚴', '🦷',
  // Education
  '📚', '🎓', '✏️', '🖊️', '🎒', '📖', '🔬', '🎨', '🎭', '📝',
  // Entertainment
  '🎬', '🎮', '🎵', '🎤', '📺', '🎟️', '🎸', '📷', '🎲', '🃏',
  // Family & pets
  '👨‍👩‍👧', '👶', '🧒', '👴', '👵', '🐶', '🐱', '🐰', '🐠', '🦜',
  // Work & tech
  '💼', '💻', '📱', '🖥️', '⌨️', '🖱️', '📊', '📁', '🖨️', '📡',
  // Travel & misc
  '🏖️', '🗺️', '🧳', '⛺', '🏨', '🎁', '💐', '🌳', '☀️', '✨',
];

const COLOR_LIBRARY = [
  '#E03131', '#D6336C', '#AE3EC9', '#7048E8', '#3B5BDB',
  '#1971C2', '#1098AD', '#0CA678', '#2F9E44', '#74B816',
  '#F08C00', '#E8590C', '#C97A2A', '#5C7CFA', '#868E96',
];

function IconPicker({ icon, setIcon }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6,
      maxHeight: 200, overflowY: 'auto', padding: 4,
      background: T.soft, borderRadius: 14,
    }}>
      {ICON_LIBRARY.map(i => (
        <button key={i} onClick={() => setIcon(i)} style={{
          width: '100%', aspectRatio: '1', border: 'none', borderRadius: 10,
          background: icon === i ? '#fff' : 'transparent',
          boxShadow: icon === i ? '0 2px 6px rgba(0,0,0,0.1), 0 0 0 2px ' + T.ink : 'none',
          cursor: 'pointer', fontSize: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 120ms',
        }}>{i}</button>
      ))}
    </div>
  );
}

function ColorPicker({ color, setColor }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {COLOR_LIBRARY.map(c => (
        <button key={c} onClick={() => setColor(c)} style={{
          width: 30, height: 30, borderRadius: 15,
          background: c, border: 'none', cursor: 'pointer',
          boxShadow: color === c
            ? `0 0 0 2.5px #fff, 0 0 0 5px ${c}, 0 2px 6px rgba(0,0,0,0.15)`
            : '0 1px 3px rgba(0,0,0,0.1)',
          transition: 'all 150ms',
        }} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CATEGORY CREATOR (Gastos / Ingresos / Metas)
// ═══════════════════════════════════════════════════════════
function CategoryCreator({ open, onClose, kind, onCreate }) {
  const [name, setName] = React.useState('');
  const [icon, setIcon] = React.useState('✨');
  const [color, setColor] = React.useState('#7048E8');

  React.useEffect(() => {
    if (open) {
      setName('');
      setIcon(kind === 'ingreso' ? '💰' : kind === 'ahorro' ? '🎯' : '✨');
      setColor(kind === 'ingreso' ? '#2F9E44' : kind === 'ahorro' ? '#3B5BDB' : '#7048E8');
    }
  }, [open, kind]);

  if (!open) return null;

  const title = kind === 'ingreso' ? 'Nueva fuente de ingreso'
              : kind === 'ahorro'  ? 'Nueva meta de ahorro'
              : 'Nueva categoría de gasto';

  const canSave = name.trim().length > 0;

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 85,
      background: 'rgba(20,18,15,0.55)',
      display: 'flex', alignItems: 'flex-end',
      animation: 'fadeIn 200ms',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.bg, width: '100%',
        borderRadius: '28px 28px 0 0',
        padding: '8px 18px 28px',
        maxHeight: '92%', overflowY: 'auto',
        animation: 'slideUp 280ms cubic-bezier(.2,.7,.3,1)',
        boxShadow: '0 -20px 40px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 14px' }}>
          <div style={{ width: 38, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.18)' }}/>
        </div>

        {/* Preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: color + '22', color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 34, flexShrink: 0,
          }}>{icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: T.muted, letterSpacing: 0.5, textTransform: 'uppercase' }}>{title}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: T.ink, letterSpacing: -0.3, marginTop: 2 }}>
              {name || 'Sin nombre'}
            </div>
          </div>
        </div>

        {/* Name */}
        <Field label="Nombre">
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={kind === 'ingreso' ? 'Ej. Renta cobrada, Bonos…' : kind === 'ahorro' ? 'Ej. Viaje a Japón…' : 'Ej. Mascotas, Regalos…'}
            style={inputStyle}
          />
        </Field>

        <Field label="Color">
          <ColorPicker color={color} setColor={setColor} />
        </Field>

        <Field label="Ícono">
          <IconPicker icon={icon} setIcon={setIcon} />
        </Field>

        <button
          disabled={!canSave}
          onClick={() => {
            const id = 'cust_' + Date.now();
            onCreate({ id, name: name.trim(), icon, color, kind });
            onClose();
          }}
          style={{
            width: '100%', border: 'none',
            cursor: canSave ? 'pointer' : 'not-allowed',
            background: canSave ? T.ink : T.soft,
            color: canSave ? '#fff' : T.muted,
            padding: '16px', borderRadius: 16,
            fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
            marginTop: 16,
          }}
        >Crear</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ACCOUNT CREATOR
// ═══════════════════════════════════════════════════════════
function AccountCreator({ open, onClose, onCreate, activeMember }) {
  const [type, setType] = React.useState('Débito');
  const [name, setName] = React.useState('');
  const [mask, setMask] = React.useState('');
  const [balance, setBalance] = React.useState('');
  const [color, setColor] = React.useState('#3B5BDB');
  const [logo, setLogo] = React.useState('B');
  const [limit, setLimit] = React.useState('');

  React.useEffect(() => { if (open) {
    setType('Débito'); setName(''); setMask(''); setBalance(''); setColor('#3B5BDB'); setLogo('B'); setLimit('');
  }}, [open]);

  if (!open) return null;

  const types = [
    { id: 'Débito',    icon: '💳' },
    { id: 'Crédito',   icon: '💰' },
    { id: 'Efectivo',  icon: '💵' },
    { id: 'Inversión', icon: '📈' },
  ];

  const canSave = name.trim().length > 0 && balance !== '';
  const isCredit = type === 'Crédito';

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 85,
      background: 'rgba(20,18,15,0.55)',
      display: 'flex', alignItems: 'flex-end',
      animation: 'fadeIn 200ms',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.bg, width: '100%',
        borderRadius: '28px 28px 0 0',
        padding: '8px 18px 28px',
        maxHeight: '92%', overflowY: 'auto',
        animation: 'slideUp 280ms cubic-bezier(.2,.7,.3,1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 14px' }}>
          <div style={{ width: 38, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.18)' }}/>
        </div>

        {/* Card preview */}
        <div style={{
          width: '100%', height: 130, borderRadius: 20, padding: 18,
          background: `linear-gradient(135deg, ${color} 0%, ${shade(color, -25)} 100%)`,
          color: '#fff', marginBottom: 18,
          boxShadow: '0 12px 30px ' + color + '50',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(255,255,255,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 16,
            }}>{logo || '?'}</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, opacity: 0.85 }}>{type.toUpperCase()}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 2 }}>{name || 'Nueva cuenta'} {mask && '··' + mask.slice(-4)}</div>
            <div style={{ fontSize: 26, fontWeight: 500, lineHeight: 1 }}>
              {balance ? fmt(Number(balance)) : '$0'}
            </div>
          </div>
        </div>

        <Field label="Tipo">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
            {types.map(tp => (
              <button key={tp.id} onClick={() => setType(tp.id)} style={{
                padding: '10px 6px', borderRadius: 12,
                border: '1.5px solid ' + (type === tp.id ? T.ink : T.border),
                background: type === tp.id ? T.ink : '#fff',
                color: type === tp.id ? '#fff' : T.ink2,
                fontWeight: 600, fontSize: 11.5, fontFamily: 'inherit',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}><span style={{ fontSize: 18 }}>{tp.icon}</span>{tp.id}</button>
            ))}
          </div>
        </Field>

        <Field label="Nombre de la cuenta">
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Ej. HSBC Premier, Mercado Pago…"
            style={inputStyle} autoFocus />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label={isCredit ? 'Deuda actual' : 'Saldo'}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: T.muted, fontSize: 14 }}>$</span>
              <input value={balance} onChange={e => setBalance(e.target.value.replace(/[^\d.]/g, ''))}
                placeholder="0" inputMode="decimal"
                style={{ ...inputStyle, paddingLeft: 26 }} />
            </div>
          </Field>
          {type !== 'Efectivo' && (
            <Field label={isCredit ? 'Límite' : 'Últimos 4'}>
              <input value={isCredit ? limit : mask}
                onChange={e => isCredit ? setLimit(e.target.value.replace(/[^\d.]/g, '')) : setMask(e.target.value.slice(0, 4))}
                placeholder={isCredit ? '50000' : '4821'} inputMode="numeric"
                style={inputStyle} />
            </Field>
          )}
        </div>

        <Field label="Color">
          <ColorPicker color={color} setColor={setColor} />
        </Field>

        <Field label="Letra/símbolo del logo">
          <input value={logo} onChange={e => setLogo(e.target.value.slice(0, 2).toUpperCase())}
            placeholder="B" style={{ ...inputStyle, width: 80, textAlign: 'center', fontSize: 18, fontWeight: 700 }} />
        </Field>

        <button
          disabled={!canSave}
          onClick={() => {
            onCreate({
              id: 'acc_' + Date.now(),
              name: name.trim(), type, mask: mask ? '··' + mask : '',
              balance: isCredit ? -Math.abs(Number(balance)) : Number(balance),
              limit: isCredit && limit ? Number(limit) : undefined,
              color, logo, brand: name.trim().split(' ')[0],
              owner: activeMember?.id || APP_DATA.members[0].id,
            });
            onClose();
          }}
          style={{
            width: '100%', border: 'none',
            cursor: canSave ? 'pointer' : 'not-allowed',
            background: canSave ? T.ink : T.soft,
            color: canSave ? '#fff' : T.muted,
            padding: '16px', borderRadius: 16,
            fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
            marginTop: 16,
          }}
        >Agregar cuenta</button>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: T.muted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6, paddingLeft: 4 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  padding: '12px 14px', borderRadius: 12,
  border: '1px solid ' + T.border, background: '#fff',
  fontSize: 14.5, fontFamily: 'inherit', color: T.ink,
  outline: 'none', fontWeight: 500,
};

Object.assign(window, {
  IconPicker, ColorPicker, CategoryCreator, AccountCreator, ICON_LIBRARY, COLOR_LIBRARY,
});
