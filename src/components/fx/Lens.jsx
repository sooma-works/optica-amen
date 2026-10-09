import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

// Lupa que sigue al cursor sobre una foto (estilo "Lens" de Aceternity).
// Solo con mouse: en celular el toque abre la galería.
export default function Lens({ src, alt, zoom = 2.2, size = 190, className = '', onClick }) {
  const [pos, setPos] = useState(null)

  function mover(e) {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height })
  }

  return (
    <div
      onPointerMove={mover}
      onPointerLeave={() => setPos(null)}
      onClick={onClick}
      className={`relative cursor-zoom-in overflow-hidden ${className}`}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      <AnimatePresence>
        {pos && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18 }}
            className="pointer-events-none absolute rounded-full border-2 border-white/90 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)]"
            style={{
              width: size,
              height: size,
              left: pos.x - size / 2,
              top: pos.y - size / 2,
              backgroundImage: `url("${src}")`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${pos.w * zoom}px ${pos.h * zoom}px`,
              backgroundPosition: `${-(pos.x * zoom - size / 2)}px ${-(pos.y * zoom - size / 2)}px`,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
