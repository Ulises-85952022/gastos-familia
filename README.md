# Handoff: Gastos Familia — App de finanzas familiares

> Repo objetivo: https://github.com/Ulises-85952022/gastos-familia
> Sitio destino: https://ulises-85952022.github.io/gastos-familia/
> Owner: Ulises

---

## Overview

App móvil web para finanzas familiares compartidas. Pensada como **PWA mobile-first**, deployada en GitHub Pages para que la familia (Ulises, Carla, Diego, Lupita) la use desde el celular.

Permite registrar gastos, ingresos y ahorros con un modelo multi-usuario donde **todos ven todo** pero **cada quien sólo edita lo suyo**.

### Funciones principales
1. **Dashboard** — balance del mes, ingresos vs gastos vs ahorrado, cuentas, próximos pagos, top categorías
2. **Movimientos** — historial filtrable por tipo (gasto/ingreso/ahorro) y por miembro
3. **Ahorros** — metas con barras de progreso y deadlines
4. **Familia** — miembros, contribución mensual, gastos compartidos, invitación
5. **Categorías y cuentas personalizables** con selector de ícono (emoji) y color
6. **Escaneo de tickets** — cámara + IA extrae monto/comercio/ítems
7. **Recordatorios de pagos** con canales (push/email/WhatsApp) y anticipación configurable
8. **Asistente IA "Penny"** — chat que conoce contexto financiero del usuario
9. **Multi-usuario** — sesión activa bloqueada, badges de propiedad ("TUYO" / 🔒)

---

## About the Design Files

Los archivos en este bundle son **referencias de diseño hechas en HTML/React**, **no código de producción para copiar directo**. La tarea es **recrear estos diseños en el codebase del repo** (que actualmente está vacío salvo por el README), eligiendo el stack más apropiado.

Hay dos rutas para publicar:

### Ruta A — Quick deploy (1 archivo)
Tomar `bundled/gastos-familia.html`, renombrarlo a `index.html`, commitearlo al root del repo y habilitar GitHub Pages → branch `main` → `/ (root)`. **Sirve para validar rápido con la familia sin tocar nada más.** El archivo es ~1.5MB autocontenido (incluye fuentes, React, Babel, etc.).

### Ruta B — Codebase real (recomendado para iteración)
Reescribir como app **React + Vite** (o el stack que el dev prefiera). Mejor DX, hot reload, build optimizado, posibilidad de conectar backend real (Firebase, Supabase) para persistencia y multi-dispositivo.

**Esta es la ruta recomendada** porque el prototipo actual usa `useState` en memoria — al recargar se pierde todo. Para que la familia lo use de verdad necesita un backend (Firebase Auth + Firestore es lo más simple).

---

## Fidelity

**High-fidelity (hifi).** Colores, tipografía, spacing, jerarquía e interacciones son finales. El developer debería recrear pixel-perfect usando los tokens al final de este documento.

---

## Stack recomendado (Ruta B)

- **Frontend**: React 18 + Vite + TypeScript
- **Routing**: react-router (5 rutas: /, /movimientos, /ahorros, /familia, /cuentas)
- **State**: Zustand o Context (la app es pequeña, no necesita Redux)
- **Persistencia**: Firebase Auth + Firestore (free tier alcanza para una familia)
  - Collection `families/{familyId}`
  - Subcollections: `members`, `transactions`, `accounts`, `categories`, `goals`, `reminders`
- **IA**: Anthropic Claude API server-side (no exponer key) o OpenAI con Vercel Function
- **OCR (escaneo de tickets)**: Mindee API, Google Vision, o Tesseract.js como fallback
- **Push notifications**: Firebase Cloud Messaging
- **Build target**: PWA (manifest + service worker, vía `vite-plugin-pwa`)
- **Deploy**: GitHub Pages (vite con `base: '/gastos-familia/'`) o Vercel

---

## Estructura de pantallas (Screens)

La app vive dentro de un frame de iPhone 402×874 en el prototipo. En producción debería ser responsive con max-width de ~440px en mobile, centrada en desktop.

