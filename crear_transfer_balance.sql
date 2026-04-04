-- Crea o reemplaza la función RPC para que los vendedores puedan transferir saldo de forma segura,
-- saltándose las políticas RLS que impiden modificar a otros usuarios directamente desde el Frontend

CREATE OR REPLACE FUNCTION transfer_balance(
  p_seller_id UUID,
  p_client_id UUID,
  p_amount DECIMAL
) RETURNS VOID AS $$
DECLARE
  v_seller_balance DECIMAL;
  v_client_username TEXT;
  v_seller_username TEXT;
BEGIN
  -- 1. Validar monto
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'El monto debe ser mayor a 0.';
  END IF;

  -- 2. Asegurar que el vendedor tenga saldo y bloquear filas para evitar errores en transacciones simultáneas
  SELECT balance, username INTO v_seller_balance, v_seller_username 
  FROM public.users WHERE id = p_seller_id FOR UPDATE;

  IF v_seller_balance < p_amount THEN
    RAISE EXCEPTION 'Saldo insuficiente.';
  END IF;

  SELECT username INTO v_client_username 
  FROM public.users WHERE id = p_client_id FOR UPDATE;

  IF NOT FOUND THEN
      RAISE EXCEPTION 'El cliente no existe o fue eliminado.';
  END IF;

  -- 3. Restar al vendedor y registrar su transacción
  UPDATE public.users SET balance = balance - p_amount WHERE id = p_seller_id;
  INSERT INTO public.transactions(user_id, amount, type, description)
  VALUES (p_seller_id, -p_amount, 'transfer_out', 'Transferencia manual enviada a ' || v_client_username);

  -- 4. Sumar al cliente y registrar su transacción
  UPDATE public.users SET balance = balance + p_amount WHERE id = p_client_id;
  INSERT INTO public.transactions(user_id, amount, type, description)
  VALUES (p_client_id, p_amount, 'transfer_in', 'Transferencia manual recibida de ' || v_seller_username);

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
