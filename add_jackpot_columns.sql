-- Script para agregar las columnas faltantes del Pozo Acumulado a la configuración
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='app_config' AND column_name='global_jackpot') THEN
        ALTER TABLE public.app_config ADD COLUMN global_jackpot NUMERIC NOT NULL DEFAULT 0.00;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='app_config' AND column_name='seed_jackpot') THEN
        ALTER TABLE public.app_config ADD COLUMN seed_jackpot NUMERIC NOT NULL DEFAULT 0.00;
    END IF;
END $$;

-- (Opcional) Migrar el dinero que había en botin_amount hacia los nuevos pozos
UPDATE public.app_config 
SET seed_jackpot = botin_amount, 
    global_jackpot = botin_amount 
WHERE global_jackpot = 0;
