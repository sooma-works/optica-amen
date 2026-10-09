import { motion } from 'framer-motion'

// Texto que entra palabra por palabra, pasando de desenfocado a nítido.
// Inspirado en el BlurText de React Bits, hecho con framer-motion para no
// sumar dependencias.
export default function BlurText({ text, delay = 0, step = 0.09, className = '' }) {
  const palabras = text.split(' ')
  return (
    <span className={className}>
      {palabras.map((palabra, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(12px)', y: 14 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.7, delay: delay + i * step, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block will-change-[filter,transform]"
        >
          {palabra}
          {i < palabras.length - 1 && ' '}
        </motion.span>
      ))}
    </span>
  )
}
