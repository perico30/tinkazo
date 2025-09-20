import React, { useState } from 'react';
import LogoIcon from '../components/icons/LogoIcon';
import type { View, RegisteredUser } from '../types';

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Credenciales del Super Admin
    if (username === 'superadmin' && password === 'walele') {
      onAdminLogin();
      return;
    }

    // Lógica para usuarios normales
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      if (user.status === 'pending') {
        setError('Tu cuenta está pendiente de activación por un administrador.');
        return;
      }
      onUserLogin(user);
    } else {
      setError('Credenciales inválidas');
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
                <label htmlFor="username" className="text-sm font-medium text-gray-300 block mb-2">Usuario</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                  placeholder="Tu nombre de usuario"
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
                className="w-full text-white font-bold py-3 rounded-lg shadow-lg btn-gradient"
              >
                Iniciar Sesión
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