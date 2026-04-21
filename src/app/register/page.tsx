'use client';

import { useApp } from '@/context/AppContext';
import RegisterPage from '@/views/RegisterPage';

export default function RegisterRoute() {
  const ctx = useApp();

  return (
    <RegisterPage
      setCurrentView={ctx.navigateToView}
      primaryColor={ctx.appConfig.theme.primaryColor}
      onRegister={ctx.handleRegister}
      appName={ctx.appConfig.appName}
      logoUrl={ctx.appConfig.logoUrl}
    />
  );
}
