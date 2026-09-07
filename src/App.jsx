import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { isAdminHost, LOGIN_PATH, PANEL_PATH } from './lib/routes'
import AdminLayout from './pages/admin/AdminLayout'
import CategoriasAdmin from './pages/admin/CategoriasAdmin'
import Login from './pages/admin/Login'
import ProductosAdmin from './pages/admin/ProductosAdmin'
import PromocionesAdmin from './pages/admin/PromocionesAdmin'
import Catalogo from './pages/Catalogo'
import Home from './pages/Home'
import Promociones from './pages/Promociones'

function SitioPublico() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/promociones" element={<Promociones />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path={LOGIN_PATH} element={<Login />} />
          <Route
            path={PANEL_PATH}
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProductosAdmin />} />
            <Route path="categorias" element={<CategoriasAdmin />} />
            <Route path="promociones" element={<PromocionesAdmin />} />
          </Route>

          {isAdminHost ? (
            <Route path="*" element={<Navigate to={PANEL_PATH} replace />} />
          ) : (
            <Route path="/*" element={<SitioPublico />} />
          )}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
