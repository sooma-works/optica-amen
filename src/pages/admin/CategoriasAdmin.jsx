import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { deleteCategoria, listCategorias, saveCategoria } from '../../lib/backend'

export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)

  async function cargar() {
    setCategorias((await listCategorias()).sort((a, b) => a.orden - b.orden))
    setLoading(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    await saveCategoria({ ...form, orden: Number(form.orden) || 0 })
    setForm(null)
    cargar()
  }

  async function eliminar(id) {
    if (!confirm('¿Eliminar esta categoría? Los productos asociados quedarán sin categoría.')) return
    await deleteCategoria(id)
    cargar()
  }

  if (loading) return <p className="text-ink/50">Cargando...</p>

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Categorías ({categorias.length})</h2>
        <button
          onClick={() => setForm({ id: '', titulo: '', orden: categorias.length })}
          className="flex items-center gap-1.5 rounded-md bg-ink px-3 py-2 text-sm font-medium text-white hover:bg-ink-2"
        >
          <Plus size={16} /> Nueva categoría
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-cream text-left text-ink/50">
            <tr>
              <th className="px-4 py-2 font-medium">Título</th>
              <th className="px-4 py-2 font-medium">Orden</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0">
                <td className="px-4 py-2 font-medium text-ink">{c.titulo}</td>
                <td className="px-4 py-2 text-ink/70">{c.orden}</td>
                <td className="px-4 py-2">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setForm(c)} className="text-ink/50 hover:text-ink">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => eliminar(c.id)} className="text-ink/50 hover:text-red-600">
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
          <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg bg-white p-6">
            <h3 className="font-display text-lg text-ink">
              {form.id ? 'Editar categoría' : 'Nueva categoría'}
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
              Orden
              <input
                type="number"
                value={form.orden}
                onChange={(e) => setForm({ ...form, orden: e.target.value })}
                className="rounded-md border border-line px-3 py-2"
              />
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
