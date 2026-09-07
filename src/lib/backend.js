import { categoriasSeed, productosSeed, promocionesSeed } from '../data/seed'
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
  session: 'oamen_admin_session',
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
    imagen: p.imagen,
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
    imagen: r.imagen,
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
    const row = { ...categoria, id: categoria.id || slugify(categoria.titulo) }
    const { error } = await supabase.from('categorias').upsert(row)
    if (error) throw error
    return listCategorias()
  }
  const actuales = readLocal(LS_KEYS.categorias, categoriasSeed)
  const id = categoria.id || slugify(categoria.titulo)
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
  return readLocal(LS_KEYS.productos, productosSeed)
}

export async function saveProducto(producto) {
  if (isSupabaseConfigured) {
    const id = producto.id || slugify(producto.titulo)
    const { error } = await supabase.from('productos').upsert(productoToRow({ ...producto, id }))
    if (error) throw error
    return listProductos()
  }
  const actuales = readLocal(LS_KEYS.productos, productosSeed)
  const id = producto.id || slugify(producto.titulo)
  const idx = actuales.findIndex((p) => p.id === id)
  const nuevo = { ...producto, id }
  if (idx >= 0) actuales[idx] = nuevo
  else actuales.push(nuevo)
  return writeLocal(LS_KEYS.productos, [...actuales])
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
    const row = { ...promo, id: promo.id || slugify(promo.titulo) }
    const { error } = await supabase.from('promociones').upsert(row)
    if (error) throw error
    return listPromociones()
  }
  const actuales = readLocal(LS_KEYS.promociones, promocionesSeed)
  const id = promo.id || slugify(promo.titulo)
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
