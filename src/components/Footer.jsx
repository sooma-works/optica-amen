import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-ink/60">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="font-display text-lg text-ink">Óptica A.M.E.N.</p>
            <p>Tu visión, nuestra prioridad.</p>
          </div>
          <div className="flex gap-6">
            <Link to="/catalogo" className="hover:text-ink">Catálogo</Link>
            <Link to="/promociones" className="hover:text-ink">Promociones</Link>
            <Link to="/admin/login" className="hover:text-ink">Acceso interno</Link>
          </div>
        </div>
        <p className="mt-6 text-xs text-ink/40">
          Sitio de demostración — los precios y promociones son a modo ilustrativo.
        </p>
      </div>
    </footer>
  )
}
