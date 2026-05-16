// App data — categories/sources are the "schema"; transactional data starts empty
window.APP_DATA = {
  user: {
    name: 'Mi Familia',
    family: 'Mi Familia',
    initials: 'MF',
  },
  members: [
    { id: 'yo',     name: 'Yo',      role: 'Admin',    color: '#3B5BDB', initials: 'YO', avatar: '👤' },
    { id: 'esposa', name: 'Esposa',  role: 'Familiar', color: '#E64980', initials: 'ES', avatar: '👤' },
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
  budgets:      [],
  upcoming:     [],
  insights:     [],
  reminders:    [],
};
