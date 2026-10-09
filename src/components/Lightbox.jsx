import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

// Galería a pantalla completa. Se pasa de foto con flechas, teclado o
// deslizando el dedo; Esc o tocar afuera la cierra.
export default function Lightbox({ imagenes, indice, onClose, titulo }) {
  const abierto = indice != null
  const [actual, setActual] = useState(indice ?? 0)
  const [direccion, setDireccion] = useState(0)
  const [indicePrevio, setIndicePrevio] = useState(indice)

  // Al abrir en otra foto se arranca desde esa (sin efecto: se ajusta el
  // estado durante el render, como recomienda React).
  if (indice !== indicePrevio) {
    setIndicePrevio(indice)
    if (indice != null) setActual(indice)
  }

  const total = imagenes.length
  const ir = useCallback(
    (paso) => {
      setDireccion(paso)
      setActual((i) => (i + paso + total) % total)
    },
    [total],
  )

  useEffect(() => {
    if (!abierto) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') ir(1)
      if (e.key === 'ArrowLeft') ir(-1)
    }
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = overflowPrevio
      window.removeEventListener('keydown', onKey)
    }
  }, [abierto, onClose, ir])

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Fotos de ${titulo}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex flex-col bg-[#120a0b]/95 backdrop-blur-md"
        >
          <div className="flex items-center justify-between px-5 py-4 text-white">
            <p className="text-sm font-medium text-white/70">
              <span className="font-semibold text-white">{titulo}</span> · {actual + 1} / {total}
            </p>
            <button
              onClick={onClose}
              aria-label="Cerrar galería"
              className="focus-ring rounded-full bg-white/10 p-2.5 transition-colors hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden" onClick={onClose}>
            <AnimatePresence initial={false} custom={direccion} mode="popLayout">
              <motion.img
                key={actual}
                src={imagenes[actual]}
                alt={`${titulo} — foto ${actual + 1}`}
                custom={direccion}
                variants={{
                  entra: (d) => ({ x: d >= 0 ? 80 : -80, opacity: 0 }),
                  centro: { x: 0, opacity: 1 },
                  sale: (d) => ({ x: d >= 0 ? -80 : 80, opacity: 0 }),
                }}
                initial="entra"
                animate="centro"
                exit="sale"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                drag={total > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) ir(1)
                  else if (info.offset.x > 60) ir(-1)
                }}
                onClick={(e) => e.stopPropagation()}
                className="max-h-full max-w-full cursor-grab rounded-2xl object-contain px-4 active:cursor-grabbing sm:max-w-[85vw]"
                draggable={false}
              />
            </AnimatePresence>

            {total > 1 && (
              <>
                <button
                  onClick={(e) => (e.stopPropagation(), ir(-1))}
                  aria-label="Foto anterior"
                  className="focus-ring absolute left-3 hidden rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25 sm:block"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => (e.stopPropagation(), ir(1))}
                  aria-label="Foto siguiente"
                  className="focus-ring absolute right-3 hidden rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25 sm:block"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {total > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto px-5 py-5">
              {imagenes.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => {
                    setDireccion(i > actual ? 1 : -1)
                    setActual(i)
                  }}
                  aria-label={`Ver foto ${i + 1}`}
                  className={`focus-ring h-14 w-14 shrink-0 overflow-hidden rounded-xl transition-all duration-200 sm:h-16 sm:w-16 ${
                    i === actual ? 'opacity-100 ring-2 ring-white' : 'opacity-45 hover:opacity-80'
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
