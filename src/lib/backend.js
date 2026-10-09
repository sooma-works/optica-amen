import {
  categoriasSeed,
  consultasSeed,
  productosSeed,
  promocionesSeed,
  SEED_VERSION,
} from '../data/seed'
import { isSupabaseConfigured, supabase } from './supabase'

// ---------------------------------------------------------------------------
// Modo demo: persiste en localStorage para poder mostrar el panel de admin
// funcionando sin depender de Supabase. Cuando se configuren las variables
// VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY, el mismo código de las páginas
// usa Supabase en su lugar (ver funciones más abajo).
// ---------------------------------------------------------------------------

const LS_KEYS = {
  categorias: 'oamen_categorias',
  productos: 'oamen_productos',
  promociones: 'oamen_promociones',
  consultas: 'oamen_consultas',
  session: 'oamen_admin_session',
  seedVersion: 'oamen_seed_version',
}

// Si cambió el seed desde la última visita, se descartan los datos demo
// guardados (no la sesión) para que la demo muestre siempre lo último.
if (!isSupabaseConfigured && localStorage.getItem(LS_KEYS.seedVersion) !== String(SEED_VERSION)) {
  for (const key of ['categorias', 'productos', 'promociones', 'consultas']) {
    localStorage.removeItem(LS_KEYS[key])
  }
  localStorage.setItem(LS_KEYS.seedVersion, String(SEED_VERSION))
}

function readLocal(key, seed) {
  const raw = localStorage.getItem(key)
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(seed))
    return seed
  }
  try {
    return JSON.parse(raw)
  } catch {
    return seed
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
  return value
}

// ---- mapeos camelCase (app) <-> snake_case (supabase) ----------------------

function productoToRow(p) {
  return {
    id: p.id,
    categoria_id: p.categoriaId,
    titulo: p.titulo,
    marca: p.marca,
    precio: p.precio,
    precio_anterior: p.precioAnterior ?? null,
    cuotas_cantidad: p.cuotas?.cantidad ?? null,
    cuotas_tarjeta: p.cuotas?.tarjeta ?? null,
    descripcion: p.descripcion,
    imagen: p.imagenes?.[0] ?? '',
    imagenes: p.imagenes ?? [],
    destacado: p.destacado,
    activo: p.activo,
    orden: p.orden ?? 0,
  }
}

function rowToProducto(r) {
  return {
    id: r.id,
    categoriaId: r.categoria_id,
    titulo: r.titulo,
    marca: r.marca,
    precio: r.precio,
    precioAnterior: r.precio_anterior,
    cuotas: r.cuotas_cantidad
      ? { cantidad: r.cuotas_cantidad, tarjeta: r.cuotas_tarjeta }
      : null,
    descripcion: r.descripcion,
    imagenes: r.imagenes?.length ? r.imagenes : r.imagen ? [r.imagen] : [],
    destacado: r.destacado,
    activo: r.activo,
    orden: r.orden,
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Arma un id a partir del título que no choque con los existentes: si ya hay
// un "aviador-clasico", el nuevo pasa a ser "aviador-clasico-2".
function idUnico(titulo, existentes) {
  const base = slugify(titulo) || 'item'
  const ids = new Set(existentes.map((x) => x.id))
  if (!ids.has(base)) return base
  let n = 2
  while (ids.has(`${base}-${n}`)) n++
  return `${base}-${n}`
}

function siguienteOrden(existentes) {
  return existentes.reduce((max, x) => Math.max(max, x.orden ?? 0), -1) + 1
}

const porOrden = (a, b) => (a.orden ?? 0) - (b.orden ?? 0)

// ---- Categorías -------------------------------------------------------

export async function listCategorias() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('categorias').select('*').order('orden')
    if (error) throw error
    return data
  }
  return readLocal(LS_KEYS.categorias, categoriasSeed)
}

export async function saveCategoria(categoria) {
  if (isSupabaseConfigured) {
    const actuales = await listCategorias()
    const row = { ...categoria, id: categoria.id || idUnico(categoria.titulo, actuales) }
    const { error } = await supabase.from('categorias').upsert(row)
    if (error) throw error
    return listCategorias()
  }
  const actuales = readLocal(LS_KEYS.categorias, categoriasSeed)
  const id = categoria.id || idUnico(categoria.titulo, actuales)
  const idx = actuales.findIndex((c) => c.id === id)
  const nueva = { ...categoria, id }
  if (idx >= 0) actuales[idx] = nueva
  else actuales.push(nueva)
  return writeLocal(LS_KEYS.categorias, [...actuales])
}

