// Extras — Cuentas, Escaneo de tickets, Recordatorios, Asistente IA

// ═══════════════════════════════════════════════════════════
// ACCOUNTS — Card carousel + full modal
// ═══════════════════════════════════════════════════════════
function AccountsStrip({ onOpen, accounts }) {
  const accs = accounts || APP_DATA.accounts;
  const totalLiquid = accs.filter(a => a.type !== 'Crédito' && a.type !== 'Inversión').reduce((s, a) => s + a.balance, 0);
  const totalCredit = accs.filter(a => a.type === 'Crédito').reduce((s, a) => s + a.balance, 0);

  return (
    <Section title="Tus cuentas" action="Ver todas" >
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', margin: '0 -18px', padding: '0 18px 4px', scrollbarWidth: 'none' }}>
        {accs.map(a => <MiniAccountCard key={a.id} a={a} onClick={() => onOpen(a.id)} />)}
        <button onClick={() => onOpen('new')} style={{
          flex: '0 0 78px', height: 110, borderRadius: 18,
          border: '1.5px dashed ' + T.border, background: 'transparent',
          color: T.muted, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <div style={{ fontSize: 24, fontWeight: 300 }}>+</div>
          <div style={{ fontSize: 10.5, fontWeight: 600 }}>Vincular</div>
        </button>
      </div>
    </Section>
  );
}

function MiniAccountCard({ a, onClick }) {
  const isCredit = a.type === 'Crédito';
  const pctUsed = isCredit ? Math.min(100, Math.abs(a.balance) / a.limit * 100) : 0;
  return (
    <button onClick={onClick} style={{
      flex: '0 0 180px', height: 110, borderRadius: 18, padding: 14,
      border: 'none', cursor: 'pointer', fontFamily: 'inherit',
      textAlign: 'left', color: '#fff',
      background: `linear-gradient(135deg, ${a.color} 0%, ${shade(a.color, -20)} 100%)`,
      boxShadow: '0 8px 20px ' + a.color + '40',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 26, height: 26, borderRadius: 6, background: 'rgba(255,255,255,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 13,
        }}>{a.logo}</div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, opacity: 0.8 }}>{a.type.toUpperCase()}</div>
      </div>
      <div>
        <div style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.75, marginBottom: 2 }}>{a.name} {a.mask}</div>
        <div style={{ fontFamily: 'inherit', fontWeight: 500, fontSize: 22, lineHeight: 1, letterSpacing: -0.3 }}>
          {fmt(Math.abs(a.balance))}
        </div>
        {isCredit && (
          <div style={{ marginTop: 4, height: 3, background: 'rgba(255,255,255,0.22)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: pctUsed + '%', height: '100%', background: '#fff' }} />
          </div>
        )}
      </div>
    </button>
  );
}

