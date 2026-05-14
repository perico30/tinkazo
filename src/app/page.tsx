'use client';

import { useApp } from '@/context/AppContext';
import HomePage from '@/views/HomePage'; // force HMR
import BottomSheet from '@/components/BottomSheet';
import PurchaseCartonPage from '@/views/PurchaseCartonPage';

export default function HomeRoute() {
  const ctx = useApp();

  const userCartonCount = ctx.currentUser
    ? ctx.appConfig.cartones.filter(c => c.userId === ctx.currentUser!.id).length
    : 0;

  return (
    <>
      <HomePage
        appConfig={ctx.appConfig}
        userRole={ctx.userRole}
        currentUser={ctx.currentUser}
        userCartonCount={userCartonCount}
        onLoginClick={ctx.navigateToLogin}
        onRegisterClick={ctx.navigateToRegister}
        onHomeClick={ctx.navigateToHome}
        onAdminClick={ctx.navigateToAdmin}
        onSellerPanelClick={ctx.userRole === 'promoter' ? ctx.navigateToPromoterPanel : ctx.navigateToSellerPanel}
        onClientPanelClick={ctx.navigateToClientPanel}
        onLogoutClick={ctx.handleLogout}
        onLegalClick={ctx.handleLegalClick}
        onPlayJornada={ctx.handlePlayJornada}
        showBottomNav={!!ctx.currentUser && ctx.userRole === 'client'}
      />
      <BottomSheet
        isOpen={ctx.showPurchaseSheet}
        onClose={ctx.navigateToHome}
      >
        {ctx.jornadaToPlay && ctx.currentUser && (
          <PurchaseCartonPage
            jornada={ctx.jornadaToPlay}
            teams={ctx.appConfig.teams}
            currentUser={ctx.currentUser}
            onPurchase={ctx.handlePurchaseCarton}
            onExit={ctx.navigateToHome}
          />
        )}
      </BottomSheet>
    </>
  );
}
