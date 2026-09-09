import { motion } from 'framer-motion'
import { ArrowRight, CreditCard, Eye, Glasses, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CardSkeleton from '../components/CardSkeleton'
import Logo from '../components/Logo'
import ProductCard from '../components/ProductCard'
import PromoBanner from '../components/PromoBanner'
import Ubicacion from '../components/Ubicacion'
import { listProductos, listPromociones } from '../lib/backend'

const beneficios = [
  { icon: Eye, titulo: 'Examen visual', texto: 'Control de vista sin cargo al armar tus lentes.' },
  { icon: Glasses, titulo: 'Armado propio', texto: 'Taller en el local, entrega en 48 h.' },
  { icon: ShieldCheck, titulo: 'Garantía', texto: '6 meses de garantía en armazones y cristales.' },
  { icon: CreditCard, titulo: 'Cuotas sin interés', texto: 'Hasta 6 cuotas con todas las tarjetas.' },
]

const contenedor = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function Home() {
  const [destacados, setDestacados] = useState([])
  const [promociones, setPromociones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listProductos(), listPromociones()]).then(([productos, promos]) => {
      setDestacados(productos.filter((p) => p.activo && p.destacado))
      setPromociones(promos)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <PromoBanner promociones={promociones} />

      <section className="mx-auto max-w-6xl px-5 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] bg-wine-800 px-7 py-14 text-left sm:px-14 sm:py-20"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-wine-500/35 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-wine-400/20 blur-3xl" />
          {/* Sello de la marca: entero y centrado en el aire que queda a la
              derecha del texto, en vez de recortado contra el borde. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute right-12 top-1/2 hidden -translate-y-1/2 lg:block xl:right-16"
          >
            <div className="absolute inset-0 -m-8 rounded-full bg-wine-400/15 blur-2xl" />
            <Logo size={300} variant="sello" className="relative text-wine-200/45" />
          </motion.div>

          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-wine-100 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-wine-300" />
              Catálogo actualizado
            </span>

            <h1 className="font-display mt-5 text-4xl leading-[1.08] font-semibold text-white sm:text-6xl">
              Mirá el mundo
              <br />
              <span className="text-wine-300">con otros ojos.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-wine-100/85">
              Anteojos de sol, recetados y lentes de contacto de las mejores marcas.
              Consultá precios, promociones y cuotas sin interés — y pasá por el local
              para probarte los modelos.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalogo"
                className="focus-ring group flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-wine-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.4)]"
              >
                Ver catálogo
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/promociones"
                className="focus-ring rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10"
              >
                Ver promociones
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <motion.section
        variants={contenedor}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="mx-auto grid max-w-6xl gap-4 px-5 py-12 text-left sm:grid-cols-2 lg:grid-cols-4"
      >
        {beneficios.map((b) => (
          <motion.div
            key={b.titulo}
            variants={item}
            className="group flex items-start gap-3.5 rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-wine-200 hover:shadow-[var(--shadow-soft)]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wine-50 text-wine-600 transition-colors duration-300 group-hover:bg-wine-600 group-hover:text-white">
              <b.icon size={20} />
            </span>
            <div>
              <p className="font-semibold text-ink">{b.titulo}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{b.texto}</p>
            </div>
          </motion.div>
        ))}
      </motion.section>

      <section className="mx-auto max-w-6xl px-5 pb-6 text-left">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wine-500">
              Selección
            </p>
            <h2 className="font-display mt-1 text-3xl text-ink">Destacados</h2>
          </div>
          <Link
            to="/catalogo"
            className="focus-ring group flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-wine-600 transition-colors hover:bg-wine-50"
          >
            Ver todos
            <ArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
            : destacados.map((p) => <ProductCard key={p.id} producto={p} />)}
        </div>
      </section>

      <Ubicacion />
    </>
  )
}
