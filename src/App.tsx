import { useMemo, useState, type FormEvent } from 'react'
import './App.css'

type VenueStatus = 'Tengo lugar' | 'Necesito lugar'
type MatchGroup = 'Experiencias' | 'Artistas' | 'Lugares'
type AdminSection = 'Resumen' | 'Solicitudes' | 'Eventos' | 'Liquidaciones'

type EventDraft = {
  eventType: string
  venueStatus: VenueStatus
  zone: string
  guests: number
  budget: number
  date: string
  time: string
  interests: string[]
}

type Match = {
  id: string
  group: MatchGroup
  eyebrow: string
  title: string
  description: string
  zone: string
  capacity: string
  price: number
  icon: string
  theme: string
  highlight?: string
  whatsapp: string
}

const eventTypes = [
  { label: 'Cumpleaños', icon: '🎂', detail: 'Una noche para celebrar a lo grande.' },
  { label: 'Despedida', icon: '🥂', detail: 'Una salida distinta con tu gente.' },
  { label: 'After office', icon: '🍸', detail: 'Cortá la semana con algo memorable.' },
  { label: 'Otro evento', icon: '✨', detail: 'La excusa es tuya. La noche también.' },
]

const zones = ['Palermo', 'Belgrano', 'Villa Urquiza', 'Recoleta', 'San Isidro', 'Zona Norte']
const showOptions = ['Stand up', 'Música en vivo', 'Burlesque', 'Pole dance', 'DJ / fiesta']

const matches: Match[] = [
  {
    id: 'noche-risas',
    group: 'Experiencias',
    eyebrow: 'Lugar + show',
    title: 'Noche de risas en Palermo',
    description: 'Reserva para tu grupo, tragos de bienvenida y un show de stand up que rompe el hielo.',
    zone: 'Palermo',
    capacity: '20–60 personas',
    price: 420000,
    icon: '🎙️',
    theme: 'violet',
    highlight: 'El más elegido para cumpleaños',
    whatsapp: '5491100001001',
  },
  {
    id: 'ritmo-terraza',
    group: 'Experiencias',
    eyebrow: 'Lugar + show',
    title: 'Ritmo en terraza',
    description: 'Una terraza de Belgrano con set acústico en vivo y menú de tapeo para compartir.',
    zone: 'Belgrano',
    capacity: '15–45 personas',
    price: 365000,
    icon: '🎷',
    theme: 'orange',
    whatsapp: '5491100001002',
  },
  {
    id: 'sofi-standup',
    group: 'Artistas',
    eyebrow: 'Stand up · 45 min',
    title: 'Sofi Correa',
    description: 'Comedia ágil, improvisación y un bloque hecho a medida para el grupo.',
    zone: 'CABA + GBA Norte',
    capacity: 'Hasta 80 personas',
    price: 180000,
    icon: '😂',
    theme: 'pink',
    highlight: 'Responde en menos de 1 h',
    whatsapp: '5491100001003',
  },
  {
    id: 'milena-burlesque',
    group: 'Artistas',
    eyebrow: 'Burlesque · 30 min',
    title: 'Milena Rouge',
    description: 'Un show elegante, teatral y adaptado al tono que buscás para tu noche.',
    zone: 'CABA',
    capacity: 'Hasta 60 personas',
    price: 240000,
    icon: '💃',
    theme: 'red',
    whatsapp: '5491100001004',
  },
  {
    id: 'club-bambu',
    group: 'Lugares',
    eyebrow: 'Bar reservado',
    title: 'Club Bambú',
    description: 'Bar íntimo con escenario, sonido propio y opciones de menú por persona.',
    zone: 'Villa Urquiza',
    capacity: '25–70 personas',
    price: 250000,
    icon: '🍹',
    theme: 'teal',
    whatsapp: '5491100001005',
  },
]

