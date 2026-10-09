import { ChevronsLeftRight } from 'lucide-react'
import { useRef, useState } from 'react'

// Comparador antes/después con una barra que se arrastra (estilo "Compare"
// de Aceternity). Funciona con mouse, dedo y teclado (flechas).
export default function Compare({ antes, despues, etiquetaAntes, etiquetaDespues, className = '' }) {
  const [pct, setPct] = useState(50)
  const ref = useRef(null)
  const arrastrando = useRef(false)

  function mover(clientX) {
    const r = ref.current.getBoundingClientRect()
    setPct(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }

  return (
    <div
      ref={ref}
      onPointerDown={(e) => {
        arrastrando.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        mover(e.clientX)
      }}
      onPointerMove={(e) => arrastrando.current && mover(e.clientX)}
      onPointerUp={() => (arrastrando.current = false)}
      className={`relative cursor-ew-resize touch-pan-y overflow-hidden select-none ${className}`}
    >
      <div className="absolute inset-0">{despues}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
        {antes}
      </div>

      <span className="absolute top-4 left-4 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        {etiquetaAntes}
      </span>
      <span className="absolute top-4 right-4 rounded-full bg-wine-600/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        {etiquetaDespues}
      </span>

      <div className="absolute inset-y-0 w-0.5 bg-white/90" style={{ left: `${pct}%` }}>
        <button
          type="button"
          role="slider"
          aria-label="Comparar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setPct((p) => Math.max(0, p - 5))
            if (e.key === 'ArrowRight') setPct((p) => Math.min(100, p + 5))
          }}
          className="focus-ring absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-wine-700 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.45)]"
        >
          <ChevronsLeftRight size={20} />
        </button>
      </div>
    </div>
  )
}
