import React, { useState } from 'react';
import { 
  TrendingUp, 
  Percent, 
  DollarSign, 
  ArrowRight, 
  Check, 
  X, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Product, PromoItem, Category } from '../types';

interface BulkPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  promos: PromoItem[];
  categories: Category[];
  onApplyBulkPrice: (updatedProducts: Product[], updatedPromos: PromoItem[]) => void;
}

export const BulkPriceModal: React.FC<BulkPriceModalProps> = ({
  isOpen,
  onClose,
  products,
  promos,
  categories,
  onApplyBulkPrice
}) => {
  const [mode, setMode] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState<number>(10);
  const [targetCategory, setTargetCategory] = useState<string>('all');
  const [includePromos, setIncludePromos] = useState<boolean>(true);
  const [rounding, setRounding] = useState<'none' | '100' | '500'>('100');

  if (!isOpen) return null;

  const calculateNewPrice = (currentPrice: number): number => {
    let result = currentPrice;
    if (mode === 'percent') {
      result = currentPrice * (1 + value / 100);
    } else {
      result = currentPrice + value;
    }

    if (rounding === '100') {
      result = Math.round(result / 100) * 100;
    } else if (rounding === '500') {
      result = Math.round(result / 500) * 500;
    } else {
      result = Math.round(result);
    }

    return Math.max(0, result);
  };

  // Preview updated items
  const previewProducts = products.map(p => {
    const shouldUpdate = targetCategory === 'all' || p.category === targetCategory;
    if (!shouldUpdate) return p;
    return {
      ...p,
      price: calculateNewPrice(p.price)
    };
  });

  const previewPromos = promos.map(pr => {
    if (!includePromos) return pr;
    return {
      ...pr,
      price: calculateNewPrice(pr.price),
      originalPrice: pr.originalPrice ? calculateNewPrice(pr.originalPrice) : calculateNewPrice(pr.price)
    };
  });

  const handleApply = () => {
    onApplyBulkPrice(previewProducts, previewPromos);
    onClose();
  };

  const formatMoney = (n: number) => '$' + Number(n).toLocaleString('es-AR');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 my-8 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#C6994E] text-stone-950 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-amber-950 font-serif">
                Ajuste Masivo de Precios
              </h3>
              <p className="text-[11px] text-amber-800 font-medium">
                Modificá precios de pastas o combos en un solo clic por inflación o costos.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-stone-500 hover:text-stone-800 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          
          {/* Preset Buttons */}
          <div>
            <span className="font-bold text-stone-700 block mb-1.5">
              Atajos rápidos de porcentaje:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {[5, 10, 15, 20, 25].map((pct) => (
                <button
                  type="button"
                  key={pct}
                  onClick={() => {
                    setMode('percent');
                    setValue(pct);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition ${
                    mode === 'percent' && value === pct
                      ? 'bg-[#235C3B] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  +{pct}%
                </button>
              ))}
              {[-5, -10].map((pct) => (
                <button
                  type="button"
                  key={pct}
                  onClick={() => {
                    setMode('percent');
                    setValue(pct);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition ${
                    mode === 'percent' && value === pct
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                  }`}
                >
                  {pct}% (Rebaja)
                </button>
              ))}
            </div>
          </div>

          {/* Mode & Value inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Tipo de ajuste
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('percent')}
                  className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
                    mode === 'percent'
                      ? 'bg-[#235C3B] text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200'
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" />
                  <span>Porcentaje</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('fixed')}
                  className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
                    mode === 'fixed'
                      ? 'bg-[#235C3B] text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Monto Fijo</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                {mode === 'percent' ? 'Porcentaje (+ o - %)' : 'Monto a sumar (+ o - $)'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400">
                  {mode === 'percent' ? '%' : '$'}
                </span>
              </div>
            </div>
          </div>

          {/* Target category & Rounding */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Aplicar a la categoría:
              </label>
              <select
                value={targetCategory}
                onChange={(e) => setTargetCategory(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              >
                <option value="all">Todas las pastas y variedades</option>
                <option value="sorrentinos">Solo Sorrentinos</option>
                <option value="raviolones">Solo Raviolones</option>
                <option value="noquis">Solo Ñoquis Rellenos</option>
                <option value="fideos">Solo Fideos Caseros</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Redondeo de precios:
              </label>
              <select
                value={rounding}
                onChange={(e) => setRounding(e.target.value as any)}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              >
                <option value="100">Redondear a $100 más cercano (Recomendado)</option>
                <option value="500">Redondear a $500 más cercano</option>
                <option value="none">Sin redondeo exacto</option>
              </select>
            </div>
          </div>

          {/* Include Promos Checkbox */}
          <label className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
            <input
              type="checkbox"
              checked={includePromos}
              onChange={(e) => setIncludePromos(e.target.checked)}
              className="accent-[#235C3B] w-4 h-4"
            />
            <span className="font-bold text-stone-800">
              Ajustar también el precio de los Combos y Promociones
            </span>
          </label>

          {/* Live Preview Comparison Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-stone-800">
                Vista Previa del Cambio (Antes vs Después):
              </span>
              <span className="text-[10px] text-stone-500">
                {previewProducts.filter(p => targetCategory === 'all' || p.category === targetCategory).length} productos afectados
              </span>
            </div>

            <div className="border border-stone-200 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-600 font-bold sticky top-0">
                  <tr>
                    <th className="p-2.5">Producto</th>
                    <th className="p-2.5">Precio Actual</th>
                    <th className="p-2.5"></th>
                    <th className="p-2.5">Nuevo Precio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products
                    .filter(p => targetCategory === 'all' || p.category === targetCategory)
                    .map(p => {
                      const newP = calculateNewPrice(p.price);
                      const diff = newP - p.price;
                      return (
                        <tr key={p.id} className="hover:bg-stone-50">
                          <td className="p-2.5 font-medium text-stone-900 truncate max-w-[180px]">
                            {p.name}
                          </td>
                          <td className="p-2.5 text-stone-500 font-semibold">
                            {formatMoney(p.price)}
                          </td>
                          <td className="p-2.5 text-stone-300">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </td>
                          <td className="p-2.5 font-extrabold text-[#235C3B]">
                            {formatMoney(newP)}
                            {diff !== 0 && (
                              <span className={`text-[10px] ml-1.5 font-normal ${diff > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                                ({diff > 0 ? `+${formatMoney(diff)}` : formatMoney(diff)})
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-bold text-stone-600 hover:bg-stone-200 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 bg-[#235C3B] hover:bg-[#163E27] text-white rounded-xl font-extrabold shadow-sm transition active:scale-95 flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-[#C6994E]" />
            <span>Confirmar y Actualizar Precios</span>
          </button>
        </div>

      </div>
    </div>
  );
};