function shade(hex, amt) {
  const h = hex.replace('#','');
  const num = parseInt(h, 16);
  let r = (num >> 16) + amt;
  let g = ((num >> 8) & 0xff) + amt;
  let b = (num & 0xff) + amt;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

// Full-screen Accounts modal
function AccountsModal({ open, onClose, accounts, onCreate, onDelete, onEdit, activeMember }) {
  if (!open) return null;
  const accs = accounts || [];
  const patrimonio = accs.reduce((s, a) => s + a.balance, 0);
  return (
    <FullSheet onClose={onClose} title="Cuentas">
      <Card pad={20} style={{ background: 'linear-gradient(150deg, #1A1815 0%, #2A2521 70%, #3A332B 100%)', color: '#fff', border: 'none', marginBottom: 18 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Patrimonio total</div>
        <div style={{ fontFamily: 'inherit', fontWeight: 500, fontSize: 44, lineHeight: 1, marginTop: 4, letterSpacing: -1 }}>{fmt(patrimonio)}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 6 }}>{accs.length} cuentas · Actualizado ahora</div>
      </Card>
      <Section title="Activos">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {accs.filter(a => a.balance >= 0).map(a => <AccountRow key={a.id} a={a} onDelete={onDelete} onEdit={onEdit} activeMember={activeMember} />)}
        </div>
      </Section>
      <div style={{ height: 14 }} />
      <Section title="Pasivos">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {accs.filter(a => a.balance < 0).map(a => <AccountRow key={a.id} a={a} onDelete={onDelete} onEdit={onEdit} activeMember={activeMember} />)}
        </div>
      </Section>
      <button onClick={onCreate} style={{ marginTop: 18, width: '100%', border: '1.5px dashed ' + T.border, background: 'transparent', padding: '16px', borderRadius: 16, fontSize: 14, fontWeight: 700, color: T.ink2, cursor: 'pointer', fontFamily: 'inherit' }}>+ Vincular nueva cuenta</button>
    </FullSheet>
  );
}

function AccountRow({ a, onDelete, onEdit, activeMember }) {
  const [editing, setEditing] = React.useState(false);
  const [editVal, setEditVal] = React.useState('');
  const isCredit = a.type === 'Crédito';
  const pctUsed = isCredit ? Math.min(100, Math.abs(a.balance) / (a.limit || 1) * 100) : 0;
  const isFamiliaView = activeMember?.id === 'familia';
  const ownerMember = APP_DATA.members.find(m => m.id === a.owner);

  const startEdit = () => {
    setEditVal(String(Math.abs(a._initialBalance ?? a.balance)));
    setEditing(true);
  };
  const saveEdit = () => {
    const newVal = Number(editVal);
    if (onEdit && newVal >= 0) onEdit(a.id, isCredit ? -newVal : newVal);
    setEditing(false);
  };

  return (
    <Card pad={14} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: a.color, color: '#fff', fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.logo}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: T.ink }}>{a.name}</div>
          {isFamiliaView && ownerMember && (
            <div style={{ fontSize: 9, fontWeight: 800, color: '#fff', background: ownerMember.color, padding: '2px 5px', borderRadius: 4 }}>{ownerMember.initials}</div>
          )}
        </div>
        <div style={{ fontSize: 11.5, color: T.muted, marginTop: 1 }}>{a.type}{a.mask ? ' ' + a.mask : ''}</div>
        {isCredit && (
          <div style={{ marginTop: 6 }}>
            <div style={{ height: 4, background: T.soft, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: pctUsed + '%', height: '100%', background: a.color }} />
            </div>
            <div style={{ fontSize: 10.5, color: T.muted, marginTop: 3 }}>{Math.round(pctUsed)}% de {fmt(a.limit, { abbr: true })} usado</div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        {editing ? (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              autoFocus
              value={editVal}
              onChange={e => setEditVal(e.target.value.replace(/[^\d.]/g, ''))}
              onKeyDown={e => e.key === 'Enter' && saveEdit()}
              style={{ width: 88, fontSize: 13, fontWeight: 700, textAlign: 'right', border: '1.5px solid ' + T.blue, borderRadius: 8, padding: '4px 8px', fontFamily: 'inherit' }}
            />
            <button onClick={saveEdit} style={{ border: 'none', background: T.blue, color: '#fff', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>OK</button>
            <button onClick={() => setEditing(false)} style={{ border: 'none', background: T.soft, color: T.ink, borderRadius: 8, padding: '4px 8px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: a.balance < 0 ? T.red : T.ink, letterSpacing: -0.2 }}>{a.balance < 0 ? '−' : ''}{fmt(Math.abs(a.balance))}</div>
            {onEdit && <button onClick={startEdit} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 14, padding: '2px 3px', lineHeight: 1, color: T.muted }}>✏️</button>}
          </div>
        )}
        {onDelete && (
          <button onClick={() => onDelete(a.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 11, color: T.muted, padding: '0', fontFamily: 'inherit', textDecoration: 'underline' }}>Eliminar</button>
        )}
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════
// SHARED — Full-screen sheet
// ═══════════════════════════════════════════════════════════
function FullSheet({ children, title, onClose, accent = T.ink }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 75,
      background: T.bg, display: 'flex', flexDirection: 'column',
      animation: 'slideUp 280ms cubic-bezier(.2,.7,.3,1)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '56px 16px 12px', position: 'sticky', top: 0,
        background: T.bg, zIndex: 2,
      }}>
        <button onClick={onClose} style={{
          width: 36, height: 36, borderRadius: 18,
          background: T.card, border: '1px solid ' + T.border,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: T.ink, cursor: 'pointer',
        }}><ChevronLeft/></button>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.ink }}>{title}</div>
        <div style={{ width: 36 }} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 18px 40px' }}>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCAN RECEIPT — OCR helpers
// ═══════════════════════════════════════════════════════════

const CAT_PRIORITY = [
  ['salud',           ['FARMACIA', 'BENAVIDES', 'AHORRO', 'GUADALAJARA', 'CRUZ VERDE', 'MEDICAMENTO', 'CLINICA', 'HOSPITAL', 'DR.', 'DRA.', 'LABORATORIO']],
  ['servicios',       ['CFE ', 'TELMEX', 'IZZI', 'TELCEL', 'AT&T', 'MOVISTAR', 'TOTALPLAY', 'MEGACABLE', 'AGUA ', 'PREDIAL', 'CONAGUA']],
  ['suscripciones',   ['NETFLIX', 'SPOTIFY', 'DISNEY', 'AMAZON', 'HBO', 'APPLE', 'YOUTUBE']],
  ['entretenimiento', ['CINEPOLIS', 'CINEMEX', 'CINEMA', 'TEATRO ', 'CONCIERTO', 'TICKETMASTER', 'SPORTIUM', 'GYM', 'GIMNASIO']],
  ['transporte',      ['UBER', 'DIDI', 'CABIFY', 'TAXI', 'METRO ', 'METROBUS', 'ADO', 'PRIMERA PLUS', 'ESTRELLA', 'PEMEX', 'SHELL', 'MAGNA', 'PREMIUM', 'LITROS', 'DIESEL']],
  ['educacion',       ['ESCUELA', 'COLEGIO', 'UNIVERSIDAD', 'INSTITUTO', 'LIBRERIA', 'PAPELERIA', 'LIBRO']],
  ['restaurantes',    ['RESTAURAN', 'TAQUERIA', 'TAQUER', 'PIZZA', 'BURGER', 'CARNITAS', 'TORTAS', 'SUSHI', 'MARISCOS', 'ANTOJITOS', 'COCINA', 'GRILL', 'CAFETERIA', 'CAFE ', 'CAFÉ', 'STARBUCKS', 'MCDONALDS', 'KFC', 'DOMINOS', 'SUBWAY', 'VIPS', 'SANBORNS']],
  ['supermercado',    ['WALMART', 'SORIANA', 'CHEDRAUI', 'BODEGA', 'COSTCO', "SAM'S", 'HEB', 'LA COMER', 'SUPERAMA', 'CITY MARKET', 'FRESKO', 'MEGA', 'OXXO', '7-ELEVEN', 'SEVEN ELEVEN', 'CIRCLE K', 'KIOSKO', 'EXTRA ']],
];

function detectCategoryFromText(text) {
  const upper = text.toUpperCase();
  for (const [cat, keywords] of CAT_PRIORITY) {
    if (keywords.some(kw => upper.includes(kw))) return cat;
  }
  return 'otros';
}

function extractTotal(text) {
  const patterns = [
    /TOTAL\s+A\s+PAGAR\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})/i,
    /IMPORTE\s+TOTAL\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})/i,
    /TOTAL\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})/i,
    /IMPORTE\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})/i,
    /A\s+PAGAR\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})/i,
    /SUMA\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})/i,
    /SUBTOTAL\s*:?\s*\$?\s*([\d,]+\.?\d{0,2})/i,
  ];
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m) {
      const n = parseFloat(m[1].replace(/,/g, ''));
      if (n > 0) return n;
    }
  }
  // Fallback: largest currency amount on the receipt
  const amounts = [...text.matchAll(/\$\s*([\d,]{1,7}\.\d{2})/g)]
    .map(m => parseFloat(m[1].replace(/,/g, '')))
    .filter(n => n > 0 && n < 999999);
  return amounts.length ? Math.max(...amounts) : 0;
}

