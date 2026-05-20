'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/supabaseClient';
import LogoIcon from '@/components/icons/LogoIcon';

export default function CompleteProfilePage() {
  const router = useRouter();
  const ctx = useApp();
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [googleData, setGoogleData] = useState<{ id: string; email: string; name: string } | null>(null);

  useEffect(() => {
    const pending = localStorage.getItem('tinkazoGooglePending');
    if (pending) {
      const data = JSON.parse(pending);
      setGoogleData(data);
      setUsername(data.name?.split(' ')[0] || '');
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleData) return;
    setError('');
    setIsLoading(true);

    try {
      // Validate referral code
      if (!referralCode.trim()) {
        setError('Debes ingresar un código de referido.');
        setIsLoading(false);
        return;
      }

      const matchedPromoter = ctx.appConfig.promoterProfiles.find(
        p => p.referralCode.toUpperCase() === referralCode.trim().toUpperCase()
      );
      const matchedSeller = ctx.appConfig.users.find(
        u => u.role === 'seller' && u.referralCode?.toUpperCase() === referralCode.trim().toUpperCase()
      );

      let referrerId: string | null = null;
      let assignedSellerId: string | null = null;

      if (matchedPromoter) {
        referrerId = matchedPromoter.userId;
        assignedSellerId = matchedPromoter.userId;
      } else if (matchedSeller) {
        referrerId = matchedSeller.id;
        assignedSellerId = matchedSeller.id;
      } else {
        setError('Código de referido no válido.');
        setIsLoading(false);
        return;
      }

      // Update the existing user profile in public.users (already created by auth trigger)
      const { error: updateError } = await supabase.from('users').update({
        username: username.trim(),
        phone: phone.trim(),
        country: 'BO',
        status: 'active',
        assigned_seller_id: assignedSellerId,
        referred_by: referrerId,
      }).eq('id', googleData.id);

      if (updateError) throw updateError;

      // Clean up temp data
      localStorage.removeItem('tinkazoGooglePending');

      // Store user info and redirect
      const newUser = {
        id: googleData.id,
        username: username.trim(),
        email: googleData.email,
        role: 'client' as const,
        phone: phone.trim(),
        country: 'BO',
        status: 'active' as const,
        balance: 0,
        assignedSellerId,
        referredBy: referrerId,
      };

      localStorage.setItem('tinkazoCurrentUser', JSON.stringify(newUser));
      localStorage.setItem('tinkazoUserRole', 'client');

      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Error al completar el perfil.');
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-md text-center bg-gray-800/80 border border-purple-500/30 p-8 rounded-2xl shadow-2xl shadow-purple-500/10 backdrop-blur-md">
          <span className="text-6xl mb-4 block animate-bounce">🎉</span>
          <h2 className="text-2xl font-bold text-white mb-2 font-sans">¡Registro Exitoso!</h2>
          <p className="text-purple-400 text-sm font-semibold mb-4">Tu cuenta ha sido activada automáticamente.</p>
          <p className="text-gray-400 text-xs font-medium">Redirigiéndote al inicio...</p>
        </div>
      </div>
    );
  }

  if (!googleData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {ctx.appConfig.logoUrl ? (
            <img src={ctx.appConfig.logoUrl} alt="Logo" className="h-16 w-auto mx-auto" />
          ) : (
            <LogoIcon className="h-16 w-16 text-cyan-300 mx-auto" style={{ filter: 'drop-shadow(0 0 10px currentColor)' }} />
          )}
          <h1 className="text-4xl font-bold text-white mt-4">{ctx.appConfig.appName}</h1>
        </div>
        <div className="gradient-border rounded-2xl shadow-2xl shadow-purple-500/10">
          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-center text-white mb-2">Completar Perfil</h2>
            <p className="text-center text-gray-400 text-sm mb-6">
              Hola <span className="text-cyan-400 font-semibold">{googleData.email}</span>, completa tu información.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">
                  Código de Referido <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  className="w-full bg-gray-700 border border-purple-500/50 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition font-mono tracking-widest text-center text-lg"
                  placeholder="EJ: TIGRE24"
                  required
                />
                <p className="text-[10px] text-gray-400 mt-1 text-center">Solicita este código a tu vendedor o promotor</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                  placeholder="Elige un nombre de usuario"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                  placeholder="71234567"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-400 text-center">{error}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-bold py-3 rounded-lg mt-2 shadow-lg btn-gradient disabled:opacity-50"
              >
                {isLoading ? 'Registrando...' : 'Completar Registro'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
