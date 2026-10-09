import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Monitor, 
  ExternalLink, 
  RotateCcw, 
  ShoppingBag, 
  Search, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  MapPin, 
  Store, 
  Clock, 
  Truck, 
  CreditCard, 
  Copy, 
  Check, 
  AlertCircle,
  Wheat,
  Boxes
} from 'lucide-react';
import { Product, PromoItem, StoreConfig, Category } from '../types';

interface ClientMenuPreviewProps {
  products: Product[];
  promos: PromoItem[];
  config: StoreConfig;
  categories: Category[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

export const ClientMenuPreview: React.FC<ClientMenuPreviewProps> = ({
  products,
  promos,
  config,
  categories
}) => {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('desktop');
  const [showWelcome, setShowWelcome] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [copiedAlias, setCopiedAlias] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Checkout form fields
  const [deliveryType, setDeliveryType] = useState<'Envío a Domicilio' | 'Retiro por Fábrica'>('Envío a Domicilio');
  const [custName, setCustName] = useState<string>('');
  const [custAddress, setCustAddress] = useState<string>('');
  const [custDate, setCustDate] = useState<string>('');
  const [custTimeSlot, setCustTimeSlot] = useState<string>('');
  const [custNotes, setCustNotes] = useState<string>('');

  // Merge regular active products with active promos
  const allActiveProducts: Product[] = [
    ...products.filter(p => p.active),
    ...promos.filter(p => p.active).map(promo => ({
      id: promo.id,
      category: 'promos',
      name: promo.name,
      tagline: promo.tagline,
      description: promo.description,
      price: promo.price,
      originalPrice: promo.originalPrice,
      driveId: promo.driveId,
      fallback: promo.fallback,
      badge: promo.badge,
      active: true
    }))
  ];

  // Set default min date for tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    setCustDate(dateStr);
    updateTimeSlots(dateStr);
  }, []);

