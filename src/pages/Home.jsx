import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, CreditCard, Glasses, ShieldCheck, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CardSkeleton from '../components/CardSkeleton'
import LogosTarjetas from '../components/LogosTarjetas'
import BlurText from '../components/fx/BlurText'
import Compare from '../components/fx/Compare'
import Tilt from '../components/fx/Tilt'
import MarcasMarquee from '../components/MarcasMarquee'
import ProductCard from '../components/ProductCard'
import PromoBanner from '../components/PromoBanner'
import Ubicacion from '../components/Ubicacion'
import { listCategorias, listProductos } from '../lib/backend'
import { imagenesDe, imgAncho } from '../lib/imagenes'

const beneficios = [
  { icon: Glasses, titulo: 'Armado propio', texto: 'Taller en el local, entrega en 48 h.' },
  { icon: ShieldCheck, titulo: 'Garantía de 6 meses', texto: 'En armazones y cristales.' },
  {
    icon: CreditCard,
    titulo: 'Cuotas sin interés',
    texto: 'Hasta 6 con todas las tarjetas.',
    tarjetas: 'todas',
  },
]

// Foto de ejemplo para la demo (Unsplash). Reemplazar por una campaña propia.
const HERO_IMG = {
  src: '/img/hero-1600.jpg',
  srcSet: '/img/hero-800.jpg 800w, /img/hero-1600.jpg 1600w',
}

const contenedor = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

// Mosaico de categorías: la primera ocupa el bloque grande.
const tamanosBento = [
  'col-span-2 row-span-2 min-h-[18rem] sm:min-h-0',
  'col-span-2 min-h-[11rem]',
  'col-span-1 min-h-[11rem]',
  'col-span-1 min-h-[11rem]',
]

function Encabezado({ kicker, titulo, children }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wine-500">{kicker}</p>
        <h2 className="font-display mt-1 text-3xl text-ink">{titulo}</h2>
      </div>
      {children}
    </div>
  )
}

