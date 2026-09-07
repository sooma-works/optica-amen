import { motion } from 'framer-motion'
import { Glasses, MessageCircle } from 'lucide-react'
import { linkWhatsapp } from '../config'
import { formatPrecio } from '../lib/format'

export default function ProductCard({ producto }) {
  const tieneDescuento = producto.precioAnterior && producto.precioAnterior > producto.precio
  const off = tieneDescuento
    ? Math.round((1 - producto.precio / producto.precioAnterior) * 100)
    : 0

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-soft)] transition-all duration-400 ease-[var(--ease-out-soft)] hover:-translate-y-1.5 hover:border-wine-200 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-wine-50">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.titulo}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.08]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-wine-200">
            <Glasses size={44} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/45 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {producto.destacado && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-wine-700 backdrop-blur-sm">
              Destacado
            </span>
          )}
          {tieneDescuento && (
            <span className="rounded-full bg-wine-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              {off}% OFF
            </span>
          )}
        </div>

        <a
          href={linkWhatsapp(`¡Hola! Me interesa el modelo "${producto.titulo}". ¿Está disponible?`)}
          target="_blank"
          rel="noreferrer"
          className="focus-ring absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-1.5 rounded-full bg-white/95 py-2.5 text-sm font-semibold text-wine-700 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-400 ease-[var(--ease-out-soft)] group-hover:translate-y-0 group-hover:opacity-100 hover:bg-white"
        >
          <MessageCircle size={15} />
          Consultar
        </a>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-5 text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-wine-500">
          {producto.marca}
        </p>
        <h3 className="font-display text-lg leading-snug text-ink">{producto.titulo}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {producto.descripcion}
        </p>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-ink">
              {formatPrecio(producto.precio)}
            </span>
            {tieneDescuento && (
              <span className="text-sm text-ink-soft/60 line-through">
                {formatPrecio(producto.precioAnterior)}
              </span>
            )}
          </div>

          {producto.cuotas && (
            <p className="mt-1 text-xs font-medium text-wine-600">
              {producto.cuotas.cantidad} cuotas sin interés · {producto.cuotas.tarjeta}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  )
}
