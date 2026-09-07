import { Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatPrecio } from '../../lib/format'
import {
  deleteProducto,
  listCategorias,
  listProductos,
  saveProducto,
} from '../../lib/backend'

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

  function abrirNuevo() {
    setForm({ ...vacio, categoriaId: categorias[0]?.id || '' })
  }

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
    const payload = {
      id: form.id,
      categoriaId: form.categoriaId,
      titulo: form.titulo,
      marca: form.marca,
      precio: Number(form.precio),
      precioAnterior: form.precioAnterior ? Number(form.precioAnterior) : null,
      cuotas: form.cuotasCantidad
        ? { cantidad: Number(form.cuotasCantidad), tarjeta: form.cuotasTarjeta || 'todas las tarjetas' }
        : null,
      descripcion: form.descripcion,
      imagen: form.imagen,
      destacado: form.destacado,
      activo: form.activo,
      orden: 0,
    }
    await saveProducto(payload)
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

  if (loading) return <p className="text-ink/50">Cargando...</p>

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Productos ({productos.length})</h2>
        <button
          onClick={abrirNuevo}
          className="flex items-center gap-1.5 rounded-md bg-ink px-3 py-2 text-sm font-medium text-white hover:bg-ink-2"
        >
          <Plus size={16} /> Nuevo producto
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-cream text-left text-ink/50">
            <tr>
              <th className="px-4 py-2 font-medium">Producto</th>
              <th className="px-4 py-2 font-medium">Categoría</th>
              <th className="px-4 py-2 font-medium">Precio</th>
              <th className="px-4 py-2 font-medium">Destacado</th>
              <th className="px-4 py-2 font-medium">Activo</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0">
                <td className="px-4 py-2">
                  <p className="font-medium text-ink">{p.titulo}</p>
                  <p className="text-xs text-ink/50">{p.marca}</p>
                </td>
                <td className="px-4 py-2 text-ink/70">
                  {categorias.find((c) => c.id === p.categoriaId)?.titulo || '—'}
                </td>
                <td className="px-4 py-2 text-ink/70">{formatPrecio(p.precio)}</td>
                <td className="px-4 py-2">
                  <button onClick={() => toggle(p, 'destacado')}>
                    <Star
                      size={18}
                      className={p.destacado ? 'fill-gold text-gold' : 'text-ink/30'}
                    />
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => toggle(p, 'activo')}
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.activo ? 'bg-green-100 text-green-700' : 'bg-ink/10 text-ink/50'
                    }`}
                  >
                    {p.activo ? 'Activo' : 'Oculto'}
                  </button>
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => abrirEdicion(p)} className="text-ink/50 hover:text-ink">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => eliminar(p.id)} className="text-ink/50 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleSubmit}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6"
          >
            <h3 className="font-display text-lg text-ink">
              {form.id ? 'Editar producto' : 'Nuevo producto'}
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="col-span-2 flex flex-col gap-1 text-sm">
                Título
                <input
                  required
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  className="rounded-md border border-line px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Marca
                <input
                  value={form.marca}
                  onChange={(e) => setForm({ ...form, marca: e.target.value })}
                  className="rounded-md border border-line px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Categoría
                <select
                  value={form.categoriaId}
                  onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
                  className="rounded-md border border-line px-3 py-2"
                >
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.titulo}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Precio
                <input
                  type="number"
                  required
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                  className="rounded-md border border-line px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Precio anterior (opcional)
                <input
                  type="number"
                  value={form.precioAnterior}
                  onChange={(e) => setForm({ ...form, precioAnterior: e.target.value })}
                  className="rounded-md border border-line px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Cuotas sin interés
                <input
                  type="number"
                  value={form.cuotasCantidad}
                  onChange={(e) => setForm({ ...form, cuotasCantidad: e.target.value })}
                  className="rounded-md border border-line px-3 py-2"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Tarjeta
                <input
                  value={form.cuotasTarjeta}
                  onChange={(e) => setForm({ ...form, cuotasTarjeta: e.target.value })}
                  placeholder="todas las tarjetas"
                  className="rounded-md border border-line px-3 py-2"
                />
              </label>
              <label className="col-span-2 flex flex-col gap-1 text-sm">
                Imagen (URL)
                <input
                  value={form.imagen}
                  onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                  className="rounded-md border border-line px-3 py-2"
                />
              </label>
              <label className="col-span-2 flex flex-col gap-1 text-sm">
                Descripción
                <textarea
                  rows={3}
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="rounded-md border border-line px-3 py-2"
                />
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.destacado}
                  onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                />
                Destacado
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                />
                Activo (visible)
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setForm(null)}
                className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink/70"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink-2"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
