import { motion } from 'framer-motion'
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Modal from '../../components/Modal'
import { btnGhost, btnPrimary, iconBtn, inputClass, labelClass } from '../../components/ui'
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
    if (!confirm('¿Eliminar esta categoría? Los productos asociados quedarán sin categoría.'))
      return
    await deleteCategoria(id)
    cargar()
  }

  if (loading) {
    return <div className="h-48 animate-pulse rounded-3xl border border-line bg-white" />
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl text-ink">
          Categorías <span className="text-ink-soft/50">({categorias.length})</span>
        </h2>
        <button
          onClick={() => setForm({ id: '', titulo: '', orden: categorias.length })}
          className={btnPrimary}
        >
          <Plus size={16} /> Nueva categoría
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {categorias.map((c) => (
          <motion.div
            key={c.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-white px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-wine-200 hover:shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-center gap-3">
              <GripVertical size={16} className="text-ink-soft/25" />
              <div>
                <p className="font-semibold text-ink">{c.titulo}</p>
                <p className="text-xs text-ink-soft">Orden {c.orden}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setForm(c)} aria-label="Editar" className={iconBtn}>
                <Pencil size={15} />
              </button>
              <button
                onClick={() => eliminar(c.id)}
                aria-label="Eliminar"
                className={`${iconBtn} hover:bg-red-50 hover:text-red-600`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal
        open={Boolean(form)}
        onClose={() => setForm(null)}
        title={form?.id ? 'Editar categoría' : 'Nueva categoría'}
      >
        {form && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <label className={labelClass}>
              Título
              <input
                required
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Orden
              <input
                type="number"
                value={form.orden}
                onChange={(e) => setForm({ ...form, orden: e.target.value })}
                className={inputClass}
              />
            </label>
            <div className="mt-3 flex justify-end gap-2">
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
