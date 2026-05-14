// Root app — full-screen, localStorage persistence

// ── localStorage helpers ─────────────────────────────────────
function loadLS(key, fallback) {
  try {
    const v = localStorage.getItem('gf_' + key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function saveLS(key, val) {
  try { localStorage.setItem('gf_' + key, JSON.stringify(val)); } catch {}
}

// ── Compute month totals from transactions (current month only) ──
function calcMonthTotals(txs) {
  const ym = new Date().toISOString().slice(0, 7);
  return txs
    .filter(t => t.date && t.date.startsWith(ym))
    .reduce((acc, t) => {
      if (t.kind === 'ingreso') acc.income += t.amount;
      else if (t.kind === 'gasto') acc.expenses += t.amount;
      else acc.savings += t.amount;
      return acc;
    }, { income: 0, expenses: 0, savings: 0 });
}

function getDayLabel(dateStr) {
  const today = new Date().toISOString().slice(0, 10);
  const yd = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (dateStr === today) return 'Hoy';
  if (dateStr === yd) return 'Ayer';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
}

function getCurrentMonthLabel() {
  const d = new Date();
  const m = d.toLocaleString('es-MX', { month: 'long' });
  return m.charAt(0).toUpperCase() + m.slice(1) + ' ' + d.getFullYear();
}

// ── App ───────────────────────────────────────────────────────
function App() {
  // ── Members & active profile ───────────────────────────────
  const [members, setMembers]             = React.useState(() => loadLS('members', []));
  const [activeProfileId, setActiveProfileId] = React.useState(() => loadLS('activeProfile', null));
  const [memberCreatorOpen, setMemberCreatorOpen] = React.useState(false);

  React.useEffect(() => { saveLS('members', members); }, [members]);
  React.useEffect(() => { saveLS('activeProfile', activeProfileId); }, [activeProfileId]);

  const activeMember = members.find(m => m.id === activeProfileId) || members[0] || null;

  // ── App state ──────────────────────────────────────────────
  const [tab, setTab]               = React.useState('inicio');
  const [addOpen, setAddOpen]       = React.useState(false);
  const [addKind, setAddKind]       = React.useState('gasto');
  const [addPrefill, setAddPrefill] = React.useState(null);
  const [accountsOpen, setAccountsOpen]     = React.useState(false);
  const [remindersOpen, setRemindersOpen]   = React.useState(false);
  const [assistantOpen, setAssistantOpen]   = React.useState(false);
  const [catCreatorOpen, setCatCreatorOpen] = React.useState(false);
  const [catCreatorKind, setCatCreatorKind] = React.useState('gasto');
  const [accCreatorOpen, setAccCreatorOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  const [accounts, setAccounts] = React.useState(() => loadLS('accounts', []));
  const [goals, setGoals]       = React.useState(() => loadLS('goals', []));
  const [txs, setTxs]           = React.useState(() => loadLS('transactions', []));

  const [customCats, setCustomCats] = React.useState(() => {
    const cats = loadLS('customCats', []);
    cats.forEach(c => { APP_DATA.categories[c.id] = { name: c.name, icon: c.icon, color: c.color }; });
    return cats;
  });
  const [customSources, setCustomSources] = React.useState(() => {
    const srcs = loadLS('customSources', []);
    srcs.forEach(s => { APP_DATA.incomeSources[s.id] = { name: s.name, icon: s.icon, color: s.color }; });
    return srcs;
  });

  React.useEffect(() => { saveLS('transactions', txs); }, [txs]);
  React.useEffect(() => { saveLS('accounts', accounts); }, [accounts]);
  React.useEffect(() => { saveLS('goals', goals); }, [goals]);
  React.useEffect(() => { saveLS('customCats', customCats); }, [customCats]);
  React.useEffect(() => { saveLS('customSources', customSources); }, [customSources]);

  const month = React.useMemo(() => ({
    ...calcMonthTotals(txs),
    label: getCurrentMonthLabel(),
  }), [txs]);

  // ── Helpers ────────────────────────────────────────────────
  const showToast = (msg, color) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2400);
  };
  const openAdd = (kind = 'gasto') => { setAddKind(kind); setAddPrefill(null); setAddOpen(true); };

  // ── Handlers ───────────────────────────────────────────────
  const onMemberCreated = (m) => {
    setMembers(prev => [...prev, m]);
    // auto-select if first member
    if (members.length === 0) setActiveProfileId(m.id);
    showToast('👤 Perfil "' + m.name + '" creado', m.color);
  };

  const onCategoryCreated = (c) => {
    if (c.kind === 'ingreso') {
      APP_DATA.incomeSources[c.id] = { name: c.name, icon: c.icon, color: c.color };
      setCustomSources(s => [...s, c]);
    } else if (c.kind === 'ahorro') {
      const g = { id: c.id, name: c.name, icon: c.icon, color: c.color, saved: 0, target: 10000, deadline: 'Sin fecha' };
      setGoals(gs => [...gs, g]);
    } else {
      APP_DATA.categories[c.id] = { name: c.name, icon: c.icon, color: c.color };
      setCustomCats(s => [...s, c]);
    }
    showToast('✨ "' + c.name + '" creada', c.color);
  };

  const onAccountCreated = (a) => {
    setAccounts(list => [...list, a]);
    showToast('💳 Cuenta "' + a.name + '" agregada', a.color);
  };

  const handleSave = (data) => {
    const today = new Date().toISOString().slice(0, 10);
    const newTx = {
      id: 't' + Date.now(),
      date: today,
      day: getDayLabel(today),
      kind: data.kind,
      cat: data.kind === 'ingreso' ? undefined : data.cat,
      src: data.kind === 'ingreso' ? data.cat : undefined,
      desc: data.desc || (
        data.kind === 'ingreso' ? APP_DATA.incomeSources[data.cat]?.name
        : data.kind === 'ahorro' ? 'Aporte a ' + (goals.find(g => g.id === data.cat)?.name || 'meta')
        : APP_DATA.categories[data.cat]?.name
      ) || 'Movimiento',
      who: data.member,
      amount: data.amount,
    };
    setTxs(prev => [newTx, ...prev]);
    if (data.kind === 'ahorro') {
      setGoals(gs => gs.map(g => g.id === data.cat ? { ...g, saved: g.saved + data.amount } : g));
    }
    setAddOpen(false);
    showToast(
      data.kind === 'ingreso' ? '+ ' + fmt(data.amount) + ' ingreso registrado'
      : data.kind === 'ahorro' ? '🐷 ' + fmt(data.amount) + ' agregado a tu meta'
      : '💸 ' + fmt(data.amount) + ' gasto registrado',
      data.kind === 'ingreso' ? T.green : data.kind === 'ahorro' ? T.blue : T.red,
    );
  };

  const handleDeleteTx = (id) => {
    setTxs(prev => prev.filter(t => t.id !== id));
    showToast('Movimiento eliminado', T.muted);
  };

  // ── Profile selector ───────────────────────────────────────
  // Show selector when no active profile (first launch or switch requested)
  if (!activeMember) {
    return (
      <>
        <ProfileSelector
          members={members}
          onSelect={(id) => setActiveProfileId(id)}
          onAddMember={() => setMemberCreatorOpen(true)}
        />
        <MemberCreator
          open={memberCreatorOpen}
          onClose={() => setMemberCreatorOpen(false)}
          onCreate={onMemberCreated}
        />
      </>
    );
  }

  window.__activeUser = activeMember;

  // ── Screen routing ─────────────────────────────────────────
  let screen;
  if (tab === 'inicio')
    screen = <DashboardScreen
      user={{ name: activeMember.name }}
      goTab={setTab} openAdd={openAdd}
      monthOverride={month} accounts={accounts} goals={goals}
      openAccounts={() => setAccountsOpen(true)}
      openAccountCreator={() => setAccCreatorOpen(true)}
      openAssistant={() => setAssistantOpen(true)}
      openReminders={() => setRemindersOpen(true)}
      activeMember={activeMember}
    />;
  else if (tab === 'movimientos')
    screen = <MovimientosScreen
      transactions={txs} activeMember={activeMember}
      onDelete={handleDeleteTx}
    />;
  else if (tab === 'ahorros')
    screen = <AhorrosScreen goals={goals} onDeposit={() => openAdd('ahorro')} />;
  else if (tab === 'familia')
    screen = <FamiliaScreen
      user={{ name: activeMember.name }}
      activeMember={activeMember}
      transactions={txs}
      members={members}
      onAddMember={() => setMemberCreatorOpen(true)}
      onSwitchProfile={() => setActiveProfileId(null)}
    />;

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: T.bg, overflowY: 'auto', overflowX: 'hidden',
      fontFamily: '"Bricolage Grotesque", -apple-system, system-ui, sans-serif',
      color: T.ink,
    }}>
      {screen}

      {toast && (
        <div style={{
          position: 'fixed', top: 16, left: 16, right: 16, zIndex: 80,
          background: toast.color, color: '#fff',
          padding: '12px 16px', borderRadius: 14,
          fontWeight: 600, fontSize: 13.5,
          boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
          animation: 'slideDownToast 280ms cubic-bezier(.2,.7,.3,1)',
          textAlign: 'center',
        }}>{toast.msg}</div>
      )}

      <TabBar tab={tab} onTab={setTab} onAdd={() => openAdd('gasto')} />

      <AddSheet
        open={addOpen}
        onClose={() => { setAddOpen(false); setAddPrefill(null); }}
        defaultKind={addKind}
        prefill={addPrefill}
        customCats={customCats}
        customSources={customSources}
        goals={goals}
        activeMember={activeMember}
        onCreateCategory={(kind) => { setCatCreatorKind(kind); setCatCreatorOpen(true); }}
        onSave={handleSave}
      />

      <AccountsModal   open={accountsOpen}   onClose={() => setAccountsOpen(false)} accounts={accounts} onCreate={() => setAccCreatorOpen(true)} />
      <RemindersModal  open={remindersOpen}  onClose={() => setRemindersOpen(false)} />
      <AssistantModal  open={assistantOpen}  onClose={() => setAssistantOpen(false)} />

      <CategoryCreator open={catCreatorOpen} onClose={() => setCatCreatorOpen(false)} kind={catCreatorKind} onCreate={onCategoryCreated} />
      <AccountCreator  open={accCreatorOpen} onClose={() => setAccCreatorOpen(false)} onCreate={onAccountCreated} />
      <MemberCreator   open={memberCreatorOpen} onClose={() => setMemberCreatorOpen(false)} onCreate={onMemberCreated} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
