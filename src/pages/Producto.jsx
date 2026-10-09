import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Expand,
  Glasses,
  Link2,
  MapPin,
  Share2,
  ShieldCheck,
  Wrench,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Lens from '../components/fx/Lens'
import Tilt from '../components/fx/Tilt'
import { WhatsappIcon } from '../components/icons'
import Lightbox from '../components/Lightbox'
import ProductCard from '../components/ProductCard'
import { linkWhatsapp, NEGOCIO } from '../config'
import { getProducto, listCategorias, listProductos } from '../lib/backend'
import { formatPrecio } from '../lib/format'
import { imagenesDe, imgAncho } from '../lib/imagenes'

const garantias = [
  { icon: ShieldCheck, texto: '6 meses de garantía en armazones y cristales' },
  { icon: Wrench, texto: 'Taller propio: armado y ajustes en el local' },
  { icon: MapPin, texto: `Retirá en ${NEGOCIO.direccionCorta}` },
]

export default function Producto() {
  const { id } = useParams()
  const [datos, setDatos] = useState({ estado: 'cargando' })
  const [fotoActiva, setFotoActiva] = useState(0)
  const [galeria, setGaleria] = useState(null)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    let vigente = true
    Promise.all([getProducto(id), listProductos(), listCategorias()]).then(
      ([producto, productos, categorias]) => {
        if (!vigente) return
        if (!producto || !producto.activo) {
          setDatos({ estado: 'no-existe' })
          return
        }
        setDatos({
          estado: 'ok',
          producto,
          categoria: categorias.find((c) => c.id === producto.categoriaId),
          relacionados: productos
            .filter((p) => p.activo && p.id !== producto.id && p.categoriaId === producto.categoriaId)
            .slice(0, 3),
        })
        setFotoActiva(0)
      },
    )
    return () => {
      vigente = false
    }
  }, [id])

  const producto = datos.producto
  useEffect(() => {
    if (!producto) return
    const previo = document.title
    document.title = `${producto.titulo} · ${producto.marca} | ${NEGOCIO.nombre}`
    return () => {
      document.title = previo
    }
  }, [producto])

  if (datos.estado === 'cargando') {
    return (
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-[2rem] bg-wine-50" />
        <div className="flex flex-col gap-4 pt-6">
          <div className="h-3 w-24 rounded-full bg-line" />
          <div className="h-9 w-3/4 rounded-full bg-line" />
          <div className="h-4 w-full rounded-full bg-line/70" />
          <div className="h-8 w-40 rounded-full bg-line" />
        </div>
      </section>
    )
  }

  if (datos.estado === 'no-existe') {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center gap-4 px-5 py-24 text-center">
        <Glasses size={40} className="text-wine-300" />
        <h1 className="font-display text-3xl text-ink">Este producto ya no está disponible</h1>
        <p className="text-ink-soft">Puede que se haya agotado. Mirá los otros modelos del catálogo.</p>
        <Link
          to="/catalogo"
          className="focus-ring mt-2 rounded-full bg-wine-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-wine-700"
        >
          Ver catálogo
        </Link>
      </section>
    )
  }

  const { categoria, relacionados } = datos
  const imagenes = imagenesDe(producto)
  const url = window.location.href
  const tieneDescuento = producto.precioAnterior && producto.precioAnterior > producto.precio
  const off = tieneDescuento ? Math.round((1 - producto.precio / producto.precioAnterior) * 100) : 0

  async function compartir() {
    const data = { title: producto.titulo, text: `Mirá este modelo en ${NEGOCIO.nombre}`, url }
    // En el celular abre el menú nativo (WhatsApp, Instagram, etc.).
    if (navigator.share) {
      try {
        await navigator.share(data)
      } catch {
        // El usuario cerró el menú: no hay nada que hacer.
      }
      return
    }
    await navigator.clipboard.writeText(url)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2200)
  }

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-6 pb-14 text-left">
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-ink-soft" aria-label="Ubicación">
          <Link
            to="/catalogo"
            className="focus-ring flex items-center gap-1 rounded-full py-1 pr-2 font-medium transition-colors hover:text-wine-700"
          >
            <ArrowLeft size={15} /> Catálogo
          </Link>
          {categoria && (
            <>
              <ChevronRight size={14} className="text-ink-soft/40" />
              <Link
                to={`/catalogo?categoria=${categoria.id}`}
                className="focus-ring rounded transition-colors hover:text-wine-700"
              >
                {categoria.titulo}
              </Link>
            </>
          )}
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          {/* ---- Fotos ---- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-line bg-white shadow-[var(--shadow-soft)]">
              {imagenes.length > 0 ? (
                <Lens
                  src={imgAncho(imagenes[fotoActiva], 1400)}
                  alt={producto.titulo}
                  className="aspect-square sm:aspect-4/3"
                  onClick={() => setGaleria(fotoActiva)}
                />
              ) : (
                <div className="flex aspect-4/3 items-center justify-center bg-wine-50 text-wine-200">
                  <Glasses size={64} />
                </div>
              )}
              {tieneDescuento && (
                <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-wine-600 px-3 py-1.5 text-xs font-bold text-white shadow">
                  {off}% OFF
                </span>
              )}
              {imagenes.length > 0 && (
                <button
                  onClick={() => setGaleria(fotoActiva)}
                  className="focus-ring absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-2 text-xs font-semibold text-ink shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
                >
                  <Expand size={14} />
                  {imagenes.length > 1 ? `Ver las ${imagenes.length} fotos` : 'Ampliar'}
                </button>
              )}
            </div>

            {imagenes.length > 1 && (
              <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
                {imagenes.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setFotoActiva(i)}
                    aria-label={`Ver foto ${i + 1}`}
                    className={`focus-ring h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                      i === fotoActiva
                        ? 'border-wine-500'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgAncho(src, 200)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <p className="mt-2 hidden text-xs text-ink-soft/70 lg:block">
              Pasá el mouse sobre la foto para ver los detalles de cerca.
            </p>
          </motion.div>

          {/* ---- Datos ---- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wine-500">
              {producto.marca}
            </p>
            <h1 className="font-display mt-2 text-4xl leading-tight text-ink sm:text-5xl">
              {producto.titulo}
            </h1>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold tracking-tight text-ink">
                {formatPrecio(producto.precio)}
              </span>
              {tieneDescuento && (
                <span className="text-lg text-ink-soft/60 line-through">
                  {formatPrecio(producto.precioAnterior)}
                </span>
              )}
            </div>
            {producto.cuotas && (
              <p className="mt-3 flex w-fit flex-wrap items-baseline gap-x-1.5 rounded-2xl bg-wine-50 px-3.5 py-2 text-sm font-semibold text-wine-700">
                {producto.cuotas.cantidad} cuotas sin interés de{' '}
                {formatPrecio(Math.ceil(producto.precio / producto.cuotas.cantidad))}
                <span className="font-normal text-wine-600">· {producto.cuotas.tarjeta}</span>
              </p>
            )}

            {producto.descripcion && (
              <p className="mt-6 text-base leading-relaxed text-ink-soft">{producto.descripcion}</p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={linkWhatsapp(
                  `¡Hola! Me interesa el modelo "${producto.titulo}" (${producto.marca}). ¿Está disponible?\n${url}`,
                )}
                target="_blank"
                rel="noreferrer"
                className="focus-ring flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1fb857] hover:shadow-[0_12px_30px_-10px_rgba(37,211,102,0.6)]"
              >
                <WhatsappIcon size={18} />
                Consultar por WhatsApp
              </a>
              <button
                onClick={compartir}
                className="focus-ring flex items-center justify-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-wine-300"
              >
                {copiado ? (
                  <>
                    <Check size={17} className="text-emerald-600" /> Link copiado
                  </>
                ) : (
                  <>
                    {navigator.share ? <Share2 size={17} /> : <Link2 size={17} />}
                    {navigator.share ? 'Compartir' : 'Copiar link'}
                  </>
                )}
              </button>
            </div>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Mirá estos anteojos: ${producto.titulo} ${url}`)}`}
              target="_blank"
              rel="noreferrer"
              className="focus-ring mt-3 w-fit rounded text-sm font-medium text-ink-soft underline-offset-4 transition-colors hover:text-wine-700 hover:underline"
            >
              Mandárselo a alguien por WhatsApp →
            </a>

            <ul className="mt-8 flex flex-col gap-3 border-t border-line pt-6">
              {garantias.map((g) => (
                <li key={g.texto} className="flex items-center gap-3 text-sm text-ink-soft">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-wine-50 text-wine-600">
                    <g.icon size={17} />
                  </span>
                  {g.texto}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-16 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wine-500">
            {categoria?.titulo}
          </p>
          <h2 className="font-display mt-1 mb-7 text-3xl text-ink">También te puede gustar</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relacionados.map((p) => (
              <Tilt key={p.id}>
                <ProductCard producto={p} />
              </Tilt>
            ))}
          </div>
        </section>
      )}

      <Lightbox
        imagenes={imagenes.map((src) => imgAncho(src, 1800))}
        indice={galeria}
        onClose={() => setGaleria(null)}
        titulo={producto.titulo}
      />
    </>
  )
}
