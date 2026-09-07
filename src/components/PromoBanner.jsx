import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function PromoBanner({ promociones }) {
  const activas = promociones.filter((p) => p.activo)
  const [i, setI] = useState(0)

  useEffect(() => {
    if (activas.length < 2) return
    const id = setInterval(() => setI((prev) => (prev + 1) % activas.length), 4500)
    return () => clearInterval(id)
  }, [activas.length])

  if (activas.length === 0) return null

  const promo = activas[i % activas.length]

  return (
    <div className="relative overflow-hidden bg-wine-800 text-wine-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_140%_at_50%_0%,rgba(255,255,255,0.14),transparent)]" />
      <div className="relative mx-auto flex h-11 max-w-6xl items-center justify-center gap-2 px-5 text-sm">
        <Sparkles size={14} className="shrink-0 text-wine-300" />
        <AnimatePresence mode="wait">
          <motion.p
            key={promo.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="truncate text-center"
          >
            <strong className="font-semibold">{promo.titulo}</strong>
            {promo.descripcion ? (
              <span className="text-wine-200"> — {promo.descripcion}</span>
            ) : null}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
