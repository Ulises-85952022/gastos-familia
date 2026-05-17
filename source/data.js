// App data — categories/sources are the "schema"; transactional data starts empty
window.APP_DATA = {
  user: {
    name: 'Mi Familia',
    family: 'Mi Familia',
    initials: 'MF',
  },
  members: [
    { id: 'yo',     name: 'Yo',      role: 'Admin',    color: '#3B5BDB', initials: 'YO', avatar: '👤' },
    { id: 'ale',    name: 'Ale',     role: 'Familiar', color: '#E64980', initials: 'AL', avatar: '👤' },
  ],
  categories: {
    supermercado:    { name: 'Supermercado',    icon: '🛒', color: '#F59F00' },
    renta:           { name: 'Renta',           icon: '🏠', color: '#7048E8' },
    transporte:      { name: 'Transporte',      icon: '🚗', color: '#1098AD' },
    servicios:       { name: 'Servicios',       icon: '💡', color: '#F76707' },
    restaurantes:    { name: 'Restaurantes',    icon: '🍽️', color: '#E03131' },
    salud:           { name: 'Salud',           icon: '🩺', color: '#37B24D' },
    educacion:       { name: 'Educación',       icon: '📚', color: '#1971C2' },
    entretenimiento: { name: 'Entretenimiento', icon: '🎬', color: '#AE3EC9' },
    suscripciones:   { name: 'Suscripciones',  icon: '📺', color: '#5C7CFA' },
    otros:           { name: 'Otros',          icon: '✨', color: '#868E96' },
  },
  incomeSources: {
    sueldo:    { name: 'Sueldo',        icon: '💼', color: '#2F9E44' },
    freelance: { name: 'Freelance',     icon: '💻', color: '#0CA678' },
    renta_in:  { name: 'Renta cobrada', icon: '🏘️', color: '#74B816' },
    otros_in:  { name: 'Otros',         icon: '💰', color: '#82C91E' },
  },

  // Transactional data — starts empty, managed via React state + localStorage
  transactions: [],
  accounts:     [],
  goals:        [],
  budgets: [
    { cat: 'supermercado',    limit: 5000 },
    { cat: 'restaurantes',    limit: 3000 },
    { cat: 'transporte',      limit: 2000 },
    { cat: 'entretenimiento', limit: 1500 },
    { cat: 'servicios',       limit: 3000 },
    { cat: 'salud',           limit: 2000 },
  ],
  upcoming: [
    { id: 'up1', name: 'Renta',         icon: '🏠', amount: 12000, dueDay: 15, who: 'Yo',  cat: 'renta',          auto: false, paid: false },
    { id: 'up2', name: 'Netflix',        icon: '📺', amount: 219,   dueDay: 17, who: 'Yo',  cat: 'suscripciones',  auto: true,  paid: false },
    { id: 'up3', name: 'Internet',       icon: '🌐', amount: 599,   dueDay: 18, who: 'Yo',  cat: 'servicios',      auto: true,  paid: false },
    { id: 'up4', name: 'CFE',            icon: '⚡', amount: 1280,  dueDay: 22, who: 'Ale', cat: 'servicios',      auto: false, paid: false },
    { id: 'up5', name: 'Spotify',        icon: '🎵', amount: 129,   dueDay: 28, who: 'Yo',  cat: 'suscripciones',  auto: true,  paid: false },
    { id: 'up6', name: 'Seguro de auto', icon: '🛡️', amount: 2100,  dueDay: 1,  who: 'Yo',  cat: 'transporte',     auto: false, paid: false },
  ],
  insights: [
    { type: 'warn', icon: '🍽️', text: 'Restaurantes 21% sobre presupuesto este mes' },
    { type: 'good', icon: '💰', text: 'Ahorraste 12% más que el mes pasado' },
    { type: 'info', icon: '📅', text: '3 pagos en los próximos 5 días' },
  ],
  reminders: [
    { id: 'r1', name: 'Netflix',  icon: '📺', when: 'Hoy 17 mayo',  amount: 219,   channel: 'Push',  status: 'urgent' },
    { id: 'r2', name: 'Internet', icon: '🌐', when: 'Mañana',       amount: 599,   channel: 'Push',  status: '' },
    { id: 'r3', name: 'CFE',      icon: '⚡', when: '22 mayo',      amount: 1280,  channel: 'Email', status: '' },
  ],
};
