// El panel interno vive en un subdominio propio (admin.opticaamen.com).
// La misma app se sirve en ambos hosts y decide qué mostrar según el hostname:
//   admin.opticaamen.com/          → panel
//   opticaamen.com/                → catálogo público
// En local se prueba con http://admin.localhost:5175
export const isAdminHost = window.location.hostname.startsWith('admin.')

// En el dominio público el panel queda accesible bajo /admin, así el demo
// funciona aunque todavía no exista el subdominio configurado.
export const PANEL_PATH = isAdminHost ? '/' : '/admin'
export const LOGIN_PATH = isAdminHost ? '/login' : '/admin/login'

// Link al sitio público desde el panel (en el subdominio hay que salir del host).
export const publicSiteUrl = isAdminHost
  ? window.location.origin.replace('//admin.', '//')
  : '/'

export function adminPath(sub = '') {
  if (!sub) return PANEL_PATH
  return isAdminHost ? `/${sub}` : `/admin/${sub}`
}
