import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LOGIN_PATH } from '../lib/routes'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-wine-600" />
      </div>
    )
  }

  if (!session) return <Navigate to={LOGIN_PATH} replace />

  return children
}
