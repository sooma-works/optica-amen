import { createContext, useContext, useEffect, useState } from 'react'
import { getSession, login as loginRequest, logout as logoutRequest } from '../lib/backend'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined) // undefined = cargando

  useEffect(() => {
    getSession().then(setSession)
  }, [])

  async function login(email, password) {
    const s = await loginRequest(email, password)
    setSession(s)
    return s
  }

  async function logout() {
    await logoutRequest()
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, loading: session === undefined, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
