// Mock API functions for purchases
import purchasesData from './data/purchases.json';
import { Purchase } from '@/types/ecommerce';

// Convert JSON dates back to Date objects
const mockPurchases: Purchase[] = purchasesData.map(purchase => ({
  ...purchase,
  purchaseDate: new Date(purchase.purchaseDate)
}));

export const getByUserId = async (userId: string): Promise<Purchase[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockPurchases.filter(purchase => purchase.userId === userId);
};

export const create = async (purchaseData: Omit<Purchase, 'id' | 'purchaseDate'>): Promise<Purchase> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newPurchase: Purchase = {
    id: `purchase_${Date.now()}`,
    ...purchaseData,
    purchaseDate: new Date()
  };
  
  mockPurchases.push(newPurchase);
  return newPurchase;
};

export const isProductPurchased = async (userId: string, productId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const userPurchases = await getByUserId(userId);
  return userPurchases.some(p => p.productId === productId);
};

export const isBundlePurchased = async (userId: string, bundleId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const userPurchases = await getByUserId(userId);
  return userPurchases.some(p => p.bundleId === bundleId);
};

export const isProductInPurchasedBundle = async (userId: string, productId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const userPurchases = await getByUserId(userId);
  
  // Get all purchased bundles for this user
  const purchasedBundles = userPurchases
    .filter(p => p.bundleId)
    .map(p => p.bundleId) as string[];
  
  // For each purchased bundle, check if it contains the product
  for (const bundleId of purchasedBundles) {
    const bundle = (await import('./bundles')).findBundleBySlug(bundleId);
    if (bundle && bundle.productIds.includes(productId)) {
      return true;
    }
  }
  
  return false;
};