import { motion } from 'framer-motion'
import { ExternalLink, LogOut } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'
import { useAuth } from '../../context/AuthContext'
import { adminPath, LOGIN_PATH, PANEL_PATH, publicSiteUrl } from '../../lib/routes'

const tabs = [
  { to: PANEL_PATH, label: 'Productos', end: true },
  { to: adminPath('categorias'), label: 'Categorías' },
  { to: adminPath('promociones'), label: 'Promociones' },
  { to: adminPath('consultas'), label: 'Consultas' },
]

export default function AdminLayout() {
  const { logout, session } = useAuth()
  const navigate = useNavigate()

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

      <div className="mx-auto max-w-6xl px-5 py-8 text-left">
        <nav className="flex gap-1.5">
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
                  <span className="relative">{t.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
