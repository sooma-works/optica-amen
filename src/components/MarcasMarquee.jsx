// Cinta de marcas (estilo "Marquee" de Magic UI). Usa la misma animación CSS
// que la cinta de promociones. Las marcas van escritas, no con sus logos: en
// la demo son de ejemplo y los logos de terceros no se pueden usar libremente.
const MARCAS = [
  { nombre: 'Ray-Ban', clase: 'font-display italic font-bold' },
  { nombre: 'VULK', clase: 'font-sans font-black tracking-[0.25em]' },
  { nombre: 'Infinit', clase: 'font-sans font-light tracking-wide' },
  { nombre: 'Acuvue', clase: 'font-sans font-bold lowercase' },
  { nombre: 'Oakley', clase: 'font-sans font-extrabold uppercase italic' },
  { nombre: 'Carrera', clase: 'font-display font-semibold uppercase tracking-widest' },
  { nombre: 'Vogue Eyewear', clase: 'font-display font-medium' },
  { nombre: 'Bausch + Lomb', clase: 'font-sans font-semibold' },
]

export default function MarcasMarquee() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-14 text-center">
      <div className="rounded-[2rem] border border-line bg-white py-8 shadow-[var(--shadow-soft)] sm:py-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wine-500">
          Trabajamos con las mejores marcas
        </p>
        <div className="promo-marquee mt-6">
          <div className="promo-track" style={{ '--promo-duracion': '38s' }}>
            {[0, 1].map((copia) => (
              <div key={copia} className="flex items-center" aria-hidden={copia === 1}>
                {MARCAS.map((m) => (
                  <span
                    key={m.nombre}
                    className={`shrink-0 px-8 text-3xl whitespace-nowrap text-ink/55 transition-colors duration-300 hover:text-wine-600 sm:px-12 sm:text-4xl ${m.clase}`}
                  >
                    {m.nombre}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
