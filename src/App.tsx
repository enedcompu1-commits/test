import React, { useState, useEffect } from 'react';
import { 
  getStoredProducts, 
  saveStoredProducts, 
  getStoredPromos, 
  saveStoredPromos, 
  getStoredCategories, 
  saveStoredCategories, 
  getStoredStoreConfig, 
  saveStoredStoreConfig,
  resetAllToDefault
} from './services/storage';
import { Product, PromoItem, StoreConfig, Category } from './types';
import { AdminHeader } from './components/AdminHeader';
import { ProductsManager } from './components/ProductsManager';
import { PromosManager } from './components/PromosManager';
import { StoreConfigManager } from './components/StoreConfigManager';
import { ClientMenuPreview } from './components/ClientMenuPreview';
import { BulkPriceModal } from './components/BulkPriceModal';
import { WebSyncModal } from './components/WebSyncModal';
import { Check, AlertTriangle, ArrowRight, Sparkles, Code2 } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [promos, setPromos] = useState<PromoItem[]>(() => getStoredPromos());
  const [categories, setCategories] = useState<Category[]>(() => getStoredCategories());
  const [config, setConfig] = useState<StoreConfig>(() => getStoredStoreConfig());

  const [activeTab, setActiveTab] = useState<'products' | 'promos' | 'store' | 'preview' | 'sync'>('products');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-save effects
  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  useEffect(() => {
    saveStoredPromos(promos);
  }, [promos]);

  useEffect(() => {
    saveStoredCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveStoredStoreConfig(config);
  }, [config]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // Product CRUD
  const handleSaveProduct = (updatedProduct: Product) => {
    setProducts(prev => {
      const exists = prev.some(p => p.id === updatedProduct.id);
      if (exists) {
        return prev.map(p => p.id === updatedProduct.id ? updatedProduct : p);
      }
      return [updatedProduct, ...prev];
    });
    showNotification(`Producto "${updatedProduct.name}" guardado.`);
  };

  const handleDeleteProduct = (productId: string) => {
    const toDelete = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    showNotification(`Producto "${toDelete?.name || ''}" eliminado.`);
  };

  const handleDuplicateProduct = (prod: Product) => {
    const copy: Product = {
      ...prod,
      id: `${prod.id}-copia-${Date.now().toString().slice(-4)}`,
      name: `${prod.name} (Copia)`,
      active: true
    };
    setProducts(prev => [copy, ...prev]);
    showNotification(`Se duplicó "${prod.name}".`);
  };

  const handleToggleProductActive = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextState = !p.active;
        showNotification(nextState ? `"${p.name}" activado en el menú.` : `"${p.name}" pausado.`);
        return { ...p, active: nextState };
      }
      return p;
    }));
  };

  // Promo CRUD
  const handleSavePromo = (updatedPromo: PromoItem) => {
    setPromos(prev => {
      const exists = prev.some(pr => pr.id === updatedPromo.id);
      if (exists) {
        return prev.map(pr => pr.id === updatedPromo.id ? updatedPromo : pr);
      }
      return [updatedPromo, ...prev];
    });
    showNotification(`Promo "${updatedPromo.name}" guardada.`);
  };

  const handleDeletePromo = (promoId: string) => {
    const toDelete = promos.find(pr => pr.id === promoId);
    setPromos(prev => prev.filter(pr => pr.id !== promoId));
    showNotification(`Promo "${toDelete?.name || ''}" eliminada.`);
  };

  const handleDuplicatePromo = (promo: PromoItem) => {
    const copy: PromoItem = {
      ...promo,
      id: `${promo.id}-copia-${Date.now().toString().slice(-4)}`,
      name: `${promo.name} (Copia)`,
      active: true
    };
    setPromos(prev => [copy, ...prev]);
    showNotification(`Se duplicó la promo "${promo.name}".`);
  };

  const handleTogglePromoActive = (promoId: string) => {
    setPromos(prev => prev.map(pr => {
      if (pr.id === promoId) {
        const nextState = !pr.active;
        showNotification(nextState ? `"${pr.name}" activada.` : `"${pr.name}" pausada.`);
        return { ...pr, active: nextState };
      }
      return pr;
    }));
  };

  // Config Update
  const handleSaveConfig = (newConfig: StoreConfig) => {
    setConfig(newConfig);
    showNotification('Datos del negocio guardados correctamente.');
  };

  // Bulk Price Update
  const handleApplyBulkPrice = (newProducts: Product[], newPromos: PromoItem[]) => {
    setProducts(newProducts);
    setPromos(newPromos);
    showNotification('¡Precios actualizados en todo el catálogo!');
  };

  // Reset to original data
  const handleResetData = () => {
    if (window.confirm('¿Deseas restablecer todos los productos y datos a los valores iniciales de Pastas Yayi?')) {
      resetAllToDefault();
      setProducts(getStoredProducts());
      setPromos(getStoredPromos());
      setCategories(getStoredCategories());
      setConfig(getStoredStoreConfig());
      showNotification('Catálogo restablecido a valores originales.');
    }
  };

  // Backup Import
  const handleImportBackup = (backupData: any) => {
    if (!backupData || !backupData.products) {
      alert('El archivo no contiene un respaldo válido de Pastas Yayi.');
      return;
    }
    if (backupData.products) setProducts(backupData.products);
    if (backupData.promos) setPromos(backupData.promos);
    if (backupData.config) setConfig(backupData.config);
    showNotification('Respaldo restaurado con éxito.');
    setIsSyncModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#19241C] flex flex-col font-sans selection:bg-[#235C3B] selection:text-white">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#163E27] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border border-[#C6994E]/40 animate-fade-in">
          <Check className="w-4 h-4 text-[#C6994E]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Admin Header */}
      <AdminHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        config={config}
        productCount={products.filter(p => p.active).length}
        promoCount={promos.filter(pr => pr.active).length}
        onOpenBulkModal={() => setIsBulkModalOpen(true)}
        onResetData={handleResetData}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'products' && (
          <ProductsManager
            products={products}
            categories={categories}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onDuplicateProduct={handleDuplicateProduct}
            onToggleActive={handleToggleProductActive}
          />
        )}

        {activeTab === 'promos' && (
          <PromosManager
            promos={promos}
            onSavePromo={handleSavePromo}
            onDeletePromo={handleDeletePromo}
            onDuplicatePromo={handleDuplicatePromo}
            onToggleActive={handleTogglePromoActive}
          />
        )}

        {activeTab === 'store' && (
          <StoreConfigManager
            config={config}
            onSaveConfig={handleSaveConfig}
          />
        )}

        {activeTab === 'preview' && (
          <ClientMenuPreview
            products={products}
            promos={promos}
            config={config}
            categories={categories}
          />
        )}

        {activeTab === 'sync' && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EDF6F0] text-[#235C3B] flex items-center justify-center font-bold">
                  <Code2 className="w-6 h-6 text-[#C6994E]" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-stone-900 font-serif">
                    Vincular Catálogo con tu Página Web
                  </h2>
                  <p className="text-xs text-stone-500">
                    Cualquier cambio que hagas en productos o combos se refleja aquí listo para exportar.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div 
                  onClick={() => setIsSyncModalOpen(true)}
                  className="p-5 rounded-2xl border-2 border-[#235C3B] bg-[#EDF6F0]/40 hover:bg-[#EDF6F0] cursor-pointer transition flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#235C3B] tracking-wider block mb-1">
                      Opción Recomendada
                    </span>
                    <h3 className="font-extrabold text-stone-900 text-sm group-hover:text-[#235C3B] transition">
                      Descargar HTML Actualizado
                    </h3>
                    <p className="text-stone-600 text-xs mt-1 leading-relaxed">
                      Descargá tu archivo <code className="font-mono bg-white px-1 rounded">index.html</code> con todos los nuevos productos y precios listos para subir a tu hosting o abrir en el navegador.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 font-bold text-xs text-[#235C3B]">
                    <span>Abrir herramientas de exportación</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('preview')}
                  className="p-5 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-stone-100 cursor-pointer transition flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider block mb-1">
                      Simulador en Vivo
                    </span>
                    <h3 className="font-extrabold text-stone-900 text-sm">
                      Ver Menú como tus Clientes
                    </h3>
                    <p className="text-stone-600 text-xs mt-1 leading-relaxed">
                      Probá agregar pastas al carrito, seleccionar horarios y enviar un pedido de prueba por WhatsApp.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 font-bold text-xs text-stone-700">
                    <span>Ir a vista previa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Bulk Price Modal */}
      <BulkPriceModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        products={products}
        promos={promos}
        categories={categories}
        onApplyBulkPrice={handleApplyBulkPrice}
      />

      {/* Web Sync Modal */}
      <WebSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        products={products}
        promos={promos}
        config={config}
        onImportBackup={handleImportBackup}
      />

    </div>
  );
}
