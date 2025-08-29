// Mock API functions for products
import productsData from './data/products.json';

// Convert JSON dates back to Date objects
const mockProducts = productsData.map(product => ({
  ...product,
  publishedAt: product.publishedAt ? new Date(product.publishedAt) : null,
  createdAt: new Date(product.createdAt),
  updatedAt: new Date(product.updatedAt)
}));

export const fetchAllProducts = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return only published products (where publishedAt is not null)
  return mockProducts.filter(product => product.publishedAt !== null);
};

export const findProductBySlug = async (slug) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockProducts.find(product => product.slug === slug && product.publishedAt !== null);
};

// Admin functions
export const fetchAllProductsAdmin = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockProducts; // Return all products including drafts
};

export const createProduct = async (productData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newProduct = {
    id: `prod_${Date.now()}`,
    ...productData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockProducts.push(newProduct);
  return newProduct;
};

export const updateProduct = async (id, updates) => {
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

export const deleteProduct = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockProducts.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Product not found');
  
  mockProducts.splice(index, 1);
};