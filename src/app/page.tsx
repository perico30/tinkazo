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

  // Calculate effective balance for promoters (they use guaranteeBalance from promoter_profiles)
  const effectiveBalance = (() => {
    if (ctx.currentUser && ctx.userRole === 'promoter') {
      const profile = ctx.appConfig.promoterProfiles.find(p => p.userId === ctx.currentUser!.id);
      return profile?.guaranteeBalance ?? ctx.currentUser.balance ?? 0;
    }
    return ctx.currentUser?.balance ?? 0;
  })();

  // Create a modified currentUser with the effective balance for the purchase page
  const purchaseUser = ctx.currentUser ? { ...ctx.currentUser, balance: effectiveBalance } : null;

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
        showBottomNav={false}
        effectiveBalance={effectiveBalance}
      />
      <BottomSheet
        isOpen={ctx.showPurchaseSheet}
        onClose={ctx.navigateToHome}
      >
        {ctx.jornadaToPlay && purchaseUser && (
          <PurchaseCartonPage
            jornada={ctx.jornadaToPlay}
            teams={ctx.appConfig.teams}
            currentUser={purchaseUser}
            onPurchase={ctx.handlePurchaseCarton}
            onExit={ctx.navigateToHome}
          />
        )}
      </BottomSheet>
    </>
  );
}