### 1. Dashboard (Inicio)
**Propósito**: vista general del estado financiero del mes.

**Layout** (de arriba abajo, padding 18px horizontal, gap 22px entre secciones):
1. **Header** (flex space-between):
   - Izq: "Hola," (13px muted) + nombre del usuario activo (24px bold) + 👋
   - Der: botón asistente IA (40×40 redondo, gradiente violeta-azul `#7048E8 → #3B5BDB`) + botón campana (con dot rojo si hay urgentes)
2. **Hero balance** (Card oscura `linear-gradient(150deg, #1A1815 0%, #2A2521 70%, #3A332B 100%)`, padding 20, radius 22):
   - Pill "Disponible · Mayo 2026" + chip "% usado"
   - Monto disponible en 46px peso 500
   - 3 columnas: Ingresos / Gastos / Ahorrado con dot de color (verde/rosa/azul claro)
3. **Quick actions grid** (4 cols, gap 10): Ingreso 💰, Gasto 💸, Ahorro 🐷, Cobrar 🤝 — cada uno tarjeta blanca con icon circular de color a 18% alpha
4. **Insights scroll horizontal** — chips de 220px con icon + texto (warn/good/info → gold/green/blue soft bg)
5. **Cuentas strip** — scroll horizontal de cards 180×110 con gradient del color del banco, mask del número, balance grande, barra de uso si es crédito + tile dashed `+`
6. **Donut "Tu mes en una mirada"** — donut 140×140 (segmentos: rojo=gastos, azul=ahorro, gris=disponible) + leyenda con %
7. **Próximos pagos** — Card con 3 filas (icon 40 + nombre + badge AUTO + fecha/persona + monto)
8. **Metas de ahorro** — scroll horizontal de cards 200px (icon + deadline + nombre + progreso + ahorrado/meta)
9. **Top categorías** — Card con barras de progreso (rojo si over budget)
10. **Bottom padding 120px** para no chocar con tabbar

### 2. Movimientos
1. Header "Movimientos / Mayo 2026"
2. 3 stats compactos (ingresos verdes / gastos rojos / ahorros azules)
3. **Filter chips horizontales** — tipo (Todo, Ingresos, Gastos, Ahorros) + separador + miembros (Todos, Ulises, Carla...) — chips activos toman color del filtro
4. **Listas agrupadas por día** — header con día + "Neto: ±$X" verde/rojo, luego Card con filas:
   - Icon categoría 40×40 (color a 22% alpha + emoji)
   - Descripción + pill "TUYO" verde si es tuyo
   - Avatar 16px + miembro · categoría + 🔒 si es ajeno
   - Monto a la derecha (signo + color: verde/azul/negro)

### 3. Ahorros
1. Header "Tus metas / Ahorros"
2. **Hero gradient** (azul→violeta soft: `linear-gradient(135deg, #E7ECFB 0%, #F4E7FB 100%)`):
   - "Total ahorrado" 11px uppercase azul
   - Monto 48px peso 400
   - % camino a meta + barra progreso
   - 2 botones: "Nueva meta" (primary azul) + "Aportar a meta" (secondary blanco)
3. Lista de cards de meta — icon coloreado + nombre + 🗓️ deadline + faltante + botón "+ Aportar" + barra + ahorrado/meta

### 4. Familia
1. Header "Familia Ramírez / Familia"
2. **Tarjeta del usuario activo** — gradient `#FBEFDC → #FCE7EE`, avatar grande del usuario, nombre + badge "TÚ" verde
3. **Card "Cómo funciona la familia"** — 3 viñetas:
   - 👀 Todos ven todo
   - 🔒 Cada quien sólo mueve lo suyo
   - 🤝 Cuentas compartidas: ambos titulares pueden mover
