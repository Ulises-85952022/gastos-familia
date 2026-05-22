// Root app — full-screen, localStorage + Firebase persistence

// ── Firebase REST helpers ─────────────────────────────────────
const FB = 'https://app-familiae-default-rtdb.firebaseio.com/data';
function fbSave(payload) {
  return fetch(FB + '.json', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => { if (!r.ok) console.error('[FB] save error', r.status); })
    .catch(e => console.error('[FB] save failed', e));
}

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
function calcMemberTotals(txs, memberName) {
  const ym = new Date().toISOString().slice(0, 7);
  return txs
    .filter(t => t.date && t.date.startsWith(ym) && t.who === memberName)
    .reduce((acc, t) => {
      if (t.kind === 'ingreso') acc.income += t.amount;
      else if (t.kind === 'gasto') acc.expenses += t.amount;
      else acc.savings += t.amount;
      return acc;
    }, { income: 0, expenses: 0, savings: 0 });
}

function calcMonthTotals(txs) {
  const ym = new Date().toISOString().slice(0, 7); // "2026-05"
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
  const month = d.toLocaleString('es-MX', { month: 'long' });
  return month.charAt(0).toUpperCase() + month.slice(1) + ' ' + d.getFullYear();
}

// ── App ───────────────────────────────────────────────────────
function App() {
  const [tab, setTab]             = React.useState('inicio');
  const [addOpen, setAddOpen]     = React.useState(false);
  const [addKind, setAddKind]     = React.useState('gasto');
  const [addPrefill, setAddPrefill] = React.useState(null);
  const [accountsOpen, setAccountsOpen]   = React.useState(false);
  const [scanOpen, setScanOpen]           = React.useState(false);
  const [remindersOpen, setRemindersOpen] = React.useState(false);
  const [assistantOpen, setAssistantOpen] = React.useState(false);
  const [upcomingOpen, setUpcomingOpen]   = React.useState(false);
  const [budgetsOpen, setBudgetsOpen]   = React.useState(false);
  const [catCreatorOpen, setCatCreatorOpen] = React.useState(false);
  const [catCreatorKind, setCatCreatorKind] = React.useState('gasto');
  const [accCreatorOpen, setAccCreatorOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [fbStatus, setFbStatus] = React.useState('connecting'); // 'connecting'|'ok'|'error'

  // Persistent state — loaded from localStorage on first render
  const [accounts, setAccounts] = React.useState(() => {
    const stored = loadLS('accounts', []);
    // Migrate: assign owner to accounts that don't have one
    return stored.map(a => a.owner ? a : { ...a, owner: APP_DATA.members[0].id });
  });
  const [goals, setGoals]       = React.useState(() => loadLS('goals', []));
  const [txs, setTxs]           = React.useState(() => {
    const stored = loadLS('transactions', []);
    return stored.map(t => t.who === 'Esposa' ? { ...t, who: 'Ale' } : t);
  });

  const [upcoming, setUpcoming] = React.useState(() => loadLS('upcoming', APP_DATA.upcoming));
  const [budgets, setBudgets] = React.useState(() => {
    const raw = loadLS('budgets', null) || APP_DATA.budgets;
    return raw.map(b => ({ cat: b.cat, limit: b.limit || 0 }));
  });

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
  const [dailyReminder, setDailyReminder] = React.useState(() =>
    loadLS('dailyReminder', { enabled: false, hour: 21 })
  );

  // Persist on change (localStorage as offline fallback)
  React.useEffect(() => { saveLS('transactions', txs); }, [txs]);
  React.useEffect(() => { saveLS('accounts', accounts); }, [accounts]);
  React.useEffect(() => { saveLS('goals', goals); }, [goals]);
  React.useEffect(() => { saveLS('customCats', customCats); }, [customCats]);
  React.useEffect(() => { saveLS('customSources', customSources); }, [customSources]);
  React.useEffect(() => { saveLS('upcoming', upcoming); }, [upcoming]);
  React.useEffect(() => { saveLS('budgets', budgets); }, [budgets]);
  React.useEffect(() => { saveLS('dailyReminder', dailyReminder); }, [dailyReminder]);

  // Daily notification: fire once per day at the configured hour
  React.useEffect(() => {
    if (!dailyReminder.enabled) return;
    const tick = setInterval(() => {
      const now = new Date();
      if (now.getHours() === dailyReminder.hour && now.getMinutes() === 0) {
        if (Notification.permission === 'granted') {
          new Notification('¿Ya registraste tus gastos hoy? 💸', {
            body: 'Toca para abrir Gastos Familia y anotar tus movimientos.',
            icon: 'https://ulises-85952022.github.io/gastos-familia/icon.png',
          });
        }
      }
    }, 60000);
    return () => clearInterval(tick);
  }, [dailyReminder]);

  // In-app nudge on open: show if no expense registered today (after noon)
  React.useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const hour  = new Date().getHours();
    const hasToday = txs.some(t => t.date === today);
    if (!hasToday && hour >= 12) {
      setTimeout(() => showToast('📝 No has registrado movimientos hoy', T.gold), 1200);
    }
  }, []);

  // ── Firebase real-time sync ────────────────────────────────
  const fbReady     = React.useRef(false);
  const fbReceiving = React.useRef(false);

  React.useEffect(() => {
    function applyRemote(remote) {
      if (!remote) { fbReady.current = true; return; }
      fbReceiving.current = true;
      setTxs((remote.txs || []).map(t => t.who === 'Esposa' ? { ...t, who: 'Ale' } : t));
      setAccounts((remote.accounts || []).map(a => a.owner ? a : { ...a, owner: APP_DATA.members[0].id }));
      setGoals(remote.goals || []);
      if (remote.upcoming) setUpcoming(remote.upcoming);
      if (remote.budgets) setBudgets(remote.budgets.map(b => ({ cat: b.cat, limit: b.limit || 0 })));
      if (remote.dailyReminder) setDailyReminder(remote.dailyReminder);
      if (remote.customCats) {
        remote.customCats.forEach(c => { APP_DATA.categories[c.id] = { name: c.name, icon: c.icon, color: c.color }; });
        setCustomCats(remote.customCats);
      }
      if (remote.customSources) {
        remote.customSources.forEach(s => { APP_DATA.incomeSources[s.id] = { name: s.name, icon: s.icon, color: s.color }; });
        setCustomSources(remote.customSources);
      }
      setTimeout(() => { fbReceiving.current = false; fbReady.current = true; }, 500);
    }

    const snap0 = { txs, accounts, goals, customCats, customSources, upcoming, budgets, dailyReminder };
    const hasLocalData = snap0.txs.length > 0 || snap0.accounts.length > 0;

    const es = new EventSource(FB + '.json?accept=text/event-stream');
    es.addEventListener('put', e => {
      try {
        const d = JSON.parse(e.data);
        if (d.data === null || d.data === undefined) {
          // Firebase is empty — only seed from this device if we have local data
          if (hasLocalData) fbSave(snap0);
          fbReady.current = true;
          setFbStatus('ok');
        } else {
          applyRemote(d.data);
          setFbStatus('ok');
        }
      } catch (err) {
        console.error('[FB] parse error', err);
        fbReady.current = true;
        setFbStatus('error');
      }
    });
    es.onerror = (err) => {
      console.error('[FB] SSE error', err);
      fbReady.current = true;
      setFbStatus('error');
    };
    return () => es.close();
  }, []);

  // Debounced save — 1 s after any data change
  React.useEffect(() => {
    if (!fbReady.current || fbReceiving.current) return;
    const timer = setTimeout(() => fbSave({ txs, accounts, goals, customCats, customSources, upcoming, budgets, dailyReminder }), 1000);
    return () => clearTimeout(timer);
  }, [txs, accounts, goals, customCats, customSources, upcoming, budgets, dailyReminder]);

  const [activeMember, setActiveMember] = React.useState(
    () => {
      const stored = loadLS('activeMember', null);
      return (stored && stored.id) ? stored : APP_DATA.members[0];
    }
  );
  React.useEffect(() => { saveLS('activeMember', activeMember); }, [activeMember]);
  window.__activeUser = activeMember;

  const FAMILIA_MEMBER = { id: 'familia', name: 'Familia', color: '#2C2C2C', initials: 'FA', role: 'Vista familiar' };
  const switcherMembers = [...APP_DATA.members, FAMILIA_MEMBER];

  // Derived month totals
  const month = React.useMemo(() => {
    if (!activeMember) return { income: 0, expenses: 0, savings: 0, label: getCurrentMonthLabel() };
    const totals = activeMember?.id === 'familia'
      ? calcMonthTotals(txs)
      : calcMemberTotals(txs, activeMember.name);
    return { ...totals, label: getCurrentMonthLabel() };
  }, [txs, activeMember]);

  const spentByCategory = React.useMemo(() => {
    const ym = new Date().toISOString().slice(0, 7);
    const acc = {};
    txs.filter(t => t.kind === 'gasto' && t.date && t.date.startsWith(ym))
       .forEach(t => { if (t.cat) acc[t.cat] = (acc[t.cat] || 0) + t.amount; });
    return acc;
  }, [txs]);

  const liveBudgets = React.useMemo(() =>
    budgets.map(b => ({ ...b, spent: spentByCategory[b.cat] || 0 }))
  , [budgets, spentByCategory]);

  // Live account balances — filtered by owner, initial balance adjusted by transactions
  const liveAccounts = React.useMemo(() => {
    const isFamilia = activeMember?.id === 'familia';
    return accounts
      .filter(a => isFamilia || a.owner === activeMember?.id)
      .map(a => {
        const delta = txs.reduce((sum, t) => {
          if (t.account !== a.id) return sum;
          if (t.kind === 'ingreso') return sum + t.amount;
          return sum - t.amount;
        }, 0);
        return { ...a, balance: a.balance + delta, _delta: delta, _initialBalance: a.balance };
      });
  }, [accounts, txs, activeMember]);

  const allLiveAccounts = React.useMemo(() =>
    accounts.map(a => {
      const delta = txs.reduce((sum, t) => {
        if (t.account !== a.id) return sum;
        if (t.kind === 'ingreso') return sum + t.amount;
        return sum - t.amount;
      }, 0);
      return { ...a, balance: a.balance + delta, _delta: delta, _initialBalance: a.balance };
    })
  , [accounts, txs]);

  // Total liquid balance for hero card
  const totalBalance = React.useMemo(() =>
    liveAccounts
      .filter(a => a.type !== 'Crédito' && a.type !== 'Inversión')
      .reduce((s, a) => s + a.balance, 0)
  , [liveAccounts]);

  // ── Helpers ────────────────────────────────────────────────
  const showToast = (msg, color) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2400);
  };

  const openAdd = (kind = 'gasto') => {
    if (activeMember?.id === 'familia') return;
    setAddKind(kind); setAddPrefill(null); setAddOpen(true);
  };

  // ── Handlers ───────────────────────────────────────────────
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
      account: data.account || null,
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

  const handlePayUpcoming = (id) => {
    const payment = upcoming.find(p => p.id === id);
    if (!payment || payment.paid) return;
    setUpcoming(list => list.map(p => p.id === id ? { ...p, paid: true } : p));
    const today = new Date().toISOString().slice(0, 10);
    const newTx = {
      id: 't' + Date.now(),
      date: today,
      day: getDayLabel(today),
      kind: 'gasto',
      cat: payment.cat,
      desc: payment.name,
      who: payment.who,
      amount: payment.amount,
      account: null,
    };
    setTxs(prev => [newTx, ...prev]);
    showToast('💸 ' + payment.name + ' pagado · ' + fmt(payment.amount), T.red);
  };

  const handleSaveUpcoming = (payment) => {
    const exists = upcoming.some(p => p.id === payment.id);
    if (exists) {
      setUpcoming(list => list.map(p => p.id === payment.id ? payment : p));
      showToast('✏️ "' + payment.name + '" actualizado', T.blue);
    } else {
      setUpcoming(list => [...list, payment]);
      showToast('📅 "' + payment.name + '" agregado', T.blue);
    }
  };

  const handleDeleteUpcoming = (id) => {
    const p = upcoming.find(x => x.id === id);
    setUpcoming(list => list.filter(x => x.id !== id));
    if (p) showToast('"' + p.name + '" eliminado', T.muted);
  };

  const handleSaveBudget = (b) => {
    const exists = budgets.some(x => x.cat === b.cat);
    if (exists) {
      setBudgets(list => list.map(x => x.cat === b.cat ? { cat: b.cat, limit: b.limit } : x));
      showToast('✏️ Presupuesto actualizado', T.blue);
    } else {
      setBudgets(list => [...list, { cat: b.cat, limit: b.limit }]);
      showToast('🎯 Presupuesto "' + (APP_DATA.categories[b.cat]?.name || b.cat) + '" agregado', T.blue);
    }
  };

  const handleDeleteBudget = (cat) => {
    setBudgets(list => list.filter(b => b.cat !== cat));
    showToast('"' + (APP_DATA.categories[cat]?.name || cat) + '" eliminado', T.muted);
  };

  const handleDeleteAccount = (id) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    showToast('Cuenta eliminada', T.muted);
  };
  const handleEditAccount = (id, newInitialBalance) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, balance: newInitialBalance } : a));
    showToast('Saldo actualizado', T.green);
  };

  const switchMember = (m) => {
    setActiveMember(m);
    showToast('Sesión: ' + m.name, m.color);
  };

  // ── Screen routing ─────────────────────────────────────────
  let screen;
  if (tab === 'inicio')
    screen = <DashboardScreen
      user={{ name: activeMember?.name || '' }}
      goTab={setTab} openAdd={openAdd}
      monthOverride={month} accounts={liveAccounts} goals={goals} totalBalance={totalBalance}
      openAccounts={() => setAccountsOpen(true)}
      openAccountCreator={() => setAccCreatorOpen(true)}
      openAssistant={() => setAssistantOpen(true)}
      openReminders={() => setRemindersOpen(true)}
      openUpcoming={() => setUpcomingOpen(true)}
      budgets={liveBudgets}
      openPresupuestos={() => setBudgetsOpen(true)}
      upcoming={upcoming}
      onPayUpcoming={handlePayUpcoming}
      activeMember={activeMember}
      members={switcherMembers}
      onSwitchMember={switchMember}
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
      user={{ name: activeMember?.name || '' }}
      activeMember={activeMember}
      transactions={txs}
      goals={goals}
      budgets={liveBudgets}
      onAction={(action) => {
        if (action === 'presupuestos') { setBudgetsOpen(true); return; }
        if (action === 'recurrentes')  { setUpcomingOpen(true); return; }
        const msgs = {
          'invite':         ['Código copiado: RAMIREZ-2026', T.blue],
          'edit-profile':   ['Editar perfil — próximamente', T.ink],
          'settle':         ['Saldo enviado a Carla 👍', T.green],
          'split':          ['Dividir gasto — próximamente', T.ink],
          'notificaciones': ['Notificaciones — próximamente', T.ink],
          'exportar':       ['Exportando CSV…', T.blue],
          'apariencia':     ['Apariencia — próximamente', T.ink],
          'privacidad':     ['Privacidad — próximamente', T.ink],
        };
        const [msg, color] = msgs[action] || ['Función próximamente', T.ink];
        showToast(msg, color);
      }}
    />;

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: T.bg, overflowY: 'auto', overflowX: 'hidden',
      fontFamily: '"Bricolage Grotesque", -apple-system, system-ui, sans-serif',
      color: T.ink,
    }}>
      {screen}

      {/* Sync status dot */}
      <div style={{
        position: 'fixed', top: 12, right: 14, zIndex: 90,
        width: 8, height: 8, borderRadius: 4,
        background: fbStatus === 'ok' ? T.green : fbStatus === 'error' ? T.red : T.gold,
        boxShadow: fbStatus === 'ok' ? '0 0 0 2px ' + T.greenSoft : fbStatus === 'error' ? '0 0 0 2px ' + T.redSoft : '0 0 0 2px ' + T.goldSoft,
        transition: 'background 400ms',
      }} title={fbStatus === 'ok' ? 'Sincronizado' : fbStatus === 'error' ? 'Sin sincronización' : 'Conectando…'} />

      {/* Toast */}
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

      <TabBar tab={tab} onTab={setTab} onAdd={() => openAdd('gasto')} hideAdd={activeMember?.id === 'familia'} />

      <AddSheet
        open={addOpen}
        onClose={() => { setAddOpen(false); setAddPrefill(null); }}
        defaultKind={addKind}
        prefill={addPrefill}
        openScan={() => setScanOpen(true)}
        customCats={customCats}
        customSources={customSources}
        goals={goals}
        accounts={liveAccounts}
        activeMember={activeMember}
        onCreateCategory={(kind) => { setCatCreatorKind(kind); setCatCreatorOpen(true); }}
        onSave={handleSave}
      />

      <AccountsModal open={accountsOpen} onClose={() => setAccountsOpen(false)} accounts={activeMember?.id === 'familia' ? allLiveAccounts : liveAccounts} onCreate={() => setAccCreatorOpen(true)} onDelete={handleDeleteAccount} onEdit={handleEditAccount} activeMember={activeMember} />
      <RemindersModal  open={remindersOpen}  onClose={() => setRemindersOpen(false)} dailyReminder={dailyReminder} onSetDailyReminder={setDailyReminder} />
      <UpcomingModal   open={upcomingOpen}   onClose={() => setUpcomingOpen(false)} upcoming={upcoming} onPay={handlePayUpcoming} onSave={handleSaveUpcoming} onDelete={handleDeleteUpcoming} activeMember={activeMember} />
      <PresupuestosModal open={budgetsOpen} onClose={() => setBudgetsOpen(false)} budgets={liveBudgets} onSave={handleSaveBudget} onDelete={handleDeleteBudget} />
      <AssistantModal  open={assistantOpen}  onClose={() => setAssistantOpen(false)} />
      <ScanModal       open={scanOpen}       onClose={() => setScanOpen(false)}
                       onResult={(e) => { setAddPrefill(e); setAddKind('gasto'); setAddOpen(true); setScanOpen(false); }} />

      <CategoryCreator open={catCreatorOpen} onClose={() => setCatCreatorOpen(false)} kind={catCreatorKind} onCreate={onCategoryCreated} />
      <AccountCreator  open={accCreatorOpen} onClose={() => setAccCreatorOpen(false)} onCreate={onAccountCreated} activeMember={activeMember} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
