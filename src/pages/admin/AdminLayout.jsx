import { LogOut } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const tabs = [
  { to: '/admin', label: 'Productos', end: true },
  { to: '/admin/categorias', label: 'Categorías' },
  { to: '/admin/promociones', label: 'Promociones' },
]

export default function AdminLayout() {
  const { logout, session } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 text-left">
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl text-ink">Panel de administración</h1>
          <p className="text-sm text-ink/50">Sesión: {session?.user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 self-start rounded-md border border-line px-3 py-2 text-sm font-medium text-ink/70 hover:border-ink hover:text-ink"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>

      <nav className="mt-6 flex gap-2">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `rounded-md px-4 py-2 text-sm font-medium ${
                isActive ? 'bg-ink text-white' : 'bg-white text-ink/70 hover:text-ink'
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6">
        <Outlet />
      </div>
    </section>
  )
}
