import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Undo2 } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { ToastContext } from './toastContext'

// Avisos cortos abajo de la pantalla ("Guardado", "Producto eliminado ·
// Deshacer"). Reemplazan a los confirm() del navegador: en vez de preguntar
// antes, se hace y se ofrece volver atrás.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const contador = useRef(0)

  const cerrar = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  const mostrar = useCallback(
    ({ mensaje, deshacer, duracion = deshacer ? 7000 : 3000 }) => {
      const id = ++contador.current
      setToasts((t) => [...t.slice(-2), { id, mensaje, deshacer, duracion }])
      setTimeout(() => cerrar(id), duracion)
    },
    [cerrar],
  )

  return (
    <ToastContext.Provider value={mostrar}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] sm:bottom-4 flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              role="status"
              className="pointer-events-auto relative flex w-full max-w-md items-center gap-3 overflow-hidden rounded-2xl bg-ink py-3 pr-2 pl-4 text-sm text-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)]"
            >
              <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
              <p className="flex-1">{t.mensaje}</p>
              {t.deshacer && (
                <button
                  onClick={() => {
                    t.deshacer()
                    cerrar(t.id)
                  }}
                  className="focus-ring flex shrink-0 items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 font-semibold transition-colors hover:bg-white/20"
                >
                  <Undo2 size={15} /> Deshacer
                </button>
              )}
              <motion.span
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: t.duracion / 1000, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-white/30"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
