import { motion } from 'framer-motion'
import { ArrowLeft, Lock } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'
import { useAuth } from '../../context/AuthContext'
import { demoCredentialsHint } from '../../lib/backend'
import { isAdminHost, PANEL_PATH, publicSiteUrl } from '../../lib/routes'

export default function Login() {
  const { session, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(demoCredentialsHint?.email || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (session) return <Navigate to={PANEL_PATH} replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(PANEL_PATH)
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-wine-900 px-5 py-12">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-wine-600/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-wine-500/25 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-[1.75rem] bg-white p-8 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] sm:p-10"
      >
        <div className="flex flex-col items-center text-center">
          <Logo size={54} className="text-wine-600" />
          <h1 className="font-display mt-4 text-2xl text-ink">Acceso interno</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            Panel de Óptica A.M.E.N. — cargá productos, precios y promociones.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-ring rounded-xl border border-line bg-cream/60 px-4 py-2.5 font-normal transition-colors focus:border-wine-400 focus:bg-white"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            Contraseña
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus-ring rounded-xl border border-line bg-cream/60 px-4 py-2.5 font-normal transition-colors focus:border-wine-400 focus:bg-white"
            />
          </label>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="focus-ring mt-1 flex items-center justify-center gap-2 rounded-xl bg-wine-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-wine-700 hover:shadow-[var(--shadow-lift)] disabled:translate-y-0 disabled:opacity-60"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <Lock size={15} />
            )}
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {demoCredentialsHint && (
          <p className="mt-6 rounded-xl bg-wine-50 p-3.5 text-xs leading-relaxed text-ink-soft">
            <strong className="text-wine-700">Modo demo</strong> — ingresá con{' '}
            <strong className="text-ink">{demoCredentialsHint.email}</strong> /{' '}
            <strong className="text-ink">{demoCredentialsHint.password}</strong>
          </p>
        )}

        <a
          href={isAdminHost ? publicSiteUrl : '/'}
          className="mt-6 flex items-center justify-center gap-1.5 text-xs font-medium text-ink-soft transition-colors hover:text-wine-600"
        >
          <ArrowLeft size={13} />
          Volver al sitio público
        </a>
      </motion.div>
    </div>
  )
}
