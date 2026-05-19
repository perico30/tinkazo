-- Verificar si hay triggers que bloquean el registro de Google OAuth
-- Primero veamos qué triggers existen en auth.users
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' AND event_object_table = 'users';

-- Si hay un trigger que inserta en public.users automáticamente,
-- necesitamos modificarlo para que sea tolerante con los campos faltantes
-- o eliminarlo para que nuestra app maneje la creación del perfil manualmente.
