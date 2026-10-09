import { Reorder, useDragControls } from 'framer-motion'
import {
  Eye,
  EyeOff,
  GripVertical,
  Pencil,
  Percent,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useToast } from '../../components/admin/toastContext'
import { btnGhost, btnPrimary, iconBtn } from '../../components/ui'
import {
  deleteProducto,
  listCategorias,
  listProductos,
  reordenarProductos,
  saveProducto,
} from '../../lib/backend'
import { formatPrecio } from '../../lib/format'
import { imagenesDe, imgAncho } from '../../lib/imagenes'
import PreciosMasivos from './PreciosMasivos'
import ProductoForm from './ProductoForm'

function FilaProducto({ producto, categoria, puedeOrdenar, onEditar, onToggle, onEliminar, onSoltar }) {
  const controles = useDragControls()
  const portada = imagenesDe(producto)[0]

  return (
    <Reorder.Item
      value={producto}
      dragListener={false}
      dragControls={controles}
      onDragEnd={onSoltar}
      className={`relative flex items-center gap-3 rounded-2xl border bg-white p-3 shadow-[var(--shadow-soft)] transition-colors sm:gap-4 sm:p-3.5 ${
        producto.activo ? 'border-line' : 'border-dashed border-line bg-white/60'
      }`}
      whileDrag={{ scale: 1.02, boxShadow: '0 20px 40px -12px rgba(77,14,16,0.3)' }}
    >
      {puedeOrdenar && (
        // El arrastre arranca solo desde la manija: así en el celular se
        // puede seguir scrolleando la lista tocando cualquier otra parte.
        <button
          onPointerDown={(e) => controles.start(e)}
          aria-label="Arrastrar para cambiar el orden"
          title="Arrastrar para cambiar el orden"
          className="-mx-1 shrink-0 cursor-grab touch-none rounded-lg p-1.5 text-ink-soft/40 transition-colors hover:bg-wine-50 hover:text-wine-600 active:cursor-grabbing"
        >
          <GripVertical size={18} />
        </button>
      )}

      <button onClick={onEditar} className="focus-ring shrink-0 rounded-xl" aria-label={`Editar ${producto.titulo}`}>
        {portada ? (
          <img
            src={imgAncho(portada, 160)}
            alt=""
            className={`h-14 w-14 rounded-xl object-cover sm:h-16 sm:w-16 ${producto.activo ? '' : 'opacity-50 grayscale'}`}
          />
        ) : (
          <span className="block h-14 w-14 rounded-xl bg-wine-50 sm:h-16 sm:w-16" />
        )}
      </button>

      <button onClick={onEditar} className="focus-ring min-w-0 flex-1 rounded-lg text-left">
        <p className="line-clamp-2 leading-snug font-semibold text-ink sm:truncate">{producto.titulo}</p>
        <p className="truncate text-xs text-ink-soft">
          {producto.marca}
          {categoria && <span className="hidden text-ink-soft/60 sm:inline"> · {categoria.titulo}</span>}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-ink sm:hidden">{formatPrecio(producto.precio)}</p>
      </button>

      <p className="hidden w-28 shrink-0 text-right font-semibold text-ink sm:block">
        {formatPrecio(producto.precio)}
        {producto.precioAnterior > producto.precio && (
          <span className="block text-xs font-normal text-ink-soft/60 line-through">
            {formatPrecio(producto.precioAnterior)}
          </span>
        )}
      </p>

      <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
        <button
          onClick={() => onToggle('destacado')}
          aria-label={producto.destacado ? 'Quitar de destacados' : 'Destacar en el inicio'}
          title={producto.destacado ? 'Quitar de destacados' : 'Destacar en el inicio'}
          className={iconBtn}
        >
          <Star size={17} className={producto.destacado ? 'fill-amber-400 text-amber-500' : ''} />
        </button>
        <button
          onClick={() => onToggle('activo')}
          aria-label={producto.activo ? 'Ocultar del sitio' : 'Mostrar en el sitio'}
          title={producto.activo ? 'Visible en el sitio (tocá para ocultar)' : 'Oculto (tocá para mostrar)'}
          className={iconBtn}
        >
          {producto.activo ? <Eye size={17} /> : <EyeOff size={17} className="text-ink-soft/50" />}
        </button>
        <button onClick={onEditar} aria-label="Editar" className={`${iconBtn} hidden sm:block`}>
          <Pencil size={16} />
        </button>
        <button
          onClick={onEliminar}
          aria-label="Eliminar"
          className={`${iconBtn} hover:bg-red-50 hover:text-red-600`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </Reorder.Item>
  )
}

export default function ProductosAdmin() {
  const toast = useToast()
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(null) // producto, o {} para uno nuevo
  const [preciosAbierto, setPreciosAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')
  // Mientras se arrastra, la lista que se ve es la que va armando el usuario;
  // al soltar se guarda y se vuelve a la que sale de los filtros.
  const [enArrastre, setEnArrastre] = useState(null)
  const enArrastreRef = useRef(null)

  async function cargar() {
    const [p, c] = await Promise.all([listProductos(), listCategorias()])
    setProductos(p)
    setCategorias(c)
    setLoading(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    return productos.filter(
      (p) =>
        (categoriaFiltro === 'todas' || p.categoriaId === categoriaFiltro) &&
        (!texto || `${p.titulo} ${p.marca}`.toLowerCase().includes(texto)),
    )
  }, [productos, busqueda, categoriaFiltro])
  const visibles = enArrastre ?? filtrados

  function alReordenar(lista) {
    enArrastreRef.current = lista
    setEnArrastre(lista)
  }

  // Al soltar se guarda el orden. Si hay una categoría filtrada, sus productos
  // se reacomodan dentro de los lugares que ya ocupaban en la lista completa.
  async function guardarOrden() {
    const nuevos = enArrastreRef.current
    enArrastreRef.current = null
    if (!nuevos) return
    const idsVisibles = new Set(nuevos.map((p) => p.id))
    let i = 0
    const completa = productos.map((p) => (idsVisibles.has(p.id) ? nuevos[i++] : p))
    // Se muestra el orden nuevo al instante y se guarda en segundo plano.
    setProductos(completa)
    setEnArrastre(null)
    if (completa.every((p, idx) => p.id === productos[idx].id)) return
    setProductos(await reordenarProductos(completa.map((p) => p.id)))
    toast({ mensaje: 'Orden guardado. Así se ve en el catálogo.' })
  }

  async function toggle(p, campo) {
    await saveProducto({ ...p, [campo]: !p[campo] })
    await cargar()
    const mensajes = {
      activo: p.activo ? `"${p.titulo}" ya no se ve en el sitio` : `"${p.titulo}" vuelve a verse en el sitio`,
      destacado: p.destacado ? `"${p.titulo}" salió de destacados` : `"${p.titulo}" aparece en el inicio`,
    }
    toast({
      mensaje: mensajes[campo],
      deshacer: async () => {
        await saveProducto(p)
        cargar()
      },
    })
  }

  async function eliminar(p) {
    await deleteProducto(p.id)
    await cargar()
    toast({
      mensaje: `Eliminaste "${p.titulo}"`,
      deshacer: async () => {
        await saveProducto(p)
        cargar()
      },
    })
  }

  async function guardar(producto) {
    const esNuevo = !producto.id
    await saveProducto(producto)
    setEditando(null)
    await cargar()
    toast({ mensaje: esNuevo ? 'Producto creado ✓' : 'Cambios guardados ✓' })
  }

  if (loading) {
    return <div className="h-64 animate-pulse rounded-3xl border border-line bg-white" />
  }

  const puedeOrdenar = !busqueda.trim()
  const filtros = [{ id: 'todas', titulo: 'Todos' }, ...categorias]

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-ink">
          Productos <span className="text-ink-soft/50">({productos.length})</span>
        </h2>
        <div className="flex w-full gap-2 sm:w-auto">
          <button onClick={() => setPreciosAbierto(true)} className={`${btnGhost} flex flex-1 items-center justify-center gap-1.5 sm:flex-none`}>
            <Percent size={15} /> <span className="sm:hidden">Precios</span>
            <span className="hidden sm:inline">Actualizar precios</span>
          </button>
          <button onClick={() => setEditando({})} className={`${btnPrimary} flex-1 sm:flex-none`}>
            <Plus size={16} /> <span className="sm:hidden">Nuevo</span>
            <span className="hidden sm:inline">Nuevo producto</span>
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3">
        <label className="relative">
          <span className="sr-only">Buscar producto</span>
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-soft/60" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o marca…"
            className="focus-ring w-full rounded-full border border-line bg-white py-2.5 pr-10 pl-10 text-sm transition-colors focus:border-wine-400"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              aria-label="Borrar búsqueda"
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-ink-soft hover:bg-wine-50"
            >
              <X size={15} />
            </button>
          )}
        </label>
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
          {filtros.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoriaFiltro(c.id)}
              className={`focus-ring shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                categoriaFiltro === c.id
                  ? 'bg-ink text-white'
                  : 'border border-line bg-white text-ink-soft hover:border-wine-300'
              }`}
            >
              {c.titulo}
            </button>
          ))}
        </div>
        <p className="text-xs text-ink-soft">
          {puedeOrdenar ? (
            <>
              Arrastrá desde <GripVertical size={12} className="inline align-[-2px]" /> para cambiar
              el orden en el catálogo. <Star size={12} className="inline align-[-2px]" /> destaca el
              producto en el inicio y <Eye size={12} className="inline align-[-2px]" /> lo muestra u
              oculta.
            </>
          ) : (
            'Para cambiar el orden, borrá la búsqueda.'
          )}
        </p>
      </div>

      {visibles.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-white px-6 py-14 text-center text-sm text-ink-soft">
          No hay productos que coincidan.
        </div>
      ) : (
        <Reorder.Group axis="y" values={visibles} onReorder={alReordenar} className="flex flex-col gap-2.5">
          {visibles.map((p) => (
            <FilaProducto
              key={p.id}
              producto={p}
              categoria={categorias.find((c) => c.id === p.categoriaId)}
              puedeOrdenar={puedeOrdenar}
              onEditar={() => setEditando(p)}
              onToggle={(campo) => toggle(p, campo)}
              onEliminar={() => eliminar(p)}
              onSoltar={guardarOrden}
            />
          ))}
        </Reorder.Group>
      )}

      <ProductoForm
        producto={editando}
        categorias={categorias}
        onClose={() => setEditando(null)}
        onGuardar={guardar}
      />

      <PreciosMasivos
        open={preciosAbierto}
        onClose={() => setPreciosAbierto(false)}
        productos={productos}
        categorias={categorias}
        onAplicado={cargar}
      />
    </div>
  )
}
