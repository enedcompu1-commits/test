import { Product, PromoItem, StoreConfig } from '../types';

export function generateProductsJson(products: Product[], promos: PromoItem[]): string {
  // Merge products and active promos with category 'promos'
  const combined = [
    ...products.filter(p => p.active),
    ...promos.filter(p => p.active).map(promo => ({
      id: promo.id,
      category: 'promos',
      name: promo.name,
      tagline: promo.tagline,
      description: promo.description,
      price: promo.price,
      driveId: promo.driveId,
      fallback: promo.fallback,
      badge: promo.badge
    }))
  ];
  return JSON.stringify(combined, null, 2);
}

export function generateJsProductsSnippet(products: Product[], promos: PromoItem[]): string {
  const json = generateProductsJson(products, promos);
  return `// Reemplazá la variable 'products' en tu archivo HTML con este bloque actualizado:
const products = ${json};`;
}

export function generateFullWebHtml(products: Product[], promos: PromoItem[], config: StoreConfig): string {
  const productsJson = generateProductsJson(products, promos);

  return `<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.storeName} | Menú Digital Artesanal</title>
  
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              green: '#235C3B',
              greenDark: '#163E27',
              greenLight: '#2D754C',
              greenSoft: '#EDF6F0',
              gold: '#C6994E',
              goldDark: '#9E752D',
              goldSoft: '#FCF7EB',
              cream: '#F7F4EE',
              surface: '#FFFFFF',
              dark: '#19241C',
              muted: '#5A665D'
            }
          },
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            serif: ['"Playfair Display"', 'serif'],
          },
          boxShadow: {
            'alacarta': '0 4px 25px -4px rgba(22, 62, 39, 0.08)',
            'glow': '0 8px 25px -4px rgba(35, 92, 59, 0.35)'
          }
        }
      }
    }
  </script>

  <style>
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .glass-nav {
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      background: rgba(255, 255, 255, 0.95);
    }
    .drawer-transition {
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes subtlePulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }
    .btn-pulse {
      animation: subtlePulse 2.2s infinite ease-in-out;
    }
  </style>
</head>

<body class="bg-[#F7F4EE] text-brand-dark font-sans min-h-screen flex flex-col antialiased selection:bg-brand-green selection:text-white">

  <!-- Welcome / Landing Screen -->
  <div 
    id="welcomeScreen" 
    class="fixed inset-0 z-50 bg-stone-950 flex flex-col items-center justify-between text-white transition-all duration-700 ease-out cursor-pointer select-none overflow-y-auto"
    onclick="enterStore()"
    title="Hacé clic en cualquier lugar para ingresar al menú"
  >
    <div class="absolute inset-0 z-0 overflow-hidden">
      <img 
        src="https://drive.google.com/thumbnail?id=${config.coverDriveId}&sz=w1600" 
        alt="Presentación ${config.storeName}" 
        class="w-full h-full object-cover sm:object-contain object-center scale-100 hover:scale-102 transition-transform duration-1000 opacity-90"
        onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1600&q=80';"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/85 via-black/35 to-black/90"></div>
    </div>

    <!-- Top Branding Bar -->
    <header class="relative z-10 w-full max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15">
        <img 
          src="https://drive.google.com/thumbnail?id=${config.logoDriveId}&sz=w200" 
          alt="Logo ${config.storeName}" 
          class="w-9 h-9 rounded-xl object-contain bg-white p-0.5 shadow-sm"
          onerror="this.onerror=null; this.src='https://placehold.co/100x100/235C3B/ffffff?text=YAYI';"
        />
        <div>
          <span class="font-serif font-bold text-sm tracking-wide text-white block leading-tight">${config.storeName}</span>
          <span class="text-[10px] text-amber-200/90 font-medium">${config.location}</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <a 
          href="${config.instagramUrl}" 
          target="_blank" 
          rel="noopener noreferrer" 
          onclick="event.stopPropagation()" 
          class="bg-black/50 hover:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 transition"
        >
          <i class="fa-brands fa-instagram text-pink-400"></i>
          <span class="hidden sm:inline">${config.instagram}</span>
        </a>
      </div>
    </header>

    <!-- Center Callout / Action Area -->
    <main class="relative z-10 w-full max-w-2xl mx-auto px-4 py-8 text-center my-auto flex flex-col items-center">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-green/90 backdrop-blur-md border border-brand-greenLight/50 text-emerald-100 text-xs font-bold mb-4 shadow-lg">
        <i class="fa-solid fa-wheat-awn text-brand-gold"></i>
        <span>Pastas Frescas 100% Artesanales</span>
      </div>

      <h1 class="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md text-white mb-2 leading-tight">
        Bienvenido a ${config.storeName}
      </h1>
      
      <p class="text-xs sm:text-base text-stone-200/90 max-w-md mx-auto mb-6 font-medium drop-shadow leading-relaxed">
        Elaboración artesanal por pedido. Tocá a continuación para explorar el menú y hacer tu encargo.
      </p>

      <button 
        type="button" 
        onclick="enterStore()"
        class="btn-pulse bg-brand-green hover:bg-brand-greenLight active:scale-95 text-white font-extrabold px-8 py-4 rounded-2xl shadow-glow border border-white/20 text-sm sm:text-base flex items-center gap-3 transition-all duration-300"
      >
        <i class="fa-solid fa-utensils text-brand-gold"></i>
        <span>Ver Menú y Hacer Pedido</span>
        <i class="fa-solid fa-arrow-right text-xs"></i>
      </button>

      <span class="text-[11px] text-stone-300/80 mt-3 font-medium flex items-center gap-1.5 drop-shadow">
        <i class="fa-regular fa-hand-pointer animate-pulse text-amber-300"></i>
        Hacé clic en cualquier lugar para continuar
      </span>
    </main>

    <!-- Bottom Highlights Strip -->
    <footer class="relative z-10 w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-6 pb-4 px-4">
      <div class="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-stone-300">
        <div class="flex items-center gap-1.5">
          <i class="fa-solid fa-truck-fast text-brand-gold"></i>
          <span>Envíos a Domicilio (${config.leadTimeHours}hs anticipación)</span>
        </div>
        <span class="hidden sm:inline text-stone-600">•</span>
        <div class="flex items-center gap-1.5">
          <i class="fa-solid fa-credit-card text-emerald-400"></i>
          <span>Mercado Pago: <strong>${config.mpAlias}</strong></span>
        </div>
        <span class="hidden sm:inline text-stone-600">•</span>
        <div class="flex items-center gap-1.5">
          <i class="fa-brands fa-whatsapp text-emerald-400"></i>
          <span>${config.phoneDisplay}</span>
        </div>
      </div>
    </footer>
  </div>

  <!-- Top Announcement Bar -->
  <aside class="bg-brand-green text-amber-50 text-xs py-2 px-4 shadow-sm relative z-40 border-b border-brand-greenDark">
    <div class="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-brand-gold text-stone-900 uppercase tracking-wider shadow-xs">
          ${config.noticeShort}
        </span>
        <span class="text-white/95 font-medium">
          ${config.announcementText}
        </span>
      </div>
      <div class="flex items-center gap-3 text-[11px] text-amber-100 font-medium">
        <button onclick="showWelcomeScreen()" class="hover:text-white transition flex items-center gap-1 font-bold">
          <i class="fa-solid fa-image text-brand-gold"></i>
          <span>Ver Portada</span>
        </button>
        <span>•</span>
        <span><i class="fa-solid fa-location-dot text-brand-gold mr-1"></i> ${config.location}</span>
        <button onclick="toggleInfoModal(true)" class="underline hover:text-white transition font-bold">
          Ver horarios
        </button>
      </div>
    </div>
  </aside>

  <!-- Main Hero Card Container -->
  <div class="max-w-4xl w-full mx-auto px-3 sm:px-4 pt-3">
    <div class="bg-white rounded-3xl border border-stone-200/90 shadow-alacarta overflow-hidden">
      
      <!-- Cover Banner Photo -->
      <div class="relative h-44 sm:h-56 w-full bg-gradient-to-r from-stone-900 via-stone-800 to-brand-greenDark overflow-hidden">
        <img 
          src="https://drive.google.com/thumbnail?id=${config.coverDriveId}&sz=w1200" 
          alt="${config.storeName} Portada" 
          class="w-full h-full object-cover object-center opacity-90 hover:scale-105 transition-transform duration-700"
          onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80';"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>

        <div class="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
          <a 
            href="${config.instagramUrl}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="backdrop-blur-md bg-black/55 hover:bg-black/80 border border-white/25 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow-sm hover:scale-105 active:scale-95"
          >
            <i class="fa-brands fa-instagram text-pink-400 text-sm"></i>
            <span>${config.instagram}</span>
          </a>
        </div>

        <div class="absolute bottom-3 right-4 hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-200 font-semibold bg-brand-greenDark/85 backdrop-blur-md px-3 py-1 rounded-full border border-brand-greenLight/40">
          <i class="fa-solid fa-wheat-awn text-brand-gold"></i>
          <span>Elaboración Fresca & Artesanal</span>
        </div>
      </div>

      <!-- Header Content Area -->
      <div class="px-4 sm:px-6 pb-6 pt-0 relative bg-white">
        
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3">
          <div class="flex flex-col sm:flex-row sm:items-end gap-3.5 sm:gap-4">
            
            <div class="-mt-12 sm:-mt-16 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-2 border-4 border-white shadow-xl flex-shrink-0 relative overflow-hidden z-20">
              <img 
                src="https://drive.google.com/thumbnail?id=${config.logoDriveId}&sz=w500" 
                alt="Logo ${config.storeName}" 
                class="w-full h-full object-contain rounded-xl"
                onerror="this.onerror=null; this.src='https://placehold.co/200x200/235C3B/ffffff?text=YAYI';"
              />
            </div>

            <div class="pt-2 sm:pt-4">
              <div class="flex items-center gap-2.5 flex-wrap">
                <h1 class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">${config.storeName}</h1>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Abierto
                </span>
              </div>
              <p class="text-xs sm:text-sm text-stone-600 font-medium mt-1">
                ${config.tagline}
              </p>
            </div>
          </div>

          <button 
            onclick="toggleInfoModal(true)" 
            class="self-start sm:self-center mt-1 sm:mt-0 px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-brand-greenSoft text-brand-dark hover:text-brand-green font-bold text-xs flex items-center gap-2 transition shadow-xs"
          >
            <i class="fa-solid fa-store text-brand-green"></i>
            <span>Información del local</span>
          </button>
        </div>

        <!-- Badges -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div class="bg-stone-50/90 hover:bg-brand-greenSoft/40 p-2.5 rounded-2xl border border-stone-200/80 flex items-center gap-2.5 transition">
            <div class="w-8 h-8 rounded-xl bg-brand-greenSoft text-brand-green flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-truck text-xs"></i>
            </div>
            <div class="min-w-0">
              <div class="font-bold text-brand-dark text-[11px] truncate">Envíos a Domicilio</div>
              <div class="text-stone-500 text-[10px] truncate">Con ${config.leadTimeHours}hs anticipación</div>
            </div>
          </div>

          <div class="bg-stone-50/90 hover:bg-brand-goldSoft p-2.5 rounded-2xl border border-stone-200/80 flex items-center gap-2.5 transition">
            <div class="w-8 h-8 rounded-xl bg-brand-goldSoft text-brand-goldDark flex items-center justify-center flex-shrink-0 border border-brand-gold/30">
              <i class="fa-solid fa-boxes-stacked text-xs"></i>
            </div>
            <div class="min-w-0">
              <div class="font-bold text-brand-dark text-[11px] truncate">Pedidos Grandes</div>
              <div class="text-stone-500 text-[10px] truncate">${config.minBigOrderBoxes}+ cajas consultar</div>
            </div>
          </div>

          <div 
            onclick="copyAlias()" 
            class="bg-stone-50/90 hover:bg-brand-greenSoft/60 p-2.5 rounded-2xl border border-stone-200/80 hover:border-brand-green/30 flex items-center gap-2.5 cursor-pointer transition group"
            title="Hacé clic para copiar el alias"
          >
            <div class="w-8 h-8 rounded-xl bg-brand-greenSoft text-brand-green group-hover:bg-brand-green group-hover:text-white transition flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-credit-card text-xs"></i>
            </div>
            <div class="min-w-0">
              <div class="font-bold text-brand-dark text-[11px] truncate">Mercado Pago</div>
              <div class="text-brand-green font-semibold text-[10px] truncate flex items-center gap-1">
                <span>Alias: ${config.mpAlias}</span>
                <i class="fa-regular fa-copy text-[9px]"></i>
              </div>
            </div>
          </div>

          <a 
            href="https://wa.me/${config.phoneWhatsapp}" 
            target="_blank" 
            class="bg-stone-50/90 hover:bg-emerald-50/70 p-2.5 rounded-2xl border border-stone-200/80 hover:border-emerald-200 flex items-center gap-2.5 transition"
          >
            <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <i class="fa-brands fa-whatsapp text-sm"></i>
            </div>
            <div class="min-w-0">
              <div class="font-bold text-brand-dark text-[11px] truncate">Contacto Directo</div>
              <div class="text-stone-600 font-semibold text-[10px] truncate">${config.phoneDisplay}</div>
            </div>
          </a>
        </div>

        <!-- Schedule summary strip -->
        <div class="mt-3 p-2.5 rounded-2xl bg-brand-greenSoft/70 border border-brand-green/20 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-2 text-brand-greenDark font-bold text-[11px]">
            <i class="fa-solid fa-clock text-brand-green"></i>
            <span>Horarios de entrega:</span>
          </div>
          <div class="flex flex-wrap items-center gap-2 text-[11px] text-stone-700">
            <span class="bg-white px-2 py-0.5 rounded-md border border-stone-200 font-medium"><strong>L-V:</strong> ${config.schedules.weekday}</span>
            <span class="bg-white px-2 py-0.5 rounded-md border border-stone-200 font-medium"><strong>SÁB:</strong> ${config.schedules.saturday}</span>
            <span class="bg-brand-goldSoft px-2 py-0.5 rounded-md border border-brand-gold/40 font-bold text-brand-goldDark"><strong>DOM:</strong> ${config.schedules.sunday}</span>
          </div>
        </div>

      </div>
    </div>
  </div>

  <!-- Sticky Navigation Bar -->
  <nav class="sticky top-0 z-40 glass-nav border-b border-stone-200/90 py-2.5 px-3 sm:px-4 shadow-sm mt-3">
    <div class="max-w-4xl mx-auto space-y-2">
      <div class="flex items-center gap-2.5">
        <div class="relative flex-1">
          <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs"></i>
          <input 
            id="productSearchInput" 
            type="text" 
            placeholder="Buscar pastas, ñoquis, fideos..." 
            oninput="handleSearch(this.value)"
            class="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-stone-100/90 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green focus:bg-white transition placeholder:text-stone-400 font-medium"
          />
          <button id="clearSearchBtn" onclick="clearSearch()" class="hidden absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
            <i class="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>

        <button 
          onclick="toggleCartDrawer(true)" 
          class="relative flex items-center gap-2 bg-brand-green hover:bg-brand-greenDark active:scale-95 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold shadow-glow transition"
        >
          <i class="fa-solid fa-bag-shopping text-sm"></i>
          <span class="whitespace-nowrap">Mi Pedido</span>
          <span id="navCartCount" class="bg-brand-gold text-stone-950 text-[11px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-xs">
            0
          </span>
        </button>
      </div>

      <div class="overflow-x-auto no-scrollbar flex items-center gap-2 py-0.5 text-xs">
        <button onclick="filterCategory('todos')" data-cat="todos" class="category-btn active px-4 py-1.5 rounded-full font-bold whitespace-nowrap bg-brand-green text-white shadow-sm transition">
          Todos
        </button>
        <button onclick="filterCategory('sorrentinos')" data-cat="sorrentinos" class="category-btn px-4 py-1.5 rounded-full font-semibold whitespace-nowrap bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition">
          Sorrentinos
        </button>
        <button onclick="filterCategory('raviolones')" data-cat="raviolones" class="category-btn px-4 py-1.5 rounded-full font-semibold whitespace-nowrap bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition">
          Raviolones
        </button>
        <button onclick="filterCategory('noquis')" data-cat="noquis" class="category-btn px-4 py-1.5 rounded-full font-semibold whitespace-nowrap bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition">
          Ñoquis Rellenos
        </button>
        <button onclick="filterCategory('fideos')" data-cat="fideos" class="category-btn px-4 py-1.5 rounded-full font-semibold whitespace-nowrap bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition">
          Fideos Caseros
        </button>
        <button onclick="filterCategory('promos')" data-cat="promos" class="category-btn px-4 py-1.5 rounded-full font-bold whitespace-nowrap bg-white border border-brand-gold/50 text-brand-goldDark hover:bg-brand-goldSoft transition">
          ⭐ Combos Familiares
        </button>
      </div>
    </div>
  </nav>

  <!-- Products Main Content -->
  <main class="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-4 py-4 pb-32">
    <div id="filterIndicator" class="mb-3 hidden items-center justify-between bg-brand-greenSoft/80 border border-brand-green/20 px-3.5 py-2 rounded-xl text-xs text-brand-greenDark">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-filter text-brand-green"></i>
        <span>Filtro activo en el menú</span>
      </div>
      <button onclick="resetFilters()" class="font-bold underline text-brand-green hover:text-brand-greenDark">
        Ver catálogo completo
      </button>
    </div>

    <div id="productsGrid" class="grid grid-cols-1 md:grid-cols-2 gap-3.5"></div>

    <div id="emptySearchState" class="hidden text-center py-16 px-4 bg-white rounded-3xl border border-stone-200 mt-4 shadow-sm">
      <div class="w-16 h-16 mx-auto mb-3 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
        <i class="fa-solid fa-magnifying-glass text-2xl"></i>
      </div>
      <h3 class="text-base font-bold text-stone-800">No encontramos productos con esa búsqueda</h3>
      <p class="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
        Probá con otra palabra o limpiá el filtro.
      </p>
      <button onclick="resetFilters()" class="mt-4 px-4 py-2 bg-brand-green hover:bg-brand-greenDark text-white text-xs font-bold rounded-xl shadow-glow transition">
        Restablecer filtros
      </button>
    </div>

    <!-- Interactive Mini-Map Section -->
    <section id="miniMapaSection" class="mt-10 bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-alacarta">
      <div class="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2 mb-0.5">
            <span class="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse"></span>
            <span class="text-xs uppercase tracking-wider font-extrabold text-brand-green">Zona de Elaboración y Envíos</span>
          </div>
          <h3 class="text-base sm:text-lg font-bold font-serif text-stone-900">Mapa de Cobertura • ${config.location}</h3>
          <p class="text-xs text-stone-500">
            Envíos programados a domicilio y retiros acordados en zona Estación Lugano.
          </p>
        </div>

        <a 
          href="https://www.google.com/maps/place/Lugano/@-34.6797492,-58.4741212,15z" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-brand-green hover:bg-brand-greenDark text-white font-bold text-xs rounded-xl shadow-glow transition flex-shrink-0"
        >
          <i class="fa-solid fa-map-location-dot"></i>
          <span>Abrir en Google Maps</span>
          <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
        </a>
      </div>

      <div class="relative w-full h-64 sm:h-80 bg-stone-100">
        <iframe 
          title="Mapa Zona Villa Lugano Pastas Yayi"
          src="https://maps.google.com/maps?q=Villa+Lugano,+Comuna+8,+CABA&hl=es&z=14&amp;output=embed" 
          class="w-full h-full border-0" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>

        <div class="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-stone-200/90 text-xs font-semibold text-stone-800 shadow-md flex items-center gap-2.5 max-w-[85%] pointer-events-none">
          <div class="w-7 h-7 rounded-xl bg-brand-greenSoft text-brand-green flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-location-dot text-xs"></i>
          </div>
          <div class="leading-tight">
            <div class="font-bold text-stone-900 text-xs">Zona ${config.location}</div>
            <div class="text-[10px] text-stone-500 font-normal">Entregas programadas en el radio barrial</div>
          </div>
        </div>
      </div>

      <div class="p-3 bg-stone-50 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-shield-halved text-brand-green"></i>
          <span>Elaboración fresca por pedido • Anticipación ${config.leadTimeHours}hs</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="fa-brands fa-whatsapp text-emerald-600"></i>
          <span>Consultas directas: <strong class="text-stone-900">${config.phoneDisplay}</strong></span>
        </div>
      </div>
    </section>
  </main>

  <!-- Sticky Bottom Cart Bar -->
  <div id="bottomCartBar" class="fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-2xl z-40 transform translate-y-full transition-transform duration-300">
    <div class="max-w-4xl mx-auto flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-brand-green text-white flex items-center justify-center font-bold relative shadow-glow">
          <i class="fa-solid fa-bag-shopping text-sm"></i>
          <span id="bottomCartBadge" class="absolute -top-1.5 -right-1.5 bg-brand-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold shadow-sm">
            0
          </span>
        </div>
        <div>
          <span class="text-[10px] text-stone-400 block font-semibold uppercase">Total del pedido</span>
          <span id="bottomCartTotal" class="text-base sm:text-lg font-extrabold text-stone-900 leading-tight">$0</span>
        </div>
      </div>

      <button onclick="toggleCartDrawer(true)" class="flex-1 max-w-xs bg-brand-green hover:bg-brand-greenDark active:scale-98 text-white py-2.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow transition">
        <span>Ver Mi Pedido</span>
        <i class="fa-solid fa-arrow-right text-xs"></i>
      </button>
    </div>
  </div>

  <!-- Cart Drawer Backdrop -->
  <div id="cartModalBackdrop" onclick="toggleCartDrawer(false)" class="fixed inset-0 bg-black/60 z-50 opacity-0 pointer-events-none transition-opacity duration-300"></div>

  <!-- Slide-over Cart Drawer -->
  <aside id="cartDrawer" class="drawer-transition fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#faf8f5] z-50 shadow-2xl flex flex-col transform translate-x-full">
    <div class="p-4 bg-white border-b border-stone-200 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-brand-greenSoft text-brand-green flex items-center justify-center font-bold">
          <i class="fa-solid fa-utensils"></i>
        </div>
        <div>
          <h2 class="font-extrabold text-base text-stone-900 leading-tight">Tu Pedido</h2>
          <span class="text-[11px] text-stone-500 font-medium">${config.storeName} • Fábrica Artesanal</span>
        </div>
      </div>
      <button onclick="toggleCartDrawer(false)" class="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition">
        <i class="fa-solid fa-xmark text-sm"></i>
      </button>
    </div>

    <div class="bg-brand-greenSoft border-b border-brand-green/15 px-4 py-2.5 text-xs text-brand-greenDark flex items-start gap-2">
      <i class="fa-solid fa-circle-info text-brand-green mt-0.5 text-xs"></i>
      <div class="text-[11px] leading-snug">
        <strong>Importante:</strong> Mínimo <strong>${config.leadTimeHours}hs de anticipación</strong> y transferencia Mercado Pago confirmada.
      </div>
    </div>

    <div id="cartItemsList" class="flex-1 overflow-y-auto p-4 space-y-2.5"></div>

    <div class="p-4 bg-white border-t border-stone-200 space-y-3 max-h-[55vh] overflow-y-auto">
      <div>
        <label class="block text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1">
          Forma de entrega
        </label>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <label class="flex items-center gap-2 p-2 rounded-xl border border-stone-200 cursor-pointer hover:border-brand-green transition" id="labelEnvio">
            <input type="radio" name="orderDeliveryType" value="Envío a Domicilio" checked onchange="updateDeliveryOption()" class="accent-brand-green">
            <span class="font-bold text-stone-800 text-[11px]">Envío a Domicilio</span>
          </label>
          <label class="flex items-center gap-2 p-2 rounded-xl border border-stone-200 cursor-pointer hover:border-brand-green transition" id="labelRetiro">
            <input type="radio" name="orderDeliveryType" value="Retiro por Fábrica" onchange="updateDeliveryOption()" class="accent-brand-green">
            <span class="font-bold text-stone-800 text-[11px]">Retiro (Estación Lugano)</span>
          </label>
        </div>
      </div>

      <div class="space-y-2 text-xs">
        <div>
          <label class="block font-bold text-stone-700 mb-1">Nombre y Apellido *</label>
          <input type="text" id="custName" placeholder="Ej: Yamila González" class="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green focus:bg-white text-xs font-medium" />
        </div>

        <div id="addressFieldContainer">
          <label class="block font-bold text-stone-700 mb-1">Dirección de entrega (${config.location} / Alrededores) *</label>
          <input type="text" id="custAddress" placeholder="Calle, número, piso/depto" class="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green focus:bg-white text-xs font-medium" />
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block font-bold text-stone-700 mb-1">Fecha de entrega *</label>
            <input type="date" id="custDate" onchange="handleDateChange()" class="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green focus:bg-white text-xs font-medium" />
            <span class="text-[9px] text-stone-400 block mt-0.5">Mínimo ${config.leadTimeHours}hs previas</span>
          </div>

          <div>
            <label class="block font-bold text-stone-700 mb-1">Horario disponible *</label>
            <select id="custTimeSlot" class="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green focus:bg-white text-xs font-medium"></select>
          </div>
        </div>

        <div>
          <label class="block font-bold text-stone-700 mb-1">Observaciones / Aclaraciones</label>
          <input type="text" id="custNotes" placeholder="Detalles del timbre, notas de cocción..." class="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green focus:bg-white text-xs font-medium" />
        </div>
      </div>

      <div class="p-3 bg-brand-greenSoft/80 border border-brand-green/20 rounded-2xl space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-brand-greenDark flex items-center gap-1.5">
            <i class="fa-solid fa-building-columns"></i>
            Transferencia Mercado Pago
          </span>
          <span class="text-[10px] text-brand-green font-semibold">${config.mpOwner}</span>
        </div>
        
        <div class="bg-white p-2.5 rounded-xl border border-brand-green/20 flex items-center justify-between gap-2">
          <div>
            <span class="text-[9px] text-stone-400 uppercase tracking-wide block font-bold">Alias Mercado Pago</span>
            <span class="font-mono font-extrabold text-sm text-brand-greenDark select-all">${config.mpAlias}</span>
          </div>
          <button type="button" onclick="copyAlias()" class="px-2.5 py-1.5 bg-brand-greenSoft hover:bg-brand-green/20 text-brand-greenDark rounded-lg text-xs font-bold flex items-center gap-1 transition">
            <i class="fa-regular fa-copy"></i>
            <span id="copyBtnText">Copiar</span>
          </button>
        </div>
        <p class="text-[10px] text-stone-500 leading-tight">
          * Al enviar tu pedido por WhatsApp, adjuntá el comprobante para confirmar la elaboración.
        </p>
      </div>

      <div class="pt-2 border-t border-stone-200 space-y-1 text-xs">
        <div class="flex justify-between text-stone-600">
          <span>Subtotal pastas:</span>
          <span id="drawerSubtotal" class="font-bold text-stone-900">$0</span>
        </div>
        <div class="flex justify-between text-stone-600">
          <span>Envío:</span>
          <span class="text-stone-500 italic text-[11px]" id="drawerDeliveryCost">A coordinar por zona</span>
        </div>
        <div class="flex justify-between text-stone-900 text-base font-extrabold pt-1">
          <span>Total:</span>
          <span id="drawerTotal" class="text-brand-green">$0</span>
        </div>
      </div>

      <button onclick="sendOrderWhatsApp()" class="w-full bg-[#25D366] hover:bg-[#1EBE5D] active:scale-98 text-white py-3 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition">
        <i class="fa-brands fa-whatsapp text-lg"></i>
        <span>Enviar Pedido por WhatsApp</span>
      </button>

      <div class="text-center">
        <button type="button" onclick="clearCart()" class="text-[11px] text-stone-400 hover:text-red-600 underline font-medium">
          Vaciar todo el pedido
        </button>
      </div>
    </div>
  </aside>

  <!-- Modal: Información del Local -->
  <div id="infoModal" class="fixed inset-0 bg-black/60 z-50 hidden items-center justify-center p-4 backdrop-blur-xs">
    <div class="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl relative border border-stone-200 max-h-[90vh] overflow-y-auto">
      <button onclick="toggleInfoModal(false)" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition">
        <i class="fa-solid fa-xmark text-sm"></i>
      </button>

      <div class="flex items-center gap-3 mb-5">
        <div class="w-12 h-12 rounded-2xl bg-brand-greenSoft text-brand-green flex items-center justify-center text-xl shadow-xs">
          <i class="fa-solid fa-store"></i>
        </div>
        <div>
          <h3 class="text-lg font-extrabold text-stone-900 leading-tight">Información de ${config.storeName}</h3>
          <span class="text-xs text-brand-muted">Fábrica Tradicional de Pastas Frescas</span>
        </div>
      </div>

      <div class="space-y-3.5 text-xs text-stone-700">
        <div class="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div class="font-extrabold text-stone-900 text-xs flex items-center gap-1.5">
            <i class="fa-solid fa-clock text-brand-green"></i>
            <span>Horarios de Entrega y Envíos</span>
          </div>
          <div class="grid grid-cols-1 gap-1.5 text-[11px]">
            <div class="flex justify-between items-center py-1 border-b border-stone-200/60">
              <span class="font-bold">Lunes a Viernes:</span>
              <span class="bg-brand-greenSoft text-brand-greenDark px-2 py-0.5 rounded font-bold">${config.schedules.weekday}</span>
            </div>
            <div class="flex justify-between items-center py-1 border-b border-stone-200/60">
              <span class="font-bold">Sábados:</span>
              <span class="bg-brand-greenSoft text-brand-greenDark px-2 py-0.5 rounded font-bold">${config.schedules.saturday}</span>
            </div>
            <div class="flex justify-between items-center py-1">
              <span class="font-bold">Domingos (Almuerzo):</span>
              <span class="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">${config.schedules.sunday}</span>
            </div>
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-brand-greenSoft/60 border border-brand-green/20 space-y-1.5 text-[11px] leading-relaxed">
          <div class="font-bold text-brand-greenDark flex items-center gap-1.5">
            <i class="fa-solid fa-triangle-exclamation text-brand-gold"></i>
            <span>Pautas para realizar tu pedido</span>
          </div>
          <p>• Los pedidos se toman con un mínimo de <strong>${config.leadTimeHours} horas de anticipación</strong> para elaborar la masa en el día.</p>
          <p>• <strong>Pedidos Grandes (${config.minBigOrderBoxes} cajas o más):</strong> Consultar con mayor anticipación para coordinar stock y tiempo de elaboración.</p>
          <p>• Pagos mediante transferencia por Mercado Pago al <strong>Alias: ${config.mpAlias}</strong>.</p>
        </div>

        <div class="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-[11px]">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-location-dot text-brand-green"></i>
            <span>Zona ${config.location} (Punto de retiro: Estación Lugano)</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fa-brands fa-whatsapp text-emerald-600"></i>
            <span>WhatsApp pedidos: <strong>${config.phoneDisplay}</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fa-brands fa-instagram text-pink-600"></i>
            <span>Instagram: <strong>${config.instagram}</strong></span>
          </div>
        </div>
      </div>

      <button onclick="toggleInfoModal(false)" class="w-full mt-5 py-3 bg-brand-green hover:bg-brand-greenDark text-white rounded-xl text-xs font-bold transition shadow-glow">
        Volver al menú
      </button>
    </div>
  </div>

  <!-- Toast Notification -->
  <div id="toastNotification" class="fixed top-5 right-5 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs transform -translate-y-24 opacity-0 transition-all duration-300 pointer-events-none">
    <i id="toastIcon" class="fa-solid fa-check text-amber-400"></i>
    <span id="toastMessage" class="font-medium">Acción completada</span>
  </div>

  <!-- Footer with Credits -->
  <footer class="bg-white border-t border-stone-200/80 py-8 px-4 text-center text-xs text-stone-500 mt-auto">
    <div class="max-w-4xl mx-auto flex flex-col items-center justify-center gap-3">
      <div class="flex items-center gap-2.5">
        <div class="w-6 h-6 rounded-lg overflow-hidden bg-stone-100 p-0.5 border border-stone-200">
          <img src="https://drive.google.com/thumbnail?id=${config.logoDriveId}&sz=w200" alt="${config.storeName}" class="w-full h-full object-contain" />
        </div>
        <span class="font-serif font-extrabold text-stone-900 text-sm">${config.storeName}</span>
        <span>•</span>
        <span class="text-stone-500 text-[11px]">Fábrica de Pastas Caseras y Artesanales</span>
      </div>

      <p class="max-w-md text-stone-400 text-[11px] leading-relaxed">
        ${config.location} • Envíos: L-V ${config.schedules.weekday} | Sáb ${config.schedules.saturday} | Dom ${config.schedules.sunday} • Tel: ${config.phoneDisplay} • Instagram: ${config.instagram}
      </p>

      <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 text-[11px]">
        <span class="text-stone-500">© 2026 ${config.storeName} - Todos los derechos reservados</span>
        <span class="hidden sm:inline text-stone-300">•</span>
        <a 
          href="https://wa.me/5491127264276" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="inline-flex items-center gap-1.5 font-bold text-brand-green hover:text-brand-greenDark bg-brand-greenSoft/80 hover:bg-brand-greenSoft px-3 py-1.5 rounded-full border border-brand-green/20 transition shadow-xs"
        >
          <i class="fa-brands fa-whatsapp text-emerald-600 text-xs"></i>
          <span>Creado por <strong>Ened Computación</strong></span>
        </a>
      </div>
    </div>
  </footer>

  <!-- Live Injected Data & Logic -->
  <script>
    // Catalogo sincronizado desde la app de administracion
    const products = ${productsJson};

    const STORE_CONFIG = {
      phoneWhatsapp: '${config.phoneWhatsapp}',
      mpAlias: '${config.mpAlias}',
      schedules: {
        weekday: '${config.schedules.weekday}',
        saturday: '${config.schedules.saturday}',
        sunday: '${config.schedules.sunday}'
      }
    };

    let cart = {};
    let currentCategory = 'todos';
    let searchQuery = '';

    function getImageUrl(driveId, fallbackUrl) {
      if (!driveId) return fallbackUrl;
      return 'https://drive.google.com/thumbnail?id=' + driveId + '&sz=w800';
    }

    function formatCurrency(num) {
      return '$' + Number(num).toLocaleString('es-AR');
    }

    function renderProducts() {
      const container = document.getElementById('productsGrid');
      const emptyState = document.getElementById('emptySearchState');
      const filterIndicator = document.getElementById('filterIndicator');

      const filtered = products.filter(p => {
        const matchesCategory = currentCategory === 'todos' || p.category === currentCategory;
        const matchesSearch = searchQuery === '' || 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      });

      if (searchQuery !== '' || currentCategory !== 'todos') {
        filterIndicator.classList.remove('hidden');
        filterIndicator.classList.add('flex');
      } else {
        filterIndicator.classList.add('hidden');
        filterIndicator.classList.remove('flex');
      }

      if (filtered.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
      }

      emptyState.classList.add('hidden');

      container.innerHTML = filtered.map(product => {
        const qtyInCart = cart[product.id] ? cart[product.id].quantity : 0;
        const imgUrl = getImageUrl(product.driveId, product.fallback);

        return \`
          <div class="bg-white rounded-2xl p-3.5 border border-stone-200/85 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
            <div class="flex gap-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                  <span class="text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full \${
                    product.category === 'promos' 
                      ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                      : 'bg-brand-greenSoft text-brand-greenDark border border-brand-green/15'
                  }">
                    \${product.badge || 'Fresco'}
                  </span>
                  <span class="text-[10px] text-stone-400 font-semibold">\${product.tagline || ''}</span>
                </div>

                <h3 class="font-extrabold text-sm sm:text-base text-stone-900 leading-snug group-hover:text-brand-green transition-colors">
                  \${product.name}
                </h3>

                <p class="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                  \${product.description || ''}
                </p>
              </div>

              <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 relative border border-stone-100">
                <img 
                  src="\${imgUrl}" 
                  alt="\${product.name}" 
                  loading="lazy"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onerror="this.onerror=null; this.src='\${product.fallback}';"
                />
              </div>
            </div>

            <div class="mt-3 pt-2.5 flex items-center justify-between border-t border-stone-100">
              <div>
                <span class="text-[9px] text-stone-400 uppercase font-bold block leading-none">Precio</span>
                <span class="text-base font-extrabold text-stone-900 leading-tight">
                  \${formatCurrency(product.price)}
                </span>
              </div>

              \${qtyInCart === 0 ? \`
                <button 
                  onclick="addToCart('\${product.id}')"
                  class="bg-brand-green hover:bg-brand-greenDark text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                >
                  <i class="fa-solid fa-plus text-[10px]"></i>
                  <span>Agregar</span>
                </button>
              \` : \`
                <div class="flex items-center gap-2 bg-stone-100 p-1 rounded-xl border border-stone-200">
                  <button onclick="decreaseCartItem('\${product.id}')" class="w-6 h-6 rounded-lg bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center text-xs font-bold transition shadow-xs">
                    <i class="fa-solid fa-minus text-[10px]"></i>
                  </button>
                  <span class="text-xs font-extrabold px-1 text-stone-900">\${qtyInCart}</span>
                  <button onclick="addToCart('\${product.id}')" class="w-6 h-6 rounded-lg bg-brand-green text-white hover:bg-brand-greenDark flex items-center justify-center text-xs font-bold transition shadow-xs">
                    <i class="fa-solid fa-plus text-[10px]"></i>
                  </button>
                </div>
              \`}
            </div>
          </div>
        \`;
      }).join('');
    }

    function addToCart(productId) {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      if (!cart[productId]) {
        cart[productId] = { product, quantity: 1 };
      } else {
        cart[productId].quantity += 1;
      }

      showToast('Agregaste ' + product.name);
      updateCartUI();
      renderProducts();
    }

    function decreaseCartItem(productId) {
      if (!cart[productId]) return;
      cart[productId].quantity -= 1;
      if (cart[productId].quantity <= 0) {
        delete cart[productId];
      }
      updateCartUI();
      renderProducts();
    }

    function removeCartItem(productId) {
      if (cart[productId]) {
        delete cart[productId];
        updateCartUI();
        renderProducts();
      }
    }

    function clearCart() {
      cart = {};
      updateCartUI();
      renderProducts();
      showToast('Tu pedido ha sido vaciado');
    }

    function updateCartUI() {
      const items = Object.values(cart);
      const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

      const navCartCount = document.getElementById('navCartCount');
      if (navCartCount) navCartCount.textContent = totalCount;

      const bottomBar = document.getElementById('bottomCartBar');
      const bottomBadge = document.getElementById('bottomCartBadge');
      const bottomTotal = document.getElementById('bottomCartTotal');

      if (totalCount > 0) {
        bottomBar.classList.remove('translate-y-full');
        bottomBadge.textContent = totalCount;
        bottomTotal.textContent = formatCurrency(totalPrice);
      } else {
        bottomBar.classList.add('translate-y-full');
      }

      const drawerList = document.getElementById('cartItemsList');
      const drawerSubtotal = document.getElementById('drawerSubtotal');
      const drawerTotal = document.getElementById('drawerTotal');

      if (items.length === 0) {
        drawerList.innerHTML = \`
          <div class="text-center py-14 text-stone-400">
            <div class="w-14 h-14 mx-auto mb-2.5 rounded-full bg-stone-100 flex items-center justify-center text-stone-300">
              <i class="fa-solid fa-basket-shopping text-2xl"></i>
            </div>
            <p class="text-xs font-bold text-stone-700">Tu pedido está vacío</p>
            <p class="text-[11px] text-stone-400 mt-0.5">Elegí las pastas caseras que quieras encargar.</p>
          </div>
        \`;
      } else {
        drawerList.innerHTML = items.map(({ product, quantity }) => {
          const itemTotal = product.price * quantity;
          const imgUrl = getImageUrl(product.driveId, product.fallback);

          return \`
            <div class="bg-white p-3 rounded-2xl border border-stone-200 flex items-center justify-between gap-3 shadow-xs">
              <img 
                src="\${imgUrl}" 
                alt="\${product.name}" 
                class="w-12 h-12 rounded-xl object-cover bg-stone-100 flex-shrink-0"
                onerror="this.onerror=null; this.src='\${product.fallback}';"
              />
              <div class="flex-1 min-w-0">
                <h4 class="text-xs font-bold text-stone-900 truncate">\${product.name}</h4>
                <div class="text-[11px] text-stone-400">\${formatCurrency(product.price)} c/u</div>
                <div class="text-xs font-extrabold text-brand-green">\${formatCurrency(itemTotal)}</div>
              </div>

              <div class="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
                <button onclick="decreaseCartItem('\${product.id}')" class="w-6 h-6 rounded-lg bg-white text-stone-700 hover:bg-stone-200 text-xs font-bold flex items-center justify-center shadow-xs">-</button>
                <span class="text-xs font-extrabold px-1">\${quantity}</span>
                <button onclick="addToCart('\${product.id}')" class="w-6 h-6 rounded-lg bg-brand-green text-white hover:bg-brand-greenDark text-xs font-bold flex items-center justify-center shadow-xs">+</button>
              </div>

              <button onclick="removeCartItem('\${product.id}')" class="text-stone-300 hover:text-red-500 text-xs p-1 transition">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          \`;
        }).join('');
      }

      if (drawerSubtotal) drawerSubtotal.textContent = formatCurrency(totalPrice);
      if (drawerTotal) drawerTotal.textContent = formatCurrency(totalPrice);
    }

    function filterCategory(cat) {
      currentCategory = cat;
      document.querySelectorAll('.category-btn').forEach(btn => {
        if (btn.dataset.cat === cat) {
          btn.className = "category-btn active px-4 py-1.5 rounded-full font-bold whitespace-nowrap bg-brand-green text-white shadow-sm transition";
        } else {
          btn.className = "category-btn px-4 py-1.5 rounded-full font-semibold whitespace-nowrap bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition";
        }
      });
      renderProducts();
    }

    function handleSearch(val) {
      searchQuery = val.trim();
      const clearBtn = document.getElementById('clearSearchBtn');
      if (searchQuery.length > 0) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
      renderProducts();
    }

    function clearSearch() {
      const input = document.getElementById('productSearchInput');
      input.value = '';
      handleSearch('');
    }

    function resetFilters() {
      clearSearch();
      filterCategory('todos');
    }

    function toggleCartDrawer(open) {
      const drawer = document.getElementById('cartDrawer');
      const backdrop = document.getElementById('cartModalBackdrop');

      if (open) {
        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100');
        drawer.classList.remove('translate-x-full');
        document.body.classList.add('overflow-hidden');
      } else {
        backdrop.classList.add('opacity-0', 'pointer-events-none');
        backdrop.classList.remove('opacity-100');
        drawer.classList.add('translate-x-full');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function toggleInfoModal(open) {
      const modal = document.getElementById('infoModal');
      if (open) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.classList.add('overflow-hidden');
      } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
      }
    }

    function updateDeliveryOption() {
      const isDelivery = document.querySelector('input[name="orderDeliveryType"]:checked').value === 'Envío a Domicilio';
      const addressContainer = document.getElementById('addressFieldContainer');
      const deliveryCostLabel = document.getElementById('drawerDeliveryCost');

      if (isDelivery) {
        addressContainer.classList.remove('hidden');
        deliveryCostLabel.textContent = 'A coordinar por zona';
      } else {
        addressContainer.classList.add('hidden');
        deliveryCostLabel.textContent = 'Sin cargo (Retiro por fábrica)';
      }
    }

    function updateTimeSlotOptionsForDate(selectedDateString) {
      const slotSelect = document.getElementById('custTimeSlot');
      if (!slotSelect) return;

      if (!selectedDateString) {
        slotSelect.innerHTML = '<option value="A coordinar con el local">A coordinar con el local</option>';
        return;
      }

      const [year, month, day] = selectedDateString.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      const dayOfWeek = dateObj.getDay();

      let optionsHtml = '';
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        optionsHtml = '<option value="' + STORE_CONFIG.schedules.weekday + ' (Horario de envíos)">' + STORE_CONFIG.schedules.weekday + ' (Envíos)</option><option value="A coordinar previamente">A coordinar previamente</option>';
      } else if (dayOfWeek === 6) {
        optionsHtml = '<option value="' + STORE_CONFIG.schedules.saturday + ' (Horario de envíos)">' + STORE_CONFIG.schedules.saturday + ' (Envíos)</option><option value="A coordinar previamente">A coordinar previamente</option>';
      } else if (dayOfWeek === 0) {
        optionsHtml = '<option value="' + STORE_CONFIG.schedules.sunday + ' (Almuerzos Domingo)">' + STORE_CONFIG.schedules.sunday + ' (Almuerzo)</option><option value="A coordinar previamente">A coordinar previamente</option>';
      }

      slotSelect.innerHTML = optionsHtml;
    }

    function handleDateChange() {
      const dateInput = document.getElementById('custDate');
      updateTimeSlotOptionsForDate(dateInput.value);
    }

    function copyAlias() {
      const alias = STORE_CONFIG.mpAlias;
      const tempInput = document.createElement('input');
      tempInput.value = alias;
      document.body.appendChild(tempInput);
      tempInput.select();
      try {
        document.execCommand('copy');
        const copyBtnText = document.getElementById('copyBtnText');
        if (copyBtnText) copyBtnText.textContent = '¡Copiado!';
        showToast('Alias copiado: ' + alias);
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'Copiar';
        }, 2500);
      } catch (err) {
        showToast('Alias MP: ' + alias);
      }
      document.body.removeChild(tempInput);
    }

    function showToast(message) {
      const toast = document.getElementById('toastNotification');
      const toastMsg = document.getElementById('toastMessage');
      toastMsg.textContent = message;
      toast.classList.remove('-translate-y-24', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');

      setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('-translate-y-24', 'opacity-0');
      }, 2600);
    }

    function sendOrderWhatsApp() {
      const items = Object.values(cart);
      if (items.length === 0) {
        showToast('Agregá al menos un producto a tu pedido');
        return;
      }

      const name = document.getElementById('custName').value.trim();
      const address = document.getElementById('custAddress').value.trim();
      const date = document.getElementById('custDate').value;
      const slot = document.getElementById('custTimeSlot').value;
      const notes = document.getElementById('custNotes').value.trim();
      const deliveryType = document.querySelector('input[name="orderDeliveryType"]:checked').value;

      if (!name) {
        showToast('Por favor completá tu nombre y apellido');
        document.getElementById('custName').focus();
        return;
      }

      if (deliveryType === 'Envío a Domicilio' && !address) {
        showToast('Por favor ingresá tu dirección para el envío');
        document.getElementById('custAddress').focus();
        return;
      }

      if (!date) {
        showToast('Por favor seleccioná la fecha');
        document.getElementById('custDate').focus();
        return;
      }

      const totalBoxes = items.reduce((sum, item) => sum + item.quantity, 0);
      const isBigOrder = totalBoxes >= 10;
      const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

      let message = '*NUEVO PEDIDO - ' + '${config.storeName.toUpperCase()}' + '*\\n';
      message += '------------------------------------\\n';
      message += '*Cliente:* ' + name + '\\n';
      message += '*Modalidad:* ' + deliveryType + '\\n';
      if (deliveryType === 'Envío a Domicilio') {
        message += '*Dirección:* ' + address + '\\n';
      }
      message += '*Fecha requerida:* ' + date + '\\n';
      message += '*Franja horaria:* ' + slot + '\\n';
      if (notes) {
        message += '*Observaciones:* ' + notes + '\\n';
      }
      message += '------------------------------------\\n';
      message += '*DETALLE DE PASTAS:*\\n';

      items.forEach(({ product, quantity }) => {
        message += '• ' + quantity + 'x ' + product.name + ' (' + (product.tagline || '') + ') -> ' + formatCurrency(product.price * quantity) + '\\n';
      });

      message += '------------------------------------\\n';
      message += '*TOTAL PASTAS:* ' + formatCurrency(totalPrice) + '\\n';
      message += '*Método de pago:* Transferencia Mercado Pago\\n';
      message += '*Alias:* ' + STORE_CONFIG.mpAlias + '\\n\\n';

      if (isBigOrder) {
        message += '⚠️ *Aviso de Pedido Grande:* Son ' + totalBoxes + ' cajas. Consulto confirmación de elaboración.\\n\\n';
      }

      message += 'Adjunto a continuación el comprobante de transferencia. ¡Muchas gracias!';

      const url = 'https://wa.me/' + STORE_CONFIG.phoneWhatsapp + '?text=' + encodeURIComponent(message);
      window.open(url, '_blank');
    }

    function initializeMinDate() {
      const dateInput = document.getElementById('custDate');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      const minDate = yyyy + '-' + mm + '-' + dd;
      
      dateInput.min = minDate;
      dateInput.value = minDate;
      updateTimeSlotOptionsForDate(minDate);
    }

    function enterStore() {
      const welcome = document.getElementById('welcomeScreen');
      if (!welcome) return;
      welcome.classList.add('opacity-0', 'pointer-events-none', 'scale-105');
      document.body.classList.remove('overflow-hidden');
      setTimeout(() => {
        welcome.classList.add('hidden');
      }, 700);
    }

    function showWelcomeScreen() {
      const welcome = document.getElementById('welcomeScreen');
      if (!welcome) return;
      welcome.classList.remove('hidden');
      void welcome.offsetWidth;
      welcome.classList.remove('opacity-0', 'pointer-events-none', 'scale-105');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.addEventListener('keydown', (e) => {
      const welcome = document.getElementById('welcomeScreen');
      if (welcome && !welcome.classList.contains('hidden') && (e.key === 'Enter' || e.key === ' ')) {
        enterStore();
      }
    });

    window.addEventListener('DOMContentLoaded', () => {
      renderProducts();
      updateCartUI();
      initializeMinDate();
    });
  </script>
</body>
</html>`;
}

export function downloadFile(filename: string, content: string, mimeType: string = 'text/html') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
