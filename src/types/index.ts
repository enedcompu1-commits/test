export interface Product {
  id: string;
  category: 'sorrentinos' | 'raviolones' | 'noquis' | 'fideos' | 'promos' | string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number; // for showing discount
  driveId: string;
  fallback: string;
  badge: string;
  active: boolean;
  order?: number;
}

export interface PromoItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice: number;
  driveId: string;
  fallback: string;
  badge: string;
  itemsIncluded?: string[];
  active: boolean;
  highlightText?: string;
}

export interface Category {
  id: string;
  label: string;
  icon?: string;
  isSpecial?: boolean;
}

export interface StoreConfig {
  storeName: string;
  tagline: string;
  location: string;
  phoneDisplay: string;
  phoneWhatsapp: string;
  instagram: string;
  instagramUrl: string;
  mpAlias: string;
  mpOwner: string;
  announcementText: string;
  noticeShort: string;
  leadTimeHours: number;
  minBigOrderBoxes: number;
  logoDriveId: string;
  logoFallback: string;
  coverDriveId: string;
  coverFallback: string;
  schedules: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}
