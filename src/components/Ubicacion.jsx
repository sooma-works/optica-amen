import { motion } from 'framer-motion'
import { Clock, ExternalLink, Mail, MapPin, Navigation } from 'lucide-react'
import { Link } from 'react-router-dom'
import { linkWhatsapp, NEGOCIO } from '../config'
import { WhatsappIcon } from './icons'

export default function Ubicacion() {
  return (
    <section id="ubicacion" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14 text-left">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wine-500">
          Dónde estamos
        </p>
        <h2 className="font-display mt-1 text-3xl text-ink">Pasá por el local</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
          Estamos en pleno centro de Rosario. Probate los modelos, consultá por tu receta
          y llevate los lentes armados en el día.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="surface relative overflow-hidden p-0"
        >
          <iframe
            title={`Ubicación de ${NEGOCIO.nombre}`}
            src={NEGOCIO.mapsEmbed}
            className="h-72 w-full border-0 sm:h-[26rem]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <a
            href={NEGOCIO.mapsLink}
            target="_blank"
            rel="noreferrer"
            className="focus-ring absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2.5 text-sm font-semibold text-wine-700 shadow-[var(--shadow-lift)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
          >
            <Navigation size={15} />
            Cómo llegar
            <ExternalLink size={13} className="opacity-60" />
          </a>
        </motion.div>

        <div className="flex flex-col gap-3">
          <InfoCard icon={MapPin} titulo="Dirección">
            <p className="font-medium text-ink">{NEGOCIO.direccionCorta}</p>
            <p className="text-ink-soft">{NEGOCIO.ciudad}</p>
          </InfoCard>

          <InfoCard icon={Clock} titulo="Horarios">
            <p className="text-ink-soft">{NEGOCIO.horarios}</p>
          </InfoCard>

          <InfoCard icon={WhatsappIcon} titulo="WhatsApp">
            <a
              href={linkWhatsapp('¡Hola! Quería hacerles una consulta.')}
              target="_blank"
              rel="noreferrer"
              className="focus-ring rounded text-wine-600 transition-colors hover:text-wine-700"
            >
              {NEGOCIO.whatsappVisible}
            </a>
          </InfoCard>

          <InfoCard icon={Mail} titulo="¿Preferís escribirnos?">
            <Link
              to="/contacto"
              className="focus-ring rounded text-wine-600 transition-colors hover:text-wine-700"
            >
              Dejanos tu consulta por formulario →
            </Link>
          </InfoCard>
        </div>
      </div>
    </section>
  )
}

function InfoCard({ icon: Icon, titulo, children }) {
  return (
    <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-wine-200 hover:shadow-[var(--shadow-soft)]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wine-50 text-wine-600">
        <Icon size={20} />
      </span>
      <div className="text-sm leading-relaxed">
        <p className="font-semibold text-ink">{titulo}</p>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  )
}
