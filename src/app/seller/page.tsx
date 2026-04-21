'use client';

import { useApp } from '@/context/AppContext';
import SellerPage from '@/views/SellerPage';

export default function SellerRoute() {
  const ctx = useApp();

  if (!ctx.currentUser) return null;

  return (
    <SellerPage
      currentUser={ctx.currentUser}
      config={ctx.appConfig}
      onUpdateUser={ctx.handleUpdateUser}
      onRequestRecharge={ctx.handleRequestSellerRecharge}
      onProcessClientRecharge={ctx.handleProcessClientRecharge}
      onTransferBalance={ctx.handleTransferBalance}
      onLogout={ctx.handleLogout}
      onExit={ctx.navigateToHome}
      onUpdateCarton={ctx.handleUpdateCarton}
      onPlayJornada={ctx.handlePlayJornada}
    />
  );
}
