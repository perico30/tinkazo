-- ===================================================================
-- MIGRACIÓN: Sistema de Promotores para Tinkazo
-- SEGURO: Solo operaciones aditivas (CREATE TABLE, ALTER TABLE ADD COLUMN)
-- NO se modifica ni elimina ningún dato existente
-- ===================================================================

-- 1. Crear tabla de perfiles de promotores
CREATE TABLE IF NOT EXISTS promoter_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  admin_commission_pct NUMERIC DEFAULT 10,
  referral_code TEXT UNIQUE NOT NULL,
  guarantee_balance NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Agregar columnas a jornadas (NO toca datos existentes)
ALTER TABLE jornadas ADD COLUMN IF NOT EXISTS promoter_id UUID REFERENCES auth.users(id) DEFAULT NULL;
ALTER TABLE jornadas ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';
ALTER TABLE jornadas ADD COLUMN IF NOT EXISTS access_code TEXT DEFAULT NULL;

-- 3. Agregar columnas a users para código de referido (NO toca datos existentes)
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE DEFAULT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by UUID DEFAULT NULL;

-- 4. Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_promoter_profiles_referral_code ON promoter_profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by);
CREATE INDEX IF NOT EXISTS idx_jornadas_promoter_id ON jornadas(promoter_id);

-- 5. Habilitar RLS en promoter_profiles
ALTER TABLE promoter_profiles ENABLE ROW LEVEL SECURITY;

-- Política: cualquiera puede leer perfiles de promotores
DROP POLICY IF EXISTS "Promoter profiles are viewable by everyone" ON promoter_profiles;
CREATE POLICY "Promoter profiles are viewable by everyone"
  ON promoter_profiles FOR SELECT
  USING (true);

-- Política: solo el propio usuario o admin puede actualizar
DROP POLICY IF EXISTS "Promoter profiles are updatable by owner" ON promoter_profiles;
CREATE POLICY "Promoter profiles are updatable by owner"
  ON promoter_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Política: insertar (solo admin vía service role o authenticated)
DROP POLICY IF EXISTS "Promoter profiles insertable by authenticated" ON promoter_profiles;
CREATE POLICY "Promoter profiles insertable by authenticated"
  ON promoter_profiles FOR INSERT
  WITH CHECK (true);
