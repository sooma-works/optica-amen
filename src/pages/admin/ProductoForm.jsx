import { ArrowLeft, ArrowRight, ImagePlus, Link2, Loader2, Smartphone, Star, X } from 'lucide-react'
import { useRef, useState } from 'react'
import Modal from '../../components/Modal'
import ProductCard from '../../components/ProductCard'
import { btnGhost, btnPrimary, inputClass, labelClass } from '../../components/ui'
import { subirImagen } from '../../lib/backend'
import { formatPrecio } from '../../lib/format'
import { imagenesDe } from '../../lib/imagenes'

const ayudaClass = 'text-xs font-normal text-ink-soft'

function aForm(p, categorias) {
  return {
    id: p.id ?? '',
    orden: p.orden,
    categoriaId: p.categoriaId ?? categorias[0]?.id ?? '',
    titulo: p.titulo ?? '',
    marca: p.marca ?? '',
    precio: p.precio ?? '',
    precioAnterior: p.precioAnterior ?? '',
    cuotasCantidad: p.cuotas?.cantidad ?? '',
    cuotasTarjeta: p.cuotas?.tarjeta ?? '',
    descripcion: p.descripcion ?? '',
    imagenes: imagenesDe(p),
    destacado: p.destacado ?? false,
    activo: p.activo ?? true,
  }
}

function aProducto(f) {
  return {
    id: f.id,
    orden: f.orden,
    categoriaId: f.categoriaId,
    titulo: f.titulo.trim(),
    marca: f.marca.trim(),
    precio: Number(f.precio) || 0,
    precioAnterior: f.precioAnterior ? Number(f.precioAnterior) : null,
    cuotas: f.cuotasCantidad
      ? { cantidad: Number(f.cuotasCantidad), tarjeta: f.cuotasTarjeta.trim() || 'todas las tarjetas' }
      : null,
    descripcion: f.descripcion.trim(),
    imagenes: f.imagenes,
    destacado: f.destacado,
    activo: f.activo,
  }
}

