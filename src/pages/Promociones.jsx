import { CreditCard } from 'lucide-react'
import { useEffect, useState } from 'react'
import { listPromociones } from '../lib/backend'

export default function Promociones() {
  const [promociones, setPromociones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listPromociones().then((data) => {
      setPromociones(data.filter((p) => p.activo).sort((a, b) => a.orden - b.orden))
      setLoading(false)
    })
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 text-left">
      <h1 className="font-display text-3xl text-ink">Promociones</h1>
      <p className="mt-2 text-ink/60">Aprovechá nuestros beneficios vigentes con tarjeta.</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {loading ? (
          <p className="text-ink/50">Cargando promociones...</p>
        ) : promociones.length === 0 ? (
          <p className="text-ink/50">No hay promociones activas por el momento.</p>
        ) : (
          promociones.map((p) => (
            <div key={p.id} className="rounded-lg border border-line bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <CreditCard size={20} />
                </span>
                <h2 className="font-display text-xl text-ink">{p.titulo}</h2>
              </div>
              <p className="mt-3 text-sm text-ink/60">{p.descripcion}</p>
              {p.tarjeta && (
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gold">
                  {p.tarjeta}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  )
}