export async function deleteCategoria(id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('categorias').delete().eq('id', id)
    if (error) throw error
    return listCategorias()
  }
  const actuales = readLocal(LS_KEYS.categorias, categoriasSeed)
  return writeLocal(
    LS_KEYS.categorias,
    actuales.filter((c) => c.id !== id),
  )
}

// ---- Productos ----------------------------------------------------------

export async function listProductos() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('productos').select('*').order('orden')
    if (error) throw error
    return data.map(rowToProducto)
  }
  return [...readLocal(LS_KEYS.productos, productosSeed)].sort(porOrden)
}

export async function getProducto(id) {
  const productos = await listProductos()
  return productos.find((p) => p.id === id) ?? null
}

// Guarda un producto. Sin id es un alta: se le arma un id que no pise a otro
// y va al final de la lista. Con id es una edición y conserva su posición.
export async function saveProducto(producto) {
  const actuales = await listProductos()
  const id = producto.id || idUnico(producto.titulo, actuales)
  const previo = actuales.find((p) => p.id === id)
  const nuevo = {
    ...producto,
    id,
    orden: producto.orden ?? previo?.orden ?? siguienteOrden(actuales),
  }

  if (isSupabaseConfigured) {
    const { error } = await supabase.from('productos').upsert(productoToRow(nuevo))
    if (error) throw error
    return listProductos()
  }
  const lista = previo ? actuales.map((p) => (p.id === id ? nuevo : p)) : [...actuales, nuevo]
  return writeLocal(LS_KEYS.productos, lista.sort(porOrden))
}

// Guarda varios productos de una (actualización masiva de precios, deshacer).
export async function saveProductos(productos) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('productos').upsert(productos.map(productoToRow))
    if (error) throw error
    return listProductos()
  }
  const porId = new Map(productos.map((p) => [p.id, p]))
  const actuales = readLocal(LS_KEYS.productos, productosSeed)
  return writeLocal(
    LS_KEYS.productos,
    actuales.map((p) => porId.get(p.id) ?? p).sort(porOrden),
  )
}

// Recibe los ids en el orden nuevo y renumera.
export async function reordenarProductos(ids) {
  if (isSupabaseConfigured) {
    const results = await Promise.all(
      ids.map((id, orden) => supabase.from('productos').update({ orden }).eq('id', id)),
    )
    const fallo = results.find((r) => r.error)
    if (fallo) throw fallo.error
    return listProductos()
  }
  const posicion = new Map(ids.map((id, i) => [id, i]))
  const actuales = readLocal(LS_KEYS.productos, productosSeed)
  return writeLocal(
    LS_KEYS.productos,
    actuales.map((p) => ({ ...p, orden: posicion.get(p.id) ?? p.orden })).sort(porOrden),
  )
}

export async function deleteProducto(id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) throw error
    return listProductos()
  }
  const actuales = readLocal(LS_KEYS.productos, productosSeed)
  return writeLocal(
    LS_KEYS.productos,
    actuales.filter((p) => p.id !== id),
  )
}

// ---- Imágenes -------------------------------------------------------------
// Las fotos se achican en el navegador antes de subirlas: una foto de celular
// pesa 3-5 MB y en el catálogo alcanza con ~1400 px de ancho.

async function comprimirImagen(file, maxLado = 1400, calidad = 0.82) {
  const bitmap = await createImageBitmap(file)
  const escala = Math.min(1, maxLado / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * escala)
  canvas.height = Math.round(bitmap.height * escala)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', calidad))
}

export async function subirImagen(file) {
  if (isSupabaseConfigured) {
    const blob = await comprimirImagen(file)
    const path = `${crypto.randomUUID()}.webp`
    const { error } = await supabase.storage
      .from('productos')
      .upload(path, blob, { contentType: 'image/webp' })
    if (error) throw error
    return supabase.storage.from('productos').getPublicUrl(path).data.publicUrl
  }
  // En modo demo la foto queda guardada dentro del navegador, así que se
  // achica más para no llenar el localStorage (~5 MB en total).
  const blob = await comprimirImagen(file, 900, 0.72)
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// ---- Promociones ----------------------------------------------------------

export async function listPromociones() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('promociones').select('*').order('orden')
    if (error) throw error
    return data
  }
  return readLocal(LS_KEYS.promociones, promocionesSeed)
}

export async function savePromocion(promo) {
  if (isSupabaseConfigured) {
    const actuales = await listPromociones()
    const row = { ...promo, id: promo.id || idUnico(promo.titulo, actuales) }
    const { error } = await supabase.from('promociones').upsert(row)
    if (error) throw error
    return listPromociones()
  }
  const actuales = readLocal(LS_KEYS.promociones, promocionesSeed)
  const id = promo.id || idUnico(promo.titulo, actuales)
  const idx = actuales.findIndex((p) => p.id === id)
  const nueva = { ...promo, id }
  if (idx >= 0) actuales[idx] = nueva
  else actuales.push(nueva)
  return writeLocal(LS_KEYS.promociones, [...actuales])
}

