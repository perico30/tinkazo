-- SCRIPT DE REINICIO SEGURO DE BASE DE DATOS
-- Este script elimina toda la información operacional, jornadas y usuarios.
-- Solo preservará al usuario Administrador y la configuración visual de la app.

DO $$ 
DECLARE
  v_admin_uid UUID;
BEGIN
  -- 1. Obtener ID del admin (el primero que encuentre, típicamente tú)
  SELECT id INTO v_admin_uid FROM public.users WHERE role = 'admin' LIMIT 1;
  
  IF v_admin_uid IS NULL THEN
    RAISE EXCEPTION 'No se encontró un usuario administrador. Abortando limpieza para no perder el acceso a la plataforma.';
  END IF;

  -- 2. Limpiar todo el historial operativo de manera rápida con TRUNCATE
  TRUNCATE TABLE public.tickets CASCADE;
  TRUNCATE TABLE public.transactions CASCADE;
  TRUNCATE TABLE public.recharge_requests CASCADE;
  TRUNCATE TABLE public.withdrawal_requests CASCADE;
  
  -- 3. Limpiar jornadas y partidos (empezar desde cero)
  TRUNCATE TABLE public.matches CASCADE;
  TRUNCATE TABLE public.jornadas CASCADE;

  -- 4. Limpiar perfiles de promotores/vendedores 
  DELETE FROM public.seller_profiles;
  
  -- Verificar si la tabla de promotores existe y vaciarla de forma segura
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'promoter_profiles') THEN
      EXECUTE 'DELETE FROM public.promoter_profiles;';
  END IF;
  
  -- 5. Eliminar a todos los usuarios de la app (excepto al admin)
  DELETE FROM public.users WHERE id != v_admin_uid;

  -- 6. Eliminar a todos los usuarios del sistema de Autenticación (excepto al admin)
  -- Esto garantiza que no puedan volver a iniciar sesión con esas cuentas
  DELETE FROM auth.users WHERE id != v_admin_uid;

  -- 7. Resetear contadores en la configuración
  UPDATE public.app_config 
  SET botin_amount = 0;

  RAISE NOTICE 'Base de datos reiniciada con éxito. Admin preservado: %', v_admin_uid;
END $$;