4. **Miembros** — lista de los otros con avatar 42, rol, "Aportó este mes" + monto verde
5. **Tile "Invitar a la familia"** con código `RAMIREZ-2026`
6. **Card de gastos compartidos** ("Carla te debe $640...") + botones Saldar / Dividir
7. **Ajustes** — lista de 6 settings (Notificaciones, Presupuestos, Recurrentes, Exportar, Apariencia, Privacidad)

### 5. Cuentas (modal full-screen)
1. Hero oscuro con patrimonio total
2. Sección "Activos" — cards con saldo positivo
3. Sección "Pasivos" — cards de crédito con barra de uso (% del límite)
4. Botón dashed "+ Vincular nueva cuenta"

### 6. AddSheet (bottom sheet)
1. Drag handle
2. **Botón "Escanear ticket"** (sólo en modo Gasto) — bg negro con icon cámara
3. Kind selector (3 tabs): Gasto rojo / Ingreso verde / Ahorro azul
4. Monto input gigante con $ → enfoque automático
5. Grid 4 cols de categorías + tile "+ Nueva" dashed (abre CategoryCreator)
6. **"Registrado por"** (LOCKED al usuario activo) con avatar + 🔒
7. Input descripción
8. Botón Guardar (color del kind, deshabilitado si no hay monto o categoría)

### 7. ScanModal (full-screen camera)
- Fondo negro
- Marcadores de esquina blancos para encuadre
- Receipt mock blanco rotado en el centro
- Botón shutter 68×68 blanco redondo
- Al disparar: laser verde escanea de arriba a abajo + barra de progreso
- Al terminar: pantalla de resultado con merchant, fecha, items desglosados, total, categoría sugerida + botones Editar / Guardar

### 8. AssistantModal (chat IA)
- Avatar circular gradient violeta→azul con ✨
- "Tu asistente Penny"
- Mensajes burbuja: usuario negro derecha, asistente blanco izquierda con border
- 4 sugerencias clickeables al iniciar
- Input redondo + botón flecha
- **Llama a Claude/OpenAI con contexto: balance del mes, presupuestos, metas, próximos pagos, miembros**

### 9. RemindersModal
- Card "Canales" con switches (Push, Email, WhatsApp)
- Card "Avisarme con anticipación" — pills (Mismo día, 1d, 2d, 3d, 5d, 7d) — sólo una activa
- Lista de próximos recordatorios con badge "HOY" rojo si urgente

### 10. CategoryCreator / AccountCreator (bottom sheets)
- Vista previa en vivo del ícono+color+nombre
- Inputs (nombre, saldo, tipo, etc.)
- **Color picker**: 15 swatches en círculos con anillo blanco al seleccionar
- **Icon picker**: grid 10×N de emojis organizados por tema (dinero, casa, comida, transporte, salud, etc.)
- Botón Crear / Agregar

### 11. TabBar (bottom)
- 5 slots con backdrop blur sobre `rgba(250,247,242,0.92)`
- Slot 3 es el **botón + central elevado** (54px, fondo negro, sombra)
- Iconos line (stroke 1.8, 2.2 si activo): Inicio (casa), Movimientos (lines), Ahorros (cerdito), Familia (people)
- Label 10.5px abajo

---

## Interactions & Behavior

### Animaciones clave
- **Bottom sheets**: `slideUp 280ms cubic-bezier(.2,.7,.3,1)` + backdrop fadeIn 200ms
- **Toast**: aparece arriba `slideDownToast 280ms`, se va a los 2.4s
- **Progress bars**: width transition `600ms cubic-bezier(.2,.7,.3,1)`
- **Tab switch**: instantáneo, sin animación (los containers ya cambian de contenido)
- **Scan laser**: 90ms entre updates, top va de 15% a 70% según progreso

### Model: multi-usuario
- App tiene un estado `activeUser` (`'ulises'` por default)
- En el AddSheet, el campo `member` se **fija** a `activeUser.name` — no es un selector, es display
- En la lista de transacciones, fila propia muestra pill verde "TUYO"; fila ajena se atenúa a opacity 0.78 y agrega 🔒
- En Familia, la tarjeta superior siempre muestra al usuario activo
- En el prototipo, hay un Tweak "Iniciar como" para cambiar de usuario en demo. En producción real, esto vendría del login de Firebase Auth.