function Fotos({ imagenes, onChange }) {
  const inputRef = useRef(null)
  const [subiendo, setSubiendo] = useState(0)
  const [error, setError] = useState('')
  const [encima, setEncima] = useState(false)
  const [link, setLink] = useState('')

  async function agregarArchivos(files) {
    const fotos = [...files].filter((f) => f.type.startsWith('image/'))
    if (!fotos.length) return
    setError('')
    setSubiendo(fotos.length)
    try {
      const urls = []
      for (const f of fotos) {
        urls.push(await subirImagen(f))
        setSubiendo((n) => n - 1)
      }
      onChange([...imagenes, ...urls])
    } catch {
      setError('No se pudo subir la foto. Probá de nuevo o con otra imagen.')
    } finally {
      setSubiendo(0)
    }
  }

  function mover(i, paso) {
    const lista = [...imagenes]
    const [foto] = lista.splice(i, 1)
    lista.splice(i + paso, 0, foto)
    onChange(lista)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-ink">Fotos</span>
        <span className={ayudaClass}>La primera es la portada</span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {imagenes.map((src, i) => (
          <div key={src.slice(0, 80) + i} className="group relative aspect-square overflow-hidden rounded-xl bg-wine-50">
            <img src={src} alt="" className="h-full w-full object-cover" />
            {i === 0 && (
              <span className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded-full bg-wine-600 px-2 py-0.5 text-[10px] font-bold text-white">
                <Star size={9} className="fill-white" /> Portada
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange(imagenes.filter((_, j) => j !== i))}
              aria-label="Quitar foto"
              className="absolute top-1.5 right-1.5 rounded-full bg-black/55 p-1 text-white transition-colors hover:bg-red-600"
            >
              <X size={13} />
            </button>
            {imagenes.length > 1 && (
              <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => mover(i, -1)}
                  aria-label="Mover antes"
                  className="rounded-full bg-white/90 p-1 text-ink shadow disabled:invisible"
                >
                  <ArrowLeft size={13} />
                </button>
                <button
                  type="button"
                  disabled={i === imagenes.length - 1}
                  onClick={() => mover(i, 1)}
                  aria-label="Mover después"
                  className="rounded-full bg-white/90 p-1 text-ink shadow disabled:invisible"
                >
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        ))}

        {Array.from({ length: subiendo }).map((_, i) => (
          <div key={`subiendo-${i}`} className="flex aspect-square items-center justify-center rounded-xl bg-wine-50 text-wine-400">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => (e.preventDefault(), setEncima(true))}
          onDragLeave={() => setEncima(false)}
          onDrop={(e) => {
            e.preventDefault()
            setEncima(false)
            agregarArchivos(e.dataTransfer.files)
          }}
          className={`focus-ring flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-1 text-center text-xs font-semibold transition-colors ${
            encima ? 'border-wine-500 bg-wine-50 text-wine-700' : 'border-line text-ink-soft hover:border-wine-300 hover:text-wine-700'
          }`}
        >
          <ImagePlus size={20} />
          Agregar fotos
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          agregarArchivos(e.target.files)
          e.target.value = ''
        }}
      />
      <p className={`${ayudaClass} flex items-center gap-1.5`}>
        <Smartphone size={13} /> Desde el celular podés sacar la foto en el momento. Se achican
        solas para que el sitio cargue rápido.
      </p>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}

      <details className="text-xs text-ink-soft">
        <summary className="cursor-pointer font-medium hover:text-ink">O pegar el link de una foto</summary>
        <div className="mt-2 flex gap-2">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://…"
            className={`${inputClass} flex-1`}
          />
          <button
            type="button"
            disabled={!link.trim()}
            onClick={() => {
              onChange([...imagenes, link.trim()])
              setLink('')
            }}
            className={`${btnGhost} flex items-center gap-1 disabled:opacity-40`}
          >
            <Link2 size={14} /> Agregar
          </button>
        </div>
      </details>
    </div>
  )
}

function Formulario({ producto, categorias, onClose, onGuardar }) {
  const [form, setForm] = useState(() => aForm(producto, categorias))
  const [guardando, setGuardando] = useState(false)
  const [errorGuardar, setErrorGuardar] = useState('')
  const [verPreview, setVerPreview] = useState(false)

  const set = (campo) => (e) =>
    setForm((f) => ({ ...f, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  async function enviar(e) {
    e.preventDefault()
    setGuardando(true)
    setErrorGuardar('')
    try {
      await onGuardar(aProducto(form))
    } catch {
      setErrorGuardar('No se pudo guardar. Revisá la conexión y probá de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  const preview = (
    <div className="pointer-events-none mx-auto w-full max-w-[320px] select-none">
      <ProductCard producto={aProducto(form)} preview />
    </div>
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <form onSubmit={enviar} className="grid grid-cols-2 gap-4">
        {/* En el celular la vista previa se abre con un botón para no alargar
            el formulario. */}
        <button
          type="button"
          onClick={() => setVerPreview((v) => !v)}
          className="col-span-2 rounded-xl bg-wine-50 px-4 py-2.5 text-sm font-semibold text-wine-700 lg:hidden"
        >
          {verPreview ? 'Ocultar vista previa' : 'Ver cómo queda en el sitio'}
        </button>
        {verPreview && <div className="col-span-2 lg:hidden">{preview}</div>}

        <label className={`col-span-2 ${labelClass}`}>
          Nombre del producto
          <input required value={form.titulo} onChange={set('titulo')} placeholder="Ej: Aviador Clásico" className={inputClass} />
        </label>
        <label className={labelClass}>
          Marca
          <input value={form.marca} onChange={set('marca')} placeholder="Ej: Ray-Ban" className={inputClass} />
        </label>
        <label className={labelClass}>
          Categoría
          <select value={form.categoriaId} onChange={set('categoriaId')} className={inputClass}>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.titulo}
              </option>
            ))}
          </select>
        </label>

        <div className="col-span-2">
          <Fotos imagenes={form.imagenes} onChange={(imagenes) => setForm((f) => ({ ...f, imagenes }))} />
        </div>

        <label className={labelClass}>
          Precio
          <input
            type="number"
            inputMode="numeric"
            min="0"
            required
            value={form.precio}
            onChange={set('precio')}
            placeholder="Ej: 145000"
            className={inputClass}
          />
          <span className={ayudaClass}>{form.precio ? `Se ve así: ${formatPrecio(Number(form.precio))}` : 'Sin puntos ni $'}</span>
        </label>
        <label className={labelClass}>
          Precio anterior
          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={form.precioAnterior}
            onChange={set('precioAnterior')}
            placeholder="Opcional"
            className={inputClass}
          />
          <span className={ayudaClass}>Si lo completás, aparece tachado con el % de descuento</span>
        </label>
        <label className={labelClass}>
          Cuotas sin interés
          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={form.cuotasCantidad}
            onChange={set('cuotasCantidad')}
            placeholder="Ej: 3"
            className={inputClass}
          />
          <span className={ayudaClass}>Dejalo vacío si no tiene cuotas</span>
        </label>
        <label className={labelClass}>
          Con qué tarjetas
          <input
            value={form.cuotasTarjeta}
            onChange={set('cuotasTarjeta')}
            placeholder="todas las tarjetas"
            className={inputClass}
          />
        </label>
        <label className={`col-span-2 ${labelClass}`}>
          Descripción
          <textarea
            rows={3}
            value={form.descripcion}
            onChange={set('descripcion')}
            placeholder="Material, color, para quién es, qué incluye…"
            className={`${inputClass} resize-none`}
          />
        </label>

        <label className="col-span-2 flex cursor-pointer items-start gap-3 rounded-xl bg-cream/70 px-4 py-3 text-sm transition-colors hover:bg-wine-50 sm:col-span-1">
          <input type="checkbox" checked={form.destacado} onChange={set('destacado')} className="mt-0.5 h-4 w-4 accent-wine-600" />
          <span>
            <span className="font-medium text-ink">Destacado</span>
            <span className={`block ${ayudaClass}`}>Aparece en la página de inicio</span>
          </span>
        </label>
        <label className="col-span-2 flex cursor-pointer items-start gap-3 rounded-xl bg-cream/70 px-4 py-3 text-sm transition-colors hover:bg-wine-50 sm:col-span-1">
          <input type="checkbox" checked={form.activo} onChange={set('activo')} className="mt-0.5 h-4 w-4 accent-wine-600" />
          <span>
            <span className="font-medium text-ink">Visible en el sitio</span>
            <span className={`block ${ayudaClass}`}>Destildalo si no hay stock</span>
          </span>
        </label>

        {errorGuardar && (
          <p className="col-span-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
            {errorGuardar}
          </p>
        )}

        <div className="sticky -bottom-5 col-span-2 -mx-5 mt-2 flex justify-end gap-2 border-t border-line bg-white/95 px-5 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
          <button type="button" onClick={onClose} className={btnGhost}>
            Cancelar
          </button>
          <button type="submit" disabled={guardando} className={`${btnPrimary} min-w-28 disabled:opacity-60`}>
            {guardando ? <Loader2 size={16} className="animate-spin" /> : 'Guardar'}
          </button>
        </div>
      </form>

      <aside className="hidden lg:block">
        <div className="sticky top-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft/70">
            Así se ve en el sitio
          </p>
          {preview}
        </div>
      </aside>
    </div>
  )
}

export default function ProductoForm({ producto, categorias, onClose, onGuardar }) {
  return (
    <Modal
      open={Boolean(producto)}
      onClose={onClose}
      size="lg"
      title={producto?.id ? 'Editar producto' : 'Nuevo producto'}
    >
      {producto && (
        <Formulario
          key={producto.id || 'nuevo'}
          producto={producto}
          categorias={categorias}
          onClose={onClose}
          onGuardar={onGuardar}
        />
      )}
    </Modal>
  )
}