function extractMerchant(lines) {
  // Skip very short lines and lines that are only digits/symbols
  const candidates = lines.filter(l => l.length >= 3 && /[A-Za-zÀ-ÿ]/.test(l));
  return candidates[0] || 'Comercio';
}

function parseReceiptText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const today = new Date();
  return {
    merchant:  extractMerchant(lines),
    total:     extractTotal(text),
    category:  detectCategoryFromText(text),
    date:      'Hoy, ' + today.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }),
    items:     [],
  };
}

function ScanModal({ open, onClose, onResult }) {
  const [phase, setPhase] = React.useState('aim');
  const [scanProgress, setScanProgress] = React.useState(0);
  const [camError, setCamError] = React.useState(null); // null | 'insecure' | 'denied' | 'unavailable'
  const [torchOn, setTorchOn] = React.useState(false);
  const [capturedImg, setCapturedImg] = React.useState(null);
  const [extracted, setExtracted] = React.useState(null);
  const [ocrStatus, setOcrStatus] = React.useState('');
  const [stream, setStream] = React.useState(null); // stream in state → triggers re-render to attach to <video>
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  // Start/stop camera when modal opens/closes
  React.useEffect(() => {
    if (!open) {
      stopCamera();
      setPhase('aim');
      setScanProgress(0);
      setCamError(null);
      setTorchOn(false);
      setCapturedImg(null);
      setExtracted(null);
      setOcrStatus('');
      return;
    }
    startCamera();
  }, [open]);

  // Attach stream to video element whenever either becomes available
  React.useEffect(() => {
    const video = videoRef.current;
    if (!stream || !video) return;
    if (video.srcObject === stream) return;
    video.srcObject = stream;
    video.play().catch(() => {});
  }, [stream]);

  function startCamera() {
    if (!window.isSecureContext) {
      setCamError('insecure');
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCamError('unavailable');
      return;
    }
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: false,
    }).then(s => {
      setStream(s);
    }).catch(err => {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCamError('denied');
      } else {
        setCamError('unavailable');
      }
    });
  }

  function stopCamera() {
    setStream(prev => {
      if (prev) prev.getTracks().forEach(t => t.stop());
      return null;
    });
    if (videoRef.current) videoRef.current.srcObject = null;
  }

  function toggleTorch() {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (!track) return;
    const newVal = !torchOn;
    track.applyConstraints({ advanced: [{ torch: newVal }] })
      .then(() => setTorchOn(newVal))
      .catch(() => {});
  }

  function captureAndScan() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.readyState >= 2) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      canvas.getContext('2d').drawImage(video, 0, 0);
      setCapturedImg(canvas.toDataURL('image/jpeg', 0.92));
    }
    stopCamera();
    setPhase('scanning');
  }

  function openGallery() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        setCapturedImg(ev.target.result);
        stopCamera();
        setPhase('scanning');
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  // OCR scanning
  React.useEffect(() => {
    if (phase !== 'scanning' || !capturedImg) return;

    setScanProgress(0);
    setOcrStatus('Iniciando…');

    const FALLBACK = {
      merchant: 'Comercio',
      total: 0,
      category: 'otros',
      date: 'Hoy, ' + new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }),
      items: [],
    };

    function finish(result) {
      setExtracted(result);
      setScanProgress(100);
      setTimeout(() => setPhase('result'), 350);
    }

    function runOCR() {
      Tesseract.recognize(capturedImg, 'spa', {
      logger: m => {
        if (m.status === 'loading tesseract core') {
          setOcrStatus('Cargando motor…');
          setScanProgress(Math.round(m.progress * 10));
        } else if (m.status === 'initializing tesseract') {
          setOcrStatus('Inicializando…');
          setScanProgress(10 + Math.round(m.progress * 10));
        } else if (m.status === 'loading language traineddata') {
          setOcrStatus('Cargando idioma…');
          setScanProgress(20 + Math.round(m.progress * 10));
        } else if (m.status === 'initializing api') {
          setOcrStatus('Preparando análisis…');
          setScanProgress(30 + Math.round(m.progress * 10));
        } else if (m.status === 'recognizing text') {
          setOcrStatus('Leyendo texto…');
          setScanProgress(40 + Math.round(m.progress * 58));
        }
      },
      }).then(({ data: { text } }) => {
        finish(parseReceiptText(text));
      }).catch(() => finish(FALLBACK));
    }

    // Load Tesseract lazily if not yet available, then run OCR
    if (typeof Tesseract !== 'undefined') {
      runOCR();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js';
      script.onload = runOCR;
      script.onerror = () => {
        // CDN failed — animate fake progress then fall back
        let p = 0;
        const id = setInterval(() => {
          p += 6 + Math.random() * 8;
          if (p >= 100) { clearInterval(id); finish(FALLBACK); }
          else setScanProgress(Math.min(p, 99));
        }, 90);
      };
      document.head.appendChild(script);
    }
  }, [phase, capturedImg]);

  if (!open) return null;

  const result = extracted || {
    merchant: '', total: 0, category: 'otros',
    date: 'Hoy, ' + new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }),
    items: [],
  };
  const catInfo = (APP_DATA.categories[result.category] || APP_DATA.categories.otros);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 78,
      background: '#000', display: 'flex', flexDirection: 'column',
      color: '#fff',
      animation: 'fadeIn 200ms',
    }}>
      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '56px 18px 14px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
      }}>
        <button onClick={onClose} style={{
          width: 36, height: 36, borderRadius: 18,
          background: 'rgba(255,255,255,0.18)', border: 'none', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>✕</button>
        <div style={{ fontSize: 15, fontWeight: 700 }}>
          {phase === 'aim' ? 'Escanear ticket' : phase === 'scanning' ? 'Analizando…' : 'Detectado'}
        </div>
        <button onClick={toggleTorch} style={{
          width: 36, height: 36, borderRadius: 18,
          background: torchOn ? 'rgba(255,220,0,0.35)' : 'rgba(255,255,255,0.18)',
          border: 'none', color: '#fff', fontSize: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>⚡</button>
      </div>

      {phase !== 'result' ? (
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

          {/* Loading indicator while stream starts */}
          {!camError && !stream && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 10,
            }}>
              <div style={{ fontSize: 32 }}>📷</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>Iniciando cámara…</div>
            </div>
          )}

          {/* Live camera feed */}
          {!camError && (
            <video ref={videoRef} autoPlay playsInline muted
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover',
                opacity: phase === 'scanning' ? 0 : 1,
                transition: 'opacity 300ms',
              }}
            />
          )}

          {/* Captured frame shown during scanning */}
          {capturedImg && phase === 'scanning' && (
            <img src={capturedImg} alt="" style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
            }} />
          )}

          {/* Camera error states */}
          {camError && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 12, padding: 32, textAlign: 'center',
            }}>
              <div style={{ fontSize: 40 }}>
                {camError === 'denied' ? '🔒' : camError === 'insecure' ? '⚠️' : '📷'}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>
                {camError === 'denied' ? 'Permiso denegado'
                  : camError === 'insecure' ? 'Requiere HTTPS'
                  : 'Cámara no disponible'}
              </div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', maxWidth: 260 }}>
                {camError === 'denied'
                  ? 'Permite el acceso a la cámara en los ajustes del navegador y vuelve a intentarlo.'
                  : camError === 'insecure'
                  ? 'La cámara solo funciona en HTTPS o localhost. Abre la app desde GitHub Pages o un servidor local.'
                  : 'Tu dispositivo no tiene cámara disponible. Usa la galería para subir una foto del ticket.'}
              </div>
              {(camError === 'denied' || camError === 'unavailable') && (
                <button onClick={() => { setCamError(null); startCamera(); }} style={{
                  marginTop: 8, padding: '12px 24px', borderRadius: 12,
                  background: '#fff', color: '#000', border: 'none',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer',
                }}>Reintentar</button>
              )}
              <button onClick={openGallery} style={{
                marginTop: 4, padding: '10px 20px', borderRadius: 12,
                background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none',
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
              }}>📁 Usar galería</button>
            </div>
          )}

          {/* Corner brackets (aim phase) */}
          {phase === 'aim' && !camError && stream && [
            { top: 100,    left: 32,  rot: 0   },
            { top: 100,    right: 32, rot: 90  },
            { bottom: 210, left: 32,  rot: -90 },
            { bottom: 210, right: 32, rot: 180 },
          ].map((c, i) => (
            <div key={i} style={{
              position: 'absolute', ...c, width: 30, height: 30,
              borderTop: '3px solid #fff', borderLeft: '3px solid #fff',
              transform: `rotate(${c.rot}deg)`, borderRadius: 4,
            }} />
          ))}

          {/* Scanning laser over captured frame */}
          {phase === 'scanning' && (
            <div style={{
              position: 'absolute', left: 0, right: 0,
              top: `${10 + (scanProgress * 0.7)}%`,
              height: 2,
              background: 'linear-gradient(90deg, transparent, #5DCC7A, transparent)',
              boxShadow: '0 0 20px #5DCC7A, 0 0 40px #5DCC7A',
              transition: 'top 90ms linear',
              zIndex: 3,
            }}/>
          )}

          {/* Bottom controls */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 2,
            padding: '0 0 56px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
            background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
          }}>
            {phase === 'aim' && (
              <>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.8)', textAlign: 'center', maxWidth: 240 }}>
                  Encuadra el ticket dentro de los marcadores
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
                  <button onClick={openGallery} style={{
                    background: 'rgba(255,255,255,0.18)', border: 'none', color: '#fff',
                    padding: '10px 14px', borderRadius: 12, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  }}>📁 Galería</button>
                  <button onClick={captureAndScan} disabled={!stream} style={{
                    width: 72, height: 72, borderRadius: 36,
                    background: stream ? '#fff' : 'rgba(255,255,255,0.3)',
                    border: '4px solid rgba(255,255,255,0.35)',
                    cursor: stream ? 'pointer' : 'default',
                    boxShadow: '0 0 0 2px #fff inset',
                    transition: 'background 300ms',
                  }}/>
                  <div style={{ width: 52 }} />
                </div>
              </>
            )}
            {phase === 'scanning' && (
              <>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{ocrStatus}</div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{Math.round(scanProgress)}%</div>
                <div style={{ width: 200, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: scanProgress + '%', height: '100%', background: '#5DCC7A', transition: 'width 120ms linear' }}/>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, background: T.bg, color: T.ink, padding: 18, animation: 'fadeIn 240ms', overflowY: 'auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 4 }}>{result.total > 0 ? '✨' : '🔍'}</div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: result.total > 0 ? T.green : T.muted }}>
              {result.total > 0 ? 'Detectado con éxito' : 'Revisión manual'}
            </div>
          </div>

          {/* Thumbnail of captured photo */}
          {capturedImg && (
            <div style={{ marginBottom: 14, borderRadius: 14, overflow: 'hidden', maxHeight: 130 }}>
              <img src={capturedImg} alt="ticket" style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
            </div>
          )}

          {result.total === 0 && (
            <div style={{ background: '#FFF3CD', borderRadius: 12, padding: '10px 14px', marginBottom: 14, fontSize: 12.5, color: '#856404' }}>
              No se detectó el monto. Puedes ajustarlo manualmente en el formulario.
            </div>
          )}

          <Card pad={18}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: catInfo.color + '22',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>{catInfo.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>{result.merchant || 'Comercio'}</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 1 }}>{result.date}</div>
              </div>
              {result.total > 0 && (
                <div style={{ fontFamily: 'inherit', fontWeight: 500, fontSize: 26, color: T.red, lineHeight: 1 }}>−{fmt(result.total)}</div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: catInfo.color, background: catInfo.color + '18', padding: '6px 10px', borderRadius: 999 }}>
                {catInfo.icon} {catInfo.name}
              </div>
            </div>
          </Card>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={onClose} style={{
              flex: 1, background: '#fff', color: T.ink, border: '1px solid ' + T.border,
              padding: '14px', borderRadius: 14, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
            }}>Cancelar</button>
            <button onClick={() => { onResult(result); onClose(); }} style={{
              flex: 1, background: T.green, color: '#fff', border: 'none',
              padding: '14px', borderRadius: 14, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
            }}>Guardar gasto</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// REMINDERS
// ═══════════════════════════════════════════════════════════
function RemindersModal({ open, onClose }) {
  const [rems, setRems] = React.useState(APP_DATA.reminders);
  const [pushAll, setPushAll]   = React.useState(true);
  const [emailAll, setEmailAll] = React.useState(false);
  const [whatsapp, setWhatsapp] = React.useState(false);
  const [days, setDays] = React.useState(2);

  if (!open) return null;

  return (
    <FullSheet onClose={onClose} title="Recordatorios">
      <Card pad={18} style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 4 }}>Canales</div>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 14 }}>Cómo te avisamos antes de un pago</div>
        <SwitchRow icon="🔔" label="Notificación push" value={pushAll} onChange={setPushAll} />
        <SwitchRow icon="✉️" label="Email a ulises@…" value={emailAll} onChange={setEmailAll} />
        <SwitchRow icon="💬" label="WhatsApp" value={whatsapp} onChange={setWhatsapp} last />
      </Card>

      <Card pad={18} style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 10 }}>Avisarme con anticipación</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 1, 2, 3, 5, 7].map(d => (
            <button key={d} onClick={() => setDays(d)} style={{
              flex: 1, padding: '10px 4px', borderRadius: 12,
              border: '1.5px solid ' + (days === d ? T.ink : T.border),
              background: days === d ? T.ink : '#fff',
              color: days === d ? '#fff' : T.ink2,
              fontWeight: 700, fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit',
            }}>{d === 0 ? 'Mismo día' : d + 'd'}</button>
          ))}
        </div>
      </Card>

      <Section title="Próximos recordatorios">
        {rems.map(r => (
          <Card key={r.id} pad={14} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, background: T.soft,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>{r.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: T.ink }}>{r.name}</div>
                {r.status === 'urgent' && (
                  <div style={{ fontSize: 9.5, fontWeight: 800, color: T.red, background: T.redSoft, padding: '2px 6px', borderRadius: 4, letterSpacing: 0.4 }}>HOY</div>
                )}
              </div>
              <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>{r.when} · {r.channel}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, letterSpacing: -0.2 }}>{fmt(r.amount)}</div>
          </Card>
        ))}
      </Section>
    </FullSheet>
  );
}

