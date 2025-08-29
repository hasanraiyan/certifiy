// New e-commerce data models for the transactional pivot

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: { amount: number; currency: 'USD' };
  description: string;
  type: 'Exam' | 'Quiz' | 'DomainQuiz';
  questionIds: string[];
  status: 'Active' | 'Draft' | 'Archived';
  isFeatured?: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bundle {
  id: string;
  name: string;
  slug: string;
  price: { amount: number; currency: 'USD' };
  description: string;
  productIds: string[];
  status: 'Active' | 'Draft' | 'Archived';
  discountPercentage?: number;
  isFeatured?: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  id: string;
  userId: string;
  productId?: string;
  bundleId?: string;
  purchaseDate: Date;
  amount: { amount: number; currency: 'USD' };
  status: 'Completed' | 'Pending' | 'Failed';
}