import { Sparkles } from 'lucide-react'

// Cinta de promociones. Antes rotaba de a una con `truncate`, así que en
// mobile las promos largas salían cortadas; ahora desfilan todas en bucle.
export default function PromoBanner({ promociones }) {
  const activas = promociones.filter((p) => p.activo)

  if (activas.length === 0) return null

  // Cada promo tarda ~11 s en cruzar, con un piso para que con una sola
  // promo la cinta no vaya disparada.
  const duracion = `${Math.max(20, activas.length * 11)}s`

  return (
    <div className="relative bg-wine-800 text-wine-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_140%_at_50%_0%,rgba(255,255,255,0.14),transparent)]" />

      <div className="promo-marquee relative flex h-11 items-center">
        <div className="promo-track" style={{ '--promo-duracion': duracion }}>
          {/* La segunda copia es la que hace posible el bucle continuo: es
              decorativa, así que no se lee dos veces. */}
          {[0, 1].map((copia) => (
            <div key={copia} className="flex items-center" aria-hidden={copia === 1}>
              {activas.map((promo) => (
                <span
                  key={promo.id}
                  className="flex shrink-0 items-center gap-2 px-6 text-sm whitespace-nowrap"
                >
                  <Sparkles size={14} className="shrink-0 text-wine-300" />
                  <strong className="font-semibold">{promo.titulo}</strong>
                  {promo.descripcion ? (
                    <span className="text-wine-200">— {promo.descripcion}</span>
                  ) : null}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
