import { motion } from 'framer-motion'
import { formatPrecio } from '../lib/format'

export default function ProductCard({ producto }) {
  const tieneDescuento = producto.precioAnterior && producto.precioAnterior > producto.precio

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-line/40">
        <img
          src={producto.imagen}
          alt={producto.titulo}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {producto.destacado && (
          <span className="absolute left-2 top-2 rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-white">
            Destacado
          </span>
        )}
        {tieneDescuento && (
          <span className="absolute right-2 top-2 rounded-full bg-ink px-2 py-0.5 text-xs font-semibold text-white">
            Oferta
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4 text-left">
        <p className="text-xs font-medium uppercase tracking-wide text-ink/50">{producto.marca}</p>
        <h3 className="font-display text-lg leading-snug text-ink">{producto.titulo}</h3>
        <p className="line-clamp-2 text-sm text-ink/60">{producto.descripcion}</p>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-xl font-semibold text-ink">{formatPrecio(producto.precio)}</span>
          {tieneDescuento && (
            <span className="text-sm text-ink/40 line-through">
              {formatPrecio(producto.precioAnterior)}
            </span>
          )}
        </div>

        {producto.cuotas && (
          <p className="text-xs text-gold">
            {producto.cuotas.cantidad} cuotas sin interés · {producto.cuotas.tarjeta}
          </p>
        )}
      </div>
    </motion.article>
  )
}
