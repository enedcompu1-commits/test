import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  X, 
  Layers, 
  Tag, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { PromoItem } from '../types';

interface PromosManagerProps {
  promos: PromoItem[];
  onSavePromo: (promo: PromoItem) => void;
  onDeletePromo: (promoId: string) => void;
  onDuplicatePromo: (promo: PromoItem) => void;
  onToggleActive: (promoId: string) => void;
}

export const PromosManager: React.FC<PromosManagerProps> = ({
  promos,
  onSavePromo,
  onDeletePromo,
  onDuplicatePromo,
  onToggleActive
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number>(27500);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(30500);
  const [formBadge, setFormBadge] = useState('Ahorro');
  const [formDriveId, setFormDriveId] = useState('');
  const [formFallback, setFormFallback] = useState('');
  const [formItemsText, setFormItemsText] = useState('');
  const [formHighlightText, setFormHighlightText] = useState('');
  const [formActive, setFormActive] = useState(true);

  const openCreateModal = () => {
    setEditingPromo(null);
    setFormName('Nuevo Combo Familiar');
    setFormTagline('2 Cajas Sorrentinos + 1 Raviolones');
    setFormDescription('Ideal para el almuerzo en familia de los domingos. ¡Elegí tus variedades favoritas!');
    setFormPrice(24000);
    setFormOriginalPrice(26000);
    setFormBadge('Combo Especial');
    setFormDriveId('1hcvHBUgYG5yExeIe6Q4EfIiTitTshUSm');
    setFormFallback('https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80');
    setFormItemsText('2 Cajas de Sorrentinos a elección\n1 Caja de Raviolones');
    setFormHighlightText('Ahorrás $2.000 con este combo');
    setFormActive(true);
    setModalOpen(true);
  };

  const openEditModal = (promo: PromoItem) => {
    setEditingPromo(promo);
    setFormName(promo.name);
    setFormTagline(promo.tagline || '');
    setFormDescription(promo.description || '');
    setFormPrice(promo.price);
    setFormOriginalPrice(promo.originalPrice || promo.price);
    setFormBadge(promo.badge || 'Ahorro');
    setFormDriveId(promo.driveId || '');
    setFormFallback(promo.fallback || '');
    setFormItemsText((promo.itemsIncluded || []).join('\n'));
    setFormHighlightText(promo.highlightText || '');
    setFormActive(promo.active);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const items = formItemsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const promoData: PromoItem = {
      id: editingPromo ? editingPromo.id : `promo-${slug}-${Date.now().toString().slice(-4)}`,
      name: formName.trim(),
      tagline: formTagline.trim(),
      description: formDescription.trim(),
      price: Number(formPrice) || 0,
      originalPrice: Number(formOriginalPrice) || Number(formPrice) || 0,
      badge: formBadge.trim(),
      driveId: formDriveId.trim(),
      fallback: formFallback.trim() || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
      itemsIncluded: items,
      highlightText: formHighlightText.trim(),
      active: formActive
    };

    onSavePromo(promoData);
    setModalOpen(false);
  };

  const formatMoney = (n: number) => '$' + Number(n).toLocaleString('es-AR');

  const getImageSrc = (driveId: string, fallback: string) => {
    if (driveId) return `https://drive.google.com/thumbnail?id=${driveId}&sz=w600`;
    return fallback || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Banner & Action */}
      <div className="bg-gradient-to-r from-[#235C3B] to-[#163E27] rounded-3xl p-6 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C6994E] text-stone-950 text-xs font-black mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Combos & Promociones Especiales</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-serif">
            Gestioná tus Combos Familiares y Ahorro
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            Los combos impulsan el ticket promedio y facilitan los pedidos de fin de semana para familias numerosas.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="relative z-10 px-5 py-3 bg-[#C6994E] hover:bg-[#9E752D] text-stone-950 font-black rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition active:scale-95"
        >
          <Plus className="w-4 h-4 text-stone-950" />
          <span>Crear Nueva Promo / Combo</span>
        </button>
      </div>

      {/* Promos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {promos.map(promo => {
          const savings = (promo.originalPrice || 0) > promo.price ? promo.originalPrice - promo.price : 0;
          const savingsPercent = promo.originalPrice && promo.originalPrice > promo.price
            ? Math.round(((promo.originalPrice - promo.price) / promo.originalPrice) * 100)
            : 0;

          const imgUrl = getImageSrc(promo.driveId, promo.fallback);

          return (
            <div
              key={promo.id}
              className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md flex flex-col justify-between ${
                promo.active ? 'border-amber-200/80' : 'border-dashed border-stone-300 opacity-60 bg-stone-50/50'
              }`}
            >
              <div>
                {/* Header ribbon */}
                <div className="bg-[#FCF7EB] border-b border-amber-200/60 px-5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#C6994E] text-stone-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                      {promo.badge || 'Promo'}
                    </span>
                    {savings > 0 && (
                      <span className="text-[11px] font-extrabold text-amber-900 flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                        Ahorrás {formatMoney(savings)} ({savingsPercent}% OFF)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleActive(promo.id)}
                      title={promo.active ? 'Desactivar combo' : 'Activar combo'}
                      className={`p-1.5 rounded-lg text-xs font-bold transition ${
                        promo.active 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {promo.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onDuplicatePromo(promo)}
                      title="Duplicar combo"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => openEditModal(promo)}
                      title="Editar promo"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-[#235C3B] hover:bg-[#EDF6F0] transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(promo.id)}
                      title="Eliminar promo"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex gap-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200 shadow-xs">
                    <img 
                      src={imgUrl} 
                      alt={promo.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = promo.fallback || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-base text-stone-900 leading-snug font-serif">
                      {promo.name}
                    </h3>
                    <div className="text-xs font-bold text-[#9E752D] mt-0.5">
                      {promo.tagline}
                    </div>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {promo.description}
                    </p>

                    {promo.highlightText && (
                      <div className="mt-2 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 inline-block">
                        ✨ {promo.highlightText}
                      </div>
                    )}
                  </div>
                </div>

                {/* Items included in combo */}
                {promo.itemsIncluded && promo.itemsIncluded.length > 0 && (
                  <div className="px-5 pb-3">
                    <span className="text-[10px] font-extrabold uppercase text-stone-400 tracking-wider block mb-1.5">
                      Incluye en el combo:
                    </span>
                    <div className="space-y-1">
                      {promo.itemsIncluded.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-stone-700 bg-stone-50 px-2.5 py-1 rounded-xl border border-stone-200/60 font-medium">
                          <Check className="w-3 h-3 text-[#235C3B] flex-shrink-0" />
                          <span>{it}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price footer */}
              <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase block leading-none">
                    Precio Promo Especial
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-lg font-black text-[#163E27]">
                      {formatMoney(promo.price)}
                    </span>
                    {promo.originalPrice && promo.originalPrice > promo.price && (
                      <span className="text-xs text-stone-400 line-through font-semibold">
                        {formatMoney(promo.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => openEditModal(promo)}
                  className="px-4 py-2 bg-[#235C3B] hover:bg-[#163E27] text-white rounded-xl text-xs font-extrabold transition shadow-xs"
                >
                  Modificar Promo
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900">¿Eliminar esta promo?</h3>
            <p className="text-xs text-stone-600 mt-1">
              Esta acción quitará el combo del menú. Podés desactivarlo temporalmente si preferís conservarlo.
            </p>
            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeletePromo(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 my-8 overflow-hidden">
            <div className="px-6 py-4 bg-[#FCF7EB] border-b border-amber-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-amber-950 font-serif">
                  {editingPromo ? 'Modificar Promo / Combo' : 'Crear Nueva Promo'}
                </h3>
                <span className="text-[11px] text-amber-800 font-medium">
                  Añadí descuentos, productos incluidos y etiquetas llamativas
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-stone-500 hover:text-stone-800 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Nombre de la Promo / Combo *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Combo Almuerzo Familiar Domingo"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Subtítulo / Contenido corto *
                </label>
                <input
                  type="text"
                  required
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="Ej: 2 Cajas Sorrentinos + 1 Raviolones + 1 Fideos"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Precio Promocional ($ ARS) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold">$</span>
                    <input
                      type="number"
                      required
                      min={0}
                      step={100}
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Precio Regular (Tachado)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold">$</span>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Etiqueta (Badge)
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="Ej: Ahorro, Combo Familiar, Especial"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Frase destacada de ahorro
                  </label>
                  <input
                    type="text"
                    value={formHighlightText}
                    onChange={(e) => setFormHighlightText(e.target.value)}
                    placeholder="Ej: Ahorrás $3.000 comprando en combo"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Descripción de la Promo
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detalles sobre cuántas porciones rinde, sabores a elegir..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Ítems incluidos (Uno por línea)
                </label>
                <textarea
                  rows={3}
                  value={formItemsText}
                  onChange={(e) => setFormItemsText(e.target.value)}
                  placeholder="2 Cajas Sorrentinos a elección&#10;1 Caja Raviolones Espinaca&#10;1 Porción Fideos Caseros"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
                />
              </div>

              {/* Image drive id */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Google Drive ID de la Foto
                </label>
                <input
                  type="text"
                  value={formDriveId}
                  onChange={(e) => setFormDriveId(e.target.value)}
                  placeholder="Ej: 1hcvHBUgYG5yExeIe6Q4EfIiTitTshUSm"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <span className="font-bold text-stone-800 block text-xs">Promo Activa</span>
                  <span className="text-[10px] text-stone-500">
                    Si está inactiva, no se mostrará a los clientes en la web.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormActive(!formActive)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    formActive ? 'bg-[#235C3B] justify-end' : 'bg-stone-300 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-xs"></span>
                </button>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-stone-600 hover:bg-stone-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C6994E] hover:bg-[#9E752D] text-stone-950 font-black rounded-xl shadow-sm transition active:scale-95"
                >
                  {editingPromo ? 'Guardar Cambios' : 'Crear Promo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
