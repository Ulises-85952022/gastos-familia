// Sample data for the family finance prototype
window.APP_DATA = {
  user: {
    name: 'Ulises',
    family: 'Familia Ramírez',
    initials: 'UR',
  },
  members: [
    { id: 'ulises', name: 'Ulises',  role: 'Admin',    color: '#3B5BDB', initials: 'U', avatar: '👨🏻' },
    { id: 'carla',  name: 'Carla',   role: 'Pareja',   color: '#D6336C', initials: 'C', avatar: '👩🏻' },
    { id: 'diego',  name: 'Diego',   role: 'Hijo',     color: '#F08C00', initials: 'D', avatar: '🧒🏻' },
    { id: 'lupita', name: 'Lupita',  role: 'Hija',     color: '#0CA678', initials: 'L', avatar: '👧🏻' },
  ],
  month: { label: 'Mayo 2026', income: 68400, expenses: 41280, savings: 8500 },
  categories: {
    supermercado:   { name: 'Supermercado',  icon: '🛒', color: '#F59F00' },
    renta:          { name: 'Renta',         icon: '🏠', color: '#7048E8' },
    transporte:     { name: 'Transporte',    icon: '🚗', color: '#1098AD' },
    servicios:      { name: 'Servicios',     icon: '💡', color: '#F76707' },
    restaurantes:   { name: 'Restaurantes',  icon: '🍽️', color: '#E03131' },
    salud:          { name: 'Salud',         icon: '🩺', color: '#37B24D' },
    educacion:      { name: 'Educación',     icon: '📚', color: '#1971C2' },
    entretenimiento:{ name: 'Entretenimiento', icon: '🎬', color: '#AE3EC9' },
    suscripciones:  { name: 'Suscripciones', icon: '📺', color: '#5C7CFA' },
    otros:          { name: 'Otros',         icon: '✨', color: '#868E96' },
  },
  incomeSources: {
    sueldo:    { name: 'Sueldo',     icon: '💼', color: '#2F9E44' },
    freelance: { name: 'Freelance',  icon: '💻', color: '#0CA678' },
    renta_in:  { name: 'Renta cobrada', icon: '🏘️', color: '#74B816' },
    otros_in:  { name: 'Otros',      icon: '💰', color: '#82C91E' },
  },
  budgets: [
    { cat: 'supermercado',    limit: 9000,  spent: 6420 },
    { cat: 'renta',           limit: 12000, spent: 12000 },
    { cat: 'transporte',      limit: 3500,  spent: 2890 },
    { cat: 'servicios',       limit: 2800,  spent: 2150 },
    { cat: 'restaurantes',    limit: 3000,  spent: 3640 },
    { cat: 'entretenimiento', limit: 2000,  spent: 1180 },
    { cat: 'suscripciones',   limit: 900,   spent: 780 },
    { cat: 'salud',           limit: 1500,  spent: 420 },
  ],
  goals: [
    { id: 'g1', name: 'Vacaciones Cancún',   icon: '🏖️', saved: 14200, target: 35000, deadline: 'Dic 2026', color: '#0CA678' },
    { id: 'g2', name: 'Fondo de emergencia', icon: '🛟', saved: 48000, target: 60000, deadline: 'Sin fecha', color: '#3B5BDB' },
    { id: 'g3', name: 'Auto nuevo',          icon: '🚙', saved: 22500, target: 180000, deadline: 'Mar 2028', color: '#7048E8' },
    { id: 'g4', name: 'Colegiatura Diego',   icon: '🎓', saved: 6800, target: 12000, deadline: 'Ago 2026', color: '#F08C00' },
  ],
  upcoming: [
    { name: 'Renta',     amount: 12000, date: '15 May', who: 'Ulises',  icon: '🏠', auto: true  },
    { name: 'Netflix',   amount: 219,   date: '17 May', who: 'Carla',   icon: '📺', auto: true  },
    { name: 'Internet',  amount: 599,   date: '18 May', who: 'Ulises',  icon: '🌐', auto: true  },
    { name: 'CFE Luz',   amount: 1280,  date: '22 May', who: 'Ulises',  icon: '💡', auto: false },
    { name: 'Spotify',   amount: 169,   date: '25 May', who: 'Diego',   icon: '🎧', auto: true  },
    { name: 'Gimnasio',  amount: 850,   date: '28 May', who: 'Carla',   icon: '🏋🏻', auto: true  },
  ],
  transactions: [
    // Today
    { id: 't1',  date: '2026-05-13', day: 'Hoy',      kind: 'gasto',   cat: 'supermercado',  desc: 'Walmart',           who: 'Ulises', amount: 1284 },
    { id: 't2',  date: '2026-05-13', day: 'Hoy',      kind: 'gasto',   cat: 'restaurantes',  desc: 'Café con Carla',    who: 'Ulises', amount: 320  },
    { id: 't3',  date: '2026-05-13', day: 'Hoy',      kind: 'ahorro',  cat: null,            desc: 'Aporte mensual a Fondo emergencia', who: 'Ulises', amount: 2000 },
    // Yesterday
    { id: 't4',  date: '2026-05-12', day: 'Ayer',     kind: 'gasto',   cat: 'transporte',    desc: 'Uber al aeropuerto',who: 'Carla',  amount: 285  },
    { id: 't5',  date: '2026-05-12', day: 'Ayer',     kind: 'ingreso', src: 'freelance',     desc: 'Proyecto landing',  who: 'Ulises', amount: 8500 },
    { id: 't6',  date: '2026-05-12', day: 'Ayer',     kind: 'gasto',   cat: 'suscripciones', desc: 'Apple One',         who: 'Ulises', amount: 299  },
    // May 10
    { id: 't7',  date: '2026-05-10', day: 'Sáb 10 May',kind: 'gasto',  cat: 'supermercado',  desc: 'La Comer',          who: 'Carla',  amount: 2140 },
    { id: 't8',  date: '2026-05-10', day: 'Sáb 10 May',kind: 'gasto',  cat: 'entretenimiento',desc:'Cine en familia',   who: 'Carla',  amount: 680  },
    // May 5
    { id: 't9',  date: '2026-05-05', day: 'Lun 5 May',kind: 'ingreso', src: 'sueldo',        desc: 'Quincena',          who: 'Ulises', amount: 32000},
    { id: 't10', date: '2026-05-05', day: 'Lun 5 May',kind: 'gasto',   cat: 'servicios',     desc: 'Agua bimestral',    who: 'Ulises', amount: 980  },
    // May 3
    { id: 't11', date: '2026-05-03', day: 'Sáb 3 May',kind: 'gasto',   cat: 'educacion',     desc: 'Libros escolares',  who: 'Lupita', amount: 1450 },
    { id: 't12', date: '2026-05-03', day: 'Sáb 3 May',kind: 'gasto',   cat: 'salud',         desc: 'Farmacia',          who: 'Carla',  amount: 420  },
    // May 1
    { id: 't13', date: '2026-05-01', day: 'Jue 1 May',kind: 'ingreso', src: 'sueldo',        desc: 'Sueldo Carla',      who: 'Carla',  amount: 27900},
    { id: 't14', date: '2026-05-01', day: 'Jue 1 May',kind: 'gasto',   cat: 'renta',         desc: 'Renta mayo',        who: 'Ulises', amount: 12000},
  ],
  // little insights surfaced on dashboard
  insights: [
    { type: 'warn',  text: 'Restaurantes va 21% arriba del presupuesto', icon: '⚠️' },
    { type: 'good',  text: 'Ahorraste $2,000 más que el mes pasado', icon: '🎉' },
    { type: 'info',  text: 'Tienes 3 pagos fijos esta semana', icon: '📅' },
  ],
  accounts: [
    { id: 'a1', name: 'BBVA Débito',    type: 'Débito',     mask: '··4821', balance: 28450, brand: 'BBVA',     color: '#004481', logo: 'B' },
    { id: 'a2', name: 'Banamex Crédito',type: 'Crédito',    mask: '··3309', balance: -8620, limit: 45000, brand: 'Banamex', color: '#E2231A', logo: 'B' },
    { id: 'a3', name: 'Nu',             type: 'Crédito',    mask: '··7712', balance: -2140, limit: 22000, brand: 'Nu',      color: '#820AD1', logo: 'N' },
    { id: 'a4', name: 'Efectivo',       type: 'Efectivo',   mask: '',       balance: 1850,  brand: 'Cash',    color: '#2F9E44', logo: '₿' },
    { id: 'a5', name: 'Cetes Cetesdir.',type: 'Inversión',  mask: '',       balance: 84300, brand: 'Cetes',   color: '#7048E8', logo: 'C' },
  ],
  reminders: [
    { id: 'r1', name: 'Renta',   amount: 12000, when: 'Mañana, 09:00',  status: 'urgent',  channel: 'push+email', icon: '🏠' },
    { id: 'r2', name: 'CFE Luz', amount: 1280,  when: 'Vie 22 May',     status: 'soon',    channel: 'push',       icon: '💡' },
    { id: 'r3', name: 'Netflix', amount: 219,   when: 'Dom 17 May',     status: 'soon',    channel: 'push',       icon: '📺' },
    { id: 'r4', name: 'Spotify', amount: 169,   when: 'Lun 25 May',     status: 'ok',      channel: 'push',       icon: '🎧' },
    { id: 'r5', name: 'Gimnasio',amount: 850,   when: 'Jue 28 May',     status: 'ok',      channel: 'silenciado', icon: '🏋🏻' },
  ],
};
