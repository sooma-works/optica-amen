import { ArrowRight, Loader2, TrendingDown, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useToast } from '../../components/admin/toastContext'
import Modal from '../../components/Modal'
import { btnGhost, btnPrimary, inputClass, labelClass } from '../../components/ui'
import { saveProductos } from '../../lib/backend'
import { formatPrecio } from '../../lib/format'

const ATAJOS = [5, 10, 15, 20, -10]
const REDONDEOS = [
  { valor: 1, texto: 'Sin redondear' },
  { valor: 100, texto: 'A los $100' },
  { valor: 500, texto: 'A los $500' },
  { valor: 1000, texto: 'A los $1.000' },
]

function ajustar(precio, porcentaje, redondeo) {
  if (precio == null) return precio
  return Math.round((precio * (1 + porcentaje / 100)) / redondeo) * redondeo
}

function Contenido({ productos, categorias, onClose, onAplicado }) {
  const toast = useToast()
  const [alcance, setAlcance] = useState('todos')
  const [porcentaje, setPorcentaje] = useState('10')
  const [redondeo, setRedondeo] = useState(100)
  const [tachado, setTachado] = useState(true)
  const [aplicando, setAplicando] = useState(false)

  const marcas = useMemo(
    () => [...new Set(productos.map((p) => p.marca).filter(Boolean))].sort(),
    [productos],
  )

  const pct = Number(porcentaje) || 0
  const afectados = productos.filter((p) => {
    if (alcance === 'todos') return true
    const [tipo, valor] = alcance.split(':')
    return tipo === 'cat' ? p.categoriaId === valor : p.marca === valor
  })
  const cambios = afectados.map((p) => ({
    antes: p,
    despues: {
      ...p,
      precio: ajustar(p.precio, pct, redondeo),
      precioAnterior: tachado ? ajustar(p.precioAnterior, pct, redondeo) : p.precioAnterior,
    },
  }))

  async function aplicar() {
    setAplicando(true)
    await saveProductos(cambios.map((c) => c.despues))
    await onAplicado()
    onClose()
    toast({
      mensaje: `Actualizaste ${cambios.length} ${cambios.length === 1 ? 'precio' : 'precios'} (${pct > 0 ? '+' : ''}${pct}%)`,
      deshacer: async () => {
        await saveProductos(cambios.map((c) => c.antes))
        onAplicado()
      },
    })
  }

  const sube = pct >= 0

  return (
    <div className="flex flex-col gap-5">
      <label className={labelClass}>
        ¿A qué productos?
        <select value={alcance} onChange={(e) => setAlcance(e.target.value)} className={inputClass}>
          <option value="todos">Todos los productos ({productos.length})</option>
          <optgroup label="Por categoría">
            {categorias.map((c) => (
              <option key={c.id} value={`cat:${c.id}`}>
                {c.titulo}
              </option>
            ))}
          </optgroup>
          <optgroup label="Por marca">
            {marcas.map((m) => (
              <option key={m} value={`marca:${m}`}>
                {m}
              </option>
            ))}
          </optgroup>
        </select>
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink">¿Cuánto?</span>
        <div className="flex flex-wrap items-center gap-2">
          {ATAJOS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setPorcentaje(String(a))}
              className={`focus-ring rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                pct === a ? 'bg-ink text-white' : 'border border-line bg-white text-ink-soft hover:border-wine-300'
              }`}
            >
              {a > 0 ? '+' : ''}
              {a}%
            </button>
          ))}
          <label className="flex items-center gap-1.5 text-sm text-ink-soft">
            Otro:
            <input
              type="number"
              inputMode="decimal"
              value={porcentaje}
              onChange={(e) => setPorcentaje(e.target.value)}
              className={`${inputClass} w-20 py-2 text-center`}
            />
            %
          </label>
        </div>
        <p className="text-xs text-ink-soft">Usá un número negativo para bajar precios (ej: -10).</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Redondear
          <select value={redondeo} onChange={(e) => setRedondeo(Number(e.target.value))} className={inputClass}>
            {REDONDEOS.map((r) => (
              <option key={r.valor} value={r.valor}>
                {r.texto}
              </option>
            ))}
          </select>
        </label>
        <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl bg-cream/70 px-4 py-3 text-sm">
          <input type="checkbox" checked={tachado} onChange={(e) => setTachado(e.target.checked)} className="h-4 w-4 accent-wine-600" />
          También ajustar el precio tachado
        </label>
      </div>

      <div>
        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
          {sube ? <TrendingUp size={16} className="text-emerald-600" /> : <TrendingDown size={16} className="text-red-600" />}
          Así van a quedar ({cambios.length})
        </p>
        <ul className="max-h-60 divide-y divide-line overflow-y-auto rounded-2xl border border-line">
          {cambios.map(({ antes, despues }) => (
            <li key={antes.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
              <span className="min-w-0 truncate text-ink">{antes.titulo}</span>
              <span className="flex shrink-0 items-center gap-2 tabular-nums">
                <span className="text-ink-soft/70 line-through">{formatPrecio(antes.precio)}</span>
                <ArrowRight size={13} className="text-ink-soft/50" />
                <span className="font-semibold text-ink">{formatPrecio(despues.precio)}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className={btnGhost}>
          Cancelar
        </button>
        <button
          type="button"
          onClick={aplicar}
          disabled={!pct || cambios.length === 0 || aplicando}
          className={`${btnPrimary} disabled:opacity-50`}
        >
          {aplicando ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            `Actualizar ${cambios.length} ${cambios.length === 1 ? 'producto' : 'productos'}`
          )}
        </button>
      </div>
    </div>
  )
}

export default function PreciosMasivos({ open, onClose, ...props }) {
  return (
    <Modal open={open} onClose={onClose} title="Actualizar precios">
      {open && <Contenido onClose={onClose} {...props} />}
    </Modal>
  )
}
