'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/login');
          return;
        }

        if (session?.user) {
          // Check if user already exists in our users table
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (existingUser) {
            // Existing user: store in localStorage and redirect based on role
            localStorage.setItem('tinkazoCurrentUser', JSON.stringify(existingUser));
            localStorage.setItem('tinkazoUserRole', existingUser.role);
            
            const roleRoutes: Record<string, string> = {
              admin: '/admin',
              seller: '/seller',
              promoter: '/promoter',
              client: '/',
            };
            
            // Force full reload so AppContext picks up the user from localStorage
            window.location.href = roleRoutes[existingUser.role] || '/';
          } else {
            // New Google user: redirect to complete profile
            localStorage.setItem('tinkazoGooglePending', JSON.stringify({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
            }));
            router.push('/complete-profile');
          }
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Callback processing error:', err);
        router.push('/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Verificando tu cuenta...</p>
      </div>
    </div>
  );
}
