export type View = 'home' | 'login' | 'register' | 'admin' | 'seller' | 'clientPanel' | 'purchaseCarton';
export type UserRole = 'admin' | 'client' | 'seller' | null;

export interface Country {
  code: string;
  name: string;
}

// --- Tipos para la configuración del Super Admin ---

export interface ThemeConfig {
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
}

export interface WelcomeMessageConfig {
  title: string;
  description: string;
}

export interface WelcomePopupConfig {
  enabled: boolean;
  title: string;
  text: string;
  imageUrl: string;
}

export interface JackpotConfig {
  title: string;
  detail: string;
  amount: string;
  colors: {
    primary: string;
    secondary: string;
  };
  backgroundImage: string;
}

export interface CarouselImage {
    id: string;
    url: string;
}

export interface RechargeConfig {
    qrCodeUrl: string;
}

export type SocialPlatform = 'facebook' | 'twitter' | 'instagram' | 'youtube' | 'linkedin';

export interface SocialLink {
  platform: SocialPlatform | string;
  url: string;
}

export interface LegalLink {
  title: string;
  content: string;
}

export interface FooterConfig {
  copyright: string;
  socialLinks: SocialLink[];
  legalLinks: [LegalLink, LegalLink];
}

export interface Team {
  id: string;
  name: string;
  logo: string; // base64 data URL
}

export interface Match {
  id: string;
  localTeamId: string;
  visitorTeamId: string;
  dateTime: string;
  result?: '1' | 'X' | '2';
}

export interface Jornada {
  id: string;
  name: string;
  status: 'abierta' | 'cerrada' | 'cancelada';
  firstPrize: string;
  secondPrize: string;
  cartonPrice: number;
  matches: Match[];
  botinMatchId?: string | null;
  styling: {
    textColor: string;
    buttonColor: string;
    backgroundColor: string;
    backgroundImage: string;
  };
}

export interface RegisteredUser {
  id: string;
  username: string;
  email: string;
  password: string; 
  phone: string;
  country: string; // Country code
  role: 'client' | 'seller';
  status: 'pending' | 'active';
  assignedSellerId?: string | null; // Only for clients
  balance?: number; // For clients
  sellerQrCodeUrl?: string; // For sellers
  sellerWhatsappNumber?: string; // For sellers
}

export type Prediction = '1' | 'X' | '2';

export interface Carton {
    id: string;
    userId: string;
    jornadaId: string;
    predictions: { [matchId: string]: Prediction };
    purchaseDate: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  userQrCodeUrl: string;
  status: 'pending' | 'completed' | 'rejected';
  requestDate: string;
  processedDate?: string;
}

export interface RechargeRequest {
  id: string;
  userId: string; // ID of the user requesting
  requesterRole: 'client' | 'seller';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  processedDate?: string;
  proofOfPaymentUrl?: string; // For seller requests
  processedBy?: string; // ID of seller/admin who processed
}


export interface AppConfig {
  appName: string;
  theme: ThemeConfig;
  logoUrl: string;
  welcomeMessage: WelcomeMessageConfig;
  welcomePopup: WelcomePopupConfig;
  jackpots: [JackpotConfig, JackpotConfig];
  carouselImages: CarouselImage[];
  recharge: RechargeConfig;
  adminWhatsappNumber: string;
  sectionsOrder: ('jackpots' | 'carousel' | 'jornadas')[];
  teams: Team[];
  jornadas: Jornada[];
  gorditoJornadaId?: string | null;
  users: RegisteredUser[];
  cartones: Carton[];
  withdrawalRequests: WithdrawalRequest[];
  rechargeRequests: RechargeRequest[];
  footer: FooterConfig;
}