### Filtros
- Filter chips usan estado local. "Todo" desactiva filtro de tipo.
- Búsqueda y por-fecha aún no implementadas — agregar en Movimientos

### Persistencia (a implementar)
Hoy todo es in-memory. En real:
- Auth de Firebase → user.uid
- `families/{familyId}/members/{memberId}` → user info + role
- `families/{familyId}/transactions/{txId}` → toda transacción con `createdBy: memberId`
- **Security rules**: leer toda la familia, crear/editar sólo `where createdBy == request.auth.uid` (excepto admin que puede editar miembros y settings, no movimientos ajenos)

---

## State Management

```ts
type State = {
  activeUser: Member;                // del login
  members: Member[];                 // de la familia
  accounts: Account[];               // cuentas vinculadas
  transactions: Transaction[];       // movimientos
  categories: Record<string, Category>;     // default + custom
  incomeSources: Record<string, Source>;
  goals: Goal[];
  reminders: Reminder[];
  // modals
  addOpen, scanOpen, accountsOpen, remindersOpen, assistantOpen,
  catCreatorOpen, catCreatorKind, accCreatorOpen,
  // form prefills
  addPrefill: ScanResult | null,
  addKind: 'gasto' | 'ingreso' | 'ahorro',
}
```

Acciones que disparan reload:
- `createTransaction(tx)` → push a transactions + recalc month + toast
- `createGoalDeposit(goalId, amount)` → transaction tipo ahorro + update goal.saved
- `createCategory(c)` → push a categories
- `createAccount(a)` → push a accounts
- `scanReceipt()` → ScanModal → result → AddSheet con prefill

---

## Design Tokens

### Colors

```ts
const T = {
  bg:        '#FAF7F2',   // app background (warm off-white)
  card:      '#FFFFFF',
  ink:       '#1A1815',   // text primary
  ink2:      '#3F3A33',   // text secondary
  muted:     '#837E78',   // text muted / labels
  border:    'rgba(26,24,21,0.08)',
  soft:      '#F1ECE4',   // soft fill, chip bg

  // accents
  green:     '#2F9E44',   // ingresos / TUYO
  greenSoft: '#E6F4EA',
  red:       '#D6336C',   // gastos / urgente / over budget
  redSoft:   '#FCE7EE',
  blue:      '#3B5BDB',   // ahorros / información
  blueSoft:  '#E7ECFB',
  gold:      '#C97A2A',   // warnings
  goldSoft:  '#FBEFDC',
  purple:    '#7048E8',   // IA gradient start
};
```

### Member colors
- Ulises: `#3B5BDB` (azul)
- Carla: `#D6336C` (rosa)
- Diego: `#F08C00` (naranja)
- Lupita: `#0CA678` (verde)

### Typography
**Una sola familia**: `"Bricolage Grotesque"` (Google Fonts, variable opsz 12..96, wght 300..800).
Fallback: `-apple-system, system-ui, sans-serif`
`font-optical-sizing: auto`
`letter-spacing: -0.01em` global

Tamaños y pesos típicos:
- Hero numbers: 46–48px, weight 500, letter-spacing -1px, line-height 1
- Page title: 24px / 700 / -0.3 letter-spacing
- Card title: 16px / 700
- Body: 13.5–14.5px / 500–600
- Section title (uppercase): 13px / 700 / 0.4 letter-spacing
- Caption / muted: 11–12px / 500–600

### Spacing
- Card padding: 14, 16, 18, 20 (usar el más cercano)
- Card radius: 22 grande, 18 mediano, 14 chico, 12 muy chico, 999 pill
- Padding horizontal en pantallas: 18px
- Gap entre secciones: 18–22px
- Gap interno entre filas: 10–14px

