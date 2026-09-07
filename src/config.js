// Datos del negocio — editar acá para adaptarlos a los reales del cliente.
export const NEGOCIO = {
  nombre: 'Óptica A.M.E.N.',
  lema: 'Tu visión, nuestra prioridad.',
  whatsapp: '5491100000000',
  direccion: 'Av. Siempreviva 742, Buenos Aires',
  horarios: 'Lunes a viernes de 9 a 18 h · Sábados de 9 a 13 h',
  instagram: 'opticaamen',
}

export function linkWhatsapp(mensaje) {
  const texto = encodeURIComponent(mensaje)
  return `https://wa.me/${NEGOCIO.whatsapp}?text=${texto}`
}
