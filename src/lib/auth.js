// Authentication utilities and types

// Mock authentication functions - replace with real implementation
export const getCurrentUser = async () => {
  // In development, check localStorage for dev auth state
  if (process.env.NODE_ENV === 'development') {
    try {
      const savedUser = localStorage.getItem('dev-auth-user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (error) {
      console.error('Failed to parse dev auth user:', error);
    }
  }
  
  // This would typically check JWT token, session, etc.
  return null;
};

export const login = async () => {
  // Mock login - replace with real authentication
  throw new Error('Not implemented');
};

export const logout = async () => {
  // Mock logout - replace with real implementation
  throw new Error('Not implemented');
};

export const signup = async () => {
  // Mock signup - replace with real authentication
  throw new Error('Not implemented');
};

// Role-based access control helpers
export const hasRole = (user, allowedRoles) => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

export const isAdmin = (user) => {
  return hasRole(user, ['admin']);
};

// Ownership-based access control helpers for e-commerce model
export const hasPurchasedProduct = async (user, productId) => {
  if (!user) return false;
  
  try {
    // Import dynamically to avoid circular dependencies
    const { isProductPurchased, isProductInPurchasedBundle } = await import('@/lib/mock-api/purchases');
    
    // Check if user directly purchased the product
    const directlyPurchased = await isProductPurchased(user.id, productId);
    
    // Check if user purchased a bundle that contains this product
    const inBundle = await isProductInPurchasedBundle(user.id, productId);
    
    return directlyPurchased || inBundle;
  } catch (error) {
    console.error('Failed to check product purchase status:', error);
    return false;
  }
};

export const hasPurchasedBundle = async (user, bundleId) => {
  if (!user) return false;
  
  try {
    // Import dynamically to avoid circular dependencies
    const { isBundlePurchased } = await import('@/lib/mock-api/purchases');
    return await isBundlePurchased(user.id, bundleId);
  } catch (error) {
    console.error('Failed to check bundle purchase status:', error);
    return false;
  }
};