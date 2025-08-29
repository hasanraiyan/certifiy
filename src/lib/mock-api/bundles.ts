// Mock API functions for bundles
import bundlesData from './data/bundles.json';
import { Bundle } from '@/types/ecommerce';

// Convert JSON dates back to Date objects
const mockBundles: Bundle[] = bundlesData.map(bundle => ({
  ...bundle,
  publishedAt: bundle.publishedAt ? new Date(bundle.publishedAt) : null,
  createdAt: new Date(bundle.createdAt),
  updatedAt: new Date(bundle.updatedAt)
}));

export const fetchAllBundles = async (): Promise<Bundle[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return only published bundles (where publishedAt is not null)
  return mockBundles.filter(bundle => bundle.publishedAt !== null);
};

export const findBundleBySlug = async (slug: string): Promise<Bundle | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockBundles.find(bundle => bundle.slug === slug && bundle.publishedAt !== null);
};

// Admin functions
export const fetchAllBundlesAdmin = async (): Promise<Bundle[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockBundles; // Return all bundles including drafts
};

export const createBundle = async (bundleData: Omit<Bundle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bundle> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newBundle: Bundle = {
    id: `bundle_${Date.now()}`,
    ...bundleData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockBundles.push(newBundle);
  return newBundle;
};

export const updateBundle = async (id: string, updates: Partial<Bundle>): Promise<Bundle> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockBundles.findIndex(b => b.id === id);
  if (index === -1) throw new Error('Bundle not found');
  
  mockBundles[index] = {
    ...mockBundles[index],
    ...updates,
    updatedAt: new Date()
  };
  
  return mockBundles[index];
};

export const deleteBundle = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockBundles.findIndex(b => b.id === id);
  if (index === -1) throw new Error('Bundle not found');
  
  mockBundles.splice(index, 1);
};