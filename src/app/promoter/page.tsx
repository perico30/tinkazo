'use client';

import { useApp } from '@/context/AppContext';
import PromoterPage from '@/views/PromoterPage';

export default function PromoterRoute() {
  const ctx = useApp();

  if (!ctx.currentUser) return null;

  return (
    <PromoterPage
      currentUser={ctx.currentUser}
      config={ctx.appConfig}
      onSave={ctx.handleSaveConfig}
      onUpdateUser={ctx.handleUpdateUser}
      onTransferBalance={ctx.handleTransferBalance}
      onLogout={ctx.handleLogout}
      onExit={ctx.navigateToHome}
      onPlayJornada={ctx.handlePlayJornada}
      onProcessClientRecharge={ctx.handleProcessClientRecharge}
      onUpdateCarton={ctx.handleUpdateCarton}
    />
  );
}