  const updateTimeSlots = (dateString: string) => {
    if (!dateString) return;
    const [year, month, day] = dateString.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      setCustTimeSlot(`${config.schedules.weekday} (Horario de envíos)`);
    } else if (dayOfWeek === 6) {
      setCustTimeSlot(`${config.schedules.saturday} (Horario de envíos)`);
    } else {
      setCustTimeSlot(`${config.schedules.sunday} (Almuerzos Domingo)`);
    }
  };

  const handleDateChange = (dateVal: string) => {
    setCustDate(dateVal);
    updateTimeSlots(dateVal);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const addToCart = (prod: Product) => {
    setCart(prev => {
      const existing = prev[prod.id];
      return {
        ...prev,
        [prod.id]: {
          product: prod,
          quantity: existing ? existing.quantity + 1 : 1
        }
      };
    });
    showToast(`Agregaste ${prod.name}`);
  };

  const decreaseCart = (prodId: string) => {
    setCart(prev => {
      const existing = prev[prodId];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        const next = { ...prev };
        delete next[prodId];
        return next;
      }
      return {
        ...prev,
        [prodId]: {
          ...existing,
          quantity: existing.quantity - 1
        }
      };
    });
  };

  const removeCartItem = (prodId: string) => {
    setCart(prev => {
      const next = { ...prev };
      delete next[prodId];
      return next;
    });
  };

  const clearCart = () => {
    setCart({});
    showToast('Tu pedido ha sido vaciado');
  };

  const copyAlias = () => {
    navigator.clipboard.writeText(config.mpAlias);
    setCopiedAlias(true);
    showToast(`Alias copiado: ${config.mpAlias}`);
    setTimeout(() => setCopiedAlias(false), 2500);
  };

  const cartItems = Object.values(cart);
  const cartTotalCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const cartTotalPrice = cartItems.reduce((acc, it) => acc + it.product.price * it.quantity, 0);

  const formatMoney = (n: number) => '$' + Number(n).toLocaleString('es-AR');

  const getImageSrc = (driveId: string, fallback: string) => {
    if (driveId) return `https://drive.google.com/thumbnail?id=${driveId}&sz=w800`;
    return fallback || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80';
  };

  const filteredProducts = allActiveProducts.filter(p => {
    const matchesCat = selectedCategory === 'todos' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tagline && p.tagline.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleSendWhatsApp = () => {
    if (cartItems.length === 0) {
      showToast('Agregá al menos un producto a tu pedido');
      return;
    }
    if (!custName.trim()) {
      showToast('Por favor completá tu nombre');
      return;
    }
    if (deliveryType === 'Envío a Domicilio' && !custAddress.trim()) {
      showToast('Por favor ingresá tu dirección para el envío');
      return;
    }

    const isBigOrder = cartTotalCount >= config.minBigOrderBoxes;

    let msg = `🍝 *NUEVO PEDIDO - ${config.storeName.toUpperCase()}*\n`;
    msg += `------------------------------------\n`;
    msg += `👤 *Cliente:* ${custName.trim()}\n`;
    msg += `🚚 *Modalidad:* ${deliveryType}\n`;
    if (deliveryType === 'Envío a Domicilio') {
      msg += `📍 *Dirección:* ${custAddress.trim()}\n`;
    }
    msg += `📅 *Fecha requerida:* ${custDate}\n`;
    msg += `⏰ *Franja horaria:* ${custTimeSlot}\n`;
    if (custNotes.trim()) {
      msg += `📝 *Observaciones:* ${custNotes.trim()}\n`;
    }
    msg += `------------------------------------\n`;
    msg += `📦 *DETALLE DE PASTAS:*\n`;

    cartItems.forEach(({ product, quantity }) => {
      msg += `• ${quantity}x ${product.name} (${product.tagline || ''}) -> ${formatMoney(product.price * quantity)}\n`;
    });

    msg += `------------------------------------\n`;
    msg += `💰 *TOTAL PASTAS:* ${formatMoney(cartTotalPrice)}\n`;
    msg += `💳 *Método de pago:* Transferencia Mercado Pago\n`;
    msg += `🏷️ *Alias:* ${config.mpAlias}\n\n`;

    if (isBigOrder) {
      msg += `⚠️ *Aviso de Pedido Grande:* Son ${cartTotalCount} cajas. Consulto confirmación de elaboración.\n\n`;
    }

    msg += `Adjunto a continuación el comprobante de transferencia. ¡Muchas gracias!`;

    const url = `https://wa.me/${config.phoneWhatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="py-4 px-2 sm:px-4 max-w-7xl mx-auto space-y-4">
      
      {/* Device Viewport Bar */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-xs text-stone-800">
            Vista Previa en Vivo (Menú de Clientes)
          </span>
          <span className="hidden sm:inline text-[11px] text-stone-400">
            • Los cambios que hiciste en el Admin ya están activos aquí
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowWelcome(true)}
            className="px-2.5 py-1 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition"
          >
            Ver Portada de Bienvenida
          </button>

          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'mobile' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Vista Móvil (Smartphone)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Móvil</span>
            </button>
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'desktop' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Vista Escritorio"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Escritorio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container framed according to mode */}
      <div className={`mx-auto transition-all duration-300 relative ${
        viewMode === 'mobile' 
          ? 'max-w-md border-8 border-stone-800 rounded-[40px] shadow-2xl overflow-hidden bg-[#F7F4EE]' 
          : 'w-full rounded-3xl overflow-hidden bg-[#F7F4EE] shadow-sm border border-stone-200'
      }`}>

        {/* WELCOME MODAL OVERLAY */}
        {showWelcome && (
          <div 
            onClick={() => setShowWelcome(false)}
            className="absolute inset-0 z-50 bg-stone-950 flex flex-col items-center justify-between text-white cursor-pointer select-none overflow-y-auto p-4 transition-all"
          >
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src={getImageSrc(config.coverDriveId, config.coverFallback)} 
                alt="Presentación" 
                className="w-full h-full object-cover opacity-90 scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-black/90"></div>
            </div>

            {/* Top Bar */}
            <header className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15">
                <img 
                  src={getImageSrc(config.logoDriveId, config.logoFallback)} 
                  alt="Logo" 
                  className="w-8 h-8 rounded-xl object-contain bg-white p-0.5"
                />
                <div>
                  <span className="font-serif font-bold text-sm text-white block leading-tight">{config.storeName}</span>
                  <span className="text-[10px] text-amber-200/90 font-medium">{config.location}</span>
                </div>
              </div>
            </header>

            {/* Center */}
            <main className="relative z-10 text-center my-auto py-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#235C3B]/90 text-emerald-100 text-xs font-bold mb-3 shadow-lg">
                <Wheat className="w-3.5 h-3.5 text-[#C6994E]" />
                <span>Pastas Frescas 100% Artesanales</span>
              </div>
              <h1 className="font-serif text-3xl font-extrabold text-white mb-2 leading-tight">
                Bienvenido a {config.storeName}
              </h1>
              <p className="text-xs text-stone-200 max-w-xs mx-auto mb-5 font-medium leading-relaxed">
                Elaboración artesanal por pedido. Tocá a continuación para explorar el menú y hacer tu encargo.
              </p>
              <button 
                type="button"
                onClick={() => setShowWelcome(false)}
                className="bg-[#235C3B] text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 mx-auto shadow-lg"
              >
                <span>Ver Menú y Hacer Pedido</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C6994E]" />
              </button>
            </main>

            {/* Bottom info */}
            <footer className="relative z-10 text-center text-[11px] text-stone-300 py-2">
              <span>Hacé clic en cualquier lugar para ingresar</span>
            </footer>
          </div>
        )}

        {/* TOP ANNOUNCEMENT BAR */}
        <aside className="bg-[#235C3B] text-amber-50 text-xs py-2 px-4 shadow-sm border-b border-[#163E27]">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#C6994E] text-stone-900 uppercase">
                {config.noticeShort}
              </span>
              <span className="text-white/95 font-medium truncate max-w-xs sm:max-w-md">
                {config.announcementText}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-amber-100">
              <button onClick={() => setIsInfoModalOpen(true)} className="underline hover:text-white font-bold">
                Ver horarios
              </button>
            </div>
          </div>
        </aside>

        {/* HERO BANNER */}
        <div className="max-w-4xl w-full mx-auto px-3 sm:px-4 pt-3">
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
            
            {/* Cover image */}
            <div className="relative h-40 sm:h-52 w-full bg-stone-900 overflow-hidden">
              <img 
                src={getImageSrc(config.coverDriveId, config.coverFallback)} 
                alt="Portada" 
                className="w-full h-full object-cover object-center opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
              
              <div className="absolute top-3 right-3 z-10">
                <a 
                  href={config.instagramUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-black/60 hover:bg-black/80 border border-white/20 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <span className="text-pink-400">📷</span>
                  <span>{config.instagram}</span>
                </a>
              </div>
            </div>

            {/* Header Content */}
            <div className="px-4 sm:px-6 pb-5 pt-0 relative bg-white">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                  <div className="-mt-12 sm:-mt-14 w-24 h-24 rounded-2xl bg-white p-2 border-4 border-white shadow-lg flex-shrink-0 relative overflow-hidden z-20">
                    <img 
                      src={getImageSrc(config.logoDriveId, config.logoFallback)} 
                      alt="Logo" 
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight font-serif">
                        {config.storeName}
                      </h1>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Abierto
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium mt-0.5">
                      {config.tagline}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsInfoModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-[#EDF6F0] text-stone-800 text-xs font-bold flex items-center gap-1.5"
                >
                  <Store className="w-3.5 h-3.5 text-[#235C3B]" />
                  <span>Información del local</span>
                </button>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="bg-stone-50 p-2 rounded-xl border border-stone-200 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#EDF6F0] text-[#235C3B] flex items-center justify-center flex-shrink-0">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-stone-900 text-[10px] truncate">Envíos</div>
                    <div className="text-stone-500 text-[9px] truncate">{config.leadTimeHours}hs anticipación</div>
                  </div>
                </div>

                <div className="bg-stone-50 p-2 rounded-xl border border-stone-200 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FCF7EB] text-[#9E752D] flex items-center justify-center flex-shrink-0">
                    <Boxes className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-stone-900 text-[10px] truncate">Pedidos Grandes</div>
                    <div className="text-stone-500 text-[9px] truncate">{config.minBigOrderBoxes}+ cajas consultar</div>
                  </div>
                </div>

                <div 
                  onClick={copyAlias}
                  className="bg-stone-50 hover:bg-[#EDF6F0] p-2 rounded-xl border border-stone-200 cursor-pointer flex items-center gap-2 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#EDF6F0] text-[#235C3B] flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-stone-900 text-[10px] truncate">Mercado Pago</div>
                    <div className="text-[#235C3B] font-semibold text-[9px] truncate flex items-center gap-1">
                      <span>{config.mpAlias}</span>
                      <Copy className="w-2.5 h-2.5" />
                    </div>
                  </div>
                </div>

                <a 
                  href={`https://wa.me/${config.phoneWhatsapp}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-stone-50 hover:bg-emerald-50 p-2 rounded-xl border border-stone-200 flex items-center gap-2 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">💬</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-stone-900 text-[10px] truncate">WhatsApp</div>
                    <div className="text-stone-600 font-semibold text-[9px] truncate">{config.phoneDisplay}</div>
                  </div>
                </a>
              </div>

              {/* Schedules strip */}
              <div className="mt-2.5 p-2 rounded-xl bg-[#EDF6F0] border border-[#235C3B]/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-[#163E27] font-bold text-[10px]">
                  <Clock className="w-3 h-3 text-[#235C3B]" />
                  <span>Horarios de entrega:</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-stone-700">
                  <span className="bg-white px-2 py-0.5 rounded border border-stone-200"><strong>L-V:</strong> {config.schedules.weekday}</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-stone-200"><strong>SÁB:</strong> {config.schedules.saturday}</span>
                  <span className="bg-[#FCF7EB] px-2 py-0.5 rounded border border-amber-300 font-bold text-amber-900"><strong>DOM:</strong> {config.schedules.sunday}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* STICKY NAVIGATION BAR */}
        <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 py-2.5 px-3 sm:px-4 shadow-xs mt-3">
          <div className="max-w-4xl mx-auto space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar pastas, ñoquis, fideos..."
                  className="w-full pl-8 pr-8 py-1.5 text-xs bg-stone-100 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#235C3B] focus:bg-white"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Cart trigger button */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-1.5 bg-[#235C3B] hover:bg-[#163E27] text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm transition active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">Mi Pedido</span>
                <span className="bg-[#C6994E] text-stone-950 text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                  {cartTotalCount}
                </span>
              </button>
            </div>

            {/* Category pills */}
            <div className="overflow-x-auto no-scrollbar flex items-center gap-1.5 py-0.5 text-xs">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition ${
                    selectedCategory === cat.id
                      ? 'bg-[#235C3B] text-white shadow-xs'
                      : cat.isSpecial
                        ? 'bg-white border border-[#C6994E] text-[#9E752D] hover:bg-[#FCF7EB]'
                        : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* PRODUCTS LIST */}
        <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredProducts.map(product => {
              const qtyInCart = cart[product.id] ? cart[product.id].quantity : 0;
              const imgUrl = getImageSrc(product.driveId, product.fallback);

              return (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl p-3.5 border border-stone-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          product.category === 'promos' 
                            ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                            : 'bg-[#EDF6F0] text-[#163E27] border border-[#235C3B]/15'
                        }`}>
                          {product.badge || 'Fresco'}
                        </span>
                        <span className="text-[10px] text-stone-400 font-semibold">
                          {product.tagline}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-sm text-stone-900 leading-snug">
                        {product.name}
                      </h3>

                      <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-100">
                      <img 
                        src={imgUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = product.fallback || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>
                  </div>

                  {/* Price & Add to cart button */}
                  <div className="mt-3 pt-2.5 flex items-center justify-between border-t border-stone-100">
                    <div>
                      <span className="text-[9px] text-stone-400 uppercase font-bold block leading-none">
                        Precio
                      </span>
                      <span className="text-base font-extrabold text-stone-900 leading-tight">
                        {formatMoney(product.price)}
                      </span>
                    </div>

                    {qtyInCart === 0 ? (
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-[#235C3B] hover:bg-[#163E27] text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs active:scale-95 transition"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Agregar</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200">
                        <button 
                          onClick={() => decreaseCart(product.id)}
                          className="w-6 h-6 rounded-lg bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center text-xs font-bold shadow-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-extrabold px-1.5 text-stone-900">
                          {qtyInCart}
                        </span>
                        <button 
                          onClick={() => addToCart(product)}
                          className="w-6 h-6 rounded-lg bg-[#235C3B] text-white hover:bg-[#163E27] flex items-center justify-center text-xs font-bold shadow-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-6 mt-4">
              <Search className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <h4 className="font-bold text-stone-800 text-sm">No encontramos productos</h4>
              <p className="text-xs text-stone-500 mt-0.5">Probá otra categoría o búsqueda.</p>
            </div>
          )}

          {/* Mini map section */}
          <section className="mt-8 bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase text-[#235C3B] tracking-wider block">
                  Zona de Elaboración y Envíos
                </span>
                <h4 className="font-serif font-bold text-sm text-stone-900">
                  Mapa de Cobertura • {config.location}
                </h4>
              </div>
              <a 
                href="https://www.google.com/maps/place/Lugano/@-34.6797492,-58.4741212,15z"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-[#235C3B] text-white rounded-xl text-xs font-bold self-start sm:self-auto flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-[#C6994E]" />
                <span>Abrir en Google Maps</span>
              </a>
            </div>

            <div className="w-full h-48 bg-stone-100">
              <iframe 
                title="Mapa Villa Lugano"
                src="https://maps.google.com/maps?q=Villa+Lugano,+Comuna+8,+CABA&hl=es&z=14&output=embed" 
                className="w-full h-full border-0" 
                loading="lazy"
              />
            </div>
          </section>

        </main>

        {/* BOTTOM CART BAR */}
        {cartTotalCount > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-2xl z-40">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#235C3B] text-white flex items-center justify-center font-bold relative">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 bg-[#C6994E] text-stone-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cartTotalCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase block leading-none">Total</span>
                  <span className="text-base font-extrabold text-stone-900">
                    {formatMoney(cartTotalPrice)}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setIsCartOpen(true)}
                className="bg-[#235C3B] hover:bg-[#163E27] text-white py-2 px-5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition active:scale-95"
              >
                <span>Ver Mi Pedido ({cartTotalCount})</span>
                <ExternalLink className="w-3 h-3 text-[#C6994E]" />
              </button>
            </div>
          </div>
        )}

        {/* CART DRAWER */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex justify-end">
            <div className="w-full max-w-md bg-[#faf8f5] h-full shadow-2xl flex flex-col">
              
              {/* Header */}
              <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#EDF6F0] text-[#235C3B] flex items-center justify-center font-bold">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-stone-900">Tu Pedido</h3>
                    <span className="text-[10px] text-stone-500">{config.storeName} • Fábrica Artesanal</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center hover:bg-stone-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Lead time notice */}
              <div className="bg-[#EDF6F0] border-b border-[#235C3B]/20 p-2.5 text-[11px] text-[#163E27] flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-[#235C3B] flex-shrink-0" />
                <span>Mínimo <strong>{config.leadTimeHours}hs de anticipación</strong> y transferencia MP confirmada.</span>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12 text-stone-400">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-stone-300" />
                    <p className="text-xs font-bold text-stone-700">Tu pedido está vacío</p>
                  </div>
                ) : (
                  cartItems.map(({ product, quantity }) => (
                    <div 
                      key={product.id}
                      className="bg-white p-2.5 rounded-2xl border border-stone-200 flex items-center justify-between gap-2.5 shadow-xs"
                    >
                      <img 
                        src={getImageSrc(product.driveId, product.fallback)} 
                        alt={product.name}
                        className="w-10 h-10 rounded-xl object-cover bg-stone-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-stone-900 truncate">{product.name}</h5>
                        <div className="text-[10px] text-stone-400">{formatMoney(product.price)} c/u</div>
                        <div className="text-xs font-extrabold text-[#235C3B]">{formatMoney(product.price * quantity)}</div>
                      </div>

                      <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg">
                        <button 
                          onClick={() => decreaseCart(product.id)}
                          className="w-5 h-5 rounded bg-white text-stone-700 text-xs font-bold flex items-center justify-center shadow-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-extrabold px-1">{quantity}</span>
                        <button 
                          onClick={() => addToCart(product)}
                          className="w-5 h-5 rounded bg-[#235C3B] text-white text-xs font-bold flex items-center justify-center shadow-xs"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => removeCartItem(product.id)}
                        className="text-stone-300 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Form */}
              <div className="p-4 bg-white border-t border-stone-200 space-y-3 max-h-[50vh] overflow-y-auto text-xs">
                <div>
                  <label className="block text-[10px] font-extrabold text-stone-500 uppercase mb-1">
                    Forma de Entrega
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer font-bold ${
                      deliveryType === 'Envío a Domicilio' ? 'border-[#235C3B] bg-[#EDF6F0] text-[#163E27]' : 'border-stone-200'
                    }`}>
                      <input 
                        type="radio" 
                        name="deliv" 
                        checked={deliveryType === 'Envío a Domicilio'} 
                        onChange={() => setDeliveryType('Envío a Domicilio')}
                        className="accent-[#235C3B]"
                      />
                      <span>Envío a Domicilio</span>
                    </label>

                    <label className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer font-bold ${
                      deliveryType === 'Retiro por Fábrica' ? 'border-[#235C3B] bg-[#EDF6F0] text-[#163E27]' : 'border-stone-200'
                    }`}>
                      <input 
                        type="radio" 
                        name="deliv" 
                        checked={deliveryType === 'Retiro por Fábrica'} 
                        onChange={() => setDeliveryType('Retiro por Fábrica')}
                        className="accent-[#235C3B]"
                      />
                      <span>Retiro (Estación)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-0.5">Nombre y Apellido *</label>
                  <input 
                    type="text" 
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="Ej: Laura Martínez"
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                {deliveryType === 'Envío a Domicilio' && (
                  <div>
                    <label className="block font-bold text-stone-700 mb-0.5">Dirección de Entrega *</label>
                    <input 
                      type="text" 
                      value={custAddress}
                      onChange={(e) => setCustAddress(e.target.value)}
                      placeholder="Calle, número, piso/depto..."
                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-stone-700 mb-0.5">Fecha *</label>
                    <input 
                      type="date" 
                      value={custDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-0.5">Horario *</label>
                    <input 
                      type="text" 
                      value={custTimeSlot}
                      onChange={(e) => setCustTimeSlot(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>

                {/* MP Alias box */}
                <div className="p-3 bg-[#EDF6F0] rounded-2xl border border-[#235C3B]/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#163E27] text-[11px]">Mercado Pago</span>
                    <span className="text-[10px] text-[#235C3B] font-semibold">{config.mpOwner}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-[#235C3B]/20 flex items-center justify-between">
                    <span className="font-mono font-extrabold text-[#163E27] text-xs">{config.mpAlias}</span>
                    <button 
                      onClick={copyAlias}
                      className="px-2 py-1 bg-[#EDF6F0] hover:bg-[#235C3B]/20 text-[#163E27] rounded text-[10px] font-bold"
                    >
                      {copiedAlias ? '¡Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-2 border-t border-stone-200">
                  <span className="font-extrabold text-stone-900 text-sm">Total del pedido:</span>
                  <span className="font-black text-[#235C3B] text-base">{formatMoney(cartTotalPrice)}</span>
                </div>

                {/* Send button */}
                <button 
                  onClick={handleSendWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-95"
                >
                  <span>💬 Enviar Pedido por WhatsApp</span>
                </button>

                <div className="text-center">
                  <button 
                    onClick={clearCart}
                    className="text-[10px] text-stone-400 hover:text-red-600 underline"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* INFO MODAL */}
        {isInfoModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl relative border border-stone-200 max-h-[85vh] overflow-y-auto text-xs">
              <button 
                onClick={() => setIsInfoModalOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center"
              >
                ✕
              </button>

              <h3 className="text-base font-extrabold text-stone-900 font-serif mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-[#235C3B]" />
                <span>Información de {config.storeName}</span>
              </h3>

              <div className="space-y-3 text-stone-700">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#235C3B]" />
                    <span>Horarios de Entrega</span>
                  </div>
                  <div><strong>Lunes a Viernes:</strong> {config.schedules.weekday}</div>
                  <div><strong>Sábados:</strong> {config.schedules.saturday}</div>
                  <div><strong>Domingos:</strong> {config.schedules.sunday}</div>
                </div>

                <div className="p-3 bg-[#EDF6F0] rounded-2xl border border-[#235C3B]/20 space-y-1">
                  <div className="font-bold text-[#163E27]">Pautas de Pedido</div>
                  <p>• Anticipación mínima de {config.leadTimeHours}hs.</p>
                  <p>• Transferencia Mercado Pago al alias: <strong>{config.mpAlias}</strong></p>
                  <p>• Punto de retiro: Estación Lugano.</p>
                </div>
              </div>

              <button 
                onClick={() => setIsInfoModalOpen(false)}
                className="w-full mt-4 py-2.5 bg-[#235C3B] text-white rounded-xl font-bold text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* TOAST */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl animate-bounce">
            {toastMessage}
          </div>
        )}

      </div>
    </div>
  );
};
