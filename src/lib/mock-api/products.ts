// Mock API functions for products
import productsData from './data/products.json';
import { Product } from '@/types/ecommerce';

// Convert JSON dates back to Date objects
const mockProducts: Product[] = productsData.map(product => ({
  ...product,
  publishedAt: product.publishedAt ? new Date(product.publishedAt) : null,
  createdAt: new Date(product.createdAt),
  updatedAt: new Date(product.updatedAt)
}));

export const fetchAllProducts = async (): Promise<Product[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return only published products (where publishedAt is not null)
  return mockProducts.filter(product => product.publishedAt !== null);
};

export const findProductBySlug = async (slug: string): Promise<Product | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockProducts.find(product => product.slug === slug && product.publishedAt !== null);
};

// Admin functions
export const fetchAllProductsAdmin = async (): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockProducts; // Return all products including drafts
};

export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newProduct: Product = {
    id: `prod_${Date.now()}`,
    ...productData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockProducts.push(newProduct);
  return newProduct;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockProducts.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Product not found');
  
  mockProducts[index] = {
    ...mockProducts[index],
    ...updates,
    updatedAt: new Date()
  };
  
  return mockProducts[index];
};

export const deleteProduct = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockProducts.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Product not found');
  
  mockProducts.splice(index, 1);
};