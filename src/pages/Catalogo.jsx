import { useEffect, useMemo, useState } from 'react'
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

  const filtrados = useMemo(() => {
    if (categoriaActiva === 'todas') return productos
    return productos.filter((p) => p.categoriaId === categoriaActiva)
  }, [productos, categoriaActiva])

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 text-left">
      <h1 className="font-display text-3xl text-ink">Catálogo</h1>
      <p className="mt-2 text-ink/60">Explorá todos nuestros productos disponibles.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCategoriaActiva('todas')}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            categoriaActiva === 'todas'
              ? 'border-ink bg-ink text-white'
              : 'border-line text-ink/70 hover:border-ink'
          }`}
        >
          Todas
        </button>
        {categorias.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoriaActiva(c.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              categoriaActiva === c.id
                ? 'border-ink bg-ink text-white'
                : 'border-line text-ink/70 hover:border-ink'
            }`}
          >
            {c.titulo}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-ink/50">Cargando productos...</p>
        ) : filtrados.length === 0 ? (
          <p className="text-ink/50">No hay productos en esta categoría todavía.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
