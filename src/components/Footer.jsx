import { Clock, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { linkWhatsapp, NEGOCIO } from '../config'
import { InstagramIcon } from './icons'
import SoomaSignature from './SoomaSignature'
import Logo from './Logo'

const linkClass =
  'focus-ring flex items-start gap-2 rounded-lg text-wine-200/80 transition-colors hover:text-white'

export default function Footer() {
  return (
    <footer className="mt-8 bg-wine-900 text-wine-100">
      <div className="mx-auto max-w-6xl px-5 pt-8 pb-5">
        {/* Marca a la izquierda y los datos agrupados a la derecha, en vez de
            tres columnas repartidas a lo ancho con mucho aire entre medio. */}
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3.5">
            <Logo size={48} variant="outline" className="shrink-0 text-wine-300" />
            <div>
              <p className="font-display text-2xl leading-tight font-semibold text-white">
                Óptica A.M.E.N.
              </p>
              <p className="mt-0.5 text-sm text-wine-200/70">{NEGOCIO.lema}</p>
            </div>
          </div>

          {/* Dos columnas independientes (no una grilla): así la dirección,
              que ocupa dos líneas, no estira la fila del teléfono. */}
          <div className="flex flex-col gap-2.5 text-sm sm:flex-row sm:gap-12">
            <div className="flex flex-col gap-2.5">
              <a href={NEGOCIO.mapsLink} target="_blank" rel="noreferrer" className={linkClass}>
                <MapPin size={15} className="mt-0.5 shrink-0 text-wine-300" />
                <span>
                  {NEGOCIO.direccionCorta}
                  <span className="block text-wine-200/60">{NEGOCIO.ciudad}</span>
                </span>
              </a>
              <p className="flex items-start gap-2 text-wine-200/80">
                <Clock size={15} className="mt-0.5 shrink-0 text-wine-300" />
                {NEGOCIO.horarios}
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              <a
                href={linkWhatsapp('¡Hola! Quería hacerles una consulta.')}
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                <Phone size={15} className="mt-0.5 shrink-0 text-wine-300" />
                {NEGOCIO.whatsappVisible}
              </a>
              <a
                href={`https://instagram.com/${NEGOCIO.instagram}`}
                target="_blank"
                rel="noreferrer"
                className={linkClass}
              >
                <InstagramIcon size={15} className="mt-0.5 shrink-0 text-wine-300" />@
                {NEGOCIO.instagram}
              </a>
              <Link to="/contacto" className={`${linkClass} font-medium text-white`}>
                Escribinos por el formulario →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-4 text-xs text-wine-200/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {NEGOCIO.nombre} · Todos los derechos reservados.
          </p>
          <SoomaSignature />
        </div>
      </div>
    </footer>
  )
}
