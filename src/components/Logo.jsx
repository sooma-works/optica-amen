export default function Logo({ size = 40, variant = 'solid', className = '' }) {
  const esSolido = variant === 'solid'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Óptica A.M.E.N."
      className={className}
    >
      {esSolido && <circle cx="50" cy="50" r="50" fill="currentColor" />}
      <g
        fill="none"
        stroke={esSolido ? 'white' : 'currentColor'}
        strokeWidth="4"
        strokeLinecap="round"
      >
        <circle cx="31" cy="63" r="15" />
        <circle cx="69" cy="63" r="15" />
        <path d="M46 61 Q50 56 54 61" />
        <path d="M25 51 C 23 33 33 23 46 26" />
        <path d="M75 51 C 77 33 67 23 54 26" />
      </g>
    </svg>
  )
}