function SwitchRow({ icon, label, value, onChange, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 0', borderBottom: last ? 'none' : '1px solid ' + T.border,
    }}>
      <div style={{ fontSize: 18 }}>{icon}</div>
      <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: T.ink }}>{label}</div>
      <button onClick={() => onChange(!value)} style={{
        width: 46, height: 28, borderRadius: 14,
        background: value ? T.green : T.soft,
        border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 200ms',
      }}>
        <div style={{
          position: 'absolute', top: 2, left: value ? 20 : 2,
          width: 24, height: 24, borderRadius: 12, background: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)', transition: 'left 200ms',
        }}/>
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// AI ASSISTANT
// ═══════════════════════════════════════════════════════════
function AssistantModal({ open, onClose }) {
  const [messages, setMessages] = React.useState([
    { role: 'assistant', content: 'Hola Ulises 👋 Soy tu asistente financiero. Puedo analizar tus gastos, sugerir recortes o ayudarte a planear ahorros. ¿En qué pensamos hoy?' },
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  if (!open) return null;

  const buildPrompt = (userMsg) => {
    const m = APP_DATA.month;
    const context = `Eres un asistente financiero amigable y directo para Ulises y su familia. Responde SIEMPRE en español, breve (máx 4 frases) y con un tono cálido pero útil. Si conviene, usa viñetas con guion.
    
Contexto del mes (Mayo 2026, pesos mexicanos MXN):
- Ingresos: $${m.income}
- Gastos: $${m.expenses}
- Ahorrado: $${m.savings}
- Disponible: $${m.income - m.expenses - m.savings}
- Sobre presupuesto: Restaurantes (21% arriba de $3,000)
- Metas activas: Vacaciones Cancún ($14,200 de $35,000), Fondo de emergencia ($48,000 de $60,000), Auto nuevo ($22,500 de $180,000)
- Familia: Ulises (admin), Carla (pareja), Diego (hijo), Lupita (hija)
- Próximos pagos: Renta $12,000 (15 may), Netflix $219 (17 may), Internet $599 (18 may), CFE $1,280 (22 may)

Conversación previa:
${messages.slice(-6).map(m => (m.role === 'user' ? 'Ulises' : 'Tú') + ': ' + m.content).join('\n')}

Ulises: ${userMsg}
Tú:`;
    return context;
  };

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setMessages(ms => [...ms, { role: 'user', content: msg }]);
    setInput('');
    setLoading(true);
    try {
      if (!(window.claude && window.claude.complete)) {
        throw new Error('no-claude');
      }
      const reply = await window.claude.complete(buildPrompt(msg));
      setMessages(ms => [...ms, { role: 'assistant', content: reply.trim() }]);
    } catch (e) {
      const fallback = e.message === 'no-claude'
        ? 'Estás viendo una versión publicada. Para que Penny conteste con IA real necesitas conectar una API (Claude, OpenAI, etc.). Por ahora soy un asistente de demo. 🤖'
        : 'Uy, no pude responder ahora. Intenta de nuevo en un momento.';
      setMessages(ms => [...ms, { role: 'assistant', content: fallback }]);
    }
    setLoading(false);
  };

  const suggestions = [
    '¿Dónde estoy gastando de más?',
    '¿Cuánto más debo ahorrar para Cancún?',
    'Dame un plan para reducir restaurantes',
    'Resumen de mi mes',
  ];

  return (
    <FullSheet onClose={onClose} title="Asistente IA">
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', minHeight: 460 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28, margin: '0 auto 10px',
            background: 'linear-gradient(135deg, #7048E8 0%, #3B5BDB 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, boxShadow: '0 10px 24px rgba(112,72,232,0.3)',
          }}>✨</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>Tu asistente Penny</div>
          <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>Conoce tus gastos, metas y presupuestos</div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} style={{
          flex: 1, overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 10,
          padding: '4px 0 8px',
        }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '82%',
            }}>
              <div style={{
                background: m.role === 'user' ? T.ink : '#fff',
                color: m.role === 'user' ? '#fff' : T.ink,
                padding: '10px 14px',
                borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                fontSize: 13.5, lineHeight: 1.45,
                border: m.role === 'user' ? 'none' : '1px solid ' + T.border,
                whiteSpace: 'pre-wrap',
              }}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start' }}>
              <div style={{
                background: '#fff', border: '1px solid ' + T.border,
                padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
                display: 'flex', gap: 4,
              }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: 3, background: T.muted,
                    animation: `pulse 1.2s ${i*0.15}s infinite ease-in-out`,
                  }}/>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && !loading && (
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '8px 0', scrollbarWidth: 'none', margin: '0 -18px 0', paddingLeft: 18, paddingRight: 18 }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)} style={{
                flex: '0 0 auto', whiteSpace: 'nowrap',
                background: '#fff', border: '1px solid ' + T.border,
                padding: '8px 12px', borderRadius: 999,
                fontSize: 12, fontWeight: 600, color: T.ink2,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{
          display: 'flex', gap: 8, padding: '10px 0 0',
          borderTop: '1px solid ' + T.border, marginTop: 8,
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Pregúntale a Penny…"
            style={{
              flex: 1, padding: '12px 14px', borderRadius: 999,
              border: '1px solid ' + T.border, background: '#fff',
              fontSize: 14, fontFamily: 'inherit', color: T.ink,
              outline: 'none',
            }}
          />
          <button onClick={() => send()} disabled={!input.trim() || loading} style={{
            width: 44, height: 44, borderRadius: 22,
            background: input.trim() && !loading ? T.ink : T.soft,
            color: '#fff', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>↑</button>
        </div>
      </div>
    </FullSheet>
  );
}

Object.assign(window, {
  AccountsStrip, AccountsModal, ScanModal, RemindersModal, AssistantModal, FullSheet,
});
