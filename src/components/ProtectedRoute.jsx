import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) return <p className="p-10 text-center text-ink/50">Cargando...</p>
  if (!session) return <Navigate to="/admin/login" replace />

  return children
}
