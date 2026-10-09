import { motion } from 'framer-motion'
import { CheckCheck, Mail, Phone, RotateCcw, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useToast } from '../../components/admin/toastContext'
import { WhatsappIcon } from '../../components/icons'
import { iconBtn } from '../../components/ui'
import { NEGOCIO } from '../../config'
import {
  actualizarConsulta,
  deleteConsulta,
  listConsultas,
  restaurarConsulta,
} from '../../lib/backend'

function hace(iso) {
  const minutos = Math.round((Date.now() - new Date(iso)) / 60000)
  if (minutos < 1) return 'recién'
  if (minutos < 60) return `hace ${minutos} min`
  const horas = Math.round(minutos / 60)
  if (horas < 24) return `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`
  const dias = Math.round(horas / 24)
  if (dias < 7) return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

// Pasa un teléfono como lo escribe la gente ("341 555-1234") al formato de
// wa.me para celulares de Argentina (549 + característica + número).
function telefonoWhatsapp(telefono) {
  let digitos = telefono.replace(/\D/g, '')
  if (digitos.startsWith('54')) return digitos
  digitos = digitos.replace(/^0/, '')
  return `549${digitos}`
}

const FILTROS = [
  { id: 'pendientes', texto: 'Sin responder' },
  { id: 'respondidas', texto: 'Respondidas' },
  { id: 'todas', texto: 'Todas' },
]

export default function ConsultasAdmin() {
  const toast = useToast()
  const [consultas, setConsultas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('pendientes')

  async function cargar() {
    setConsultas(await listConsultas())
    setLoading(false)
  }

  useEffect(() => {
    cargar()
  }, [])

  async function marcar(c, campos, mensaje) {
    setConsultas(await actualizarConsulta(c.id, campos))
    if (mensaje) {
      toast({
        mensaje,
        deshacer: async () =>
          setConsultas(await actualizarConsulta(c.id, { leida: c.leida, respondida: c.respondida })),
      })
    }
  }

  function responder(c) {
    marcar(c, { leida: true, respondida: true }, `Marcamos como respondida la consulta de ${c.nombre}`)
  }

  async function eliminar(c) {
    setConsultas(await deleteConsulta(c.id))
    toast({
      mensaje: `Eliminaste la consulta de ${c.nombre}`,
      deshacer: async () => setConsultas(await restaurarConsulta(c)),
    })
  }

  if (loading) {
    return <div className="h-48 animate-pulse rounded-3xl border border-line bg-white" />
  }

  const pendientes = consultas.filter((c) => !c.respondida).length
  const visibles = consultas.filter((c) =>
    filtro === 'todas' ? true : filtro === 'pendientes' ? !c.respondida : c.respondida,
  )

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-ink">Consultas</h2>
        {pendientes > 0 && (
          <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800">
            {pendientes} sin responder
          </span>
        )}
      </div>

      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFiltro(f.id)}
            className={`focus-ring shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filtro === f.id ? 'bg-ink text-white' : 'border border-line bg-white text-ink-soft hover:border-wine-300'
            }`}
          >
            {f.texto}
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <CheckCheck size={28} className="mx-auto text-emerald-500" />
          <p className="mt-3 font-semibold text-ink">
            {filtro === 'pendientes' ? '¡Todo respondido!' : 'No hay consultas acá'}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Las consultas que lleguen desde el formulario de contacto del sitio aparecen acá.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visibles.map((c) => {
            const saludo = `¡Hola ${c.nombre.split(' ')[0]}! Te escribimos de ${NEGOCIO.nombre} por tu consulta: `
            return (
              <motion.article
                key={c.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => !c.leida && marcar(c, { leida: true })}
                className={`rounded-2xl border bg-white p-4 transition-shadow duration-300 hover:shadow-[var(--shadow-soft)] sm:p-5 ${
                  c.respondida ? 'border-line' : 'border-amber-200 shadow-[0_0_0_3px_rgba(251,191,36,0.12)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-ink">{c.nombre}</p>
                      {!c.leida && (
                        <span className="rounded-full bg-wine-600 px-2 py-0.5 text-[11px] font-bold text-white">
                          Nueva
                        </span>
                      )}
                      {c.respondida ? (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                          <CheckCheck size={12} /> Respondida
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                          Sin responder
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-ink-soft">
                      <span className="font-medium text-wine-700">{c.motivo}</span> · {hace(c.creado_at)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => (e.stopPropagation(), eliminar(c))}
                    aria-label="Eliminar"
                    className={`${iconBtn} hover:bg-red-50 hover:text-red-600`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-ink">{c.mensaje}</p>

                <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                  {c.telefono && (
                    <a
                      href={`https://wa.me/${telefonoWhatsapp(c.telefono)}?text=${encodeURIComponent(saludo)}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => (e.stopPropagation(), responder(c))}
                      className="focus-ring flex w-full items-center justify-center gap-2 rounded-full sm:w-auto bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1fb857] sm:flex-none"
                    >
                      <WhatsappIcon size={16} /> Responder por WhatsApp
                    </a>
                  )}
                  <a
                    href={`mailto:${c.email}?subject=${encodeURIComponent(`Tu consulta en ${NEGOCIO.nombre}`)}&body=${encodeURIComponent(saludo)}`}
                    onClick={(e) => (e.stopPropagation(), responder(c))}
                    className="focus-ring flex w-full items-center justify-center gap-2 rounded-full sm:w-auto border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-wine-300 sm:flex-none"
                  >
                    <Mail size={15} /> Responder por mail
                  </a>
                  {c.telefono && (
                    <a
                      href={`tel:${c.telefono.replace(/\s/g, '')}`}
                      className="focus-ring flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-wine-300 hover:text-ink"
                    >
                      <Phone size={15} /> {c.telefono}
                    </a>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      marcar(
                        c,
                        { leida: true, respondida: !c.respondida },
                        c.respondida ? 'La consulta volvió a pendientes' : 'Consulta marcada como respondida',
                      )
                    }}
                    className="focus-ring flex items-center gap-1.5 rounded-full px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-wine-50 hover:text-wine-700 sm:ml-auto"
                  >
                    {c.respondida ? (
                      <>
                        <RotateCcw size={14} /> Volver a pendiente
                      </>
                    ) : (
                      <>
                        <CheckCheck size={15} /> Ya la respondí
                      </>
                    )}
                  </button>
                </div>
              </motion.article>
            )
          })}
        </div>
      )}
    </div>
  )
}
