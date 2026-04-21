'use client';

import { useApp } from '@/context/AppContext';
import AdminPage from '@/views/AdminPage';

export default function AdminRoute() {
  const ctx = useApp();

  return (
    <AdminPage
      initialConfig={ctx.appConfig}
      onSave={ctx.handleSaveConfig}
      onLogout={ctx.handleLogout}
      onExit={ctx.navigateToHome}
      onProcessWithdrawal={ctx.handleProcessWithdrawal}
      onProcessSellerRecharge={ctx.handleProcessSellerRecharge}
      dataFetchError={ctx.dataFetchError}
    />
  );
}
