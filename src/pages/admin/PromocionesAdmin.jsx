import { motion } from 'framer-motion'
import { CreditCard, Pencil, Plus, Tag, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Modal from '../../components/Modal'
import { btnGhost, btnPrimary, iconBtn, inputClass, labelClass } from '../../components/ui'
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

  if (loading) {
    return <div className="h-48 animate-pulse rounded-3xl border border-line bg-white" />
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl whitespace-nowrap text-ink">
          Promociones <span className="text-ink-soft/50">({promociones.length})</span>
        </h2>
        <button
          onClick={() => setForm({ ...vacio, orden: promociones.length })}
          className={`${btnPrimary} shrink-0 whitespace-nowrap`}
        >
          <Plus size={16} /> <span className="sm:hidden">Nueva</span>
          <span className="hidden sm:inline">Nueva promoción</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {promociones.map((p) => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="group flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between transition-all duration-300 hover:-translate-y-0.5 hover:border-wine-200 hover:shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start gap-3.5">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  p.activo ? 'bg-wine-600 text-white' : 'bg-line/60 text-ink-soft'
                }`}
              >
                {p.tarjeta ? <CreditCard size={18} /> : <Tag size={18} />}
              </span>
              <div>
                <p className="font-semibold text-ink">{p.titulo}</p>
                <p className="text-sm text-ink-soft">{p.descripcion}</p>
                {p.tarjeta && (
                  <p className="mt-1 text-xs font-medium text-wine-600">{p.tarjeta}</p>
                )}
              </div>
            </div>

            <div className="-mb-1 flex shrink-0 items-center justify-end gap-1 border-t border-line pt-3 sm:mb-0 sm:border-0 sm:pt-0">
              <button
                onClick={() => toggleActivo(p)}
                className={`focus-ring mr-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                  p.activo
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-line/60 text-ink-soft hover:bg-line'
                }`}
              >
                {p.activo ? 'Activa' : 'Oculta'}
              </button>
              <button onClick={() => setForm(p)} aria-label="Editar" className={iconBtn}>
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
          </motion.div>
        ))}
      </div>

      <Modal
        open={Boolean(form)}
        onClose={() => setForm(null)}
        title={form?.id ? 'Editar promoción' : 'Nueva promoción'}
      >
        {form && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <label className={labelClass}>
              Título
              <input
                required
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Ej: 6 cuotas sin interés"
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Descripción
              <textarea
                rows={2}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className={`${inputClass} resize-none`}
              />
            </label>
            <label className={labelClass}>
              Tarjeta / banco
              <input
                value={form.tarjeta || ''}
                onChange={(e) => setForm({ ...form, tarjeta: e.target.value })}
                placeholder="Opcional"
                className={inputClass}
              />
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-cream/60 px-3.5 py-2.5 text-sm transition-colors hover:bg-wine-50">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                className="accent-wine-600"
              />
              Activa (visible en el sitio)
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
