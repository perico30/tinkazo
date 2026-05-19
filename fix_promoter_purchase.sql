-- =============================================
-- FIX: Permitir a promotores comprar cartones usando su guarantee_balance
-- =============================================

DROP FUNCTION IF EXISTS public.purchase_carton(uuid, uuid, jsonb, integer, integer);
DROP FUNCTION IF EXISTS public.purchase_carton(uuid, uuid, jsonb, integer, numeric);
DROP FUNCTION IF EXISTS public.purchase_carton(uuid, uuid, jsonb, jsonb, numeric);
DROP FUNCTION IF EXISTS public.purchase_carton(uuid, text, jsonb, jsonb, numeric);

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
  v_user_role text;
  v_user_referred_by uuid;
  v_jornada_promoter_id uuid;
  v_jornada_status text;
  v_ticket_id uuid;
  v_promoter_balance numeric;
BEGIN
  -- 1. Obtener saldo, rol y promotor del usuario
  SELECT balance, role, referred_by INTO v_user_balance, v_user_role, v_user_referred_by
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;

  -- 2. Obtener estado y promotor de la jornada
  SELECT status, promoter_id INTO v_jornada_status, v_jornada_promoter_id
  FROM jornadas
  WHERE id = p_jornada_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Jornada no encontrada';
  END IF;

  IF v_jornada_status != 'abierta' THEN
    RAISE EXCEPTION 'La jornada no está abierta';
  END IF;

  -- 3. VALIDACIÓN DE PROMOTOR (solo para clientes, no para promotores comprando)
  IF v_user_role = 'client' THEN
    IF v_jornada_promoter_id IS NULL THEN
      IF v_user_referred_by IS NOT NULL THEN
        RAISE EXCEPTION 'Acceso denegado: Los clientes de promotores no pueden comprar cartones de La Casa';
      END IF;
    ELSE
      IF v_user_referred_by IS NULL OR v_user_referred_by != v_jornada_promoter_id THEN
        RAISE EXCEPTION 'Acceso denegado: Solo puedes comprar cartones en las jornadas de tu propio promotor oficial';
      END IF;
    END IF;
  END IF;

  -- 4. Validar saldo según el rol
  IF v_user_role = 'promoter' THEN
    -- Promotores usan guarantee_balance de promoter_profiles
    SELECT guarantee_balance INTO v_promoter_balance
    FROM promoter_profiles
    WHERE user_id = p_user_id
    FOR UPDATE;

    IF v_promoter_balance IS NULL OR v_promoter_balance < p_price THEN
      RAISE EXCEPTION 'Saldo insuficiente';
    END IF;

    -- Descontar del guarantee_balance del promotor
    UPDATE promoter_profiles
    SET guarantee_balance = guarantee_balance - p_price
    WHERE user_id = p_user_id;
  ELSE
    -- Clientes y otros roles usan users.balance
    IF v_user_balance < p_price THEN
      RAISE EXCEPTION 'Saldo insuficiente';
    END IF;

    UPDATE users
    SET balance = balance - p_price
    WHERE id = p_user_id;
  END IF;

  -- 5. Registrar transacción
  INSERT INTO transactions (user_id, amount, type, description)
  VALUES (p_user_id, -p_price, 'ticket_purchase', 'Compra de cartón');

  -- 6. Crear el cartón (ticket)
  INSERT INTO tickets (user_id, jornada_id, predictions, botin_prediction)
  VALUES (p_user_id, p_jornada_id, p_predictions, p_botin_prediction)
  RETURNING id INTO v_ticket_id;

  RETURN v_ticket_id;
END;
$$;