export default function Home() {
  const [destacados, setDestacados] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listProductos(), listCategorias()]).then(
      ([productos, cats]) => {
        const activos = productos.filter((p) => p.activo)
        setDestacados(activos.filter((p) => p.destacado))
        // Cada categoría toma como portada la foto de su primer producto.
        setCategorias(
          [...cats]
            .sort((a, b) => a.orden - b.orden)
            .map((c) => {
              const suyos = activos.filter((p) => p.categoriaId === c.id)
              return { ...c, cantidad: suyos.length, portada: suyos.map(imagenesDe).find((i) => i[0])?.[0] }
            })
            .filter((c) => c.cantidad > 0)
            .slice(0, 4),
        )
        setLoading(false)
      },
    )
  }, [])

  return (
    <>
      <PromoBanner />

      <section className="mx-auto max-w-6xl px-5 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative isolate overflow-hidden rounded-[2rem] bg-wine-800 px-6 pt-[19rem] pb-9 text-left sm:px-12 sm:pt-[27rem] sm:pb-12 lg:px-14 lg:py-24"
        >
          {/* Foto de campaña. En móvil va arriba, limpia, y se funde con el
              bordó recién al final, así el texto queda sobre fondo liso. En
              desktop ocupa la derecha y se funde hacia el texto. */}
          <img
            src={HERO_IMG.src}
            srcSet={HERO_IMG.srcSet}
            sizes="(min-width: 1024px) 60vw, 100vw"
            alt=""
            fetchPriority="high"
            className="absolute inset-x-0 top-0 -z-10 h-[22rem] w-full object-cover object-[50%_22%] saturate-[1.08] sm:h-[31rem] lg:inset-y-0 lg:right-0 lg:left-auto lg:h-full lg:w-[60%] lg:object-[50%_28%]"
          />
          <div className="pointer-events-none absolute inset-x-0 top-[12.5rem] -z-10 h-[9.5rem] bg-gradient-to-b from-wine-800/0 via-wine-800/70 to-wine-800 sm:top-[17rem] sm:h-[14.5rem] lg:hidden" />
          <div className="pointer-events-none absolute inset-0 -z-10 hidden bg-gradient-to-r from-wine-800 from-40% via-wine-800/55 via-55% to-wine-800/0 to-75% lg:block" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-72 w-72 rounded-full bg-wine-500/25 blur-3xl" />

          {/* En móvil el chip va arriba a la izquierda, sobre la foto, para no
              taparle la cara; en desktop vuelve a su lugar sobre el título. */}
          <span className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-black/30 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-md sm:top-7 sm:left-7 lg:static lg:mb-5 lg:bg-white/10 lg:text-wine-100">
            <span className="h-1.5 w-1.5 rounded-full bg-wine-300" />
            Catálogo actualizado
          </span>

          <div className="max-w-2xl">
            <h1 className="font-display text-[2.6rem] leading-[1.06] font-semibold text-white sm:text-6xl">
              <BlurText text="Mirá el mundo" delay={0.2} />
              <br />
              <BlurText text="con otros ojos." delay={0.5} className="text-wine-300" />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
              className="mt-5 max-w-lg text-base leading-relaxed text-white/85"
            >
              Anteojos de sol, recetados y lentes de contacto de las mejores marcas.
              Consultá precios, promociones y cuotas sin interés — y pasá por el local
              para probarte los modelos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                to="/catalogo"
                className="focus-ring group flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-wine-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.4)]"
              >
                Ver catálogo
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/promociones"
                className="focus-ring flex items-center justify-center rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10"
              >
                Ver promociones
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Franja de beneficios: sin tarjetas propias, para que no compita con
          la tarjeta blanca de marcas que viene abajo. Separadores finos y
          textos de largo parecido, así las tres columnas quedan parejas. */}
      <section className="mx-auto max-w-6xl px-5 py-10 text-left sm:py-12">
        <motion.ul
          variants={contenedor}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid divide-y divide-wine-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        >
          {beneficios.map((b) => (
            <motion.li
              key={b.titulo}
              variants={item}
              className="group flex items-center gap-4 py-4 first:pt-0 last:pb-0 sm:justify-center sm:px-6 sm:py-1 sm:first:pl-0 sm:last:pr-0"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-wine-600 text-white shadow-[0_8px_20px_-8px_rgba(139,26,28,0.6)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <b.icon size={21} />
              </span>
              <div>
                <p className="flex items-center gap-2 font-semibold text-ink">
                  {b.titulo}
                  {b.tarjetas && <LogosTarjetas texto={b.tarjetas} />}
                </p>
                <p className="text-sm text-ink-soft">{b.texto}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      <MarcasMarquee />

      {categorias.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-14 text-left">
          <Encabezado kicker="Explorá" titulo="Comprá por categoría" />
          <motion.div
            variants={contenedor}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid auto-rows-[11rem] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:auto-rows-[13rem]"
          >
            {categorias.map((c, i) => (
              <motion.div key={c.id} variants={item} className={tamanosBento[i]}>
                <Link
                  to={`/catalogo?categoria=${c.id}`}
                  className="focus-ring group relative flex h-full overflow-hidden rounded-3xl bg-wine-700"
                >
                  {c.portada && (
                    <img
                      src={imgAncho(c.portada, i === 0 ? 900 : 600)}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                  <div className="relative mt-auto flex w-full items-end justify-between gap-3 p-4 sm:p-5">
                    <div>
                      <p
                        className={`font-display leading-tight text-white ${i === 0 ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}`}
                      >
                        {c.titulo}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-white/75">
                        {c.cantidad} {c.cantidad === 1 ? 'modelo' : 'modelos'}
                      </p>
                    </div>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:bg-white group-hover:text-wine-700">
                      <ArrowUpRight size={17} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-5 pb-6 text-left">
        <Encabezado kicker="Selección" titulo="Destacados">
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
        </Encabezado>

        {/* Hasta desktop es un carrusel que se desliza de costado (se asoma la
            tarjeta siguiente para que se entienda que hay más); en desktop,
            grilla de 3. Así en el celular no se vuelve una lista eterna. */}
        <div className="sin-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pt-1 pb-5 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-[78%] shrink-0 sm:w-[46%] lg:w-auto">
                  <CardSkeleton />
                </div>
              ))
            : destacados.map((p) => (
                <Tilt key={p.id} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
                  <ProductCard producto={p} />
                </Tilt>
              ))}
        </div>
        {destacados.length > 1 && (
          <p className="mt-1 flex items-center justify-center gap-1.5 text-xs font-medium text-ink-soft/70 lg:hidden">
            Deslizá para ver más <ArrowRight size={13} />
          </p>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-12 text-left">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] border border-line bg-white p-6 shadow-[var(--shadow-soft)] sm:p-10 lg:grid-cols-[1fr_1.25fr] lg:gap-12">
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-wine-50 text-wine-600">
              <Sun size={20} />
            </span>
            <h2 className="font-display mt-4 text-3xl leading-tight text-ink sm:text-4xl">
              La diferencia de un cristal polarizado
            </h2>
            <p className="mt-3 leading-relaxed text-ink-soft">
              Elimina el reflejo del agua, el asfalto y la nieve. Ves colores más vivos, con
              más contraste y sin forzar la vista.{' '}
              <span className="font-medium text-ink">Deslizá la barra para comparar.</span>
            </p>
            <Link
              to="/catalogo?categoria=sol"
              className="focus-ring group mt-6 inline-flex items-center gap-2 rounded-full bg-wine-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-wine-700"
            >
              Ver anteojos de sol
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <Compare
            className="aspect-4/3 rounded-3xl"
            etiquetaAntes="Cristal común"
            etiquetaDespues="Polarizado"
            antes={
              <div className="relative h-full w-full">
                <img
                  src="/img/playa.jpg"
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover brightness-[1.18] contrast-[0.78] saturate-[0.55]"
                />
                {/* Reflejo del sol que el polarizado filtra. */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_55%_62%,rgba(255,255,255,0.75),rgba(255,255,255,0.2)_45%,transparent_70%)]" />
              </div>
            }
            despues={
              <img
                src="/img/playa.jpg"
                alt="Playa vista con cristal polarizado"
                loading="lazy"
                className="h-full w-full object-cover contrast-[1.12] saturate-[1.35] brightness-[0.95]"
              />
            }
          />
        </div>
      </section>

      <Ubicacion />
    </>
  )
}
