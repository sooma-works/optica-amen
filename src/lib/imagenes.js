// Fotos de un producto. Los productos viejos tenían una sola `imagen`.
export function imagenesDe(producto) {
  if (producto?.imagenes?.length) return producto.imagenes
  return producto?.imagen ? [producto.imagen] : []
}

// Las fotos de Unsplash aceptan el ancho por parámetro: se pide el tamaño
// que realmente se muestra en vez de bajar siempre la de 1200 px.
export function imgAncho(src, ancho) {
  if (!src?.includes('images.unsplash.com')) return src
  const url = new URL(src)
  url.searchParams.set('w', String(ancho))
  return url.toString()
}
