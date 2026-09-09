import { Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { linkWhatsapp, NEGOCIO } from '../config'
import { InstagramIcon, WhatsappIcon } from './icons'
import SoomaSignature from './SoomaSignature'
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

            <div className="mt-5 flex gap-2.5">
              <SocialButton
                href={linkWhatsapp('¡Hola! Quería hacerles una consulta.')}
                label="Escribinos por WhatsApp"
              >
                <WhatsappIcon size={19} />
              </SocialButton>
              <SocialButton
                href={`https://instagram.com/${NEGOCIO.instagram}`}
                label={`Seguinos en Instagram @${NEGOCIO.instagram}`}
              >
                <InstagramIcon size={19} />
              </SocialButton>
              <SocialButton href={NEGOCIO.mapsLink} label="Ver ubicación en Google Maps">
                <Navigation size={18} />
              </SocialButton>
            </div>
          </div>

          <div className="text-sm">
            <p className="font-semibold text-white">Visitanos</p>
            <div className="mt-3 flex flex-col gap-2.5">
              <a
                href={NEGOCIO.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="focus-ring flex items-start gap-2 rounded-lg text-wine-200/80 transition-colors hover:text-white"
              >
                <MapPin size={15} className="mt-0.5 shrink-0 text-wine-300" />
                <span>
                  {NEGOCIO.direccionCorta}
                  <br />
                  <span className="text-wine-200/60">{NEGOCIO.ciudad}</span>
                </span>
              </a>
              <p className="flex items-start gap-2 text-wine-200/80">
                <Clock size={15} className="mt-0.5 shrink-0 text-wine-300" />
                {NEGOCIO.horarios}
              </p>
            </div>
          </div>

          <div className="text-sm">
            <p className="font-semibold text-white">Contacto</p>
            <div className="mt-3 flex flex-col items-start gap-2.5">
              <a
                href={linkWhatsapp('¡Hola! Quería hacerles una consulta.')}
                target="_blank"
                rel="noreferrer"
                className="focus-ring flex items-center gap-2 rounded-lg text-wine-200/80 transition-colors hover:text-white"
              >
                <Phone size={15} className="shrink-0 text-wine-300" />
                {NEGOCIO.whatsappVisible}
              </a>
              <a
                href={`https://instagram.com/${NEGOCIO.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="focus-ring flex items-center gap-2 rounded-lg text-wine-200/80 transition-colors hover:text-white"
              >
                <InstagramIcon size={15} className="shrink-0 text-wine-300" />
                @{NEGOCIO.instagram}
              </a>
              <Link
                to="/contacto"
                className="focus-ring mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 font-medium text-white transition-colors hover:bg-white/20"
              >
                Formulario de contacto
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-wine-200/50 sm:flex-row sm:items-center sm:justify-between">
          <SoomaSignature />
          <div className="flex flex-wrap gap-5">
            <Link to="/catalogo" className="transition-colors hover:text-white">
              Catálogo
            </Link>
            <Link to="/promociones" className="transition-colors hover:text-white">
              Promociones
            </Link>
            <Link to="/contacto" className="transition-colors hover:text-white">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialButton({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="focus-ring flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-wine-100 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-wine-800"
    >
      {children}
    </a>
  )
}
