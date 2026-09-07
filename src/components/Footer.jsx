import { AtSign, Clock, MapPin, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { linkWhatsapp, NEGOCIO } from '../config'
import { LOGIN_PATH } from '../lib/routes'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="mt-8 bg-wine-900 text-wine-100">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo size={38} variant="outline" className="text-wine-300" />
              <span className="font-display text-xl font-semibold text-white">
                Óptica A.M.E.N.
              </span>
            </div>
            <p className="mt-3 text-sm text-wine-200/70">{NEGOCIO.lema}</p>
          </div>

          <div className="text-sm">
            <p className="font-semibold text-white">Visitanos</p>
            <p className="mt-3 flex items-start gap-2 text-wine-200/80">
              <MapPin size={15} className="mt-0.5 shrink-0 text-wine-300" />
              {NEGOCIO.direccion}
            </p>
            <p className="mt-2 flex items-start gap-2 text-wine-200/80">
              <Clock size={15} className="mt-0.5 shrink-0 text-wine-300" />
              {NEGOCIO.horarios}
            </p>
          </div>

          <div className="text-sm">
            <p className="font-semibold text-white">Contacto</p>
            <div className="mt-3 flex flex-col items-start gap-2">
              <a
                href={linkWhatsapp('¡Hola! Quería hacerles una consulta.')}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-wine-200/80 transition-colors hover:text-white"
              >
                <MessageCircle size={15} className="text-wine-300" />
                WhatsApp
              </a>
              <a
                href={`https://instagram.com/${NEGOCIO.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-wine-200/80 transition-colors hover:text-white"
              >
                <AtSign size={15} className="text-wine-300" />
                @{NEGOCIO.instagram}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-wine-200/50 sm:flex-row sm:items-center sm:justify-between">
          <p>Sitio de demostración — precios y promociones a modo ilustrativo.</p>
          <div className="flex gap-5">
            <Link to="/catalogo" className="transition-colors hover:text-white">
              Catálogo
            </Link>
            <Link to="/promociones" className="transition-colors hover:text-white">
              Promociones
            </Link>
            <Link to={LOGIN_PATH} className="transition-colors hover:text-white">
              Acceso interno
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
