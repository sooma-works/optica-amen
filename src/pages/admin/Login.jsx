import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { demoCredentialsHint } from '../../lib/backend'

export default function Login() {
  const { session, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(demoCredentialsHint?.email || '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (session) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col px-5 py-20 text-left">
      <h1 className="font-display text-2xl text-ink">Acceso interno</h1>
      <p className="mt-2 text-sm text-ink/60">
        Panel de administración de Óptica A.M.E.N. — cargá productos, precios y promociones.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-line px-3 py-2 outline-none focus:border-ink"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Contraseña
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-line px-3 py-2 outline-none focus:border-ink"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink-2 disabled:opacity-60"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      {demoCredentialsHint && (
        <p className="mt-6 rounded-md bg-gold/10 p-3 text-xs text-ink/70">
          Modo demo — usá <strong>{demoCredentialsHint.email}</strong> /{' '}
          <strong>{demoCredentialsHint.password}</strong> para entrar.
        </p>
      )}
    </section>
  )
}
