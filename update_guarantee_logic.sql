-- =============================================
-- FIX: Lógica de Quiniela Centralizada y Comisiones Directas
-- =============================================

-- Primero añadimos las columnas necesarias a app_config si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='app_config' AND column_name='global_jackpot') THEN
        ALTER TABLE public.app_config ADD COLUMN global_jackpot numeric DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='app_config' AND column_name='seed_jackpot') THEN
        ALTER TABLE public.app_config ADD COLUMN seed_jackpot numeric DEFAULT 0;
    END IF;
END $$;

CREATE OR REPLACE FUNCTION public.purchase_carton(
  p_user_id uuid,
  p_jornada_id uuid,
  p_predictions jsonb,
  p_botin_prediction jsonb,
  p_price numeric
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_user_balance numeric;
  v_user_referred_by uuid;
  v_referrer_role text;
  v_jornada_status text;
  v_ticket_id uuid;
  v_commission_amount numeric;
  v_jackpot_contribution numeric;
BEGIN
  -- 1. Obtener saldo y quién refirió al usuario
  SELECT balance, referred_by INTO v_user_balance, v_user_referred_by
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;

  -- 2. Obtener estado de la jornada
  SELECT status INTO v_jornada_status
  FROM jornadas
  WHERE id = p_jornada_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Jornada no encontrada';
  END IF;

  IF v_jornada_status != 'abierta' THEN
    RAISE EXCEPTION 'La jornada no está abierta';
  END IF;

  -- 3. Validar saldo del cliente
  IF v_user_balance < p_price THEN
    RAISE EXCEPTION 'Saldo insuficiente';
  END IF;

  -- 4. Lógica de Comisión Inmediata para el Promotor (20%)
  IF v_user_referred_by IS NOT NULL THEN
    -- Verificar si el que lo refirió es promotor
    SELECT role INTO v_referrer_role
    FROM users
    WHERE id = v_user_referred_by;

    IF v_referrer_role = 'promoter' THEN
      v_commission_amount := p_price * 0.20;
      
      IF v_commission_amount > 0 THEN
        -- Abonar comisión al saldo del promotor
        UPDATE users
        SET balance = balance + v_commission_amount
        WHERE id = v_user_referred_by;

        -- Registrar la transacción de comisión
        INSERT INTO transactions (user_id, amount, type, description)
        VALUES (v_user_referred_by, v_commission_amount, 'commission', 'Comisión directa por venta de cartón');
      END IF;
    END IF;
  END IF;

  -- 5. Aporte al Pozo Global (50%)
  v_jackpot_contribution := p_price * 0.50;
  UPDATE app_config
  SET global_jackpot = COALESCE(global_jackpot, 0) + v_jackpot_contribution
  WHERE id = 'main';

  -- 6. Descontar saldo al cliente
  UPDATE users
  SET balance = balance - p_price
  WHERE id = p_user_id;

  -- 7. Registrar transacción de compra del cliente
  INSERT INTO transactions (user_id, amount, type, description)
  VALUES (p_user_id, -p_price, 'ticket_purchase', 'Compra de cartón para pozo global');

  -- 8. Crear el cartón (ticket)
  INSERT INTO tickets (user_id, jornada_id, predictions, botin_prediction)
  VALUES (p_user_id, p_jornada_id, p_predictions, p_botin_prediction)
  RETURNING id INTO v_ticket_id;

  RETURN v_ticket_id;
END;
$$;
