import { CreditCard } from 'lucide-react'

export default function PromoBanner({ promociones }) {
  const activas = promociones.filter((p) => p.activo)
  if (activas.length === 0) return null

  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
        {activas.map((p) => (
          <div key={p.id} className="flex items-center gap-2 text-sm">
            <CreditCard size={16} className="shrink-0 text-gold" />
            <span>
              <strong className="font-semibold">{p.titulo}</strong>
              {p.descripcion ? ` — ${p.descripcion}` : ''}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
