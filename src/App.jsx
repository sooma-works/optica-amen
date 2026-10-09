import { MotionConfig } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import WhatsappFab from './components/WhatsappFab'
import { AuthProvider } from './context/AuthContext'
import { isAdminHost, LOGIN_PATH, PANEL_PATH } from './lib/routes'
import Catalogo from './pages/Catalogo'
import Contacto from './pages/Contacto'
import Home from './pages/Home'
import Producto from './pages/Producto'
import Promociones from './pages/Promociones'

// El panel se descarga aparte: quien entra al catálogo no baja su código.
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const CategoriasAdmin = lazy(() => import('./pages/admin/CategoriasAdmin'))
const ConsultasAdmin = lazy(() => import('./pages/admin/ConsultasAdmin'))
const Login = lazy(() => import('./pages/admin/Login'))
const ProductosAdmin = lazy(() => import('./pages/admin/ProductosAdmin'))
const PromocionesAdmin = lazy(() => import('./pages/admin/PromocionesAdmin'))

// Recibe `location` por prop en vez de leerla con useLocation(): al estar
// montado como element de una ruta comodín (`path="/*"`), este componente no
// se vuelve a renderizar cuando cambia la ruta dentro de ese comodín, y la
// transición se quedaba mostrando la página anterior.
function SitioPublico({ location }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* overflow-x-clip recorta el desplazamiento lateral de la transición sin
          crear un contenedor de scroll, que es lo que haría overflow-hidden. */}
      <main className="flex-1 overflow-x-clip">
        {/* La key hace que React remonte el bloque en cada cambio de ruta, y
            con eso la animación CSS de entrada vuelve a correr. */}
        <div key={location.pathname} className="pagina-entra">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/producto/:id" element={<Producto />} />
            <Route path="/promociones" element={<Promociones />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      <Footer />
      <WhatsappFab />
    </div>
  )
}

// Vive dentro del Router, así que sí se re-renderiza en cada cambio de ruta
// y puede repartir la location actualizada hacia abajo.
function Contenido() {
  const location = useLocation()

  return (
    <Suspense fallback={null}>
      <Routes location={location}>
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
          <Route path="consultas" element={<ConsultasAdmin />} />
        </Route>

        {isAdminHost ? (
          <Route path="*" element={<Navigate to={PANEL_PATH} replace />} />
        ) : (
          <Route path="/*" element={<SitioPublico location={location} />} />
        )}
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* reducedMotion="user" apaga los desplazamientos para quien pidió menos
          movimiento en el sistema. El CSS de index.css no alcanza: framer anima
          por JS con estilos inline. */}
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <Contenido />
        </AuthProvider>
      </MotionConfig>
    </BrowserRouter>
  )
}
