import { AnimatePresence, motion } from 'framer-motion'
import { SearchX } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import CardSkeleton from '../components/CardSkeleton'
import ProductCard from '../components/ProductCard'
import { listCategorias, listProductos } from '../lib/backend'

export default function Catalogo() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState('todas')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listProductos(), listCategorias()]).then(([p, c]) => {
      setProductos(p.filter((prod) => prod.activo))
      setCategorias([...c].sort((a, b) => a.orden - b.orden))
      setLoading(false)
    })
  }, [])

  const filtros = useMemo(
    () => [{ id: 'todas', titulo: 'Todas' }, ...categorias],
    [categorias],
  )

  const filtrados = useMemo(() => {
    if (categoriaActiva === 'todas') return productos
    return productos.filter((p) => p.categoriaId === categoriaActiva)
  }, [productos, categoriaActiva])

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 text-left">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wine-500">
          Nuestros productos
        </p>
        <h1 className="font-display mt-1 text-4xl text-ink">Catálogo</h1>
        <p className="mt-2 text-ink-soft">
          Explorá todos los modelos disponibles. Consultá por WhatsApp el que más te guste.
        </p>
      </motion.div>

      <div className="mt-7 flex flex-wrap gap-2">
        {filtros.map((c) => {
          const activo = categoriaActiva === c.id
          return (
            <button
              key={c.id}
              onClick={() => setCategoriaActiva(c.id)}
              className={`focus-ring relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activo ? 'text-white' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {activo && (
                <motion.span
                  layoutId="filtro-activo"
                  className="absolute inset-0 rounded-full bg-wine-600 shadow-[var(--shadow-soft)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              {!activo && (
                <span className="absolute inset-0 rounded-full border border-line bg-white transition-colors duration-200 hover:border-wine-300" />
              )}
              <span className="relative">{c.titulo}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line bg-white/60 py-20 text-center">
            <SearchX size={28} className="text-wine-300" />
            <p className="text-ink-soft">No hay productos en esta categoría todavía.</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtrados.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  )
}
