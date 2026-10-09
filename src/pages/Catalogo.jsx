import { motion } from 'framer-motion'
import { Search, SearchX, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CardSkeleton from '../components/CardSkeleton'
import Tilt from '../components/fx/Tilt'
import ProductCard from '../components/ProductCard'
import PromoBanner from '../components/PromoBanner'
import { listCategorias, listProductos } from '../lib/backend'

// Sin tildes ni mayúsculas, para que "rayban" encuentre "Ray-Ban".
function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
}

export default function Catalogo() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  // La categoría va en la URL (?categoria=sol) para que los mosaicos del
  // inicio puedan linkear directo y el filtro se pueda compartir.
  const [params, setParams] = useSearchParams()
  const categoriaActiva = params.get('categoria') || 'todas'
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('relevancia')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listProductos(), listCategorias()]).then(([p, c]) => {
      setProductos(p.filter((prod) => prod.activo))
      setCategorias([...c].sort((a, b) => a.orden - b.orden))
      setLoading(false)
    })
  }, [])

  const filtros = useMemo(() => [{ id: 'todas', titulo: 'Todas' }, ...categorias], [categorias])

  function elegirCategoria(id) {
    setParams(id === 'todas' ? {} : { categoria: id }, { replace: true })
  }

  const filtrados = useMemo(() => {
    const texto = normalizar(busqueda.trim())
    const lista = productos.filter(
      (p) =>
        (categoriaActiva === 'todas' || p.categoriaId === categoriaActiva) &&
        (!texto || normalizar(`${p.titulo} ${p.marca} ${p.descripcion}`).includes(texto)),
    )
    if (orden === 'menor') return [...lista].sort((a, b) => a.precio - b.precio)
    if (orden === 'mayor') return [...lista].sort((a, b) => b.precio - a.precio)
    return lista
  }, [productos, categoriaActiva, busqueda, orden])

  return (
    <>
      <PromoBanner />
      <section className="mx-auto max-w-6xl px-5 pt-8 pb-12 text-left">
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

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Buscar</span>
            <Search
              size={17}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-soft/60"
            />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por modelo o marca…"
              className="focus-ring w-full rounded-full border border-line bg-white py-3 pr-10 pl-11 text-sm transition-colors focus:border-wine-400"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                aria-label="Borrar búsqueda"
                className="focus-ring absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-ink-soft hover:bg-wine-50"
              >
                <X size={15} />
              </button>
            )}
          </label>
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            aria-label="Ordenar"
            className="focus-ring rounded-full border border-line bg-white px-4 py-3 text-sm font-medium text-ink transition-colors focus:border-wine-400"
          >
            <option value="relevancia">Ordenar: recomendados</option>
            <option value="menor">Precio: menor a mayor</option>
            <option value="mayor">Precio: mayor a menor</option>
          </select>
        </div>

        <div className="sin-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {filtros.map((c) => {
            const activo = categoriaActiva === c.id
            return (
              <button
                key={c.id}
                onClick={() => elegirCategoria(c.id)}
                className={`focus-ring relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
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
              <p className="text-ink-soft">
                {busqueda
                  ? `No encontramos nada para "${busqueda}".`
                  : 'No hay productos en esta categoría todavía.'}
              </p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtrados.map((p) => (
                <Tilt key={p.id}>
                  <ProductCard producto={p} />
                </Tilt>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
