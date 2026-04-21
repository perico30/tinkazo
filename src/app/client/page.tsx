'use client';

import { useApp } from '@/context/AppContext';
import ClientPage from '@/views/ClientPage';

export default function ClientRoute() {
  const ctx = useApp();

  if (!ctx.currentUser) return null;

  return (
    <ClientPage
      currentUser={ctx.currentUser}
      config={ctx.appConfig}
      onUpdateUser={ctx.handleUpdateUser}
      onUpdateCarton={ctx.handleUpdateCarton}
      onDeleteCarton={ctx.handleDeleteCarton}
      onRequestWithdrawal={ctx.handleRequestWithdrawal}
      onRequestRecharge={ctx.handleRequestClientRecharge}
      onLogout={ctx.handleLogout}
      onExit={ctx.navigateToHome}
      onPlayJornada={ctx.handlePlayJornada}
    />
  );
}
