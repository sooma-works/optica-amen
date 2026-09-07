import { motion } from 'framer-motion'
import { Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Modal from '../../components/Modal'
import { btnGhost, btnPrimary, iconBtn, inputClass, labelClass } from '../../components/ui'
import {
  deleteProducto,
  listCategorias,
  listProductos,
  saveProducto,
} from '../../lib/backend'
import { formatPrecio } from '../../lib/format'

const vacio = {
  id: '',
  categoriaId: '',
  titulo: '',
  marca: '',
  precio: '',
  precioAnterior: '',
  cuotasCantidad: '',
  cuotasTarjeta: '',
  descripcion: '',
  imagen: '',
  destacado: false,
  activo: true,
}

export default function ProductosAdmin() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)

  async function cargar() {
    const [p, c] = await Promise.all([listProductos(), listCategorias()])
    setProductos(p)
    setCategorias(c)
    setLoading(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  function abrirEdicion(p) {
    setForm({
      id: p.id,
      categoriaId: p.categoriaId,
      titulo: p.titulo,
      marca: p.marca,
      precio: p.precio,
      precioAnterior: p.precioAnterior ?? '',
      cuotasCantidad: p.cuotas?.cantidad ?? '',
      cuotasTarjeta: p.cuotas?.tarjeta ?? '',
      descripcion: p.descripcion,
      imagen: p.imagen,
      destacado: p.destacado,
      activo: p.activo,
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await saveProducto({
      id: form.id,
      categoriaId: form.categoriaId,
      titulo: form.titulo,
      marca: form.marca,
      precio: Number(form.precio),
      precioAnterior: form.precioAnterior ? Number(form.precioAnterior) : null,
      cuotas: form.cuotasCantidad
        ? {
            cantidad: Number(form.cuotasCantidad),
            tarjeta: form.cuotasTarjeta || 'todas las tarjetas',
          }
        : null,
      descripcion: form.descripcion,
      imagen: form.imagen,
      destacado: form.destacado,
      activo: form.activo,
      orden: 0,
    })
    setForm(null)
    cargar()
  }

  async function toggle(p, campo) {
    await saveProducto({ ...p, [campo]: !p[campo] })
    cargar()
  }

  async function eliminar(id) {
    if (!confirm('¿Eliminar este producto?')) return
    await deleteProducto(id)
    cargar()
  }

  if (loading) {
    return <div className="h-64 animate-pulse rounded-3xl border border-line bg-white" />
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl text-ink">
          Productos <span className="text-ink-soft/50">({productos.length})</span>
        </h2>
        <button
          onClick={() => setForm({ ...vacio, categoriaId: categorias[0]?.id || '' })}
          className={btnPrimary}
        >
          <Plus size={16} /> Nuevo producto
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[var(--shadow-soft)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-cream/60 text-left text-xs uppercase tracking-wide text-ink-soft/70">
              <tr>
                <th className="px-5 py-3 font-semibold">Producto</th>
                <th className="px-5 py-3 font-semibold">Categoría</th>
                <th className="px-5 py-3 font-semibold">Precio</th>
                <th className="px-5 py-3 font-semibold">Destacado</th>
                <th className="px-5 py-3 font-semibold">Estado</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <motion.tr
                  key={p.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-line/70 transition-colors last:border-0 hover:bg-cream/50"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {p.imagen ? (
                        <img
                          src={p.imagen}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="h-10 w-10 shrink-0 rounded-xl bg-wine-50" />
                      )}
                      <div>
                        <p className="font-semibold text-ink">{p.titulo}</p>
                        <p className="text-xs text-ink-soft">{p.marca}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink-soft">
                    {categorias.find((c) => c.id === p.categoriaId)?.titulo || '—'}
                  </td>
                  <td className="px-5 py-3 font-medium text-ink">{formatPrecio(p.precio)}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggle(p, 'destacado')}
                      aria-label="Destacar producto"
                      className="focus-ring rounded-full p-1.5 transition-transform duration-200 hover:scale-125"
                    >
                      <Star
                        size={18}
                        className={
                          p.destacado ? 'fill-wine-500 text-wine-500' : 'text-ink-soft/30'
                        }
                      />
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggle(p, 'activo')}
                      className={`focus-ring rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                        p.activo
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-line/60 text-ink-soft hover:bg-line'
                      }`}
                    >
                      {p.activo ? 'Visible' : 'Oculto'}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => abrirEdicion(p)}
                        aria-label="Editar"
                        className={iconBtn}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => eliminar(p.id)}
                        aria-label="Eliminar"
                        className={`${iconBtn} hover:bg-red-50 hover:text-red-600`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={Boolean(form)}
        onClose={() => setForm(null)}
        title={form?.id ? 'Editar producto' : 'Nuevo producto'}
      >
        {form && (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3.5">
            <label className={`col-span-2 ${labelClass}`}>
              Título
              <input
                required
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Marca
              <input
                value={form.marca}
                onChange={(e) => setForm({ ...form, marca: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Categoría
              <select
                value={form.categoriaId}
                onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
                className={inputClass}
              >
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.titulo}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Precio
              <input
                type="number"
                required
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Precio anterior
              <input
                type="number"
                value={form.precioAnterior}
                onChange={(e) => setForm({ ...form, precioAnterior: e.target.value })}
                placeholder="Opcional"
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Cuotas sin interés
              <input
                type="number"
                value={form.cuotasCantidad}
                onChange={(e) => setForm({ ...form, cuotasCantidad: e.target.value })}
                placeholder="Ej: 3"
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Tarjeta
              <input
                value={form.cuotasTarjeta}
                onChange={(e) => setForm({ ...form, cuotasTarjeta: e.target.value })}
                placeholder="todas las tarjetas"
                className={inputClass}
              />
            </label>
            <label className={`col-span-2 ${labelClass}`}>
              Imagen (URL)
              <input
                value={form.imagen}
                onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className={`col-span-2 ${labelClass}`}>
              Descripción
              <textarea
                rows={3}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className={`${inputClass} resize-none`}
              />
            </label>

            <label className="col-span-2 flex cursor-pointer items-center gap-2.5 rounded-xl bg-cream/60 px-3.5 py-2.5 text-sm transition-colors hover:bg-wine-50 sm:col-span-1">
              <input
                type="checkbox"
                checked={form.destacado}
                onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                className="accent-wine-600"
              />
              Destacado
            </label>
            <label className="col-span-2 flex cursor-pointer items-center gap-2.5 rounded-xl bg-cream/60 px-3.5 py-2.5 text-sm transition-colors hover:bg-wine-50 sm:col-span-1">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                className="accent-wine-600"
              />
              Visible en el sitio
            </label>

            <div className="col-span-2 mt-3 flex justify-end gap-2">
              <button type="button" onClick={() => setForm(null)} className={btnGhost}>
                Cancelar
              </button>
              <button type="submit" className={btnPrimary}>
                Guardar
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