const adminApplications = [
  { id: 'A-102', name: 'Sofi Correa', type: 'Artista', detail: 'Stand up · 45 min', zone: 'CABA + GBA Norte', status: 'Pendiente', emoji: '😂' },
  { id: 'L-208', name: 'Casa Sifón', type: 'Lugar', detail: 'Bar · Hasta 60 personas', zone: 'Palermo', status: 'Pendiente', emoji: '🍸' },
  { id: 'A-101', name: 'Milena Rouge', type: 'Artista', detail: 'Burlesque · 30 min', zone: 'CABA', status: 'Aprobado', emoji: '💃' },
]

const adminEvents = [
  { id: 'PE-2408', client: 'Martina S.', plan: 'Noche de risas en Palermo', date: 'Sáb 22 nov · 21:00', total: 420000, status: 'Por confirmar' },
  { id: 'PE-2407', client: 'Tomás G.', plan: 'Sofi Correa · Stand up', date: 'Vie 21 nov · 22:00', total: 180000, status: 'Seña abonada' },
  { id: 'PE-2406', client: 'Carla M.', plan: 'Ritmo en terraza', date: 'Sáb 29 nov · 20:00', total: 365000, status: 'Confirmado' },
]

const steps = ['Tu plan', 'La zona', 'Día y presupuesto', 'El clima']

