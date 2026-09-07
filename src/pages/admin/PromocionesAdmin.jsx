import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { deletePromocion, listPromociones, savePromocion } from '../../lib/backend'

const vacio = { id: '', titulo: '', descripcion: '', tarjeta: '', activo: true, orden: 0 }

export default function PromocionesAdmin() {
  const [promociones, setPromociones] = useState([])
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)

  async function cargar() {
    setPromociones((await listPromociones()).sort((a, b) => a.orden - b.orden))
    setLoading(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    await savePromocion({ ...form, orden: Number(form.orden) || 0 })
    setForm(null)
    cargar()
  }

  async function toggleActivo(p) {
    await savePromocion({ ...p, activo: !p.activo })
    cargar()
  }

  async function eliminar(id) {
    if (!confirm('¿Eliminar esta promoción?')) return
    await deletePromocion(id)
    cargar()
  }

  if (loading) return <p className="text-ink/50">Cargando...</p>

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Promociones ({promociones.length})</h2>
        <button
          onClick={() => setForm({ ...vacio, orden: promociones.length })}
          className="flex items-center gap-1.5 rounded-md bg-ink px-3 py-2 text-sm font-medium text-white hover:bg-ink-2"
        >
          <Plus size={16} /> Nueva promoción
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {promociones.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-line bg-white p-4"
          >
            <div>
              <p className="font-medium text-ink">{p.titulo}</p>
              <p className="text-sm text-ink/60">{p.descripcion}</p>
              {p.tarjeta && <p className="text-xs text-gold">{p.tarjeta}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                onClick={() => toggleActivo(p)}
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  p.activo ? 'bg-green-100 text-green-700' : 'bg-ink/10 text-ink/50'
                }`}
              >
                {p.activo ? 'Activa' : 'Oculta'}
              </button>
              <button onClick={() => setForm(p)} className="text-ink/50 hover:text-ink">
                <Pencil size={16} />
              </button>
              <button onClick={() => eliminar(p.id)} className="text-ink/50 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="font-display text-lg text-ink">
              {form.id ? 'Editar promoción' : 'Nueva promoción'}
            </h3>
            <label className="mt-4 flex flex-col gap-1 text-sm">
              Título
              <input
                required
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                className="rounded-md border border-line px-3 py-2"
              />
            </label>
            <label className="mt-3 flex flex-col gap-1 text-sm">
              Descripción
              <textarea
                rows={2}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className="rounded-md border border-line px-3 py-2"
              />
            </label>
            <label className="mt-3 flex flex-col gap-1 text-sm">
              Tarjeta / banco (opcional)
              <input
                value={form.tarjeta || ''}
                onChange={(e) => setForm({ ...form, tarjeta: e.target.value })}
                className="rounded-md border border-line px-3 py-2"
              />
            </label>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={(e) => setForm({ ...form, activo: e.target.checked })}
              />
              Activa (visible en el sitio)
            </label>
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
