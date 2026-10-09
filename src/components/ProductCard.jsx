import { motion } from 'framer-motion'
import { Glasses, Images } from 'lucide-react'
import { Link } from 'react-router-dom'
import { linkWhatsapp } from '../config'
import { formatPrecio } from '../lib/format'
import { imagenesDe, imgAncho } from '../lib/imagenes'
import { linkProducto } from '../lib/routes'
import { WhatsappIcon } from './icons'

// `preview` la usa el panel para mostrar la tarjeta mientras se edita: sin
// link ni animación de entrada.
export default function ProductCard({ producto, preview = false }) {
  const tieneDescuento = producto.precioAnterior && producto.precioAnterior > producto.precio
  const off = tieneDescuento
    ? Math.round((1 - producto.precio / producto.precioAnterior) * 100)
    : 0
  const imagenes = imagenesDe(producto)
  const portada = imagenes[0]

  return (
    <motion.article
      layout={!preview}
      initial={preview ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white text-left shadow-[var(--shadow-soft)] transition-[border-color,box-shadow] duration-400 ease-[var(--ease-out-soft)] hover:border-wine-200 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-wine-50">
        {portada ? (
          <img
            src={imgAncho(portada, 700)}
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

        {imagenes.length > 1 && (
          <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            <Images size={12} /> {imagenes.length}
          </span>
        )}

        {/* Con mouse aparece al pasar por encima; en pantallas táctiles no
            hay hover, así que ahí queda siempre visible. */}
        {!preview && (
          <a
            href={linkWhatsapp(
              `¡Hola! Me interesa el modelo "${producto.titulo}". ¿Está disponible?\n${window.location.origin}${linkProducto(producto)}`,
            )}
            target="_blank"
            rel="noreferrer"
            className="focus-ring absolute right-3 bottom-3 z-10 flex items-center justify-center gap-1.5 rounded-full bg-white/95 px-4 py-2.5 text-sm font-semibold text-wine-700 shadow-lg backdrop-blur-sm transition-all duration-400 ease-[var(--ease-out-soft)] hover:bg-white pointer-fine:inset-x-3 pointer-fine:translate-y-3 pointer-fine:opacity-0 pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100"
          >
            <WhatsappIcon size={15} className="text-[#25D366]" />
            Consultar
          </a>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-wine-500">
          {producto.marca}
        </p>
        <h3 className="font-display text-lg leading-snug text-ink">
          {preview ? (
            producto.titulo || 'Nombre del producto'
          ) : (
            // El link se estira sobre toda la tarjeta (after:inset-0), así
            // toda la tarjeta lleva a la ficha sin anidar el botón de WhatsApp.
            <Link
              to={linkProducto(producto)}
              className="focus-ring rounded after:absolute after:inset-0 after:content-['']"
            >
              {producto.titulo}
            </Link>
          )}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {producto.descripcion}
        </p>

        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-ink">
              {formatPrecio(producto.precio || 0)}
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
