import { motion } from 'framer-motion'
import { linkWhatsapp } from '../config'
import { WhatsappIcon } from './icons'

export default function WhatsappFab() {
  return (
    <motion.a
      href={linkWhatsapp('¡Hola! Quería hacerles una consulta.')}
      target="_blank"
      rel="noreferrer"
      aria-label="Consultar por WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="focus-ring group fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 sm:bottom-7 sm:right-7"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20" />
      <WhatsappIcon size={28} className="relative" />
    </motion.a>
  )
}
