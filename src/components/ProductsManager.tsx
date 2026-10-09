import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Image as ImageIcon, 
  Sparkles,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { Product, Category } from '../types';

interface ProductsManagerProps {
  products: Product[];
  categories: Category[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onDuplicateProduct: (product: Product) => void;
  onToggleActive: (productId: string) => void;
}

const BADGE_PRESETS = [
  'Recomendado',
  'Más Vendido',
  'Especial',
  'Clásico',
  'Favorito',
  'Artesanal',
  '100% Natural',
  'Exclusivo',
  'Nuevo Sabor'
];

const PRESET_IMAGES = [
  { label: 'Sorrentinos Espinaca', driveId: '1U1mZTG-Sv_MY-wtywQkCgfVy0cEF1zpf', fallback: 'https://images.unsplash.com/photo-1587740896339-96a76170508d?auto=format&fit=crop&w=600&q=80' },
  { label: 'Sorrentinos Tradicionales', driveId: '1HV75-UGoVvQDlZAgw74qDKaH3Z1fFi6a', fallback: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80' },
  { label: 'Raviolones Espinaca', driveId: '1FjnVxz347mvyA339FxGfwGzupIiEcftB', fallback: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80' },
  { label: 'Raviolones Tradicionales', driveId: '171lMX5xBhAOJDNi6ddIEPAceyZ-YhTQW', fallback: 'https://images.unsplash.com/photo-1587740896339-96a76170508d?auto=format&fit=crop&w=600&q=80' },
  { label: 'Ñoquis Rellenos', driveId: '10zgPhTy6kJGD0XoGokQatZcDgKD4Jpq7', fallback: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fideos al Huevo', driveId: '16mcc9-U8W192_gyfci8LFxAEKcU-xfCe', fallback: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fideos Espinaca', driveId: '1Vx3-IMTwrJc-pDVOD0hbMaxHCArTRvy6', fallback: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fideos Morrón', driveId: '19XEQdTvpxG_hkhXFg3D5oTtGePcJrx7Y', fallback: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80' }
];

export const ProductsManager: React.FC<ProductsManagerProps> = ({
  products,
  categories,
  onSaveProduct,
  onDeleteProduct,
  onDuplicateProduct,
  onToggleActive
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('sorrentinos');
  const [formTagline, setFormTagline] = useState('Caja x 16 unidades');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number>(8500);
  const [formBadge, setFormBadge] = useState('Recomendado');
  const [formDriveId, setFormDriveId] = useState('');
  const [formFallback, setFormFallback] = useState('');
  const [formActive, setFormActive] = useState(true);

  // Quick price inline editor
  const [quickPriceId, setQuickPriceId] = useState<string | null>(null);
  const [quickPriceVal, setQuickPriceVal] = useState<number>(0);

  const filteredProducts = products.filter(p => {
    // Only non-promos in this view or everything except category 'promos'
    if (p.category === 'promos') return false;
    const matchesCat = selectedCategory === 'todos' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('sorrentinos');
    setFormTagline('Caja x 16 unidades');
    setFormDescription('Elaboración 100% fresca y artesanal.');
    setFormPrice(8000);
    setFormBadge('Recomendado');
    setFormDriveId('1HV75-UGoVvQDlZAgw74qDKaH3Z1fFi6a');
    setFormFallback('https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80');
    setFormActive(true);
    setModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormTagline(prod.tagline || '');
    setFormDescription(prod.description || '');
    setFormPrice(prod.price);
    setFormBadge(prod.badge || 'Fresco');
    setFormDriveId(prod.driveId || '');
    setFormFallback(prod.fallback || '');
    setFormActive(prod.active);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const productData: Product = {
      id: editingProduct ? editingProduct.id : `${slug}-${Date.now().toString().slice(-4)}`,
      name: formName.trim(),
      category: formCategory,
      tagline: formTagline.trim(),
      description: formDescription.trim(),
      price: Number(formPrice) || 0,
      badge: formBadge.trim(),
      driveId: formDriveId.trim(),
      fallback: formFallback.trim() || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
      active: formActive
    };

    onSaveProduct(productData);
    setModalOpen(false);
  };

  const saveQuickPrice = (prod: Product) => {
    if (quickPriceVal > 0) {
      onSaveProduct({
        ...prod,
        price: quickPriceVal
      });
    }
    setQuickPriceId(null);
  };

  const formatMoney = (n: number) => '$' + Number(n).toLocaleString('es-AR');

  const getImageSrc = (driveId: string, fallback: string) => {
    if (driveId) return `https://drive.google.com/thumbnail?id=${driveId}&sz=w600`;
    return fallback || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top action toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, relleno o presentación..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#235C3B] focus:bg-white"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="flex-1 sm:flex-initial px-4 py-2 bg-[#235C3B] hover:bg-[#163E27] text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#C6994E]" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
        {categories
          .filter(c => c.id !== 'promos')
          .map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-[#235C3B] text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => {
          const isQuickEditing = quickPriceId === product.id;
          const imgUrl = getImageSrc(product.driveId, product.fallback);

          return (
            <div 
              key={product.id}
              className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                product.active ? 'border-stone-200' : 'border-dashed border-stone-300 opacity-60 bg-stone-50/50'
              }`}
            >
              <div className="p-4">
                {/* Header row: Status toggle + Category + Actions */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EDF6F0] text-[#163E27] border border-[#235C3B]/20">
                      {product.badge || 'Fresco'}
                    </span>
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                      {product.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Active toggle */}
                    <button
                      onClick={() => onToggleActive(product.id)}
                      title={product.active ? 'Desactivar (Ocultar del menú)' : 'Activar (Mostrar en el menú)'}
                      className={`p-1.5 rounded-lg text-xs font-bold transition ${
                        product.active 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                          : 'bg-stone-200 text-stone-500 hover:bg-stone-300'
                      }`}
                    >
                      {product.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={() => onDuplicateProduct(product)}
                      title="Duplicar producto"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(product)}
                      title="Editar producto completo"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-[#235C3B] hover:bg-[#EDF6F0] transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteConfirmId(product.id)}
                      title="Eliminar producto"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content: Image + Texts */}
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200 relative group">
                    <img 
                      src={imgUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = product.fallback || 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-sm text-stone-900 leading-snug line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="text-[11px] font-semibold text-[#C6994E] mt-0.5">
                      {product.tagline}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom bar with price & fast edit */}
              <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase block leading-none">
                    Precio actual
                  </span>
                  {isQuickEditing ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs font-bold text-stone-500">$</span>
                      <input
                        type="number"
                        value={quickPriceVal}
                        onChange={(e) => setQuickPriceVal(Number(e.target.value))}
                        className="w-24 px-2 py-1 text-xs font-bold border border-[#235C3B] rounded-lg bg-white focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => saveQuickPrice(product)}
                        className="p-1 bg-[#235C3B] text-white rounded-md hover:bg-[#163E27]"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setQuickPriceId(null)}
                        className="p-1 bg-stone-200 text-stone-600 rounded-md hover:bg-stone-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => {
                        setQuickPriceId(product.id);
                        setQuickPriceVal(product.price);
                      }}
                      className="cursor-pointer group/price flex items-center gap-1"
                      title="Clic para editar precio rápido"
                    >
                      <span className="text-base font-extrabold text-stone-900 group-hover/price:text-[#235C3B]">
                        {formatMoney(product.price)}
                      </span>
                      <Edit3 className="w-3 h-3 text-stone-400 opacity-0 group-hover/price:opacity-100 transition" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(product)}
                    className="px-2.5 py-1 text-xs font-bold text-[#235C3B] hover:text-[#163E27] bg-[#EDF6F0] hover:bg-[#235C3B]/15 rounded-lg transition"
                  >
                    Modificar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-6">
          <div className="w-14 h-14 mx-auto mb-3 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-stone-800 text-base">No se encontraron productos</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Probá cambiando la categoría o agregá un nuevo producto al menú.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-[#235C3B] text-white rounded-xl text-xs font-bold"
          >
            Crear Producto
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900">¿Eliminar producto?</h3>
            <p className="text-xs text-stone-600 mt-1">
              Esta acción quitará el producto del menú. También podés simplemente desactivarlo si no hay stock hoy.
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
                  onDeleteProduct(deleteConfirmId);
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

      {/* Create / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 my-8 overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#EDF6F0] border-b border-[#235C3B]/20 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-[#163E27] font-serif">
                  {editingProduct ? 'Modificar Producto' : 'Crear Nuevo Producto'}
                </h3>
                <span className="text-[11px] text-[#2D754C] font-medium">
                  Configurá los detalles, precio, foto y presentación
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-stone-500 hover:text-stone-800 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Product Name */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Sorrentinos de Calabaza y Muzzarella"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
                />
              </div>

              {/* Category & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Categoría *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
                  >
                    <option value="sorrentinos">Sorrentinos</option>
                    <option value="raviolones">Raviolones</option>
                    <option value="noquis">Ñoquis Rellenos</option>
                    <option value="fideos">Fideos Caseros</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Presentación / Porción *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTagline}
                    onChange={(e) => setFormTagline(e.target.value)}
                    placeholder="Ej: Caja x 16 unidades / Porción artesanal"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
                  />
                </div>
              </div>

              {/* Price & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Precio ($ ARS) *
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
                    Etiqueta Destacada (Badge)
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="Ej: Recomendado, Más Vendido..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
                  />
                </div>
              </div>

              {/* Badge Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-stone-400 font-bold">Atajos de etiquetas:</span>
                {BADGE_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setFormBadge(preset)}
                    className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-[#EDF6F0] hover:text-[#235C3B] text-[10px] font-semibold text-stone-600 transition"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Descripción / Relleno
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detalles de la masa, ingredientes, cocción o sugerencia de salsa..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
                />
              </div>

              {/* Image Configuration */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#235C3B]" />
                    Imagen del Producto
                  </span>
                  <span className="text-[10px] text-stone-400">Google Drive ID o URL directa</span>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="w-16 h-16 rounded-xl bg-white border border-stone-200 overflow-hidden flex-shrink-0">
                    <img 
                      src={getImageSrc(formDriveId, formFallback)}
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase block">
                        Google Drive ID de la foto
                      </label>
                      <input
                        type="text"
                        value={formDriveId}
                        onChange={(e) => setFormDriveId(e.target.value)}
                        placeholder="Ej: 1HV75-UGoVvQDlZAgw74qDKaH3Z1fFi6a"
                        className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset image picker */}
                <div>
                  <span className="text-[10px] text-stone-400 font-bold block mb-1">
                    Elegir imagen de catálogo existente:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {PRESET_IMAGES.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => {
                          setFormDriveId(preset.driveId);
                          setFormFallback(preset.fallback);
                        }}
                        className="p-1.5 text-left rounded-lg bg-white border border-stone-200 hover:border-[#235C3B] hover:bg-[#EDF6F0] transition flex items-center gap-1.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#235C3B]"></span>
                        <span className="text-[10px] font-semibold text-stone-700 truncate">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <span className="font-bold text-stone-800 block text-xs">Mostrar en el menú</span>
                  <span className="text-[10px] text-stone-500">
                    Si desactivás este producto, no aparecerá para los clientes en la web.
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

              {/* Submit Buttons */}
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
                  className="px-6 py-2.5 bg-[#235C3B] hover:bg-[#163E27] text-white rounded-xl font-extrabold shadow-sm transition active:scale-95"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
