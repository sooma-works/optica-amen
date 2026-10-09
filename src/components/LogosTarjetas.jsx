// Logos oficiales de las tarjetas (archivos en public/brand/tarjetas). Se
// deducen del texto que carga la óptica: "Visa y Mastercard", "Visa /
// Mastercard Galicia", "todas las tarjetas"… así no hay que tocar nada en el
// panel para que aparezcan.
const LOGOS = {
  visa: { src: '/brand/tarjetas/visa.svg', alt: 'Visa', alto: 'h-[9px]', altoGrande: 'h-3' },
  mastercard: {
    src: '/brand/tarjetas/mastercard.svg',
    alt: 'Mastercard',
    alto: 'h-3.5',
    altoGrande: 'h-[18px]',
  },
}

function marcasEn(texto) {
  const t = (texto || '').toLowerCase()
  if (t.includes('todas')) return ['visa', 'mastercard']
  return ['visa', 'mastercard'].filter((m) => t.includes(m === 'visa' ? 'visa' : 'master'))
}

export default function LogosTarjetas({ texto, grande = false, className = '' }) {
  const marcas = marcasEn(texto)
  if (marcas.length === 0) return null

  return (
    <span className={`inline-flex shrink-0 items-center gap-1 align-middle ${className}`}>
      {marcas.map((m) => (
        <span
          key={m}
          className={`inline-flex items-center justify-center rounded-md border border-line bg-white ${
            grande ? 'h-7 w-11' : 'h-5 w-8'
          }`}
        >
          <img
            src={LOGOS[m].src}
            alt={LOGOS[m].alt}
            className={`w-auto ${grande ? LOGOS[m].altoGrande : LOGOS[m].alto}`}
          />
        </span>
      ))}
    </span>
  )
}
