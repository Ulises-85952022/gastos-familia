// Screens — Dashboard, Movimientos, Ahorros, Presupuestos, Familia, AddSheet

// ═══════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════
function DashboardScreen({ goTab, openAdd, user, monthOverride, openAccounts, openAssistant, openReminders, openUpcoming, accounts, openAccountCreator, goals, activeMember, members, onSwitchMember, totalBalance, upcoming, onPayUpcoming }) {
  const m = monthOverride || { income: 0, expenses: 0, savings: 0, label: '' };
  const hasAccounts = accounts && accounts.length > 0;
  const disponible = hasAccounts ? totalBalance || 0 : m.income - m.expenses - m.savings;
  const pctUsado = m.income > 0 ? Math.round(((m.expenses + m.savings) / m.income) * 100) : 0;

  const segments = [
    { value: m.expenses, color: T.red },
    { value: m.savings,  color: T.blue },
  ];

  // top categories from budgets
  const topCats = [...APP_DATA.budgets]
    .sort((a,b) => b.spent - a.spent).slice(0, 4);

  const next3 = (upcoming || []).filter(p => !p.paid).slice(0, 3);

  return (
    <div style={{ padding: '0 18px 120px', display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
        <div>
          <div style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>
            {activeMember && activeMember.id === 'familia' ? 'Vista combinada' : 'Hola,'}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.4, color: T.ink, display: 'flex', alignItems: 'baseline', gap: 6 }}>
            {activeMember && activeMember.id === 'familia' ? 'Resumen familiar' : user.name}
            {(!activeMember || activeMember.id !== 'familia') && <span style={{ fontSize: 20 }}>👋</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Member switcher */}
          {members && members.length > 1 && (
            <div style={{ display: 'flex', gap: 4 }}>
              {members.map(m => (
                <button key={m.id} onClick={() => onSwitchMember && onSwitchMember(m)} style={{
                  width: 36, height: 36, borderRadius: 18,
                  background: m.color,
                  border: activeMember && activeMember.id === m.id ? '2.5px solid ' + T.ink : '2px solid transparent',
                  color: '#fff', fontWeight: 800, fontSize: 11,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: activeMember && activeMember.id !== m.id ? 0.45 : 1,
                  transition: 'all 200ms',
                }}>{m.initials}</button>
              ))}
            </div>
          )}
          <button style={{ ...iconBtn, background: 'linear-gradient(135deg, #7048E8 0%, #3B5BDB 100%)', color: '#fff', border: 'none' }} onClick={openAssistant}>
            <span style={{ fontSize: 18 }}>✨</span>
          </button>
          <button style={iconBtn} onClick={openReminders}>
            <BellIcon/>
            <div style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, background: T.red, border: '2px solid #fff' }}/>
          </button>
        </div>
      </div>

      {/* Hero balance card */}
      <Card pad={20} style={{
        background: 'linear-gradient(150deg, #1A1815 0%, #2A2521 70%, #3A332B 100%)',
        color: '#fff', border: 'none',
        boxShadow: '0 18px 38px rgba(26,24,21,0.18), 0 2px 6px rgba(26,24,21,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
            {hasAccounts ? 'Saldo en cuentas' : 'Disponible'} · {m.label}
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', padding: '4px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.1)' }}>
            {pctUsado}% usado
          </div>
        </div>
        <div style={{ fontFamily: 'inherit', fontWeight: 500, fontSize: 46, lineHeight: 1, letterSpacing: -1, fontWeight: 400 }}>
          {fmt(disponible)}<span style={{ fontSize: 22, opacity: 0.55 }}>.{(disponible % 1 ? '00' : '00')}</span>
        </div>
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'Ingresos',  v: m.income,   c: '#5DCC7A' },
            { label: 'Gastos',    v: m.expenses, c: '#FF8A9A' },
            { label: 'Ahorrado',  v: m.savings,  c: '#8AA1FF' },
          ].map(s => (
            <div key={s.label} style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: s.c }} />
                <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.65)', fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>{s.label}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, letterSpacing: -0.3 }}>{fmt(s.v)}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick action grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
        {[
          { label: 'Ingreso', icon: '💰', color: T.green,  onClick: () => openAdd('ingreso') },
          { label: 'Gasto',   icon: '💸', color: T.red,    onClick: () => openAdd('gasto') },
          { label: 'Ahorro',  icon: '🐷', color: T.blue,   onClick: () => openAdd('ahorro') },
          { label: 'Cobrar',  icon: '🤝', color: T.gold,   onClick: () => {} },
        ].map(q => (
          <button key={q.label} onClick={q.onClick} style={{
            background: T.card, border: '1px solid ' + T.border, borderRadius: 18,
            padding: '12px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 17, background: q.color + '18',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>{q.icon}</div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: T.ink }}>{q.label}</div>
          </button>
        ))}
      </div>

      {/* Accounts strip */}
      <AccountsStrip accounts={accounts} onOpen={(id) => id === 'new' ? openAccountCreator() : openAccounts()} />

      {/* Insights row */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -18px', padding: '0 18px', scrollbarWidth: 'none' }}>
        {APP_DATA.insights.map((it, i) => {
          const bg = it.type === 'warn' ? T.goldSoft : it.type === 'good' ? T.greenSoft : T.blueSoft;
          const fg = it.type === 'warn' ? T.gold    : it.type === 'good' ? T.green     : T.blue;
          return (
            <div key={i} style={{
              flex: '0 0 220px', background: bg, borderRadius: 16, padding: '12px 14px',
              display: 'flex', gap: 10, alignItems: 'flex-start',
              border: '1px solid ' + fg + '22',
            }}>
              <div style={{ fontSize: 18 }}>{it.icon}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: fg, lineHeight: 1.35 }}>{it.text}</div>
            </div>
          );
        })}
      </div>

      {/* Donut: gastos vs ahorro vs disponible */}
      <Card pad={18}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>Tu mes en una mirada</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>De cada $100 que entran</div>
          </div>
          <button onClick={() => goTab('movimientos')} style={miniLink}>Ver detalle <ChevronRight/></button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Donut segments={[
            { value: m.expenses, color: T.red },
            { value: m.savings, color: T.blue },
            { value: Math.max(0, m.income - m.expenses - m.savings), color: T.soft },
          ]} size={140} thickness={16}>
            <div style={{ fontSize: 11, color: T.muted, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>Ingreso</div>
            <div style={{ fontFamily: 'inherit', fontWeight: 500, fontSize: 28, lineHeight: 1, marginTop: 4, color: T.ink }}>{fmt(m.income, { abbr: true })}</div>
          </Donut>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Gastos',     v: m.expenses, c: T.red },
              { label: 'Ahorrado',   v: m.savings,  c: T.blue },
              { label: 'Disponible', v: Math.max(0, m.income - m.expenses - m.savings), c: T.muted },
            ].map(r => {
              const pct = m.income > 0 ? Math.round((r.v / m.income) * 100) : 0;
              return (
                <div key={r.label}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: r.c }} />
                      <div style={{ fontSize: 12.5, color: T.ink2, fontWeight: 600 }}>{r.label}</div>
                    </div>
                    <div style={{ fontSize: 12.5, color: T.ink, fontWeight: 700 }}>{pct}%</div>
                  </div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 2, marginLeft: 16 }}>{fmt(r.v)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Próximos pagos */}
      <Section title="Próximos pagos" action="Ver todo" onAction={openUpcoming}>
        {next3.length === 0 ? (
          <Card pad={18} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>✅</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: T.muted }}>Sin pagos pendientes este mes</div>
          </Card>
        ) : (
          <Card pad={0}>
            {next3.map((p, i) => {
              const disp = getUpcomingDateInfo(p);
              const urgentColor = disp.isOverdue ? T.red : disp.isToday ? T.gold : disp.daysLeft <= 3 ? T.gold : T.muted;
              const urgentLabel = disp.isOverdue ? 'Vencido' : disp.isToday ? 'Hoy' : 'en ' + disp.daysLeft + 'd';
              return (
                <div key={p.id || p.name} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                  borderBottom: i < next3.length - 1 ? '1px solid ' + T.border : 'none',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: (disp.isOverdue || disp.isToday) ? T.red + '15' : T.soft,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                  }}>{p.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: T.ink }}>{p.name}</div>
                      {p.auto && <div style={{ fontSize: 10, fontWeight: 700, color: T.blue, background: T.blueSoft, padding: '2px 6px', borderRadius: 4 }}>AUTO</div>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <div style={{ fontSize: 12, color: T.muted }}>{disp.date} · {p.who}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: urgentColor, background: urgentColor + '18', padding: '1px 5px', borderRadius: 999 }}>
                        {urgentLabel}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>{fmt(p.amount)}</div>
                    {onPayUpcoming && !p.auto && (
                      <button onClick={() => onPayUpcoming(p.id)} style={{
                        background: T.ink, color: '#fff', border: 'none',
                        padding: '4px 10px', borderRadius: 999, fontSize: 10.5, fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}>Pagar</button>
                    )}
                  </div>
                </div>
              );
            })}
          </Card>
        )}
      </Section>

      {/* Metas */}
      <Section title="Metas de ahorro" action="Ver todas">
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', margin: '0 -18px', padding: '0 18px', scrollbarWidth: 'none' }}>
          {(goals || []).slice(0, 3).map(g => {
            const pct = g.target > 0 ? Math.round((g.saved / g.target) * 100) : 0;
            return (
              <Card key={g.id} pad={14} style={{ flex: '0 0 200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 10, background: g.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{g.icon}</div>
                  <div style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>{g.deadline}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 8 }}>{g.name}</div>
                <Progress value={pct} color={g.color} height={6} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12 }}>
                  <span style={{ fontWeight: 700, color: T.ink }}>{fmt(g.saved, { abbr: true })}</span>
                  <span style={{ color: T.muted }}>de {fmt(g.target, { abbr: true })}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Top categorías */}
      <Section title="Top categorías del mes" action="Presupuestos">
        <Card pad={16}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {topCats.map(b => {
              const c = APP_DATA.categories[b.cat];
              const pct = Math.round((b.spent / b.limit) * 100);
              const over = pct > 100;
              return (
                <div key={b.cat}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <CatIcon cat={b.cat} size={28} />
                    <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: T.ink }}>{c.name}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: over ? T.red : T.ink }}>{fmt(b.spent)}</div>
                  </div>
                  <Progress value={Math.min(100, pct)} color={over ? T.red : c.color} height={5} />
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>
                    {over ? `${pct - 100}% sobre presupuesto` : `Quedan ${fmt(b.limit - b.spent)}`}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </Section>
    </div>
  );
}

