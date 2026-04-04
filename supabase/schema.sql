-- ==========================================
-- TINKAZO SUPABASE SCHEMA MIGRATION
-- ==========================================

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. LIMPIEZA PREVIA Y TABLAS
-- ==========================================

-- PRECAUCIÓN: Esto borrará los datos existentes para aplicar la nueva estructura limpia.
DROP TABLE IF EXISTS public.recharge_requests CASCADE;
DROP TABLE IF EXISTS public.withdrawal_requests CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.tickets CASCADE;
DROP TABLE IF EXISTS public.matches CASCADE;
DROP TABLE IF EXISTS public.jornadas CASCADE;
DROP TABLE IF EXISTS public.seller_profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.app_config CASCADE;

-- Tabla de Configuración de la App (un solo registro)
CREATE TABLE public.app_config (
    id TEXT PRIMARY KEY DEFAULT 'main',
    app_name TEXT NOT NULL DEFAULT 'TINKAZO',
    theme JSONB NOT NULL DEFAULT '{"backgroundColor": "#020617", "textColor": "#ffffff", "primaryColor": "#a855f7", "backgroundStyle": "space"}',
    botin_amount NUMERIC NOT NULL DEFAULT 10000.00,
    seller_commission_percentage NUMERIC NOT NULL DEFAULT 10.00,
    admin_whatsapp TEXT,
    welcome_message JSONB,
    welcome_popup JSONB,
    jackpots JSONB,
    video_tutorials JSONB,
    carousel_images JSONB,
    recharge_qr_url TEXT,
    social_links JSONB,
    legal_links JSONB,
    sections_order JSONB,
    teams JSONB NOT NULL DEFAULT '[]'::jsonb,
    minutes_before_block NUMERIC NOT NULL DEFAULT 10,
    footer_text TEXT NOT NULL DEFAULT '© 2026 TINKAZO. Todos los derechos reservados.',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Inicializar config
INSERT INTO public.app_config (id) VALUES ('main') ON CONFLICT DO NOTHING;

-- Tabla de Usuarios Extendida
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    country TEXT,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'seller', 'admin')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
    assigned_seller_id UUID REFERENCES public.users(id),
    balance NUMERIC NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Perfiles de Vendedores (datos extra solo para vendedores)
CREATE TABLE public.seller_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    qr_code_url TEXT,
    whatsapp_number TEXT,
    commission_percentage NUMERIC NOT NULL DEFAULT 10.00
);

-- Jornadas
CREATE TABLE public.jornadas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'abierta' CHECK (status IN ('abierta', 'cerrada', 'cancelada')),
    first_prize_amount NUMERIC NOT NULL DEFAULT 0.00,
    second_prize_amount NUMERIC NOT NULL DEFAULT 0.00,
    carton_price NUMERIC NOT NULL DEFAULT 0.00,
    botin_match_id UUID,
    botin_result TEXT, -- Ej: "2-1"
    flag_icon_url TEXT,
    styling JSONB,
    results_processed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partidos (Matches)
CREATE TABLE public.matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    jornada_id UUID NOT NULL REFERENCES public.jornadas(id) ON DELETE CASCADE,
    local_team_id TEXT NOT NULL,
    visitor_team_id TEXT NOT NULL,
    date_time TIMESTAMPTZ NOT NULL,
    result TEXT CHECK (result IN ('1', 'X', '2')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cartones (Tickets)
CREATE TABLE public.tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    jornada_id UUID NOT NULL REFERENCES public.jornadas(id) ON DELETE CASCADE,
    predictions JSONB NOT NULL, -- {"match_id": "1", ...}
    botin_prediction JSONB, -- {"localScore": 2, "visitorScore": 1}
    purchase_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    hits INT DEFAULT 0,
    prize_won NUMERIC DEFAULT 0.00,
    prize_details JSONB,
    result_notified BOOLEAN NOT NULL DEFAULT false
);

-- Transacciones
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('recharge', 'withdrawal', 'prize', 'ticket_purchase', 'commission')),
    reference_id UUID,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Solicitudes de Retiro
CREATE TABLE public.withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    amount NUMERIC NOT NULL,
    user_qr_code_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
    request_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_date TIMESTAMPTZ,
    processed_by UUID REFERENCES public.users(id)
);

