import React, { useState } from 'react';
import { 
  Store, 
  Phone, 
  CreditCard, 
  Clock, 
  MapPin, 
  Bell, 
  Image as ImageIcon, 
  Save, 
  Check, 
  Instagram,
  ShieldCheck
} from 'lucide-react';
import { StoreConfig } from '../types';

interface StoreConfigManagerProps {
  config: StoreConfig;
  onSaveConfig: (newConfig: StoreConfig) => void;
}

export const StoreConfigManager: React.FC<StoreConfigManagerProps> = ({
  config,
  onSaveConfig
}) => {
  const [formData, setFormData] = useState<StoreConfig>({ ...config });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const updateField = (field: keyof StoreConfig, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateSchedule = (key: keyof StoreConfig['schedules'], value: string) => {
    setFormData(prev => ({
      ...prev,
      schedules: {
        ...prev.schedules,
        [key]: value
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Header Save Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-4 sticky top-28 z-20">
          <div>
            <h2 className="font-extrabold text-stone-900 text-base font-serif">
              Datos del Negocio & Horarios
            </h2>
            <p className="text-xs text-stone-500">
              Personalizá WhatsApp, Alias de Mercado Pago, horarios y avisos.
            </p>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#235C3B] hover:bg-[#163E27] text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-sm transition active:scale-95"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-[#C6994E]" />
                <span>¡Guardado con éxito!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#C6994E]" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>

        {/* Section 1: Business Identification */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Store className="w-5 h-5 text-[#235C3B]" />
            <h3 className="font-bold text-sm text-stone-900">Identidad del Local</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Nombre Comercial</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => updateField('storeName', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Ubicación / Barrio</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => updateField('location', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">Eslogan / Frase de Portada</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => updateField('tagline', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Payments */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Phone className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-stone-900">WhatsApp & Mercado Pago</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                WhatsApp Visible (para el cliente)
              </label>
              <input
                type="text"
                value={formData.phoneDisplay}
                onChange={(e) => updateField('phoneDisplay', e.target.value)}
                placeholder="11 5039-4202"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Número para Enlace de WhatsApp (con código de país, sin espacios)
              </label>
              <input
                type="text"
                value={formData.phoneWhatsapp}
                onChange={(e) => updateField('phoneWhatsapp', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="5491150394202"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Formato internacional argentino: 54911...
              </span>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Alias de Mercado Pago
              </label>
              <input
                type="text"
                value={formData.mpAlias}
                onChange={(e) => updateField('mpAlias', e.target.value)}
                placeholder="Yamila.Peralta95"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono font-bold text-[#163E27] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Titular de la Cuenta MP
              </label>
              <input
                type="text"
                value={formData.mpOwner}
                onChange={(e) => updateField('mpOwner', e.target.value)}
                placeholder="Yamila Peralta"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Usuario de Instagram</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => updateField('instagram', e.target.value)}
                placeholder="@pastas_yayii"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Enlace a Instagram</label>
              <input
                type="text"
                value={formData.instagramUrl}
                onChange={(e) => updateField('instagramUrl', e.target.value)}
                placeholder="https://instagram.com/pastas_yayii"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Schedules & Announcements */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Clock className="w-5 h-5 text-[#C6994E]" />
            <h3 className="font-bold text-sm text-stone-900">Horarios de Entrega & Política de Pedidos</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Lunes a Viernes</label>
              <input
                type="text"
                value={formData.schedules.weekday}
                onChange={(e) => updateSchedule('weekday', e.target.value)}
                placeholder="18:00 a 20:30 hs"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Sábados</label>
              <input
                type="text"
                value={formData.schedules.saturday}
                onChange={(e) => updateSchedule('saturday', e.target.value)}
                placeholder="14:00 a 18:00 hs"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Domingos</label>
              <input
                type="text"
                value={formData.schedules.sunday}
                onChange={(e) => updateSchedule('sunday', e.target.value)}
                placeholder="11:00 a 14:00 hs"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              />
            </div>
          </div>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Horas de Anticipación Mínima (Lead Time)
              </label>
              <input
                type="number"
                min={1}
                value={formData.leadTimeHours}
                onChange={(e) => updateField('leadTimeHours', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Cajas para considerar Pedido Grande
              </label>
              <input
                type="number"
                min={1}
                value={formData.minBigOrderBoxes}
                onChange={(e) => updateField('minBigOrderBoxes', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">
                Texto de la Cinta Superior de Anuncios
              </label>
              <input
                type="text"
                value={formData.announcementText}
                onChange={(e) => updateField('announcementText', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Brand Drive Photos */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <ImageIcon className="w-5 h-5 text-[#235C3B]" />
            <h3 className="font-bold text-sm text-stone-900">Fotos de Portada & Logo (Google Drive IDs)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Logo Drive ID</label>
              <input
                type="text"
                value={formData.logoDriveId}
                onChange={(e) => updateField('logoDriveId', e.target.value)}
                placeholder="1F2olx_wbyAkyYXfQLR5W7s9TDQmlNA7b"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Portada Drive ID</label>
              <input
                type="text"
                value={formData.coverDriveId}
                onChange={(e) => updateField('coverDriveId', e.target.value)}
                placeholder="1hcvHBUgYG5yExeIe6Q4EfIiTitTshUSm"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#235C3B]"
              />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
