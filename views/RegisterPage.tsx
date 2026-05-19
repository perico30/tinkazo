import React, { useState } from 'react';
import LogoIcon from '../components/icons/LogoIcon';
import type { View, RegisteredUser } from '../types';
import { supabase } from '../supabaseClient';

interface RegisterPageProps {
  setCurrentView: (view: View) => void;
  primaryColor: string;
  onRegister: (userData: Omit<RegisteredUser, 'id' | 'role' | 'assignedSellerId' | 'status' | 'balance'> & { referralCode?: string }) => void;
  appName: string;
  logoUrl: string;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ setCurrentView, primaryColor, onRegister, appName, logoUrl }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralCode.trim()) {
      alert('Debes ingresar un código de referido para registrarte. Solicítalo a tu vendedor o promotor.');
      return;
    }
    onRegister({ username, email, password, phone, country: 'BO', referralCode: referralCode.trim().toUpperCase() });
  };

  const handleGoogleRegister = async () => {
    if (!referralCode.trim()) {
      alert('Debes ingresar un código de referido antes de registrarte con Google.');
      return;
    }
    setIsGoogleLoading(true);
    try {
      // Store referral code for the callback to use
      localStorage.setItem('tinkazoPendingReferral', referralCode.trim().toUpperCase());
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      alert(err.message || 'Error al registrar con Google');
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
            <h2 className="text-3xl font-bold text-center text-white mb-6">Crear Cuenta</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="referral-code" className="text-sm font-medium text-gray-300 block mb-2">
                  Código de Referido <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="referral-code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full bg-gray-700 border border-purple-500/50 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition font-mono tracking-widest text-center text-lg"
                  placeholder="EJ: TIGRE24"
                  required
                />
                <p className="text-[10px] text-gray-400 mt-1 text-center">Solicita este código a tu vendedor o promotor</p>
              </div>

              {/* Google Register Button */}
              <button
                type="button"
                onClick={handleGoogleRegister}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 rounded-lg shadow-lg hover:bg-gray-100 transition disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isGoogleLoading ? 'Redirigiendo...' : 'Registrarse con Google'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-600"></div>
                <span className="text-gray-500 text-sm">o manualmente</span>
                <div className="flex-1 h-px bg-gray-600"></div>
              </div>

              <div>
                <label htmlFor="username" className="text-sm font-medium text-gray-300 block mb-2">Usuario</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                  placeholder="Elige un nombre de usuario"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-300 block mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                  placeholder="tu@correo.com"
                  required
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
                  placeholder="Crea una contraseña segura"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-medium text-gray-300 block mb-2">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                  placeholder="71234567"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white font-bold py-3 rounded-lg mt-2 shadow-lg btn-gradient"
              >
                Registrarse
              </button>
            </form>
            <p className="text-center text-gray-400 mt-6">
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => setCurrentView('login')} className="font-semibold text-cyan-400 hover:underline">Inicia sesión</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;