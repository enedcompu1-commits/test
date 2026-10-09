import { Product, PromoItem, Category, StoreConfig } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'sorrentinos-espinaca',
    category: 'sorrentinos',
    name: 'Sorrentinos (Masa de Espinaca)',
    tagline: 'Caja x 16 unidades',
    description: 'Masa fresca enriquecida con espinaca natural seleccionada. Relleno abundante que no se abre al hervir.',
    price: 8500,
    driveId: '1U1mZTG-Sv_MY-wtywQkCgfVy0cEF1zpf',
    fallback: 'https://images.unsplash.com/photo-1587740896339-96a76170508d?auto=format&fit=crop&w=600&q=80',
    badge: 'Recomendado',
    active: true
  },
  {
    id: 'sorrentinos-tradicionales',
    category: 'sorrentinos',
    name: 'Sorrentinos Tradicionales',
    tagline: 'Caja x 16 unidades',
    description: 'Clásica masa al huevo rellena de jamón cocido seleccionado y queso muzzarella fundente de primera calidad.',
    price: 8000,
    driveId: '1HV75-UGoVvQDlZAgw74qDKaH3Z1fFi6a',
    fallback: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    badge: 'Más Vendido',
    active: true
  },
  {
    id: 'raviolones-espinaca',
    category: 'raviolones',
    name: 'Raviolones (Masa de Espinaca)',
    tagline: 'Caja x 16 unidades',
    description: 'Raviolones grandes con masa de espinaca fresca de quinta. Rellenos equilibrados y muy sabrosos.',
    price: 8500,
    driveId: '1FjnVxz347mvyA339FxGfwGzupIiEcftB',
    fallback: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80',
    badge: 'Especial',
    active: true
  },
  {
    id: 'raviolones-tradicionales',
    category: 'raviolones',
    name: 'Raviolones Tradicionales',
    tagline: 'Caja x 16 unidades',
    description: 'Masa al huevo suave, elástica y consistente. El clásico infaltable de los domingos en familia.',
    price: 8000,
    driveId: '171lMX5xBhAOJDNi6ddIEPAceyZ-YhTQW',
    fallback: 'https://images.unsplash.com/photo-1587740896339-96a76170508d?auto=format&fit=crop&w=600&q=80',
    badge: 'Clásico',
    active: true
  },
  {
    id: 'noquis-rellenos',
    category: 'noquis',
    name: 'Ñoquis Rellenos de Jamón y Queso',
    tagline: 'Caja x 36 unidades',
    description: 'Ñoquis rellenos uno a uno de forma artesanal con corazón fundido de jamón y queso. Rendidores y deliciosos.',
    price: 9000,
    driveId: '10zgPhTy6kJGD0XoGokQatZcDgKD4Jpq7',
    fallback: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    badge: 'Favorito',
    active: true
  },
  {
    id: 'fideo-al-huevo',
    category: 'fideos',
    name: 'Fideos Caseros al Huevo',
    tagline: 'Porción artesanal',
    description: 'Elaborados con huevos de campo y sémola seleccionada. Textura al dente inigualable para tucos o cremas.',
    price: 5500,
    driveId: '16mcc9-U8W192_gyfci8LFxAEKcU-xfCe',
    fallback: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80',
    badge: 'Artesanal',
    active: true
  },
  {
    id: 'fideo-espinaca',
    category: 'fideos',
    name: 'Fideos Caseros de Espinaca',
    tagline: 'Porción artesanal',
    description: 'Masa 100% natural con espinaca fresca triturada. Delicados, aromáticos y saludables.',
    price: 6000,
    driveId: '1Vx3-IMTwrJc-pDVOD0hbMaxHCArTRvy6',
    fallback: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    badge: '100% Natural',
    active: true
  },
  {
    id: 'fideo-morron',
    category: 'fideos',
    name: 'Fideos Caseros de Morrón',
    tagline: 'Porción artesanal',
    description: 'Con morrones rojos asados y seleccionados. Coloración viva, aroma único y exquisito toque en boca.',
    price: 6000,
    driveId: '19XEQdTvpxG_hkhXFg3D5oTtGePcJrx7Y',
    fallback: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80',
    badge: 'Exclusivo',
    active: true
  },
  {
    id: 'combo-familiar-yayi',
    category: 'promos',
    name: 'Combo Banquete Familiar Yayi',
    tagline: '2 Cajas Sorrentinos + 1 Raviolones + 1 Fideos',
    description: 'La solución completa para el almuerzo familiar de fin de semana. Elegí tus gustos favoritos y ahorrá.',
    price: 27500,
    originalPrice: 30500,
    driveId: '1hcvHBUgYG5yExeIe6Q4EfIiTitTshUSm',
    fallback: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    badge: 'Ahorro',
    active: true
  }
];

