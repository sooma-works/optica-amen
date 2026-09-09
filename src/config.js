// Datos del negocio — editar acá para adaptarlos a los reales del cliente.
export const NEGOCIO = {
  nombre: 'Óptica A.M.E.N.',
  lema: 'Tu visión, nuestra prioridad.',
  whatsapp: '5493414254107',
  whatsappVisible: '341 425-4107',
  direccion: 'Corrientes 370, Rosario, Santa Fe',
  direccionCorta: 'Corrientes 370',
  ciudad: 'S2000 CTP · Rosario, Santa Fe',
  horarios: 'Lunes a viernes de 9 a 19 h',
  instagram: 'opticaamen',
  mapsLink: 'https://maps.app.goo.gl/QkRpvhdpH3xvNNor5',
  mapsEmbed:
    'https://www.google.com/maps?q=Corrientes%20370%2C%20S2000%20CTP%2C%20Rosario%2C%20Santa%20Fe&z=16&output=embed',
}

export function linkWhatsapp(mensaje) {
  const texto = encodeURIComponent(mensaje)
  return `https://wa.me/${NEGOCIO.whatsapp}?text=${texto}`
}