### Shadows
- Card: `0 1px 0 rgba(26,24,21,0.04), 0 6px 16px rgba(26,24,21,0.04)`
- Hero/elevated: `0 18px 38px rgba(26,24,21,0.18), 0 2px 6px rgba(26,24,21,0.08)`
- Bottom sheet: `0 -20px 40px rgba(0,0,0,0.15)`
- Account card: `0 8px 20px {color}40` (40% alpha del color del banco)
- Floating + button: `0 10px 22px rgba(26,24,21,0.25), 0 2px 6px rgba(26,24,21,0.15)`

---

## Assets

- **Fuente**: Bricolage Grotesque vía Google Fonts (`https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&display=swap`)
- **Iconos**: emojis nativos del sistema (no requiere librería)
- **Logos de bancos**: letras planas en cuadrado de color (B para BBVA, N para Nu, etc.) — placeholder, sustituible por SVGs reales si se quiere

---

## Files en este bundle

### `source/` — código fuente del prototipo
- `index.html` — entry point con script tags
- `data.js` — datos mock (miembros, transacciones, cuentas, metas, presupuestos)
- `common.jsx` — primitivos (Card, Chip, Progress, Avatar, CatIcon, Donut, Section, TabBar, iconos line) + token `T`
- `screens.jsx` — Dashboard, Movimientos, Ahorros, Familia, AddSheet
- `extras.jsx` — Accounts (strip + modal), Scan, Reminders, Assistant
- `creators.jsx` — CategoryCreator, AccountCreator + IconPicker + ColorPicker
- `app.jsx` — root con estado, navegación, montaje en iOS frame
- `ios-frame.jsx` — frame de iPhone (status bar, dynamic island, home indicator)
- `tweaks-panel.jsx` — panel de tweaks (sólo para demo, NO incluir en producción)

### `bundled/`
- `gastos-familia.html` — versión empaquetada, single-file. Útil para ver el diseño funcionando offline. NO usar como base de código.

---

## Plan sugerido para Claude Code

1. **Setup**: `npm create vite@latest gastos-familia -- --template react-ts` en el repo
2. **Tokens**: crear `src/tokens.ts` con todos los colores/tipografía/spacing del bloque "Design Tokens"
3. **Firebase**: crear proyecto, habilitar Auth (Email + Google), Firestore. Definir reglas de seguridad multi-usuario
4. **Auth flow**: pantalla de login → crear familia o ingresar con código → dashboard
5. **Componentes base**: portar `common.jsx` (Card, Chip, Progress, etc.) a TSX tipado
6. **Screens**: portar cada pantalla, una por archivo en `src/screens/`
7. **Modals**: portar `extras.jsx` y `creators.jsx` a `src/modals/`
8. **State**: Zustand store en `src/store.ts` con las acciones listadas arriba
9. **Firebase wiring**: reemplazar `useState` por `useCollection` (react-firebase-hooks)
10. **PWA**: `vite-plugin-pwa` con manifest, instalable en iOS/Android
11. **IA**: Cloud Function que recibe `{ prompt, familyContext }` y llama a Claude API. Frontend lo invoca con `fetch('/api/assistant', ...)`
12. **OCR**: Mindee free tier para escaneo de tickets, fallback a entrada manual
13. **Push**: Firebase Cloud Messaging para recordatorios
14. **Deploy**: GitHub Action que builda y pushea a `gh-pages` branch, o conectar Vercel

### Quick win (sin backend)
Si quieren validar primero con la familia antes de invertir en Firebase, se puede:
1. Hacer todo con `localStorage` (cada usuario tiene su copia)
2. Sincronizar manualmente vía export/import JSON
3. Migrar a Firebase después

Pero recomiendo Firebase desde el día 1 — el free tier sobra para una familia.

---

## Notas finales

- El nombre del usuario por defecto en la app es **Ulises** (es el dueño del proyecto)
- La familia se llama **"Familia Ramírez"** en el prototipo — cambiar al apellido real
- Moneda: pesos mexicanos (MXN), formato `es-MX`
- Todos los textos están en **español**
- El asistente "Penny" usa un tono cálido pero directo — mantener esa personalidad si se conecta a un LLM real
