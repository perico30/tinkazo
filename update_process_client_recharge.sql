CREATE OR REPLACE FUNCTION public.process_client_recharge(
    p_request_id uuid,
    p_seller_id uuid,
    p_action text
) RETURNS void AS $$
DECLARE
    v_request record;
    v_seller_balance numeric;
    v_seller_role text;
BEGIN
    -- 1. Obtener y bloquear la solicitud
    SELECT * INTO v_request 
    FROM public.recharge_requests 
    WHERE id = p_request_id AND status = 'pending'
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Solicitud no encontrada o ya procesada.';
    END IF;

    IF p_action = 'approve' THEN
        -- 2. Verificar saldo y rol del vendedor
        SELECT balance, role INTO v_seller_balance, v_seller_role 
        FROM public.users 
        WHERE id = p_seller_id 
        FOR UPDATE;

        -- 3. Excepción de saldo solo si NO es promotor
        IF v_seller_role != 'promoter' AND v_seller_balance < v_request.amount THEN
            RAISE EXCEPTION 'Insufficient seller balance';
        END IF;

        -- 4. Debitar al vendedor (a los promotores también se les debita para llevar registro contable)
        UPDATE public.users 
        SET balance = balance - v_request.amount 
        WHERE id = p_seller_id;

        -- 5. Acreditar al cliente
        UPDATE public.users 
        SET balance = balance + v_request.amount 
        WHERE id = v_request.user_id;

        -- 6. Registrar transacciones en el historial
        -- Transacción para el vendedor (salida)
        INSERT INTO public.transactions (user_id, amount, type, reference_id, description)
        VALUES (p_seller_id, -v_request.amount, 'transfer_out', p_request_id, 'Recarga aprobada a cliente');

        -- Transacción para el cliente (entrada)
        INSERT INTO public.transactions (user_id, amount, type, reference_id, description)
        VALUES (v_request.user_id, v_request.amount, 'recharge', p_request_id, 'Recarga de saldo por vendedor/promotor');

    END IF;

    -- 7. Actualizar el estado de la solicitud
    UPDATE public.recharge_requests 
    SET status = CASE WHEN p_action = 'approve' THEN 'approved' ELSE 'rejected' END,
        processed_date = now(),
        processed_by = p_seller_id
    WHERE id = p_request_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