export async function deletePromocion(id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('promociones').delete().eq('id', id)
    if (error) throw error
    return listPromociones()
  }
  const actuales = readLocal(LS_KEYS.promociones, promocionesSeed)
  return writeLocal(
    LS_KEYS.promociones,
    actuales.filter((p) => p.id !== id),
  )
}

// ---- Consultas (formulario de contacto) -----------------------------------
// El formulario público solo inserta; leer / marcar / borrar es del panel.

export async function crearConsulta(consulta) {
  const row = {
    nombre: consulta.nombre.trim(),
    email: consulta.email.trim(),
    telefono: consulta.telefono?.trim() || null,
    motivo: consulta.motivo,
    mensaje: consulta.mensaje.trim(),
  }

  if (isSupabaseConfigured) {
    const { error } = await supabase.from('consultas').insert(row)
    if (error) throw error
    return
  }

  const actuales = readLocal(LS_KEYS.consultas, consultasSeed)
  actuales.unshift({
    ...row,
    id: crypto.randomUUID(),
    leida: false,
    respondida: false,
    creado_at: new Date().toISOString(),
  })
  writeLocal(LS_KEYS.consultas, actuales)
}

export async function listConsultas() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('consultas')
      .select('*')
      .order('creado_at', { ascending: false })
    if (error) throw error
    return data
  }
  return readLocal(LS_KEYS.consultas, consultasSeed)
}

// Avisa al panel que cambiaron las consultas, para refrescar el contador
// de "sin responder" de la pestaña sin tener que recargar.
function avisarConsultas() {
  window.dispatchEvent(new Event('oamen:consultas'))
}

export async function actualizarConsulta(id, campos) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('consultas').update(campos).eq('id', id)
    if (error) throw error
    avisarConsultas()
    return listConsultas()
  }
  const actuales = readLocal(LS_KEYS.consultas, consultasSeed)
  const lista = writeLocal(
    LS_KEYS.consultas,
    actuales.map((c) => (c.id === id ? { ...c, ...campos } : c)),
  )
  avisarConsultas()
  return lista
}

export async function contarConsultasSinResponder() {
  const consultas = await listConsultas()
  return consultas.filter((c) => !c.respondida).length
}

export async function deleteConsulta(id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('consultas').delete().eq('id', id)
    if (error) throw error
    avisarConsultas()
    return listConsultas()
  }
  const actuales = readLocal(LS_KEYS.consultas, consultasSeed)
  const lista = writeLocal(
    LS_KEYS.consultas,
    actuales.filter((c) => c.id !== id),
  )
  avisarConsultas()
  return lista
}

// ---- Auth (admin) ---------------------------------------------------------
// En modo demo simulamos una sesión con localStorage y credenciales fijas.
// Con Supabase configurado, usamos Supabase Auth (email/password) real.

const DEMO_USER = import.meta.env.VITE_DEMO_ADMIN_USER || 'admin@opticaamen.com'
const DEMO_PASS = import.meta.env.VITE_DEMO_ADMIN_PASS || 'amen2026'

export async function login(email, password) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.session
  }
  if (email === DEMO_USER && password === DEMO_PASS) {
    const session = { user: { email }, demo: true }
    writeLocal(LS_KEYS.session, session)
    return session
  }
  throw new Error('Usuario o contraseña incorrectos')
}

export async function logout() {
  if (isSupabaseConfigured) {
    await supabase.auth.signOut()
    return
  }
  localStorage.removeItem(LS_KEYS.session)
}

export async function getSession() {
  if (isSupabaseConfigured) {
    const { data } = await supabase.auth.getSession()
    return data.session
  }
  const raw = localStorage.getItem(LS_KEYS.session)
  return raw ? JSON.parse(raw) : null
}

export const demoCredentialsHint = isSupabaseConfigured
  ? null
  : { email: DEMO_USER, password: DEMO_PASS }

// Vuelve a poner una consulta borrada (botón "Deshacer").
export async function restaurarConsulta(consulta) {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('consultas').insert(consulta)
    if (error) throw error
    avisarConsultas()
    return listConsultas()
  }
  const actuales = readLocal(LS_KEYS.consultas, consultasSeed)
  const lista = writeLocal(
    LS_KEYS.consultas,
    [...actuales, consulta].sort((a, b) => b.creado_at.localeCompare(a.creado_at)),
  )
  avisarConsultas()
  return lista
}
