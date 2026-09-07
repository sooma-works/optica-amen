import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
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
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
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
          <Route path="/*" element={<SitioPublico />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
