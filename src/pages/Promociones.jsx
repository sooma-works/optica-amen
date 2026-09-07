import { motion } from 'framer-motion'
import { CreditCard, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { linkWhatsapp } from '../config'
import { listPromociones } from '../lib/backend'

const contenedor = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } }
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function Promociones() {
  const [promociones, setPromociones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listPromociones().then((data) => {
      setPromociones(data.filter((p) => p.activo).sort((a, b) => a.orden - b.orden))
      setLoading(false)
    })
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 text-left">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wine-500">
          Beneficios vigentes
        </p>
        <h1 className="font-display mt-1 text-4xl text-ink">Promociones</h1>
        <p className="mt-2 text-ink-soft">
          Financiación y descuentos disponibles en el local.
        </p>
      </motion.div>

      {loading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-3xl border border-line bg-white" />
          ))}
        </div>
      ) : promociones.length === 0 ? (
        <p className="mt-8 text-ink-soft">No hay promociones activas por el momento.</p>
      ) : (
        <motion.div
          variants={contenedor}
          initial="hidden"
          animate="show"
          className="mt-8 grid gap-5 sm:grid-cols-2"
        >
          {promociones.map((p) => (
            <motion.article
              key={p.id}
              variants={item}
              className="group relative overflow-hidden rounded-3xl border border-line bg-white p-7 transition-all duration-400 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:border-wine-200 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-wine-50 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-150" />

              <div className="relative">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine-600 text-white shadow-sm transition-transform duration-400 group-hover:scale-110 group-hover:-rotate-6">
                  {p.tarjeta ? <CreditCard size={22} /> : <Tag size={22} />}
                </span>

                <h2 className="font-display mt-4 text-2xl leading-snug text-ink">{p.titulo}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.descripcion}</p>

                {p.tarjeta && (
                  <p className="mt-4 inline-block rounded-full bg-wine-50 px-3 py-1 text-xs font-semibold tracking-wide text-wine-700">
                    {p.tarjeta}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}

      <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-3xl bg-wine-800 px-7 py-8 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl text-white">¿Dudas con alguna promo?</h2>
          <p className="mt-1 text-sm text-wine-100/80">
            Escribinos y te asesoramos con la mejor opción de pago.
          </p>
        </div>
        <a
          href={linkWhatsapp('¡Hola! Quería consultar por las promociones vigentes.')}
          target="_blank"
          rel="noreferrer"
          className="focus-ring shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-wine-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.4)]"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </section>
  )
}