const iconBtn = {
  position: 'relative',
  width: 40, height: 40, borderRadius: 20,
  background: T.card, border: '1px solid ' + T.border,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: T.ink, cursor: 'pointer',
};

const miniLink = {
  border: 'none', background: 'transparent', cursor: 'pointer',
  color: T.blue, fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
  display: 'flex', alignItems: 'center', gap: 2,
};

// ═══════════════════════════════════════════════════════════
// MOVIMIENTOS
// ═══════════════════════════════════════════════════════════
function MovimientosScreen({ transactions, activeMember, onDelete }) {
  const [filter, setFilter] = React.useState('todos');
  const [member, setMember] = React.useState('todos');
  const currentMonthLabel = React.useMemo(() => {
    const d = new Date();
    const m = d.toLocaleString('es-MX', { month: 'long' });
    return m.charAt(0).toUpperCase() + m.slice(1) + ' ' + d.getFullYear();
  }, []);

  const filtered = transactions.filter(t => {
    if (filter !== 'todos' && t.kind !== filter) return false;
    if (member !== 'todos' && t.who !== member) return false;
    return true;
  });

  // group by day
  const grouped = {};
  filtered.forEach(t => { (grouped[t.day] ||= []).push(t); });

  const totals = filtered.reduce((acc, t) => {
    if (t.kind === 'ingreso') acc.in += t.amount;
    else if (t.kind === 'gasto') acc.out += t.amount;
    else acc.sav += t.amount;
    return acc;
  }, { in: 0, out: 0, sav: 0 });

  return (
    <div style={{ padding: '0 18px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ paddingTop: 8 }}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>Movimientos</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: T.ink, letterSpacing: -0.3 }}>{currentMonthLabel}</div>
      </div>

      {/* Summary chips */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <SummaryStat label="Ingresos" value={totals.in}  color={T.green} sign="+" />
        <SummaryStat label="Gastos"   value={totals.out} color={T.red}   sign="−" />
        <SummaryStat label="Ahorro"   value={totals.sav} color={T.blue}  sign="→" />
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -18px', padding: '0 18px', scrollbarWidth: 'none' }}>
        <Chip active={filter==='todos'} onClick={() => setFilter('todos')}>Todo</Chip>
        <Chip active={filter==='ingreso'} onClick={() => setFilter('ingreso')} color={T.green}>Ingresos</Chip>
        <Chip active={filter==='gasto'} onClick={() => setFilter('gasto')} color={T.red}>Gastos</Chip>
        <Chip active={filter==='ahorro'} onClick={() => setFilter('ahorro')} color={T.blue}>Ahorros</Chip>
        <div style={{ width: 1, background: T.border, margin: '4px 4px' }} />
        <Chip active={member==='todos'} onClick={() => setMember('todos')}>Todos</Chip>
        {APP_DATA.members.map(m => (
          <Chip key={m.id} active={member===m.name} onClick={() => setMember(m.name)} color={m.color}>{m.name}</Chip>
        ))}
      </div>

      {/* Grouped list */}
      {Object.keys(grouped).length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px 20px', color: T.muted }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>{transactions.length === 0 ? '📋' : '🔍'}</div>
          <div style={{ fontWeight: 600 }}>{transactions.length === 0 ? 'Aún no hay movimientos' : 'Sin movimientos con esos filtros'}</div>
          {transactions.length === 0 && <div style={{ fontSize: 12, marginTop: 6 }}>Toca + para registrar tu primer gasto o ingreso</div>}
        </Card>
      ) : Object.entries(grouped).map(([day, items]) => {
        const dayTotal = items.reduce((s, t) => s + (t.kind === 'gasto' ? -t.amount : t.amount), 0);
        return (
          <div key={day}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 4px 8px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink2 }}>{day}</div>
              <div style={{ fontSize: 11.5, color: T.muted, fontWeight: 600 }}>
                Neto: <span style={{ color: dayTotal >= 0 ? T.green : T.red }}>{fmt(dayTotal, { sign: true })}</span>
              </div>
            </div>
            <Card pad={0}>
              {items.map((t, i) => <TxRow key={t.id} t={t} last={i === items.length - 1} activeMember={activeMember} onDelete={onDelete} />)}
            </Card>
          </div>
        );
      })}
    </div>
  );
}

