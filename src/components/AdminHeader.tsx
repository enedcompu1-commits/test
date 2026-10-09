import React from 'react';
import { 
  UtensilsCrossed, 
  Layers, 
  Sparkles, 
  Settings, 
  Eye, 
  Code2, 
  TrendingUp, 
  RotateCcw,
  Store,
  ExternalLink
} from 'lucide-react';
import { StoreConfig } from '../types';

interface AdminHeaderProps {
  activeTab: 'products' | 'promos' | 'store' | 'preview' | 'sync';
  setActiveTab: (tab: 'products' | 'promos' | 'store' | 'preview' | 'sync') => void;
  config: StoreConfig;
  productCount: number;
  promoCount: number;
  onOpenBulkModal: () => void;
  onResetData: () => void;
  onOpenSyncModal: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  setActiveTab,
  config,
  productCount,
  promoCount,
  onOpenBulkModal,
  onResetData,
  onOpenSyncModal
}) => {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      {/* Top Notification Bar */}
      <div className="bg-[#163E27] text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
          <span className="bg-[#C6994E] text-stone-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
            Panel de Control
          </span>
          <span className="truncate">
            Administración del Menú Digital • <strong>{config.storeName}</strong> ({config.location})
          </span>
          <div className="ml-auto flex items-center gap-3 text-[11px] text-emerald-200">
            <span>Alias MP: <strong className="text-white">{config.mpAlias}</strong></span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">WhatsApp: <strong className="text-white">{config.phoneDisplay}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#EDF6F0] border border-[#235C3B]/20 p-1 flex items-center justify-center shadow-xs">
            <img 
              src={`https://drive.google.com/thumbnail?id=${config.logoDriveId}&sz=w200`}
              alt="Logo" 
              className="w-full h-full object-contain rounded-xl"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/100x100/235C3B/ffffff?text=YAYI';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-stone-900 font-serif leading-tight">
                {config.storeName}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Sincronizado
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Gestor de Menú, Precios, Promociones y Vinculación Web
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenBulkModal}
            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
            title="Aumentar o cambiar precios en porcentaje a todos los productos"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
            <span>Ajuste Masivo de Precios</span>
          </button>

          <button
            onClick={onOpenSyncModal}
            className="px-3.5 py-2 bg-[#235C3B] hover:bg-[#163E27] text-white rounded-xl text-xs font-extrabold flex items-center gap-2 transition active:scale-95 shadow-sm"
          >
            <Code2 className="w-4 h-4 text-[#C6994E]" />
            <span>Vincular con tu Página Web</span>
          </button>

          <button
            onClick={onResetData}
            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition"
            title="Restablecer a los productos originales"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 border-t border-stone-100 flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-[#235C3B] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Productos</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'products' ? 'bg-white/25 text-white' : 'bg-stone-200 text-stone-700'
          }`}>
            {productCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('promos')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'promos'
              ? 'bg-[#235C3B] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Promos & Combos</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            activeTab === 'promos' ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-800'
          }`}>
            {promoCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('store')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'store'
              ? 'bg-[#235C3B] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Datos del Negocio & Horarios</span>
        </button>

        <button
          onClick={() => setActiveTab('sync')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'sync'
              ? 'bg-[#235C3B] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Código & Exportación</span>
        </button>

        <div className="ml-auto pl-2 border-l border-stone-200">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition whitespace-nowrap ${
              activeTab === 'preview'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Menú Cliente (En Vivo)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
