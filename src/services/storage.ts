import { Product, PromoItem, Category, StoreConfig } from '../types';
import { INITIAL_PRODUCTS, INITIAL_PROMOS, INITIAL_CATEGORIES, INITIAL_STORE_CONFIG } from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'pastas_yayi_products_v1',
  PROMOS: 'pastas_yayi_promos_v1',
  CATEGORIES: 'pastas_yayi_categories_v1',
  STORE_CONFIG: 'pastas_yayi_config_v1'
};

export const getStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Error reading stored products:', err);
  }
  return INITIAL_PRODUCTS;
};

export const saveStoredProducts = (products: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (err) {
    console.error('Error saving products:', err);
  }
};

export const getStoredPromos = (): PromoItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROMOS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Error reading stored promos:', err);
  }
  return INITIAL_PROMOS;
};

export const saveStoredPromos = (promos: PromoItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROMOS, JSON.stringify(promos));
  } catch (err) {
    console.error('Error saving promos:', err);
  }
};

export const getStoredCategories = (): Category[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Error reading stored categories:', err);
  }
  return INITIAL_CATEGORIES;
};

export const saveStoredCategories = (categories: Category[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (err) {
    console.error('Error saving categories:', err);
  }
};

export const getStoredStoreConfig = (): StoreConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STORE_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.storeName) return parsed;
    }
  } catch (err) {
    console.error('Error reading stored config:', err);
  }
  return INITIAL_STORE_CONFIG;
};

export const saveStoredStoreConfig = (config: StoreConfig) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STORE_CONFIG, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving config:', err);
  }
};

export const resetAllToDefault = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.PROMOS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.STORE_CONFIG);
  } catch (err) {
    console.error('Error resetting store:', err);
  }
};

export const exportCatalogBackupJSON = (products: Product[], promos: PromoItem[], config: StoreConfig) => {
  const backup = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    config,
    products,
    promos
  };
  return JSON.stringify(backup, null, 2);
};