const initialDraft: EventDraft = {
  eventType: 'Cumpleaños',
  venueStatus: 'Necesito lugar',
  zone: 'Palermo',
  guests: 40,
  budget: 500000,
  date: '',
  time: '21:00',
  interests: ['Stand up', 'Música en vivo'],
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(date: string) {
  if (!date) return 'fecha a definir'

  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${date}T12:00:00`))
}

function AdminDashboard({ onExit }: { onExit: () => void }) {
  const [section, setSection] = useState<AdminSection>('Resumen')
  const [applications, setApplications] = useState(adminApplications)
  const [notice, setNotice] = useState('')

  const pendingApplications = applications.filter((application) => application.status === 'Pendiente')
  const commissionTotal = adminEvents.reduce((total, event) => total + event.total * 0.3, 0)

  const approveApplication = (id: string) => {
    const selected = applications.find((application) => application.id === id)
    setApplications((current) => current.map((application) => (
      application.id === id ? { ...application, status: 'Aprobado' } : application
    )))
    if (selected) setNotice(`${selected.name} fue aprobado y ya puede aparecer en los matches.`)
  }

  const requestDetails = (name: string) => {
    setNotice(`Marcamos a ${name} para pedir información adicional.`)
  }

  const menu: AdminSection[] = ['Resumen', 'Solicitudes', 'Eventos', 'Liquidaciones']

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div>
          <button className="brand admin-brand" type="button" onClick={onExit}>
            <span className="brand-mark">pipi</span>
            <span>eventos</span>
          </button>
          <p className="admin-kicker">Panel de administración</p>
        </div>
        <nav className="admin-menu" aria-label="Secciones de administración">
          {menu.map((item) => (
            <button
              type="button"
              key={item}
              className={section === item ? 'is-active' : ''}
              onClick={() => { setSection(item); setNotice('') }}
            >
              <span>{item === 'Resumen' ? '◫' : item === 'Solicitudes' ? '◌' : item === 'Eventos' ? '◈' : '◒'}</span>
              {item}
              {item === 'Solicitudes' && pendingApplications.length > 0 && <b>{pendingApplications.length}</b>}
            </button>
          ))}
        </nav>
        <button className="admin-exit" type="button" onClick={onExit}>Ver versión pública</button>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="section-kicker">Administración</p>
            <h1>{section}</h1>
          </div>
          <div className="admin-profile"><span>JG</span><div><b>JuanMa</b><small>Administrador</small></div></div>
        </header>

        {notice && <div className="admin-notice"><span>✓</span>{notice}<button type="button" onClick={() => setNotice('')}>×</button></div>}

        {section === 'Resumen' && (
          <>
            <div className="admin-stat-grid">
              <article><span>Eventos activos</span><b>12</b><small>3 por confirmar</small></article>
              <article><span>Solicitudes nuevas</span><b>{pendingApplications.length}</b><small>Artistas y lugares</small></article>
              <article><span>Reservas del mes</span><b>{formatMoney(1285000)}</b><small>Facturación bruta</small></article>
              <article><span>Comisión proyectada</span><b>{formatMoney(commissionTotal)}</b><small>30% de shows confirmados</small></article>
            </div>
            <div className="admin-two-columns">
              <article className="admin-panel">
                <div className="panel-heading"><div><p>PARA REVISAR</p><h2>Solicitudes nuevas</h2></div><button type="button" onClick={() => setSection('Solicitudes')}>Ver todas</button></div>
                <div className="application-list">
                  {pendingApplications.length ? pendingApplications.map((application) => (
                    <div className="application-row" key={application.id}>
                      <span className="application-avatar">{application.emoji}</span>
                      <div><b>{application.name}</b><small>{application.detail} · {application.zone}</small></div>
                      <button type="button" onClick={() => approveApplication(application.id)}>Aprobar</button>
                    </div>
                  )) : <p className="empty-state">No hay solicitudes pendientes.</p>}
                </div>
              </article>
              <article className="admin-panel commission-panel">
                <div className="panel-heading"><div><p>NEGOCIO</p><h2>Liquidaciones</h2></div><button type="button" onClick={() => setSection('Liquidaciones')}>Ver detalle</button></div>
                <div className="commission-figure"><span>Comisión Pipi a liquidar</span><b>{formatMoney(156000)}</b><small>Próximo corte: 30 nov</small></div>
                <div className="commission-rule"><span>30%</span><p>La plataforma retiene la comisión sobre el valor acordado del show. El artista ve su neto antes de aceptar.</p></div>
              </article>
            </div>
            <article className="admin-panel events-preview">
              <div className="panel-heading"><div><p>OPERACIÓN</p><h2>Próximos eventos</h2></div><button type="button" onClick={() => setSection('Eventos')}>Abrir agenda</button></div>
              <EventTable events={adminEvents} compact />
            </article>
          </>
        )}

        {section === 'Solicitudes' && (
          <article className="admin-panel full-panel">
            <div className="panel-heading"><div><p>ALTAS DE PROVEEDORES</p><h2>Artistas y lugares</h2></div><span className="demo-badge">Modo demo</span></div>
            <div className="application-table">
              {applications.map((application) => (
                <div className="application-table-row" key={application.id}>
                  <div className="provider-name"><span className="application-avatar">{application.emoji}</span><div><b>{application.name}</b><small>{application.id} · {application.type}</small></div></div>
                  <span>{application.detail}</span><span>{application.zone}</span><span className={`status-pill ${application.status === 'Aprobado' ? 'approved' : 'pending'}`}>{application.status}</span>
                  <div className="row-actions">
                    {application.status === 'Pendiente' ? <><button type="button" className="secondary-action" onClick={() => requestDetails(application.name)}>Pedir datos</button><button type="button" className="primary-action" onClick={() => approveApplication(application.id)}>Aprobar</button></> : <button type="button" className="secondary-action" onClick={() => setNotice(`Abrimos el perfil de ${application.name}.`)}>Ver perfil</button>}
                  </div>
                </div>
              ))}
            </div>
          </article>
        )}

        {section === 'Eventos' && (
          <article className="admin-panel full-panel">
            <div className="panel-heading"><div><p>AGENDA Y RESERVAS</p><h2>Eventos en curso</h2></div><button type="button" className="primary-action" onClick={() => setNotice('Nuevo evento: esta acción se conectará a la base de datos.')}>Crear evento</button></div>
            <EventTable events={adminEvents} />
          </article>
        )}

        {section === 'Liquidaciones' && (
          <div className="settlement-layout">
            <article className="admin-panel settlement-summary"><p>COMISIÓN PROYECTADA</p><b>{formatMoney(commissionTotal)}</b><span>Shows confirmados en el período actual.</span><div><small>Valor de show</small><small>Comisión Pipi</small><small>Neto artista</small></div></article>
            <article className="admin-panel full-panel"><div className="panel-heading"><div><p>CORTE NOVIEMBRE</p><h2>Liquidaciones pendientes</h2></div><span className="demo-badge">30% automático</span></div><div className="settlement-list">{adminEvents.map((event) => <div key={event.id}><span><b>{event.plan}</b><small>{event.id} · {event.client}</small></span><span><small>Show / reserva</small><b>{formatMoney(event.total)}</b></span><span><small>Comisión Pipi</small><b>{formatMoney(event.total * 0.3)}</b></span><span><small>Neto proveedor</small><b>{formatMoney(event.total * 0.7)}</b></span></div>)}</div></article>
          </div>
        )}
      </section>
    </div>
  )
}

function EventTable({ events, compact = false }: { events: typeof adminEvents; compact?: boolean }) {
  return (
    <div className="event-table">
      {!compact && <div className="event-table-head"><span>Evento</span><span>Fecha</span><span>Total</span><span>Estado</span></div>}
      {events.map((event) => (
        <div className="event-table-row" key={event.id}>
          <div><b>{event.plan}</b><small>{event.id} · {event.client}</small></div>
          <span>{event.date}</span>
          <b>{formatMoney(event.total)}</b>
          <span className={`status-pill ${event.status === 'Confirmado' ? 'approved' : event.status === 'Seña abonada' ? 'deposit' : 'pending'}`}>{event.status}</span>
        </div>
      ))}
    </div>
  )
}

function App() {
  const [view, setView] = useState<'public' | 'admin'>('public')
  const [draft, setDraft] = useState<EventDraft>(initialDraft)
  const [step, setStep] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [resultFilter, setResultFilter] = useState<'Todo' | MatchGroup>('Todo')
  const [providerType, setProviderType] = useState<'artist' | 'venue' | null>(null)
  const [providerSent, setProviderSent] = useState(false)

  const suggestedMatches = useMemo(() => {
    const byVenue =
      draft.venueStatus === 'Tengo lugar'
        ? matches.filter((match) => match.group === 'Artistas')
        : matches

    if (resultFilter === 'Todo') return byVenue
    return byVenue.filter((match) => match.group === resultFilter)
  }, [draft.venueStatus, resultFilter])

  const nextStep = () => {
    if (step === steps.length - 1) {
      setShowResults(true)
      return
    }
    setStep((current) => current + 1)
  }

  const toggleInterest = (interest: string) => {
    setDraft((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }))
  }

  const openProviderForm = (type: 'artist' | 'venue') => {
    setProviderSent(false)
    setProviderType(type)
  }

  const requestMatch = (match: Match) => {
    const interests = draft.interests.length ? draft.interests.join(', ') : 'show a definir'
    const message = `Hola, encontré ${match.title} en Pipi Eventos. Estoy organizando un ${draft.eventType.toLowerCase()} para ${draft.guests} personas, el ${formatDate(draft.date)} a las ${draft.time}, por ${draft.zone}. Busco ${interests}. ¿Me cuentan disponibilidad y opciones?`
    const url = `https://wa.me/${match.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const submitProvider = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setProviderSent(true)
  }

  const scrollToPlanner = () => {
    setShowResults(false)
    setStep(0)
    window.setTimeout(() => {
      document.getElementById('armar-evento')?.scrollIntoView({ behavior: 'smooth' })
    }, 0)
  }

  if (view === 'admin') {
    return <AdminDashboard onExit={() => setView('public')} />
  }

  return (
    <main>
      <nav className="nav-shell" aria-label="Navegación principal">
        <button className="brand" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="brand-mark">pipi</span>
          <span>eventos</span>
        </button>
        <div className="nav-links">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#sumate">Para artistas y lugares</a>
        </div>
        <div className="nav-actions">
          <button className="admin-entry" type="button" onClick={() => setView('admin')}>Admin</button>
          <button className="outline-button nav-cta" type="button" onClick={() => openProviderForm('artist')}>
            Publicá tu show
          </button>
        </div>
      </nav>

      {!showResults ? (
        <>
          <section className="hero-section" id="como-funciona">
            <div className="hero-copy">
              <p className="eyebrow"><span className="spark">✦</span> Tu evento, sin vueltas</p>
              <h1>La noche que imaginás empieza con un buen <em>match.</em></h1>
              <p className="hero-description">
                Elegí la zona, la fecha, tu presupuesto y la energía que buscás. Pipi encuentra el lugar y los artistas que hacen que pase algo.
              </p>
              <div className="hero-proof">
                <div className="avatar-stack" aria-hidden="true">
                  <span>🎙️</span><span>🎷</span><span>💃</span>
                </div>
                <p><strong>Shows, bares y lugares</strong><br />para armar un plan que se recuerde.</p>
              </div>
            </div>
            <div className="hero-orbit" aria-hidden="true">
              <div className="orbit-card card-one"><span>🎂</span><b>Cumple</b></div>
              <div className="orbit-card card-two"><span>🎤</span><b>Show en vivo</b></div>
              <div className="hero-orbit-center"><span>✦</span></div>
              <div className="orbit-ring ring-one" />
              <div className="orbit-ring ring-two" />
            </div>
          </section>

          <section className="planner-section" id="armar-evento">
            <div className="planner-heading">
              <p className="section-kicker">Armá tu evento</p>
              <h2>Contanos tu idea. Nosotros encontramos la combinación.</h2>
              <p>En menos de un minuto te mostramos opciones que encajan con tu plan.</p>
            </div>

            <div className="planner-card">
              <div className="stepper" aria-label={`Paso ${step + 1} de ${steps.length}`}>
                {steps.map((label, index) => (
                  <div className={`step-item ${index <= step ? 'is-active' : ''}`} key={label}>
                    <span>{index + 1}</span>
                    <small>{label}</small>
                  </div>
                ))}
              </div>

              <div className="planner-content">
                {step === 0 && (
                  <div className="step-panel">
                    <div>
                      <p className="step-label">01 · Tu plan</p>
                      <h3>¿Qué vamos a celebrar?</h3>
                      <p className="step-helper">Elegí la excusa. Después definimos la experiencia.</p>
                    </div>
                    <div className="occasion-grid">
                      {eventTypes.map((eventType) => (
                        <button
                          className={`occasion-card ${draft.eventType === eventType.label ? 'is-selected' : ''}`}
                          type="button"
                          key={eventType.label}
                          onClick={() => setDraft((current) => ({ ...current, eventType: eventType.label }))}
                        >
                          <span className="occasion-icon">{eventType.icon}</span>
                          <span><b>{eventType.label}</b><small>{eventType.detail}</small></span>
                        </button>
                      ))}
                    </div>
                    <div className="question-row">
                      <div>
                        <b>¿Ya tenés lugar?</b>
                        <p>Así sabemos si buscamos un espacio también.</p>
                      </div>
                      <div className="segmented-control">
                        {(['Tengo lugar', 'Necesito lugar'] as VenueStatus[]).map((option) => (
                          <button
                            type="button"
                            key={option}
                            className={draft.venueStatus === option ? 'is-selected' : ''}
                            onClick={() => setDraft((current) => ({ ...current, venueStatus: option }))}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="step-panel">
                    <div>
                      <p className="step-label">02 · La zona</p>
                      <h3>¿Dónde querés que suceda?</h3>
                      <p className="step-helper">Podemos buscar cerca tuyo o descubrirte un lugar nuevo.</p>
                    </div>
                    <div className="zone-grid">
                      {zones.map((zone) => (
                        <button
                          type="button"
                          key={zone}
                          className={`zone-chip ${draft.zone === zone ? 'is-selected' : ''}`}
                          onClick={() => setDraft((current) => ({ ...current, zone }))}
                        >
                          <span>⌖</span>{zone}
                        </button>
                      ))}
                    </div>
                    <div className="range-block">
                      <div className="range-head">
                        <div><b>¿Cuántas personas?</b><p>Podés ajustar después.</p></div>
                        <output>{draft.guests} invitados</output>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="150"
                        step="5"
                        value={draft.guests}
                        onChange={(event) => setDraft((current) => ({ ...current, guests: Number(event.target.value) }))}
                        aria-label="Cantidad de invitados"
                      />
                      <div className="range-scale"><span>10</span><span>150+</span></div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="step-panel">
                    <div>
                      <p className="step-label">03 · Día y presupuesto</p>
                      <h3>Ahora pongámosle fecha y forma.</h3>
                      <p className="step-helper">Usamos tu presupuesto para mostrarte opciones realistas.</p>
                    </div>
                    <div className="date-fields">
                      <label>
                        <span>¿Qué día?</span>
                        <input
                          type="date"
                          value={draft.date}
                          onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))}
                        />
                      </label>
                      <label>
                        <span>¿A qué hora?</span>
                        <select value={draft.time} onChange={(event) => setDraft((current) => ({ ...current, time: event.target.value }))}>
                          <option>19:00</option><option>20:00</option><option>21:00</option><option>22:00</option><option>23:00</option>
                        </select>
                      </label>
                    </div>
                    <div className="budget-block">
                      <div className="range-head">
                        <div><b>Presupuesto total estimado</b><p>{draft.venueStatus === 'Necesito lugar' ? 'Incluye lugar, show y gestión.' : 'Incluye show y gestión.'}</p></div>
                        <output>{formatMoney(draft.budget)}</output>
                      </div>
                      <input
                        type="range"
                        min="120000"
                        max="1200000"
                        step="20000"
                        value={draft.budget}
                        onChange={(event) => setDraft((current) => ({ ...current, budget: Number(event.target.value) }))}
                        aria-label="Presupuesto total estimado"
                      />
                      <div className="range-scale"><span>$120 mil</span><span>$1,2 M+</span></div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="step-panel">
                    <div>
                      <p className="step-label">04 · El clima</p>
                      <h3>¿Qué querés que pase esa noche?</h3>
                      <p className="step-helper">Elegí una o varias opciones. No hace falta decidir todo ahora.</p>
                    </div>
                    <div className="show-grid">
                      {showOptions.map((option, index) => (
                        <button
                          type="button"
                          key={option}
                          className={`show-option ${draft.interests.includes(option) ? 'is-selected' : ''}`}
                          onClick={() => toggleInterest(option)}
                        >
                          <span className="show-number">0{index + 1}</span>
                          <b>{option}</b>
                          <span className="check-mark">{draft.interests.includes(option) ? '✓' : '+'}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="planner-actions">
                <button className="text-button" type="button" onClick={() => setStep((current) => Math.max(current - 1, 0))} disabled={step === 0}>
                  ← Volver
                </button>
                <button className="primary-button" type="button" onClick={nextStep}>
                  {step === steps.length - 1 ? 'Ver mis matches ✦' : 'Continuar →'}
                </button>
              </div>
            </div>
          </section>

          <section className="provider-section" id="sumate">
            <div>
              <p className="section-kicker">También es tu escenario</p>
              <h2>¿Tenés un show o un lugar que merece ser parte?</h2>
              <p>Sumate a Pipi y recibí consultas de personas que ya están listas para organizar su evento.</p>
            </div>
            <div className="provider-actions">
              <button className="provider-choice" type="button" onClick={() => openProviderForm('artist')}><span>🎤</span><b>Soy artista</b><small>Publicá tu show</small></button>
              <button className="provider-choice" type="button" onClick={() => openProviderForm('venue')}><span>🍸</span><b>Tengo un lugar</b><small>Mostrá tu espacio</small></button>
            </div>
          </section>
        </>
      ) : (
        <section className="results-page">
          <div className="results-topbar">
            <button className="brand" type="button" onClick={() => setShowResults(false)}><span className="brand-mark">pipi</span><span>eventos</span></button>
            <div className="result-top-actions"><button className="admin-entry" type="button" onClick={() => setView('admin')}>Admin</button><button className="text-button" type="button" onClick={scrollToPlanner}>← Editar mi plan</button></div>
          </div>
          <div className="results-hero">
            <div>
              <p className="section-kicker">Tu selección Pipi</p>
              <h1>{draft.venueStatus === 'Tengo lugar' ? 'Artistas que le van a dar vida a tu lugar.' : 'Combinaciones que encajan con tu noche.'}</h1>
              <p>Para tu {draft.eventType.toLowerCase()} en {draft.zone} · {draft.guests} personas · {formatDate(draft.date)}.</p>
            </div>
            <aside className="event-recap">
              <span>Tu presupuesto</span><b>{formatMoney(draft.budget)}</b><small>Gestión Pipi incluida</small>
            </aside>
          </div>
          <div className="result-filter-row">
            {(['Todo', 'Experiencias', 'Artistas', 'Lugares'] as const).map((filter) => (
              <button
                type="button"
                key={filter}
                className={resultFilter === filter ? 'is-selected' : ''}
                onClick={() => setResultFilter(filter)}
                disabled={draft.venueStatus === 'Tengo lugar' && (filter === 'Experiencias' || filter === 'Lugares')}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="match-grid">
            {suggestedMatches.map((match) => (
              <article className="match-card" key={match.id}>
                <div className={`match-art ${match.theme}`}><span>{match.icon}</span>{match.highlight && <small>{match.highlight}</small>}</div>
                <div className="match-body">
                  <p className="match-eyebrow">{match.eyebrow}</p>
                  <h2>{match.title}</h2>
                  <p>{match.description}</p>
                  <div className="match-details"><span>⌖ {match.zone}</span><span>♧ {match.capacity}</span></div>
                  <div className="match-footer">
                    <div><small>Desde</small><b>{formatMoney(match.price)}</b></div>
                    <button className="whatsapp-button" type="button" onClick={() => requestMatch(match)}>Consultar por WhatsApp ↗</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="results-help"><span>✦</span><p>¿Querés algo distinto? <button type="button" onClick={scrollToPlanner}>Cambiá tus preferencias</button> y te mostramos nuevas opciones.</p></div>
        </section>
      )}

      {providerType && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setProviderType(null) }}>
          <section className="provider-modal" role="dialog" aria-modal="true" aria-labelledby="provider-title">
            <button className="close-button" type="button" aria-label="Cerrar" onClick={() => setProviderType(null)}>×</button>
            {providerSent ? (
              <div className="success-state"><span>✦</span><h2>Recibimos tu propuesta.</h2><p>La revisamos y te contactamos para completar tu perfil en Pipi Eventos.</p><button className="primary-button" type="button" onClick={() => setProviderType(null)}>Listo</button></div>
            ) : (
              <>
                <p className="section-kicker">Sumate a Pipi</p>
                <h2 id="provider-title">{providerType === 'artist' ? 'Mostrá tu show a la gente indicada.' : 'Abrí las puertas de tu espacio.'}</h2>
                <div className="provider-tabs">
                  <button type="button" className={providerType === 'artist' ? 'is-selected' : ''} onClick={() => setProviderType('artist')}>Soy artista</button>
                  <button type="button" className={providerType === 'venue' ? 'is-selected' : ''} onClick={() => setProviderType('venue')}>Tengo un lugar</button>
                </div>
                <form onSubmit={submitProvider}>
                  <div className="form-grid">
                    <label><span>{providerType === 'artist' ? 'Nombre artístico' : 'Nombre del lugar'}</span><input required placeholder={providerType === 'artist' ? 'Ej. Sofi Correa' : 'Ej. Club Bambú'} /></label>
                    <label><span>WhatsApp</span><input required type="tel" placeholder="11 0000 0000" /></label>
                    <label><span>{providerType === 'artist' ? 'Tipo de show' : 'Zona'}</span><input required placeholder={providerType === 'artist' ? 'Ej. Stand up, música…' : 'Ej. Palermo'} /></label>
                    <label><span>{providerType === 'artist' ? 'Duración del show' : 'Capacidad'}</span><input required placeholder={providerType === 'artist' ? 'Ej. 45 minutos' : 'Ej. Hasta 80 personas'} /></label>
                    <label className="form-full"><span>{providerType === 'artist' ? 'Contanos qué hacés y qué necesitás para el show' : 'Contanos sobre el espacio, servicios y horarios'}</span><textarea required rows={4} placeholder="Lo que quieras que sepan antes de contactarte." /></label>
                  </div>
                  <p className="commission-note">{providerType === 'artist' ? 'Pipi retiene una comisión del 30% sobre el valor acordado del show.' : 'Te contactamos para definir el modelo de trabajo del lugar.'}</p>
                  <button className="primary-button form-submit" type="submit">Enviar mi propuesta →</button>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  )
}

export default App
