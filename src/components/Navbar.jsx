import { AnimatePresence, motion } from 'framer-motion'
import { Menu, MessageCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { linkWhatsapp } from '../config'
import Logo from './Logo'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/promociones', label: 'Promociones' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-line/80 bg-cream/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-cream/40 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <NavLink to="/" className="focus-ring group flex items-center gap-2.5 rounded-full">
          <Logo
            size={38}
            className="text-wine-600 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-110 group-hover:-rotate-6"
          />
          <span className="font-display text-xl leading-none font-semibold tracking-tight text-ink">
            Óptica <span className="text-wine-600">A.M.E.N.</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `focus-ring relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'text-wine-700' : 'text-ink-soft hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-wine-100"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </>
              )}
            </NavLink>
          ))}

          <a
            href={linkWhatsapp('¡Hola! Quería hacerles una consulta.')}
            target="_blank"
            rel="noreferrer"
            className="focus-ring ml-2 flex items-center gap-1.5 rounded-full bg-wine-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-wine-700 hover:shadow-[var(--shadow-lift)]"
          >
            <MessageCircle size={15} />
            Consultar
          </a>
        </nav>

        <button
          className="focus-ring rounded-full p-2 text-ink transition-colors hover:bg-wine-50 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-cream/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-3">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? 'bg-wine-100 text-wine-700' : 'text-ink-soft hover:bg-wine-50'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <a
                href={linkWhatsapp('¡Hola! Quería hacerles una consulta.')}
                target="_blank"
                rel="noreferrer"
                className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-wine-600 px-3 py-2.5 text-sm font-semibold text-white"
              >
                <MessageCircle size={15} />
                Consultar por WhatsApp
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
