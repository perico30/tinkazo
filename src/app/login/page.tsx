'use client';

import { useApp } from '@/context/AppContext';
import LoginPage from '@/views/LoginPage';

export default function LoginRoute() {
  const ctx = useApp();

  return (
    <LoginPage
      setCurrentView={ctx.navigateToView}
      onAdminLogin={ctx.handleAdminLogin}
      onUserLogin={ctx.handleUserLogin}
      users={ctx.appConfig.users}
      primaryColor={ctx.appConfig.theme.primaryColor}
      appName={ctx.appConfig.appName}
      logoUrl={ctx.appConfig.logoUrl}
    />
  );
}
