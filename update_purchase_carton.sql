-- Actualización de la función purchase_carton para aplicar restricciones de Promotores (Opción 2)
CREATE OR REPLACE FUNCTION public.purchase_carton(
  p_user_id uuid,
  p_jornada_id uuid,
  p_predictions jsonb,
  p_botin_prediction integer,
  p_price integer
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
DECLARE
  v_user_balance integer;
  v_user_referred_by uuid;
  v_jornada_promoter_id uuid;
  v_jornada_status text;
  v_ticket_id uuid;
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

  -- 3. VALIDACIÓN ESTRICTA DE PROMOTOR (Opción 2)
  -- Si es jornada de La Casa (promoter_id IS NULL)
  IF v_jornada_promoter_id IS NULL THEN
    IF v_user_referred_by IS NOT NULL THEN
      RAISE EXCEPTION 'Acceso denegado: Los clientes de promotores no pueden comprar cartones de La Casa';
    END IF;
  ELSE
    -- Si es jornada de un Promotor, el cliente DEBE pertenecer a ese promotor
    IF v_user_referred_by IS NULL OR v_user_referred_by != v_jornada_promoter_id THEN
      RAISE EXCEPTION 'Acceso denegado: Solo puedes comprar cartones en las jornadas de tu propio promotor oficial';
    END IF;
  END IF;

  -- 4. Validar saldo
  IF v_user_balance < p_price THEN
    RAISE EXCEPTION 'Saldo insuficiente';
  END IF;

  -- 5. Descontar saldo
  UPDATE users
  SET balance = balance - p_price
  WHERE id = p_user_id;

  -- 6. Registrar transacción
  INSERT INTO transactions (user_id, amount, type, description)
  VALUES (p_user_id, -p_price, 'ticket_purchase', 'Compra de cartón');

  -- 7. Crear el cartón (ticket)
  INSERT INTO cartones (user_id, jornada_id, predictions, botin_prediction)
  VALUES (p_user_id, p_jornada_id, p_predictions, p_botin_prediction)
  RETURNING id INTO v_ticket_id;

  RETURN v_ticket_id;
END;
$$;
