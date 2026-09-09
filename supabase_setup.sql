-- =============================================
-- ÓPTICA A.M.E.N. - Schema y datos iniciales
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- =============================================

-- 1. Tablas
CREATE TABLE IF NOT EXISTS categorias (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  orden INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS productos (
  id TEXT PRIMARY KEY,
  categoria_id TEXT REFERENCES categorias(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  marca TEXT DEFAULT '',
  precio NUMERIC NOT NULL DEFAULT 0,
  precio_anterior NUMERIC,
  cuotas_cantidad INTEGER,
  cuotas_tarjeta TEXT,
  descripcion TEXT DEFAULT '',
  imagen TEXT DEFAULT '',
  destacado BOOLEAN DEFAULT FALSE,
  activo BOOLEAN DEFAULT TRUE,
  orden INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS promociones (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT DEFAULT '',
  tarjeta TEXT,
  activo BOOLEAN DEFAULT TRUE,
  orden INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS consultas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  motivo TEXT DEFAULT '',
  mensaje TEXT NOT NULL,
  leida BOOLEAN DEFAULT FALSE,
  creado_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS: lectura pública, escritura solo para usuarios autenticados (admin)
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE promociones ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categorias" ON categorias FOR SELECT USING (true);
CREATE POLICY "Auth write categorias" ON categorias FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public read productos" ON productos FOR SELECT USING (true);
CREATE POLICY "Auth write productos" ON productos FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Public read promociones" ON promociones FOR SELECT USING (true);
CREATE POLICY "Auth write promociones" ON promociones FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Consultas del formulario: cualquiera puede enviar, solo el admin las lee.
CREATE POLICY "Public insert consultas" ON consultas FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read consultas" ON consultas FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth update consultas" ON consultas FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth delete consultas" ON consultas FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Storage bucket para imágenes de productos
INSERT INTO storage.buckets (id, name, public) VALUES ('productos', 'productos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read storage" ON storage.objects FOR SELECT USING (bucket_id = 'productos');
CREATE POLICY "Auth upload storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'productos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update storage" ON storage.objects FOR UPDATE USING (bucket_id = 'productos' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete storage" ON storage.objects FOR DELETE USING (bucket_id = 'productos' AND auth.role() = 'authenticated');

-- 4. Datos iniciales (mismos que el modo demo, ver src/data/seed.js)
INSERT INTO categorias (id, titulo, orden) VALUES
  ('sol', 'Anteojos de Sol', 0),
  ('recetados', 'Anteojos Recetados', 1),
  ('contacto', 'Lentes de Contacto', 2),
  ('accesorios', 'Accesorios', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO productos (id, categoria_id, titulo, marca, precio, precio_anterior, cuotas_cantidad, cuotas_tarjeta, descripcion, imagen, destacado, activo, orden) VALUES
  ('ray-classic-negro', 'sol', 'Aviador Clásico', 'Ray-Ban', 145000, 168000, 3, 'todas las tarjetas', 'El aviador de siempre: marco metálico, lentes con protección UV400 y puente doble. Ideal para uso diario.', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80', true, true, 0),
  ('wayfarer-havana', 'sol', 'Wayfarer Havana', 'Ray-Ban', 132000, NULL, 6, 'Visa y Mastercard', 'Marco de acetato color havana, forma clásica wayfarer. Lentes polarizados.', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80', true, true, 1),
  ('redonditos-oro', 'sol', 'Redondos Oro', 'Vulk', 68000, 79000, 3, 'todas las tarjetas', 'Marco metálico dorado con lentes degradé. Estilo retro liviano.', 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80', false, true, 2),
  ('rectangular-carey', 'recetados', 'Rectangular Carey', 'Infinit', 54000, NULL, 6, 'todas las tarjetas', 'Marco liviano de acetato símil carey. Incluye armazón, no incluye cristales.', 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=80', true, true, 0),
  ('ovalado-titanio', 'recetados', 'Ovalado Titanio', 'Vulk', 89000, 99000, 6, 'Visa y Mastercard', 'Marco ultraliviano de titanio, ideal para uso prolongado. Ajuste anatómico.', 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800&q=80', false, true, 1),
  ('cuadrado-negro-mate', 'recetados', 'Cuadrado Negro Mate', 'Infinit', 47000, NULL, 3, 'todas las tarjetas', 'Marco de acetato negro mate, diseño unisex, calce universal.', 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80', false, true, 2),
  ('lentes-contacto-diarios', 'contacto', 'Lentes de Contacto Diarios x30', 'Acuvue', 38000, NULL, 3, 'todas las tarjetas', 'Caja de 30 unidades, descartables diarios. Alta transmisión de oxígeno.', 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80', true, true, 0),
  ('estuche-rigido', 'accesorios', 'Estuche Rígido', 'Óptica A.M.E.N.', 8500, NULL, NULL, NULL, 'Estuche rígido acolchado con paño de limpieza incluido.', 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=80', false, true, 0)
ON CONFLICT (id) DO NOTHING;

INSERT INTO promociones (id, titulo, descripcion, tarjeta, activo, orden) VALUES
  ('promo-3-cuotas', '3 cuotas sin interés', 'Con todas las tarjetas de crédito, en toda la tienda.', 'Todas las tarjetas', true, 0),
  ('promo-recetados', '20% OFF en segundo par', 'Llevando dos armazones recetados, el segundo tiene 20% de descuento.', NULL, true, 1),
  ('promo-banco', '6 cuotas sin interés', 'Pagando con tarjetas Visa o Mastercard emitidas por Banco Galicia.', 'Visa / Mastercard Galicia', true, 2)
ON CONFLICT (id) DO NOTHING;

-- 5. Crear el usuario admin desde Supabase Dashboard → Authentication → Users
-- (email/password del local, no hace falta SQL para esto).
