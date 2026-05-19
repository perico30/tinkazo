import React, { useState } from 'react';
import LogoIcon from '../components/icons/LogoIcon';
import type { View, RegisteredUser } from '../types';
import { supabase } from '../supabaseClient';

interface LoginPageProps {
  setCurrentView: (view: View) => void;
  onAdminLogin: () => void;
  onUserLogin: (user: RegisteredUser) => void;
  users: RegisteredUser[];
  primaryColor: string;
  appName: string;
  logoUrl: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ setCurrentView, onAdminLogin, onUserLogin, users, primaryColor, appName, logoUrl }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mapeo especial para el usuario Super Admin
    let loginEmail = email.trim();
    if (loginEmail.toLowerCase() === 'superadmin') {
        loginEmail = 'superadmin@tinkazo.com';
    } else if (!loginEmail.includes('@')) {
        // Buscar el correo por el nombre de usuario
        const matchedUser = users.find(u => u.username.toLowerCase() === loginEmail.toLowerCase());
        if (matchedUser) {
            loginEmail = matchedUser.email;
        } else {
            setError('Usuario no encontrado. Intenta con tu correo electrónico.');
            setIsLoading(false);
            return;
        }
    }

    try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: loginEmail,
            password: password
        });

        if (authError) throw authError;

        if (authData.user) {
             const userProfile = users.find(u => u.email === authData.user?.email);
             if (userProfile) {
                 if (userProfile.status === 'pending') {
                     // Sign out immediately if pending
                     await supabase.auth.signOut();
                     setError('Tu cuenta está pendiente de activación por un administrador.');
                     setIsLoading(false);
                     return;
                 }
                 onUserLogin(userProfile);
             } else {
                 setError('No se encontró el perfil de usuario. Contacta soporte.');
                 await supabase.auth.signOut();
             }
        }
    } catch (err: any) {
        setError(err.message || 'Credenciales inválidas');
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Error al iniciar con Google');
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div 
          className="text-center mb-8 cursor-pointer"
          onClick={() => setCurrentView('home')}
        >
          {logoUrl ? (
            <img src={logoUrl} alt={`${appName} Logo`} className="h-16 w-auto mx-auto" />
          ) : (
            <LogoIcon className="h-16 w-16 text-cyan-300 mx-auto" style={{ filter: 'drop-shadow(0 0 10px currentColor)' }} />
          )}
          <h1 className="text-4xl font-bold text-white mt-4">{appName}</h1>
        </div>
        <div className="gradient-border rounded-2xl shadow-2xl shadow-purple-500/10">
          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-center text-white mb-6">Iniciar Sesión</h2>
            
            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 rounded-lg shadow-lg hover:bg-gray-100 transition disabled:opacity-50 mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isGoogleLoading ? 'Redirigiendo...' : 'Continuar con Google'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-600"></div>
              <span className="text-gray-500 text-sm">o con tu cuenta</span>
              <div className="flex-1 h-px bg-gray-600"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-300 block mb-2">Correo o Usuario</label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                  placeholder="usuario o tu@correo.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-300 block mb-2">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-400 text-center">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-bold py-3 rounded-lg shadow-lg btn-gradient disabled:opacity-50"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>
            <p className="text-center text-gray-400 mt-6">
              ¿No tienes cuenta?{' '}
              <button onClick={() => setCurrentView('register')} className="font-semibold text-cyan-400 hover:underline">Regístrate</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;