-- Solicitudes de Recarga
CREATE TABLE public.recharge_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id),
    amount NUMERIC NOT NULL,
    requester_role TEXT NOT NULL CHECK (requester_role IN ('client', 'seller')),
    proof_of_payment_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    request_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_date TIMESTAMPTZ,
    processed_by UUID REFERENCES public.users(id)
);


-- ==========================================
-- 2. AUTOMATIZACIÓN DE AUTENTICACIÓN
-- ==========================================

-- Función para insertar automáticamente en public.users cuando se registra en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, username, role, status)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'username', 'User_' || substr(new.id::text, 1, 6)),
    COALESCE(new.raw_user_meta_data->>'role', 'client'),
    'pending'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar la función anterior al registrar
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==========================================
-- 3. SEGURIDAD A NIVEL DE FILAS (RLS)
-- ==========================================

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jornadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recharge_requests ENABLE ROW LEVEL SECURITY;

-- Helper function: Is Admin?
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- POLÍTICAS APP_CONFIG
CREATE POLICY "Config pública para lectura" ON public.app_config FOR SELECT USING (true);
CREATE POLICY "Admins pueden actualizar config" ON public.app_config FOR UPDATE USING (public.is_admin());

-- POLÍTICAS USERS
CREATE POLICY "Users pueden ver su propio perfil" ON public.users FOR SELECT USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "Vendedores pueden ver sus clientes asignados" ON public.users FOR SELECT USING (assigned_seller_id = auth.uid());
CREATE POLICY "Users pueden editar info básica" ON public.users FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins pueden editar todo usuario" ON public.users FOR UPDATE USING (public.is_admin());

-- POLÍTICAS SELLER PROFILES
CREATE POLICY "Lectura pública de vendedores (o para clientes)" ON public.seller_profiles FOR SELECT USING (true);
CREATE POLICY "Vendedores editan su perfil" ON public.seller_profiles FOR UPDATE USING (user_id = auth.uid() OR public.is_admin());

-- POLÍTICAS JORNADAS Y MATCHES
CREATE POLICY "Lectura pública de jornadas" ON public.jornadas FOR SELECT USING (true);
CREATE POLICY "Solo admins modifican jornadas" ON public.jornadas FOR ALL USING (public.is_admin());

CREATE POLICY "Lectura pública de matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Solo admins modifican matches" ON public.matches FOR ALL USING (public.is_admin());

-- POLÍTICAS TICKETS (Cartones)
CREATE POLICY "Users ven sus propios cartones" ON public.tickets FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users insertan cartones a su nombre" ON public.tickets FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users actualizan sus cartones" ON public.tickets FOR UPDATE USING (user_id = auth.uid());

-- POLÍTICAS TRANSACCIONES
CREATE POLICY "Users ven sus transacciones" ON public.transactions FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Solo sistema/admins insertan transacciones" ON public.transactions FOR INSERT WITH CHECK (public.is_admin()); -- Eventualmente mediante RPC

-- POLÍTICAS SOLICITUDES RETIRO Y RECARGA
CREATE POLICY "Users ven sus peticiones de retiro" ON public.withdrawal_requests FOR SELECT USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY "Users crean sus peticiones de retiro" ON public.withdrawal_requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins gestionan retiros" ON public.withdrawal_requests FOR UPDATE USING (public.is_admin());

CREATE POLICY "Users ven sus peticiones de recarga" ON public.recharge_requests FOR SELECT USING (user_id = auth.uid() OR public.is_admin() OR processed_by = auth.uid());
CREATE POLICY "Users crean sus peticiones de recarga" ON public.recharge_requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Vendedores y admins procesan recargas" ON public.recharge_requests FOR UPDATE USING (
    public.is_admin() OR 
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'seller'
);

-- ==========================================
-- 4. ALMACENAMIENTO (STORAGE)
-- ==========================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tinkazo_public', 'tinkazo_public', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Lectura pública de imágenes" ON storage.objects FOR SELECT USING (bucket_id = 'tinkazo_public');
CREATE POLICY "Admins borran imágenes" ON storage.objects FOR DELETE USING (bucket_id = 'tinkazo_public' AND public.is_admin());

-- ==========================================
-- 5. PROCEDIMIENTOS ALMACENADOS (RPC)
-- ==========================================

-- Función segura para procesar recargas de clientes debitando al vendedor
DROP FUNCTION IF EXISTS public.process_client_recharge(uuid, uuid, text);

