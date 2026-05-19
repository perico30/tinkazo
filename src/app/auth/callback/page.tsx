'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabaseClient';

export default function AuthCallbackPage() {
  const router = useRouter();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const handleCallback = async () => {
      try {
        // Clear any previous session data
        localStorage.removeItem('tinkazoCurrentUser');
        localStorage.removeItem('tinkazoUserRole');
        localStorage.removeItem('tinkazoCurrentPath');

        // Try to get code from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
          console.log('Auth callback: exchanging code for session...');
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('Code exchange error:', exchangeError);
          }
        }

        // Also check for hash fragments (implicit flow)
        if (window.location.hash) {
          console.log('Auth callback: hash fragment detected, waiting for auto-session...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Wait a moment for session to be established
        await new Promise(resolve => setTimeout(resolve, 500));

        // Try getting session multiple times
        let session: any = null;
        for (let i = 0; i < 3; i++) {
          const { data, error } = await supabase.auth.getSession();
          if (data?.session) {
            session = data.session;
            break;
          }
          console.log(`Auth callback: attempt ${i + 1} - no session yet, waiting...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (!session?.user) {
          console.error('Auth callback: no session after retries');
          alert('No se pudo verificar la autenticación. Intenta de nuevo.');
          window.location.href = '/login';
          return;
        }

        console.log('Auth callback: session established for', session.user.email);

        // Check if user already exists in our users table (by ID or email)
        let existingUser = null;
        
        const { data: byId } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (byId) {
          existingUser = byId;
        } else {
          // Also check by email in case the auth ID is different
          const { data: byEmail } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single();
          existingUser = byEmail;
        }

        if (existingUser && existingUser.status === 'active') {
          // Active user: log them in directly
          console.log('Auth callback: active user found, role:', existingUser.role);
          localStorage.setItem('tinkazoCurrentUser', JSON.stringify(existingUser));
          localStorage.setItem('tinkazoUserRole', existingUser.role);
          
          const roleRoutes: Record<string, string> = {
            admin: '/admin',
            seller: '/seller',
            promoter: '/promoter',
            client: '/',
          };
          
          window.location.href = roleRoutes[existingUser.role] || '/';
        } else {
          // New user OR pending user: redirect to complete profile
          console.log('Auth callback: new/pending user, redirecting to complete-profile');
          localStorage.setItem('tinkazoGooglePending', JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
          }));
          window.location.href = '/complete-profile';
        }
      } catch (err) {
        console.error('Callback processing error:', err);
        alert('Error procesando la autenticación. Intenta de nuevo.');
        window.location.href = '/login';
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Verificando tu cuenta...</p>
        <p className="text-gray-500 text-sm mt-2">Espera un momento...</p>
      </div>
    </div>
  );
}