export const INITIAL_PROMOS: PromoItem[] = [
  {
    id: 'combo-familiar-yayi',
    name: 'Combo Banquete Familiar Yayi',
    tagline: '2 Cajas Sorrentinos + 1 Raviolones + 1 Fideos',
    description: 'La solución completa para el almuerzo familiar de fin de semana. Elegí tus gustos favoritos y ahorrá.',
    price: 27500,
    originalPrice: 30500,
    driveId: '1hcvHBUgYG5yExeIe6Q4EfIiTitTshUSm',
    fallback: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    badge: 'Ahorro',
    itemsIncluded: ['2 Cajas Sorrentinos (a elección)', '1 Caja Raviolones', '1 Porción Fideos Caseros'],
    active: true,
    highlightText: 'Ahorrás $3.000 comprando en combo'
  },
  {
    id: 'promo-domingo-noquis',
    name: 'Dúo Ñoquis Rellenos Especial',
    tagline: '2 Cajas de Ñoquis Rellenos x 36 u.',
    description: 'Llevá 2 cajas de nuestros aclamados ñoquis rellenos de jamón y queso con descuento exclusivo.',
    price: 16800,
    originalPrice: 18000,
    driveId: '10zgPhTy6kJGD0XoGokQatZcDgKD4Jpq7',
    fallback: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    badge: 'Promo Domingo',
    itemsIncluded: ['2 Cajas de Ñoquis Rellenos (72 unidades en total)'],
    active: true,
    highlightText: 'Ideal para 4 a 5 personas'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'sorrentinos', label: 'Sorrentinos' },
  { id: 'raviolones', label: 'Raviolones' },
  { id: 'noquis', label: 'Ñoquis Rellenos' },
  { id: 'fideos', label: 'Fideos Caseros' },
  { id: 'promos', label: '⭐ Combos Familiares', isSpecial: true }
];

export const INITIAL_STORE_CONFIG: StoreConfig = {
  storeName: 'Pastas Yayi',
  tagline: 'Pastas frescas 100% artesanales • Hechas con amor de familia',
  location: 'Villa Lugano, CABA',
  phoneDisplay: '11 5039-4202',
  phoneWhatsapp: '5491150394202',
  instagram: '@pastas_yayii',
  instagramUrl: 'https://instagram.com/pastas_yayii',
  mpAlias: 'Yamila.Peralta95',
  mpOwner: 'Yamila Peralta',
  announcementText: 'Pedidos con 24hs de anticipación y transferencia confirmada. Envíos programados.',
  noticeShort: 'Aviso',
  leadTimeHours: 24,
  minBigOrderBoxes: 10,
  logoDriveId: '1F2olx_wbyAkyYXfQLR5W7s9TDQmlNA7b',
  logoFallback: 'https://drive.google.com/thumbnail?id=1F2olx_wbyAkyYXfQLR5W7s9TDQmlNA7b&sz=w500',
  coverDriveId: '1hcvHBUgYG5yExeIe6Q4EfIiTitTshUSm',
  coverFallback: 'https://drive.google.com/thumbnail?id=1hcvHBUgYG5yExeIe6Q4EfIiTitTshUSm&sz=w1200',
  schedules: {
    weekday: '18:00 a 20:30 hs',
    saturday: '14:00 a 18:00 hs',
    sunday: '11:00 a 14:00 hs'
  }
};
