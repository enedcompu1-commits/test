import React, { useState } from 'react';
import { 
  Code2, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Database, 
  Upload, 
  Sparkles, 
  Globe, 
  Layers,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Product, PromoItem, StoreConfig } from '../types';
import { 
  generateFullWebHtml, 
  generateJsProductsSnippet, 
  generateProductsJson, 
  downloadFile 
} from '../services/codeGenerator';
import { exportCatalogBackupJSON } from '../services/storage';

interface WebSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  promos: PromoItem[];
  config: StoreConfig;
  onImportBackup: (backupData: any) => void;
}

export const WebSyncModal: React.FC<WebSyncModalProps> = ({
  isOpen,
  onClose,
  products,
  promos,
  config,
  onImportBackup
}) => {
  const [activeTab, setActiveTab] = useState<'download' | 'snippet' | 'dynamic' | 'backup'>('download');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const fullHtmlCode = generateFullWebHtml(products, promos, config);
  const snippetCode = generateJsProductsSnippet(products, promos);
  const productsJson = generateProductsJson(products, promos);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadHtml = () => {
    downloadFile('index.html', fullHtmlCode, 'text/html');
  };

  const handleDownloadJson = () => {
    downloadFile('pastas-yayi-productos.json', productsJson, 'application/json');
  };

  const handleDownloadBackup = () => {
    const backupJson = exportCatalogBackupJSON(products, promos, config);
    downloadFile(`pastas-yayi-respaldo-${new Date().toISOString().slice(0, 10)}.json`, backupJson, 'application/json');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        onImportBackup(parsed);
      } catch (err) {
        alert('El archivo seleccionado no tiene un formato JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 my-8 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#EDF6F0] border-b border-[#235C3B]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#235C3B] text-white flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5 text-[#C6994E]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#163E27] font-serif">
                Vincular con tu Página Web (Pastas Yayi)
              </h3>
              <p className="text-[11px] text-[#2D754C] font-medium">
                Sincronizá tus modificaciones de pastas, precios y combos con el código web.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-stone-500 hover:text-stone-800 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 pt-2 gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('download')}
            className={`py-2 px-3.5 rounded-t-xl transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'download'
                ? 'bg-white text-[#235C3B] border-[#235C3B] shadow-xs'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>1. Descargar HTML Listo</span>
          </button>

          <button
            onClick={() => setActiveTab('snippet')}
            className={`py-2 px-3.5 rounded-t-xl transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'snippet'
                ? 'bg-white text-[#235C3B] border-[#235C3B] shadow-xs'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Reemplazo Rápido de Código</span>
          </button>

          <button
            onClick={() => setActiveTab('dynamic')}
            className={`py-2 px-3.5 rounded-t-xl transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'dynamic'
                ? 'bg-white text-[#235C3B] border-[#235C3B] shadow-xs'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3. Carga Automática / En la Nube</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`py-2 px-3.5 rounded-t-xl transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'backup'
                ? 'bg-white text-[#235C3B] border-[#235C3B] shadow-xs'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>4. Respaldo / Copia JSON</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 text-xs max-h-[70vh] overflow-y-auto space-y-4">
          
          {/* TAB 1: DOWNLOAD COMPLETE HTML */}
          {activeTab === 'download' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-900 text-xs">
                    El método más simple: Un archivo con todo actualizado
                  </h4>
                  <p className="text-stone-600 text-[11px] mt-0.5 leading-relaxed">
                    Generamos tu archivo <code className="bg-emerald-100 text-emerald-900 px-1 py-0.5 rounded font-mono">index.html</code> completo con todos tus nuevos precios, fotos, combos, números de WhatsApp y alias de Mercado Pago integrados. Solo lo descargás y lo subís a tu hosting o lo abrís en tu navegador.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadHtml}
                  className="flex-1 py-3 px-4 bg-[#235C3B] hover:bg-[#163E27] text-white rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                >
                  <Download className="w-4 h-4 text-[#C6994E]" />
                  <span>Descargar "index.html" Actualizado</span>
                </button>

                <button
                  onClick={() => copyToClipboard(fullHtmlCode, 'fullHtml')}
                  className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
                >
                  {copiedType === 'fullHtml' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>¡Código Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Todo el Código HTML</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <h5 className="font-bold text-stone-800 text-xs flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#235C3B]" />
                  ¿Dónde puedo subir este archivo gratis para que esté online?
                </h5>
                <ul className="space-y-1.5 text-stone-600 text-[11px] list-disc list-inside">
                  <li><strong>Netlify Drop:</strong> Arrastrás el archivo a <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-[#235C3B] underline font-bold">netlify.com/drop</a> y tu menú queda online con link propio en 10 segundos.</li>
                  <li><strong>Vercel o GitHub Pages:</strong> Ideal si tenés un repositorio de GitHub.</li>
                  <li><strong>Tu hosting actual:</strong> Si ya tenés dominio propio (.com o .com.ar), reemplazá el archivo <code className="font-mono">index.html</code> en tu cPanel o FileZilla.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: SNIPPET REPLACEMENT */}
          {activeTab === 'snippet' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <h4 className="font-extrabold text-amber-950 text-xs">
                  Reemplazar solo el bloque de productos en tu archivo actual
                </h4>
                <p className="text-amber-900 text-[11px] mt-0.5 leading-relaxed">
                  Si ya tenés tu archivo HTML abierto en Visual Studio Code o el Bloc de Notas, buscá alrededor de la línea 565 donde dice:
                  <br />
                  <code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-950 font-bold">const products = [ ... ];</code>
                  <br />
                  y reemplazalo por este bloque generado con tus cambios actuales:
                </p>
              </div>

              <div className="relative">
                <button
                  onClick={() => copyToClipboard(snippetCode, 'snippet')}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-[#235C3B] text-white hover:bg-[#163E27] rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition"
                >
                  {copiedType === 'snippet' ? (
                    <>
                      <Check className="w-3 h-3 text-[#C6994E]" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar Bloque</span>
                    </>
                  )}
                </button>

                <pre className="p-4 bg-stone-900 text-emerald-300 rounded-2xl overflow-x-auto text-[11px] font-mono max-h-72 leading-relaxed">
                  {snippetCode}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: DYNAMIC AUTO FETCH */}
          {activeTab === 'dynamic' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                <h4 className="font-extrabold text-blue-950 text-xs">
                  Opción Avanzada: Carga en tiempo real por URL / JSON
                </h4>
                <p className="text-blue-900 text-[11px] mt-0.5 leading-relaxed">
                  Podés subir solo el archivo <code className="bg-blue-100 px-1 rounded font-mono">pastas.json</code> a GitHub o a tu servidor, y hacer que la web cargue los productos automáticamente cada vez que un cliente entra, sin volver a tocar el HTML.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadJson}
                  className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar productos en formato JSON</span>
                </button>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <span className="font-bold text-stone-800 text-xs block">
                  Snippet JavaScript para cargar por fetch:
                </span>
                <pre className="p-3 bg-stone-900 text-stone-200 rounded-xl overflow-x-auto text-[10px] font-mono leading-relaxed">
{`// En tu archivo HTML reemplazá la declaración estática por:
let products = [];
async function loadMenu() {
  try {
    const res = await fetch('https://tudominio.com/pastas.json');
    products = await res.json();
    renderProducts();
  } catch (err) {
    console.error('Error cargando menú:', err);
  }
}
window.addEventListener('DOMContentLoaded', loadMenu);`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200">
                <h4 className="font-extrabold text-stone-900 text-xs">
                  Copia de Seguridad Completa (Respaldo)
                </h4>
                <p className="text-stone-600 text-[11px] mt-0.5 leading-relaxed">
                  Guardá una copia completa con todos tus productos, combos, alias de Mercado Pago, horarios y avisos para tener un respaldo en tu computadora o transferirlo a otro dispositivo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-stone-900 text-xs">Exportar Respaldo</h5>
                    <p className="text-stone-500 text-[10px] mt-0.5">
                      Descarga un archivo con toda la base de datos de tu tienda.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadBackup}
                    className="py-2.5 px-4 bg-[#235C3B] hover:bg-[#163E27] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Download className="w-4 h-4 text-[#C6994E]" />
                    <span>Descargar Respaldo JSON</span>
                  </button>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-stone-900 text-xs">Restaurar Respaldo</h5>
                    <p className="text-stone-500 text-[10px] mt-0.5">
                      Carga un archivo de respaldo previo para restablecer los datos.
                    </p>
                  </div>
                  <label className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition">
                    <Upload className="w-4 h-4 text-stone-600" />
                    <span>Seleccionar Archivo JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Pastas Yayi • Todos los cambios se guardan localmente en tu navegador.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl font-bold text-xs transition"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
