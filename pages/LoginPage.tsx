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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mapeo especial para el usuario Super Admin
    let loginEmail = email.trim();
    if (loginEmail.toLowerCase() === 'superadmin') {
        loginEmail = 'superadmin@tinkazo.com';
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-300 block mb-2">Correo Electrónico o Usuario</label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                  placeholder="tu@correo.com o superadmin"
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
              <div className="text-right">
                <a href="#" className="text-sm text-cyan-400 hover:underline">¿Olvidé mi contraseña?</a>
              </div>
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