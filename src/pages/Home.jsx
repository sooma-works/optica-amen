import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import PromoBanner from '../components/PromoBanner'
import { listProductos, listPromociones } from '../lib/backend'

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

      <section className="mx-auto max-w-6xl px-5 py-16 text-left">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">
          Óptica A.M.E.N.
        </p>
        <h1 className="font-display mt-2 max-w-2xl text-4xl leading-tight text-ink sm:text-5xl">
          Anteojos de sol, recetados y lentes de contacto para cada estilo de vida.
        </h1>
        <p className="mt-4 max-w-xl text-base text-ink/60">
          Conocé nuestro catálogo, mirá precios y promociones vigentes con tarjeta.
          Visitanos en el local para probarte los modelos y armar tus lentes recetados.
        </p>
        <Link
          to="/catalogo"
          className="mt-6 inline-block rounded-md bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink-2"
        >
          Ver catálogo completo
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 text-left">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-ink">Destacados</h2>
          <Link to="/catalogo" className="text-sm font-medium text-gold hover:underline">
            Ver todos
          </Link>
        </div>

        {loading ? (
          <p className="text-ink/50">Cargando productos...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
