import { motion } from 'framer-motion'
import { Check, Clock, Loader2, MapPin, Send } from 'lucide-react'
import { useState } from 'react'
import { WhatsappIcon } from '../components/icons'
import { inputClass, labelClass } from '../components/ui'
import { linkWhatsapp, NEGOCIO } from '../config'
import { crearConsulta } from '../lib/backend'

const MOTIVOS = [
  'Consulta general',
  'Turno para examen visual',
  'Presupuesto de anteojos recetados',
  'Lentes de contacto',
  'Reparación o ajuste',
]

const VACIO = { nombre: '', email: '', telefono: '', motivo: MOTIVOS[0], mensaje: '' }

export default function Contacto() {
  const [form, setForm] = useState(VACIO)
  const [estado, setEstado] = useState('idle') // idle | enviando | ok | error

  function set(campo) {
    return (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setEstado('enviando')
    try {
      await crearConsulta(form)
      setForm(VACIO)
      setEstado('ok')
    } catch {
      setEstado('error')
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 text-left">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wine-500">
          Contacto
        </p>
        <h1 className="font-display mt-1 text-4xl text-ink">Escribinos</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
          Dejanos tu consulta y te respondemos a la brevedad. Si preferís algo más rápido,
          también estamos por WhatsApp.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="surface p-6 sm:p-8"
        >
          {estado === 'ok' ? (
            <div className="flex flex-col items-start gap-4 py-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine-50 text-wine-600">
                <Check size={24} />
              </span>
              <div>
                <p className="font-display text-2xl text-ink">¡Consulta enviada!</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  Gracias por escribirnos. Te vamos a responder dentro del horario de
                  atención ({NEGOCIO.horarios.toLowerCase()}).
                </p>
              </div>
              <button
                onClick={() => setEstado('idle')}
                className="focus-ring rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink-soft transition-all duration-200 hover:border-wine-300 hover:text-ink"
              >
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Nombre y apellido
                  <input
                    required
                    value={form.nombre}
                    onChange={set('nombre')}
                    placeholder="Juan Pérez"
                    className={inputClass}
                  />
                </label>
                <label className={labelClass}>
                  Email
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="juan@email.com"
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  <span>
                    Teléfono <span className="font-normal text-ink-soft">(opcional)</span>
                  </span>
                  <input
                    type="tel"
                    value={form.telefono}
                    onChange={set('telefono')}
                    placeholder="341 123-4567"
                    className={inputClass}
                  />
                </label>
                <label className={labelClass}>
                  Motivo
                  <select value={form.motivo} onChange={set('motivo')} className={inputClass}>
                    {MOTIVOS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className={labelClass}>
                Mensaje
                <textarea
                  required
                  rows={5}
                  value={form.mensaje}
                  onChange={set('mensaje')}
                  placeholder="Contanos en qué podemos ayudarte."
                  className={`${inputClass} resize-y`}
                />
              </label>

              {estado === 'error' && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  No pudimos enviar la consulta. Probá de nuevo o escribinos por WhatsApp.
                </p>
              )}

              <div className="mt-1 flex items-center justify-between gap-4">
                <p className="text-xs text-ink-soft">
                  Usamos tus datos solo para responderte esta consulta.
                </p>
                <button
                  type="submit"
                  disabled={estado === 'enviando'}
                  className="focus-ring flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-wine-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-wine-700 hover:shadow-[var(--shadow-lift)] disabled:pointer-events-none disabled:opacity-60"
                >
                  {estado === 'enviando' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Enviando…
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Enviar consulta
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>

        <div className="flex flex-col gap-3">
          <a
            href={linkWhatsapp('¡Hola! Quería hacerles una consulta.')}
            target="_blank"
            rel="noreferrer"
            className="focus-ring flex items-start gap-3.5 rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-wine-200 hover:shadow-[var(--shadow-soft)]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wine-50 text-wine-600">
              <WhatsappIcon size={20} />
            </span>
            <div className="text-sm leading-relaxed">
              <p className="font-semibold text-ink">WhatsApp</p>
              <p className="text-wine-600">{NEGOCIO.whatsappVisible}</p>
            </div>
          </a>

          <a
            href={NEGOCIO.mapsLink}
            target="_blank"
            rel="noreferrer"
            className="focus-ring flex items-start gap-3.5 rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-wine-200 hover:shadow-[var(--shadow-soft)]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wine-50 text-wine-600">
              <MapPin size={20} />
            </span>
            <div className="text-sm leading-relaxed">
              <p className="font-semibold text-ink">{NEGOCIO.direccionCorta}</p>
              <p className="text-ink-soft">{NEGOCIO.ciudad}</p>
            </div>
          </a>

          <div className="flex items-start gap-3.5 rounded-2xl border border-line bg-white p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wine-50 text-wine-600">
              <Clock size={20} />
            </span>
            <div className="text-sm leading-relaxed">
              <p className="font-semibold text-ink">Horarios</p>
              <p className="text-ink-soft">{NEGOCIO.horarios}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line">
            <iframe
              title={`Ubicación de ${NEGOCIO.nombre}`}
              src={NEGOCIO.mapsEmbed}
              className="h-52 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
