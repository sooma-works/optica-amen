import { motion } from 'framer-motion'
import { Mail, MailOpen, Phone, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { iconBtn } from '../../components/ui'
import { deleteConsulta, listConsultas, marcarConsultaLeida } from '../../lib/backend'

function formatFecha(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ConsultasAdmin() {
  const [consultas, setConsultas] = useState([])
  const [loading, setLoading] = useState(true)

  async function cargar() {
    setConsultas(await listConsultas())
    setLoading(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  async function alternarLeida(c) {
    await marcarConsultaLeida(c.id, !c.leida)
    cargar()
  }

  async function eliminar(id) {
    if (!confirm('¿Eliminar esta consulta? No se puede deshacer.')) return
    await deleteConsulta(id)
    cargar()
  }

  if (loading) {
    return <div className="h-48 animate-pulse rounded-3xl border border-line bg-white" />
  }

  const sinLeer = consultas.filter((c) => !c.leida).length

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl text-ink">
          Consultas <span className="text-ink-soft/50">({consultas.length})</span>
        </h2>
        {sinLeer > 0 && (
          <span className="rounded-full bg-wine-100 px-3 py-1.5 text-sm font-semibold text-wine-700">
            {sinLeer} sin leer
          </span>
        )}
      </div>

      {consultas.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <Mail size={28} className="mx-auto text-ink-soft/30" />
          <p className="mt-3 font-semibold text-ink">Todavía no hay consultas</p>
          <p className="mt-1 text-sm text-ink-soft">
            Las que lleguen desde el formulario de contacto del sitio aparecen acá.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {consultas.map((c) => (
            <motion.article
              key={c.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border bg-white px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] ${
                c.leida ? 'border-line' : 'border-wine-200 bg-wine-50/40'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink">{c.nombre}</p>
                    <span className="rounded-full bg-wine-50 px-2.5 py-0.5 text-xs font-medium text-wine-700">
                      {c.motivo}
                    </span>
                    {!c.leida && (
                      <span className="rounded-full bg-wine-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                        Nueva
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">{formatFecha(c.creado_at)}</p>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => alternarLeida(c)}
                    aria-label={c.leida ? 'Marcar como no leída' : 'Marcar como leída'}
                    title={c.leida ? 'Marcar como no leída' : 'Marcar como leída'}
                    className={iconBtn}
                  >
                    {c.leida ? <MailOpen size={15} /> : <Mail size={15} />}
                  </button>
                  <button
                    onClick={() => eliminar(c.id)}
                    aria-label="Eliminar"
                    className={`${iconBtn} hover:bg-red-50 hover:text-red-600`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-ink-soft">
                {c.mensaje}
              </p>

              <div className="mt-3 flex flex-wrap gap-4 border-t border-line pt-3 text-sm">
                <a
                  href={`mailto:${c.email}?subject=${encodeURIComponent('Tu consulta en Óptica A.M.E.N.')}`}
                  className="focus-ring flex items-center gap-1.5 rounded text-wine-600 transition-colors hover:text-wine-700"
                >
                  <Mail size={14} /> {c.email}
                </a>
                {c.telefono && (
                  <a
                    href={`tel:${c.telefono.replace(/\s/g, '')}`}
                    className="focus-ring flex items-center gap-1.5 rounded text-wine-600 transition-colors hover:text-wine-700"
                  >
                    <Phone size={14} /> {c.telefono}
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  )
}
