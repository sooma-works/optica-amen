import { motion } from 'framer-motion'
import { ExternalLink, Glasses, LayoutGrid, LogOut, MessageCircle, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ToastProvider } from '../../components/admin/Toast'
import Logo from '../../components/Logo'
import { useAuth } from '../../context/AuthContext'
import { contarConsultasSinResponder } from '../../lib/backend'
import { adminPath, LOGIN_PATH, PANEL_PATH, publicSiteUrl } from '../../lib/routes'

const tabs = [
  { to: PANEL_PATH, label: 'Productos', icon: Glasses, end: true },
  { to: adminPath('categorias'), label: 'Categorías', icon: LayoutGrid },
  { to: adminPath('promociones'), label: 'Promociones', icon: Tag },
  { to: adminPath('consultas'), label: 'Consultas', icon: MessageCircle, contador: true },
]

export default function AdminLayout() {
  const { logout, session } = useAuth()
  const navigate = useNavigate()
  const [sinResponder, setSinResponder] = useState(0)

  // El número de consultas sin responder se ve en la pestaña desde cualquier
  // sección del panel, y se actualiza cuando se responde una.
  useEffect(() => {
    const actualizar = () => contarConsultasSinResponder().then(setSinResponder)
    actualizar()
    window.addEventListener('oamen:consultas', actualizar)
    window.addEventListener('focus', actualizar)
    return () => {
      window.removeEventListener('oamen:consultas', actualizar)
      window.removeEventListener('focus', actualizar)
    }
  }, [])

  async function handleLogout() {
    await logout()
    navigate(LOGIN_PATH)
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Logo size={40} className="text-wine-600" />
            <div>
              <p className="font-display text-lg leading-tight text-ink">Panel interno</p>
              <p className="text-xs text-ink-soft">{session?.user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={publicSiteUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-sm font-medium text-ink-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-wine-300 hover:text-ink"
            >
              <ExternalLink size={14} /> Ver sitio
            </a>
            <button
              onClick={handleLogout}
              className="focus-ring flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-sm font-medium text-ink-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-wine-300 hover:bg-wine-50 hover:text-wine-700"
            >
              <LogOut size={14} /> Salir
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 pt-6 pb-28 text-left sm:py-8">
        <nav className="hidden gap-1.5 sm:flex">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `focus-ring relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-ink-soft hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="admin-tab"
                      className="absolute inset-0 rounded-full bg-wine-600 shadow-[var(--shadow-soft)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {t.label}
                    {t.contador && sinResponder > 0 && (
                      <span
                        className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                          isActive ? 'bg-white text-wine-700' : 'bg-amber-400 text-amber-950'
                        }`}
                      >
                        {sinResponder}
                      </span>
                    )}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sm:mt-6">
          <ToastProvider>
            <Outlet />
          </ToastProvider>
        </div>
      </div>

      {/* En el celular las secciones van en una barra fija abajo, como en
          cualquier app, al alcance del pulgar. */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl sm:hidden">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors ${
                isActive ? 'text-wine-700' : 'text-ink-soft/70'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`relative flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                    isActive ? 'bg-wine-100' : ''
                  }`}
                >
                  <t.icon size={19} />
                  {t.contador && sinResponder > 0 && (
                    <span className="absolute -top-1 right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-amber-950 ring-2 ring-white">
                      {sinResponder}
                    </span>
                  )}
                </span>
                {t.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
