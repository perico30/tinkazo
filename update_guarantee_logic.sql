-- =============================================
-- FIX: Añadir descuento de garantía en purchase_carton
-- =============================================

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
  v_jornada_promoter_id uuid;
  v_jornada_status text;
  v_ticket_id uuid;
  v_commission_pct numeric;
  v_commission_amount numeric;
  v_guarantee_balance numeric;
BEGIN
  -- 1. Obtener saldo y promotor del usuario
  SELECT balance, referred_by INTO v_user_balance, v_user_referred_by
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

  -- 3. VALIDACIÓN ESTRICTA DE PROMOTOR
  IF v_jornada_promoter_id IS NULL THEN
    IF v_user_referred_by IS NOT NULL THEN
      RAISE EXCEPTION 'Acceso denegado: Los clientes de promotores no pueden comprar cartones de La Casa';
    END IF;
  ELSE
    IF v_user_referred_by IS NULL OR v_user_referred_by != v_jornada_promoter_id THEN
      RAISE EXCEPTION 'Acceso denegado: Solo puedes comprar cartones en las jornadas de tu propio promotor oficial';
    END IF;
  END IF;

  -- 4. Validar saldo
  IF v_user_balance < p_price THEN
    RAISE EXCEPTION 'Saldo insuficiente';
  END IF;

  -- 5. Lógica de Comisión y Garantía para Promotores
  IF v_jornada_promoter_id IS NOT NULL THEN
    SELECT admin_commission_pct, guarantee_balance INTO v_commission_pct, v_guarantee_balance
    FROM promoter_profiles
    WHERE user_id = v_jornada_promoter_id
    FOR UPDATE;

    IF FOUND THEN
      v_commission_amount := p_price * (COALESCE(v_commission_pct, 0) / 100.0);
      IF v_commission_amount > 0 THEN
        -- Descontar de la garantía del promotor
        UPDATE promoter_profiles
        SET guarantee_balance = guarantee_balance - v_commission_amount
        WHERE user_id = v_jornada_promoter_id;

        -- Registrar la transacción de comisión
        INSERT INTO transactions (user_id, amount, type, description)
        VALUES (v_jornada_promoter_id, -v_commission_amount, 'commission', 'Comisión administrador por cartón en jornada');
      END IF;
    END IF;
  END IF;

  -- 6. Descontar saldo al cliente
  UPDATE users
  SET balance = balance - p_price
  WHERE id = p_user_id;

  -- 7. Registrar transacción de compra del cliente
  INSERT INTO transactions (user_id, amount, type, description)
  VALUES (p_user_id, -p_price, 'ticket_purchase', 'Compra de cartón');

  -- 8. Crear el cartón (ticket)
  INSERT INTO tickets (user_id, jornada_id, predictions, botin_prediction)
  VALUES (p_user_id, p_jornada_id, p_predictions, p_botin_prediction)
  RETURNING id INTO v_ticket_id;

  RETURN v_ticket_id;
END;
$$;
