# Óptica A.M.E.N. — Catálogo web

Demo de catálogo web para óptica: sitio público (catálogo, precios, promociones con
tarjeta/cuotas) + panel interno para cargar productos, precios y destacar promociones.

## Stack

React + Vite + Tailwind v4 + React Router + Supabase (auth y base de datos).

## Modo demo (sin Supabase)

Corriendo `npm run dev` sin configurar variables de entorno, el sitio funciona
completo con datos guardados en `localStorage` del navegador — ideal para mostrarle
el flujo al cliente sin depender de infraestructura.

Login del panel interno en modo demo: `/admin/login`

- Usuario: `admin@opticaamen.com`
- Contraseña: `amen2026`

(configurable en `.env`, ver `.env.example`)

## Conectar Supabase real

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. Ejecutar `supabase_setup.sql` en el SQL Editor del proyecto.
3. Crear un usuario admin en Authentication → Users.
4. Copiar `.env.example` a `.env` y completar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
5. Reiniciar `npm run dev`. El sitio pasa a usar Supabase automáticamente (login real,
   datos persistidos en la base, sin localStorage).

## Scripts

```bash
npm run dev       # desarrollo
npm run build     # build de producción
npm run preview   # preview del build
```