function SummaryStat({ label, value, color, sign }) {
  return (
    <div style={{
      background: T.card, border: '1px solid ' + T.border, borderRadius: 14,
      padding: '10px 12px',
    }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: T.muted, letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color, marginTop: 2, letterSpacing: -0.2 }}>
        {sign}{fmt(value, { abbr: true }).replace('$', '$')}
      </div>
    </div>
  );
}

function TxRow({ t, last, activeMember, onDelete }) {
  const isIncome = t.kind === 'ingreso';
  const isSaving = t.kind === 'ahorro';
  const meta = isIncome ? APP_DATA.incomeSources[t.src] : (t.cat ? APP_DATA.categories[t.cat] : null);
  const color = isIncome ? T.green : isSaving ? T.blue : T.ink;
  const sign  = isIncome ? '+' : isSaving ? '→' : '−';
  const isMine = activeMember && t.who === activeMember.name;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
      borderBottom: last ? 'none' : '1px solid ' + T.border,
      opacity: activeMember && !isMine ? 0.78 : 1,
    }}>
      <CatIcon cat={isIncome ? t.src : t.cat} kind={t.kind} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 14.5, fontWeight: 600, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{t.desc}</div>
          {isMine && (
            <div style={{ fontSize: 9, fontWeight: 800, color: T.green, background: T.greenSoft, padding: '2px 6px', borderRadius: 4, letterSpacing: 0.4, flexShrink: 0 }}>TUYO</div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
          <Avatar member={t.who} size={16} />
          <div style={{ fontSize: 11.5, color: T.muted, fontWeight: 500 }}>
            {t.who} · {meta ? meta.name : 'Ahorro'}
          </div>
          {activeMember && !isMine && (
            <span style={{ fontSize: 10, color: T.muted }}>· 🔒</span>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color, letterSpacing: -0.2 }}>
          {sign}{fmt(t.amount).replace('$', '$').replace('−', '')}
        </div>
        {onDelete && isMine && (
          <button onClick={() => onDelete(t.id)} style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            color: T.muted, fontSize: 16, padding: '2px 4px', lineHeight: 1,
            opacity: 0.5,
          }}>×</button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// AHORROS
// ═══════════════════════════════════════════════════════════
function AhorrosScreen({ goals, onDeposit }) {
  const total = goals.reduce((s, g) => s + g.saved, 0);
  const target = goals.reduce((s, g) => s + g.target, 0);
  const pct = Math.round((total / target) * 100);

  return (
    <div style={{ padding: '0 18px 120px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ paddingTop: 8 }}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>Tus metas</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: T.ink, letterSpacing: -0.3 }}>Ahorros</div>
      </div>

      {/* Hero */}
      <Card pad={20} style={{
        background: 'linear-gradient(135deg, #E7ECFB 0%, #F4E7FB 100%)',
        border: '1px solid rgba(59,91,219,0.18)',
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: T.blue }}>Total ahorrado</div>
        <div style={{ fontFamily: 'inherit', fontWeight: 500, fontSize: 48, fontWeight: 400, color: T.ink, letterSpacing: -1, lineHeight: 1, marginTop: 4 }}>
          {fmt(total)}
        </div>
        <div style={{ fontSize: 13, color: T.ink2, marginTop: 6 }}>
          {pct}% camino a tu meta total · <span style={{ color: T.blue, fontWeight: 600 }}>{fmt(target)}</span>
        </div>
        <div style={{ marginTop: 14 }}>
          <Progress value={pct} color={T.blue} height={8} track="rgba(59,91,219,0.15)" />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button style={{ ...primaryBtn, background: T.blue }}>+ Nueva meta</button>
          <button style={secondaryBtn}>Aportar a meta</button>
        </div>
      </Card>

      {/* Goals list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {goals.map(g => {
          const pct = Math.round((g.saved / g.target) * 100);
          const remaining = g.target - g.saved;
          return (
            <Card key={g.id} pad={16}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 14, background: g.color + '20',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>{g.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: T.ink }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                    🗓️ {g.deadline} · Faltan {fmt(remaining, { abbr: true })}
                  </div>
                </div>
                <button onClick={() => onDeposit(g.id)} style={{
                  background: g.color + '18', color: g.color, border: 'none',
                  padding: '8px 12px', borderRadius: 999, fontSize: 12.5, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>+ Aportar</button>
              </div>
              <Progress value={pct} color={g.color} height={8} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 13 }}>
                <span style={{ fontWeight: 700, color: T.ink }}>{fmt(g.saved)}</span>
                <span style={{ color: T.muted }}>{pct}% de {fmt(g.target)}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

const primaryBtn = {
  flex: 1, background: T.ink, color: '#fff', border: 'none', borderRadius: 14,
  padding: '12px 14px', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
};
const secondaryBtn = {
  flex: 1, background: '#fff', color: T.ink, border: '1px solid ' + T.border, borderRadius: 14,
  padding: '12px 14px', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
};

// ═══════════════════════════════════════════════════════════
// FAMILIA
// ═══════════════════════════════════════════════════════════
function FamiliaScreen({ user, activeMember, transactions, onAction }) {
  const ym = new Date().toISOString().slice(0, 7);
  const contribByMember = {};
  (transactions || []).forEach(t => {
    if (!contribByMember[t.who]) contribByMember[t.who] = { in: 0, out: 0, sav: 0, inAll: 0, outAll: 0, savAll: 0 };
    contribByMember[t.who].inAll  += t.kind === 'ingreso' ? t.amount : 0;
    contribByMember[t.who].outAll += t.kind === 'gasto'   ? t.amount : 0;
    contribByMember[t.who].savAll += t.kind === 'ahorro'  ? t.amount : 0;
    if (t.date && t.date.startsWith(ym)) {
      if (t.kind === 'ingreso') contribByMember[t.who].in  += t.amount;
      else if (t.kind === 'gasto') contribByMember[t.who].out += t.amount;
      else contribByMember[t.who].sav += t.amount;
    }
  });
  const me = activeMember || APP_DATA.members[0];
  const isFamiliaMode = me.id === 'familia';
  const realMembers = APP_DATA.members;

  return (
    <div style={{ padding: '0 18px 120px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ paddingTop: 8 }}>
        <div style={{ fontSize: 13, color: T.muted, fontWeight: 500 }}>{APP_DATA.user.family}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: T.ink, letterSpacing: -0.3 }}>Familia</div>
      </div>

      {/* Month report — per member breakdown */}
      <Card pad={18}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.muted, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 14 }}>Reporte del mes</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid ' + T.border }}>
          <div style={{ flex: 1, fontSize: 11, color: T.muted, fontWeight: 600 }}>Miembro</div>
          <div style={{ width: 64, fontSize: 11, color: T.green, fontWeight: 700, textAlign: 'right' }}>Ingresos</div>
          <div style={{ width: 64, fontSize: 11, color: T.red, fontWeight: 700, textAlign: 'right' }}>Gastos</div>
          <div style={{ width: 64, fontSize: 11, color: T.blue, fontWeight: 700, textAlign: 'right' }}>Ahorros</div>
        </div>
        {realMembers.map((m, i) => {
          const c = contribByMember[m.name] || { in: 0, out: 0, sav: 0 };
          return (
            <div key={m.id} style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '8px 0', borderBottom: i < realMembers.length - 1 ? '1px solid ' + T.border : 'none' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: m.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>{m.initials}</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>{m.name}</div>
              </div>
              <div style={{ width: 64, fontSize: 12.5, fontWeight: 700, color: T.green, textAlign: 'right' }}>{fmt(c.in, { abbr: true })}</div>
              <div style={{ width: 64, fontSize: 12.5, fontWeight: 700, color: T.red, textAlign: 'right' }}>{fmt(c.out, { abbr: true })}</div>
              <div style={{ width: 64, fontSize: 12.5, fontWeight: 700, color: T.blue, textAlign: 'right' }}>{fmt(c.sav, { abbr: true })}</div>
            </div>
          );
        })}
        {(() => {
          const totIn  = realMembers.reduce((s, m) => s + (contribByMember[m.name]?.in  || 0), 0);
          const totOut = realMembers.reduce((s, m) => s + (contribByMember[m.name]?.out || 0), 0);
          const totSav = realMembers.reduce((s, m) => s + (contribByMember[m.name]?.sav || 0), 0);
          return (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '10px 0 0', borderTop: '1.5px solid ' + T.ink2, marginTop: 4 }}>
              <div style={{ flex: 1, fontSize: 12.5, fontWeight: 800, color: T.ink }}>Total familia</div>
              <div style={{ width: 64, fontSize: 12.5, fontWeight: 800, color: T.green, textAlign: 'right' }}>{fmt(totIn, { abbr: true })}</div>
              <div style={{ width: 64, fontSize: 12.5, fontWeight: 800, color: T.red, textAlign: 'right' }}>{fmt(totOut, { abbr: true })}</div>
              <div style={{ width: 64, fontSize: 12.5, fontWeight: 800, color: T.blue, textAlign: 'right' }}>{fmt(totSav, { abbr: true })}</div>
            </div>
          );
        })()}
      </Card>

      {/* Your card — hidden in Familia mode */}
      {!isFamiliaMode && <Card pad={18} style={{ background: 'linear-gradient(135deg, #FBEFDC 0%, #FCE7EE 100%)', border: '1px solid rgba(201,122,42,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28, background: me.color, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, border: '3px solid #fff',
          }}>{me.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.ink }}>{me.name}</div>
              <div style={{ fontSize: 9, fontWeight: 800, color: T.green, background: 'rgba(255,255,255,0.7)', padding: '2px 6px', borderRadius: 4, letterSpacing: 0.4 }}>TÚ</div>
            </div>
            <div style={{ fontSize: 12, color: T.muted }}>{me.role} · Sólo tú puedes editar lo tuyo</div>
          </div>
          <button onClick={() => onAction && onAction('edit-profile')} style={{
            background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: 999, padding: '8px 14px', fontSize: 12.5, fontWeight: 700,
            color: T.ink, cursor: 'pointer', fontFamily: 'inherit',
          }}>Editar</button>
        </div>
      </Card>}

      {/* Sharing explanation */}
      <Card pad={16}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 10 }}>Cómo funciona la familia</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 16 }}>👀</div>
            <div style={{ fontSize: 12.5, color: T.ink2, lineHeight: 1.4 }}>
              <b>Todos ven todo.</b> Movimientos, presupuestos, metas y cuentas son transparentes para la familia.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 16 }}>🔒</div>
            <div style={{ fontSize: 12.5, color: T.ink2, lineHeight: 1.4 }}>
              <b>Cada quien sólo mueve lo suyo.</b> El selector "registrado por" siempre eres tú.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 16 }}>🤝</div>
            <div style={{ fontSize: 12.5, color: T.ink2, lineHeight: 1.4 }}>
              <b>Cuentas compartidas:</b> los titulares (ej. tú y Carla) pueden mover ambos.
            </div>
          </div>
        </div>
      </Card>

      <Section title="Miembros" action="+ Invitar" onAction={() => onAction && onAction('invite')}>
        <Card pad={0}>
          {APP_DATA.members.filter(m => isFamiliaMode || m.id !== me.id).map((m, i, arr) => {
            const c = contribByMember[m.name] || { in: 0, out: 0, sav: 0 };
            return (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                borderBottom: i < arr.length - 1 ? '1px solid ' + T.border : 'none',
              }}>
                <Avatar member={m.id} size={42} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: T.ink }}>{m.name}</div>
                  <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>{m.role}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: T.muted, fontWeight: 600 }}>Aportó este mes</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.green }}>{fmt(c.in, { abbr: true })}</div>
                </div>
              </div>
            );
          })}
          <div onClick={() => onAction && onAction('invite')} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
            background: T.soft, cursor: 'pointer',
          }}>
            <div style={{
              width: 42, height: 42, borderRadius: 21,
              border: '1.5px dashed ' + T.border, background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 300, color: T.muted,
            }}>+</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>Invitar a la familia</div>
              <div style={{ fontSize: 11.5, color: T.muted, marginTop: 1 }}>Código: <b>RAMIREZ-2026</b> · expira en 7 días</div>
            </div>
            <div style={{ color: T.blue, fontSize: 12, fontWeight: 700 }}>Compartir →</div>
          </div>
        </Card>
      </Section>

      <Section title="Gastos compartidos">
        <Card pad={16}>
          <div style={{ fontSize: 13.5, color: T.ink2, lineHeight: 1.5 }}>
            <b>Carla</b> te debe <span style={{ color: T.green, fontWeight: 700 }}>$640</span> del cine.
            <br/>Tú le debes a <b>Diego</b> <span style={{ color: T.red, fontWeight: 700 }}>$120</span> del taxi.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={() => onAction && onAction('settle')} style={primaryBtn}>Saldar cuentas</button>
            <button onClick={() => onAction && onAction('split')} style={secondaryBtn}>+ Dividir gasto</button>
          </div>
        </Card>
      </Section>

      <Section title="Ajustes">
        <Card pad={0}>
          {[
            { i: '🔔', l: 'Notificaciones',    s: 'Alertas, recordatorios',   a: 'notificaciones' },
            { i: '🎯', l: 'Presupuestos',      s: '8 categorías activas',     a: 'presupuestos' },
            { i: '🔁', l: 'Pagos recurrentes', s: '12 servicios',             a: 'recurrentes' },
            { i: '📤', l: 'Exportar a Excel',  s: 'CSV / XLSX',               a: 'exportar' },
            { i: '🌙', l: 'Apariencia',        s: 'Claro · Auto · Oscuro',    a: 'apariencia' },
            { i: '🔒', l: 'Privacidad y datos',s: 'Bloqueo con Face ID',      a: 'privacidad' },
          ].map((row, i, arr) => (
            <div key={row.l} onClick={() => onAction && onAction(row.a)} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
              borderBottom: i < arr.length - 1 ? '1px solid ' + T.border : 'none',
              cursor: 'pointer',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: T.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{row.i}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{row.l}</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 1 }}>{row.s}</div>
              </div>
              <div style={{ color: T.muted }}><ChevronRight/></div>
            </div>
          ))}
        </Card>
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ADD SHEET (modal)
// ═══════════════════════════════════════════════════════════
function AddSheet({ open, onClose, defaultKind = 'gasto', onSave, openScan, prefill, customCats, customSources, goals, accounts, onCreateCategory, activeMember }) {
  const [kind, setKind] = React.useState(defaultKind);
  const [amount, setAmount] = React.useState('');
  const [cat, setCat] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [member, setMember] = React.useState(activeMember ? activeMember.name : 'Yo');
  const [desc, setDesc] = React.useState('');

  const firstCatFor = (k, gs) => {
    if (k === 'ingreso') return Object.keys(APP_DATA.incomeSources)[0] ?? null;
    if (k === 'ahorro') return (gs || [])[0]?.id ?? null;
    return Object.keys(APP_DATA.categories)[0] ?? null;
  };

  React.useEffect(() => {
    if (activeMember) setMember(activeMember.name);
  }, [activeMember]);

  React.useEffect(() => {
    if (open) {
      if (prefill) {
        setKind('gasto');
        setAmount(prefill.total > 0 ? String(prefill.total) : '');
        setCat(prefill.category || firstCatFor('gasto', goals));
        setDesc(prefill.merchant || '');
      } else {
        setKind(defaultKind);
        setAmount('');
        setCat(firstCatFor(defaultKind, goals));
        setDesc('');
      }
      setAccount((accounts || [])[0]?.id ?? null);
    }
  }, [open, defaultKind, prefill]);

  // Auto-select first category when kind changes
  React.useEffect(() => {
    if (open) setCat(firstCatFor(kind, goals));
  }, [kind]);

  if (!open) return null;

  const kinds = [
    { id: 'gasto',   label: 'Gasto',    color: T.red,   icon: '💸' },
    { id: 'ingreso', label: 'Ingreso',  color: T.green, icon: '💰' },
    { id: 'ahorro',  label: 'Ahorro',   color: T.blue,  icon: '🐷' },
  ];

  const cats = kind === 'ingreso'
    ? Object.entries(APP_DATA.incomeSources)
    : kind === 'ahorro'
    ? (goals || []).map(g => [g.id, { name: g.name, icon: g.icon, color: g.color }])
    : Object.entries(APP_DATA.categories);

  const accent = kinds.find(k => k.id === kind).color;

  const canSave = amount && Number(amount) > 0 && cat;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 70,
      background: 'rgba(20,18,15,0.45)',
      display: 'flex', alignItems: 'flex-end',
      animation: 'fadeIn 200ms ease',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.bg, width: '100%', borderRadius: '28px 28px 0 0',
        padding: '8px 18px 28px',
        maxHeight: '90%', overflow: 'auto',
        animation: 'slideUp 280ms cubic-bezier(.2,.7,.3,1)',
        boxShadow: '0 -20px 40px rgba(0,0,0,0.15)',
      }}>
        {/* drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 14px' }}>
          <div style={{ width: 38, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.18)' }}/>
        </div>

        {/* Scan shortcut */}
        {kind === 'gasto' && openScan && (
          <button onClick={() => { onClose(); setTimeout(openScan, 240); }} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            background: 'linear-gradient(135deg, #1A1815 0%, #3F3A33 100%)',
            color: '#fff', border: 'none', padding: '14px 16px', borderRadius: 16,
            cursor: 'pointer', fontFamily: 'inherit', marginBottom: 14,
            boxShadow: '0 6px 16px rgba(26,24,21,0.18)',
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📸</div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>Escanear ticket</div>
              <div style={{ fontSize: 11.5, opacity: 0.7, marginTop: 1 }}>La IA llena los datos por ti</div>
            </div>
            <div style={{ fontSize: 18 }}>→</div>
          </button>
        )}

        {/* Kind selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {kinds.map(k => (
            <button key={k.id} onClick={() => setKind(k.id)} style={{
              flex: 1, border: '1.5px solid ' + (kind === k.id ? k.color : T.border),
              background: kind === k.id ? k.color + '14' : '#fff',
              color: kind === k.id ? k.color : T.ink2,
              padding: '12px 8px', borderRadius: 16,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              cursor: 'pointer', fontFamily: 'inherit',
              fontWeight: 700, fontSize: 13.5,
            }}>
              <div style={{ fontSize: 22 }}>{k.icon}</div>
              {k.label}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div style={{ textAlign: 'center', padding: '8px 0 22px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, letterSpacing: 0.6, textTransform: 'uppercase' }}>Monto</div>
          <div style={{
            display: 'inline-flex', alignItems: 'baseline', gap: 4, marginTop: 6,
            fontFamily: 'inherit', fontWeight: 500, fontWeight: 400,
          }}>
            <span style={{ fontSize: 28, color: T.muted, lineHeight: 1 }}>$</span>
            <input
              autoFocus
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={e => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
              placeholder="0"
              style={{
                fontFamily: 'inherit', fontSize: 56, fontWeight: 400, color: accent,
                border: 'none', outline: 'none', background: 'transparent',
                width: amount ? amount.length * 32 + 30 : 80, minWidth: 80, maxWidth: 240,
                textAlign: 'center', letterSpacing: -1, lineHeight: 1,
              }}
            />
          </div>
        </div>

        {/* Category grid */}
        <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, letterSpacing: 0.6, textTransform: 'uppercase', padding: '0 4px 10px' }}>
          {kind === 'ingreso' ? 'Fuente' : kind === 'ahorro' ? 'Meta' : 'Categoría'}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 18 }}>
          {cats.map(([id, c]) => (
            <button key={id} onClick={() => setCat(id)} style={{
              border: '1.5px solid ' + (cat === id ? c.color : T.border),
              background: cat === id ? c.color + '14' : '#fff',
              borderRadius: 14, padding: '10px 4px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <div style={{ fontSize: 22 }}>{c.icon}</div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: cat === id ? c.color : T.ink2, textAlign: 'center', lineHeight: 1.15 }}>{c.name}</div>
            </button>
          ))}
          {onCreateCategory && (
            <button onClick={() => onCreateCategory(kind)} style={{
              border: '1.5px dashed ' + T.border, background: 'transparent',
              borderRadius: 14, padding: '10px 4px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              cursor: 'pointer', fontFamily: 'inherit',
              color: T.muted,
            }}>
              <div style={{ fontSize: 22, fontWeight: 300, lineHeight: 1 }}>+</div>
              <div style={{ fontSize: 10.5, fontWeight: 700, textAlign: 'center' }}>Nueva</div>
            </button>
          )}
        </div>

        {/* Member - locked to active user */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 10px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, letterSpacing: 0.6, textTransform: 'uppercase' }}>Registrado por</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
            🔒 Sólo lo tuyo
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
          background: T.card, border: '1px solid ' + T.border, borderRadius: 14,
          marginBottom: 16,
        }}>
          {activeMember && <Avatar member={activeMember.id} size={32} />}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{activeMember ? activeMember.name : 'Tú'}</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>{activeMember ? activeMember.role : 'Tú'} · Sesión activa</div>
          </div>
          <div style={{ fontSize: 14, color: T.muted }}>🔒</div>
        </div>

        {/* Account selector */}
        {(accounts && accounts.length > 0) && (
          <>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, letterSpacing: 0.6, textTransform: 'uppercase', padding: '0 4px 10px' }}>
              Cuenta de pago
            </div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
              {accounts.map(a => (
                <button key={a.id} onClick={() => setAccount(a.id)} style={{
                  flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px', borderRadius: 14,
                  border: '1.5px solid ' + (account === a.id ? a.color : T.border),
                  background: account === a.id ? a.color + '14' : '#fff',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: a.color, color: '#fff', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.logo}</div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: account === a.id ? a.color : T.ink }}>{a.name}</div>
                    <div style={{ fontSize: 10.5, color: T.muted }}>{a.type}</div>
                  </div>
                </button>
              ))}
              <button onClick={() => setAccount(null)} style={{
                flexShrink: 0, padding: '10px 14px', borderRadius: 14,
                border: '1.5px solid ' + (account === null ? T.ink : T.border),
                background: account === null ? T.soft : '#fff',
                cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 12, fontWeight: 600, color: T.muted,
              }}>Sin cuenta</button>
            </div>
          </>
        )}

        {/* Description */}
        <input
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Nota (opcional)"
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '14px 16px', borderRadius: 14,
            border: '1px solid ' + T.border, background: '#fff',
            fontSize: 14, fontFamily: 'inherit', color: T.ink,
            outline: 'none', marginBottom: 18,
          }}
        />

        <button
          disabled={!canSave}
          onClick={() => { onSave({ kind, amount: Number(amount), cat, member, desc, account }); }}
          style={{
            width: '100%', border: 'none', cursor: canSave ? 'pointer' : 'not-allowed',
            background: canSave ? accent : T.soft,
            color: canSave ? '#fff' : T.muted,
            padding: '16px', borderRadius: 16, fontSize: 15, fontWeight: 700, fontFamily: 'inherit',
            transition: 'all 200ms',
          }}
        >Guardar</button>
      </div>
    </div>
  );
}

Object.assign(window, {
  DashboardScreen, MovimientosScreen, AhorrosScreen, FamiliaScreen, AddSheet,
});
