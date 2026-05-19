-- =============================================
-- FIX: Añadir estado de pago global a Jornadas
-- =============================================

-- Agregamos la columna a la tabla jornadas si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jornadas' AND column_name='global_prize_processed') THEN
        ALTER TABLE public.jornadas ADD COLUMN global_prize_processed boolean DEFAULT false;
    END IF;
END $$;
