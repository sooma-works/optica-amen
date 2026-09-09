// Isotipo oficial de Óptica A.M.E.N. (kit de marca completo en public/brand/).
// El trazo usa currentColor, así que el color lo define el contenedor con una
// clase de texto, igual que el resto de los íconos.
//
//   variant="solid"   → disco lleno con la marca calada en crema (navbar, panel)
//   variant="outline" → solo la marca, sin fondo (footer)
//   variant="sello"   → la marca dentro de un aro fino (hero)
//
// El rediseño usa dos grosores distintos: los aros de los lentes van más
// gruesos que las patillas y el puente. Por eso `grosor` es un par de valores
// y no uno solo — igualarlos aplana el dibujo.

const PAPEL = '#FDF8F5'

function Marca({ trazo, aro, varilla, escala, x, y, tip }) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${escala})`}
      fill="none"
      stroke={trazo}
      strokeLinecap="round"
    >
      <g strokeWidth={aro}>
        <circle cx="198" cy="297" r="53" />
        <circle cx="305" cy="300" r="38" />
      </g>
      <path d="M248 279.3 L 273.1 279.3" strokeWidth={varilla} strokeLinecap="butt" />
      <g strokeWidth={varilla}>
        <path d="M157.4 262.9 C 194.7 218.5 218 160 248 142" />
        <path d="M341.7 290.2 C 328.2 239.9 313 190 275 164" />
      </g>
      <g fill={trazo} stroke="none">
        <ellipse cx="248" cy="142" rx={tip} ry={tip * 0.679} transform="rotate(-30 248 142)" />
        <ellipse cx="275" cy="164" rx={tip} ry={tip * 0.679} transform="rotate(38 275 164)" />
      </g>
    </g>
  )
}

// Encuadres tomados del kit: cada variante trae la escala con la que fue
// dibujada, para que la marca respire igual que en los archivos originales.
const ENCUADRE = {
  solid: { escala: 1.1909, x: -34.58, y: -34.88, aro: 8.5, varilla: 5, tip: 7.8 },
  outline: { escala: 2.0455, x: -243.09, y: -243.6, aro: 8.5, varilla: 5, tip: 7.8 },
  sello: { escala: 1.0545, x: -1.31, y: -1.57, aro: 8.5, varilla: 5, tip: 7.8 },
}

export default function Logo({ size = 40, variant = 'solid', className = '' }) {
  const enc = ENCUADRE[variant] ?? ENCUADRE.solid
  const esSolido = variant === 'solid'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      role="img"
      aria-label="Óptica A.M.E.N."
      className={className}
    >
      {esSolido && <circle cx="256" cy="256" r="256" fill="currentColor" />}
      {variant === 'sello' && (
        <circle cx="256" cy="256" r="250" fill="none" stroke="currentColor" strokeWidth="7" />
      )}
      <Marca trazo={esSolido ? PAPEL : 'currentColor'} {...enc} />
    </svg>
  )
}
