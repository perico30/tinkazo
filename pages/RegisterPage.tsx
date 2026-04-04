import React, { useState } from 'react';
import LogoIcon from '../components/icons/LogoIcon';
import type { View, RegisteredUser } from '../types';
import { COUNTRIES } from '../constants/countries';

interface RegisterPageProps {
  setCurrentView: (view: View) => void;
  primaryColor: string;
  // FIX: Updated the Omit type to also exclude 'status' and 'balance', which are handled by the parent component.
  onRegister: (userData: Omit<RegisteredUser, 'id' | 'role' | 'assignedSellerId' | 'status' | 'balance'>) => void;
  appName: string;
  logoUrl: string;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ setCurrentView, primaryColor, onRegister, appName, logoUrl }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0].code);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister({ username, email, password, phone, country });
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="text-sm font-medium text-gray-300 block mb-2">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                    placeholder="Tu teléfono"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="country" className="text-sm font-medium text-gray-300 block mb-2">País</label>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition appearance-none"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white font-bold py-3 rounded-lg mt-6 shadow-lg btn-gradient"
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