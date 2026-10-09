import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// Inclina el contenido en 3D siguiendo al mouse (estilo "3D Card" de
// Aceternity). En pantallas táctiles no hay hover, así que queda quieto.
export default function Tilt({ children, max = 7, className = '' }) {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const resorte = { stiffness: 220, damping: 22 }
  const rotateX = useSpring(useTransform(y, [0, 1], [max, -max]), resorte)
  const rotateY = useSpring(useTransform(x, [0, 1], [-max, max]), resorte)
  const brilloX = useTransform(x, [0, 1], ['0%', '100%'])
  const brilloY = useTransform(y, [0, 1], ['0%', '100%'])
  const brillo = useTransform(
    [brilloX, brilloY],
    ([bx, by]) => `radial-gradient(circle at ${bx} ${by}, rgba(255,255,255,0.22), transparent 55%)`,
  )

  function mover(e) {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width)
    y.set((e.clientY - r.top) / r.height)
  }

  function salir() {
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <motion.div
        onPointerMove={mover}
        onPointerLeave={salir}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group/tilt relative h-full"
      >
        {children}
        {/* Reflejo de luz que sigue al cursor. */}
        <motion.div
          aria-hidden
          style={{ background: brillo }}
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
        />
      </motion.div>
    </div>
  )
}
