// Root app — state, navigation, IOS frame mount

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "userName": "Ulises",
  "familyName": "Familia Ramírez",
  "theme": "warm",
  "showSavings": true,
  "compactNumbers": false,
  "activeUser": "ulises"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab] = React.useState('inicio');
  const [addOpen, setAddOpen] = React.useState(false);
  const [addKind, setAddKind] = React.useState('gasto');
  const [addPrefill, setAddPrefill] = React.useState(null);
  const [accountsOpen, setAccountsOpen]   = React.useState(false);
  const [scanOpen, setScanOpen]           = React.useState(false);
  const [remindersOpen, setRemindersOpen] = React.useState(false);
  const [assistantOpen, setAssistantOpen] = React.useState(false);
  const [catCreatorOpen, setCatCreatorOpen] = React.useState(false);
  const [catCreatorKind, setCatCreatorKind] = React.useState('gasto');
  const [accCreatorOpen, setAccCreatorOpen] = React.useState(false);
  const [accounts, setAccounts]   = React.useState(APP_DATA.accounts);
  const [customCats, setCustomCats]       = React.useState([]);
  const [customSources, setCustomSources] = React.useState([]);
  const [goals, setGoals]   = React.useState(APP_DATA.goals);
  const [txs, setTxs]       = React.useState(APP_DATA.transactions);
  const [month, setMonth]   = React.useState({ ...APP_DATA.month });
  const [toast, setToast]   = React.useState(null);

  // theme tweak — quickly swap accent
  React.useEffect(() => {
    const root = document.documentElement;
    const themes = {
      warm:   { bg: '#FAF7F2', ink: '#1A1815', soft: '#F1ECE4' },
      cool:   { bg: '#F4F6FA', ink: '#0F1B2D', soft: '#E5EAF2' },
      mono:   { bg: '#F5F5F5', ink: '#111111', soft: '#E8E8E8' },
    };
    const th = themes[t.theme] || themes.warm;
    Object.assign(window.T, th);
    root.style.setProperty('--app-bg', th.bg);
  }, [t.theme]);

  const openAdd = (kind = 'gasto') => { setAddKind(kind); setAddPrefill(null); setAddOpen(true); };

  const handleScanResult = (extracted) => {
    setAddPrefill(extracted);
    setAddKind('gasto');
    setAddOpen(true);
  };

  const handleCreateCategory = (kind) => {
    setCatCreatorKind(kind);
    setCatCreatorOpen(true);
  };

  const onCategoryCreated = (c) => {
    // mutate APP_DATA so all icon lookups resolve, plus update state to re-render
    if (c.kind === 'ingreso') {
      APP_DATA.incomeSources[c.id] = { name: c.name, icon: c.icon, color: c.color };
      setCustomSources(s => [...s, c]);
    } else if (c.kind === 'ahorro') {
      const newGoal = { id: c.id, name: c.name, icon: c.icon, color: c.color, saved: 0, target: 10000, deadline: 'Sin fecha' };
      setGoals(g => [...g, newGoal]);
    } else {
      APP_DATA.categories[c.id] = { name: c.name, icon: c.icon, color: c.color };
      setCustomCats(s => [...s, c]);
    }
    setToast({ msg: '✨ "' + c.name + '" creada', color: c.color });
    setTimeout(() => setToast(null), 2400);
  };

  const onAccountCreated = (a) => {
    setAccounts(list => [...list, a]);
    setToast({ msg: '💳 Cuenta "' + a.name + '" agregada', color: a.color });
    setTimeout(() => setToast(null), 2400);
  };

  const handleSave = (data) => {
    const today = new Date().toISOString().slice(0, 10);
    const newTx = {
      id: 't' + Date.now(),
      date: today, day: 'Hoy',
      kind: data.kind,
      cat: data.kind === 'ingreso' ? undefined : data.cat,
      src: data.kind === 'ingreso' ? data.cat : undefined,
      desc: data.desc || (data.kind === 'ingreso'
        ? APP_DATA.incomeSources[data.cat]?.name
        : data.kind === 'ahorro'
        ? 'Aporte a ' + (APP_DATA.goals.find(g => g.id === data.cat)?.name || 'meta')
        : APP_DATA.categories[data.cat]?.name) || 'Movimiento',
      who: data.member, amount: data.amount,
    };
    setTxs([newTx, ...txs]);

    setMonth(m => {
      const next = { ...m };
      if (data.kind === 'ingreso') next.income += data.amount;
      else if (data.kind === 'gasto') next.expenses += data.amount;
      else next.savings += data.amount;
      return next;
    });

    if (data.kind === 'ahorro') {
      setGoals(gs => gs.map(g => g.id === data.cat ? { ...g, saved: g.saved + data.amount } : g));
    }

    setAddOpen(false);
    setToast({
      msg: data.kind === 'ingreso' ? '+ ' + fmt(data.amount) + ' ingreso registrado'
         : data.kind === 'ahorro'  ? '🐷 ' + fmt(data.amount) + ' agregado a tu meta'
         : '💸 ' + fmt(data.amount) + ' gasto registrado',
      color: data.kind === 'ingreso' ? T.green : data.kind === 'ahorro' ? T.blue : T.red,
    });
    setTimeout(() => setToast(null), 2400);
  };

  const handleDeposit = (goalId) => {
    setAddKind('ahorro');
    setAddOpen(true);
  };

  const user = { name: t.userName };
  const activeMember = APP_DATA.members.find(m => m.id === t.activeUser) || APP_DATA.members[0];
  window.__activeUser = activeMember; // make available to deep components

  let screen;
  if (tab === 'inicio')      screen = <DashboardScreen user={{ name: activeMember.name }} goTab={setTab} openAdd={openAdd} monthOverride={month} accounts={accounts} openAccounts={() => setAccountsOpen(true)} openAccountCreator={() => setAccCreatorOpen(true)} openAssistant={() => setAssistantOpen(true)} openReminders={() => setRemindersOpen(true)} activeMember={activeMember} />;
  else if (tab === 'movimientos') screen = <MovimientosScreen transactions={txs} activeMember={activeMember} />;
  else if (tab === 'ahorros')     screen = <AhorrosScreen goals={goals} onDeposit={handleDeposit} />;
  else if (tab === 'familia')     screen = <FamiliaScreen user={{ name: activeMember.name }} activeMember={activeMember} />;

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      background: T.bg,
      paddingTop: 56, // status bar
      overflowY: 'auto', overflowX: 'hidden',
      fontFamily: '"Bricolage Grotesque", -apple-system, system-ui, sans-serif',
      color: T.ink,
    }}>
      {screen}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'absolute', top: 64, left: 16, right: 16, zIndex: 80,
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
        openScan={() => setScanOpen(true)}
        customCats={customCats}
        customSources={customSources}
        goals={goals}
        activeMember={activeMember}
        onCreateCategory={handleCreateCategory}
        onSave={handleSave}
      />

      <AccountsModal   open={accountsOpen}   onClose={() => setAccountsOpen(false)} accounts={accounts} onCreate={() => setAccCreatorOpen(true)} />
      <RemindersModal  open={remindersOpen}  onClose={() => setRemindersOpen(false)} />
      <AssistantModal  open={assistantOpen}  onClose={() => setAssistantOpen(false)} />
      <ScanModal       open={scanOpen}       onClose={() => setScanOpen(false)} onResult={handleScanResult} />

      <CategoryCreator open={catCreatorOpen} onClose={() => setCatCreatorOpen(false)} kind={catCreatorKind} onCreate={onCategoryCreated} />
      <AccountCreator  open={accCreatorOpen} onClose={() => setAccCreatorOpen(false)} onCreate={onAccountCreated} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Identidad" />
        <TweakText label="Nombre" value={t.userName}
                   onChange={v => setTweak('userName', v)} />
        <TweakText label="Familia" value={t.familyName}
                   onChange={v => setTweak('familyName', v)} />

        <TweakSection label="Sesión (demo multiusuario)" />
        <TweakRadio label="Iniciar como" value={t.activeUser}
                    options={APP_DATA.members.map(m => ({ value: m.id, label: m.name }))}
                    onChange={v => setTweak('activeUser', v)} />

        <TweakSection label="Apariencia" />
        <TweakRadio label="Tema" value={t.theme}
                    options={[
                      { value: 'warm', label: 'Cálido' },
                      { value: 'cool', label: 'Frío' },
                      { value: 'mono', label: 'Mono' },
                    ]}
                    onChange={v => setTweak('theme', v)} />

        <TweakSection label="Funciones" />
        <TweakToggle label="Mostrar ahorros en dashboard" value={t.showSavings}
                     onChange={v => setTweak('showSavings', v)} />
        <TweakToggle label="Números compactos ($1.2k)" value={t.compactNumbers}
                     onChange={v => setTweak('compactNumbers', v)} />

        <TweakSection label="Acciones rápidas" />
        <TweakButton label="Abrir asistente IA" onClick={() => setAssistantOpen(true)} />
        <TweakButton label="Escanear ticket" onClick={() => setScanOpen(true)} />
        <TweakButton label="Ver cuentas" onClick={() => setAccountsOpen(true)} />
        <TweakButton label="Recordatorios" onClick={() => setRemindersOpen(true)} />
        <TweakButton label="+ Nueva categoría de gasto" onClick={() => handleCreateCategory('gasto')} />
        <TweakButton label="+ Vincular cuenta nueva" onClick={() => setAccCreatorOpen(true)} />
      </TweaksPanel>
    </div>
  );
}

// Mount inside IOS frame
function Mount() {
  const [scale, setScale] = React.useState(1);
  const wrapRef = React.useRef(null);

  React.useLayoutEffect(() => {
    const fit = () => {
      const W = 402, H = 874, pad = 40;
      const sw = (window.innerWidth - pad) / W;
      const sh = (window.innerHeight - pad) / H;
      setScale(Math.min(1, Math.min(sw, sh)));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#EDE7DE',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <div ref={wrapRef} style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
        <IOSDevice width={402} height={874}>
          <App/>
        </IOSDevice>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Mount/>);