CREATE OR REPLACE FUNCTION public.process_client_recharge(
    p_request_id uuid,
    p_seller_id uuid,
    p_action text
) RETURNS void AS $$
DECLARE
    v_request record;
    v_seller_balance numeric;
BEGIN
    -- 1. Obtener y bloquear la solicitud
    SELECT * INTO v_request 
    FROM public.recharge_requests 
    WHERE id = p_request_id AND status = 'pending'
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Solicitud no encontrada o ya procesada.';
    END IF;

    -- Validar que el vendedor es el autorizado (Opcional, pero recomendado)
    -- IF v_request.processed_by IS NOT NULL AND v_request.processed_by != p_seller_id THEN
    --    RAISE EXCEPTION 'No autorizado.';
    -- END IF;

    IF p_action = 'approve' THEN
        -- 2. Verificar saldo del vendedor
        SELECT balance INTO v_seller_balance 
        FROM public.users 
        WHERE id = p_seller_id 
        FOR UPDATE;

        IF v_seller_balance < v_request.amount THEN
            RAISE EXCEPTION 'Insufficient seller balance';
        END IF;

        -- 3. Debitar al vendedor
        UPDATE public.users 
        SET balance = balance - v_request.amount 
        WHERE id = p_seller_id;

        -- 4. Acreditar al cliente
        UPDATE public.users 
        SET balance = balance + v_request.amount 
        WHERE id = v_request.user_id;

        -- 5. Registrar transacciones en el historial
        -- Transacción para el vendedor (salida)
        INSERT INTO public.transactions (user_id, amount, type, reference_id, description)
        VALUES (p_seller_id, -v_request.amount, 'transfer_out', p_request_id, 'Recarga aprobada a cliente');

        -- Transacción para el cliente (entrada)
        INSERT INTO public.transactions (user_id, amount, type, reference_id, description)
        VALUES (v_request.user_id, v_request.amount, 'recharge', p_request_id, 'Recarga de saldo por vendedor');

    END IF;

    -- 6. Actualizar el estado de la solicitud
    UPDATE public.recharge_requests 
    SET status = CASE WHEN p_action = 'approve' THEN 'approved' ELSE 'rejected' END,
        processed_date = now(),
        processed_by = p_seller_id
    WHERE id = p_request_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==========================================
-- 8. COMPRA SEGURA DE CARTONES
-- ==========================================

DROP FUNCTION IF EXISTS public.purchase_carton(uuid, text, jsonb, jsonb, numeric);
DROP FUNCTION IF EXISTS public.purchase_carton(uuid, uuid, jsonb, jsonb, numeric);

CREATE OR REPLACE FUNCTION public.purchase_carton(
    p_user_id uuid,
    p_jornada_id uuid,
    p_predictions jsonb,
    p_botin_prediction jsonb,
    p_price numeric
) RETURNS uuid AS $$
DECLARE
    v_user_balance numeric;
    v_jornada_status text;
    v_new_ticket_id uuid;
BEGIN
    -- 1. Verificar balance del cliente
    SELECT balance INTO v_user_balance 
    FROM public.users 
    WHERE id = p_user_id 
    FOR UPDATE;

    IF v_user_balance IS NULL THEN
        RAISE EXCEPTION 'Usuario no encontrado.';
    END IF;

    IF v_user_balance < p_price THEN
        RAISE EXCEPTION 'Saldo insuficiente.';
    END IF;

    -- 2. Asegurar que la jornada esté abierta (previa revisión)
    SELECT status INTO v_jornada_status 
    FROM public.jornadas 
    WHERE id = p_jornada_id;

    IF v_jornada_status IS NULL OR v_jornada_status != 'abierta' THEN
        RAISE EXCEPTION 'Jornada no disponible o cerrada.';
    END IF;

    -- 3. Debitar al cliente
    UPDATE public.users 
    SET balance = balance - p_price 
    WHERE id = p_user_id;

    -- 4. Registrar la transacción
    INSERT INTO public.transactions (user_id, amount, type, description)
    VALUES (p_user_id, -p_price, 'ticket_purchase', 'Compra de cartón para la jornada');

    -- 5. Emitir el cartón
    INSERT INTO public.tickets (user_id, jornada_id, predictions, botin_prediction)
    VALUES (p_user_id, p_jornada_id, p_predictions, p_botin_prediction)
    RETURNING id INTO v_new_ticket_id;

    RETURN v_new_ticket_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;



-- ==========================================
-- FIN DEL SCRIPT
-- ==========================================
