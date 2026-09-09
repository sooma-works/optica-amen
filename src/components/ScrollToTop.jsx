import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router no reposiciona el scroll al cambiar de ruta: sin esto, si
// entrás a otra página desde el menú estando scrolleado, la nueva página
// arranca a la misma altura y caés en el medio del contenido.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // Los links con ancla (#ubicacion) apuntan a una sección concreta:
    // ahí queremos ir al elemento, no al principio.
    if (hash) {
      try {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      } catch {
        // hash inválido como selector: lo ignoramos y no tocamos el scroll.
      }
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}
