'use client';

import { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Tag, Package, Calendar, Star } from 'lucide-react';
import { Product, Bundle } from '@/types/ecommerce';
import * as mockApi from '@/lib/mock-api';

// --- COMPONENT ---
export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(true); // true for product, false for bundle
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    slug: '',
    price: { amount: 0, currency: 'USD' },
    description: '',
    type: 'Exam',
    questionIds: [],
    status: 'Draft',
    publishedAt: null
  });
  const [newBundle, setNewBundle] = useState<Partial<Bundle>>({
    name: '',
    slug: '',
    price: { amount: 0, currency: 'USD' },
    description: '',
    productIds: [],
    status: 'Draft',
    discountPercentage: 0,
    publishedAt: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedProducts, fetchedBundles] = await Promise.all([
          mockApi.products.fetchAllProductsAdmin(),
          mockApi.bundles.fetchAllBundlesAdmin()
        ]);
        setProducts(fetchedProducts);
        setBundles(fetchedBundles);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openCreateProductDrawer = () => {
    setIsCreating(true);
    setIsEditingProduct(true);
    setSelectedProduct(null);
    setNewProduct({
      name: '',
      slug: '',
      price: { amount: 0, currency: 'USD' },
      description: '',
      type: 'Exam',
      questionIds: [],
      status: 'Draft',
      publishedAt: null
    });
    setIsDrawerOpen(true);
  };

  const openCreateBundleDrawer = () => {
    setIsCreating(true);
    setIsEditingProduct(false);
    setSelectedBundle(null);
    setNewBundle({
      name: '',
      slug: '',
      price: { amount: 0, currency: 'USD' },
      description: '',
      productIds: [],
      status: 'Draft',
      discountPercentage: 0,
      publishedAt: null
    });
    setIsDrawerOpen(true);
  };

  const openEditProductDrawer = (product: Product) => {
    setIsCreating(false);
    setIsEditingProduct(true);
    setSelectedProduct(product);
    setNewProduct(product);
    setIsDrawerOpen(true);
  };

  const openEditBundleDrawer = (bundle: Bundle) => {
    setIsCreating(false);
    setIsEditingProduct(false);
    setSelectedBundle(bundle);
    setNewBundle(bundle);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const getStatusBadgeVariant = (status: Product['status'] | Bundle['status']) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Draft': return 'secondary';
      case 'Archived': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleSave = async () => {
    try {
      if (isEditingProduct) {
        if (isCreating) {
          const createdProduct = await mockApi.products.createProduct(newProduct as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
          setProducts([...products, createdProduct]);
        } else if (selectedProduct) {
          const updatedProduct = await mockApi.products.updateProduct(selectedProduct.id, newProduct);
          setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        }
      } else {
        if (isCreating) {
          const createdBundle = await mockApi.bundles.createBundle(newBundle as Omit<Bundle, 'id' | 'createdAt' | 'updatedAt'>);
          setBundles([...bundles, createdBundle]);
        } else if (selectedBundle) {
          const updatedBundle = await mockApi.bundles.updateBundle(selectedBundle.id, newBundle);
          setBundles(bundles.map(b => b.id === updatedBundle.id ? updatedBundle : b));
        }
      }
      closeDrawer();
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const totalProducts = products.filter(p => p.status === 'Active').length;
  const totalBundles = bundles.filter(b => b.status === 'Active').length;
  const featuredProducts = products.filter(p => p.isFeatured).length;
  const featuredBundles = bundles.filter(b => b.isFeatured).length;

  if (loading) {
    return (
      <AuthGuard allowedRoles={['admin', 'super_admin']}>
        <div className="flex items-center justify-center min-h-screen">
          <div>Loading...</div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard allowedRoles={['admin', 'super_admin']}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
          <p className="mt-1 text-muted-foreground">Manage products and bundles for sale.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreateProductDrawer} className="w-full sm:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Create Product
          </Button>
          <Button onClick={openCreateBundleDrawer} variant="secondary" className="w-full sm:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Create Bundle
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground">Total Products</h3>
            <p className="mt-2 text-3xl font-bold">{totalProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground">Total Bundles</h3>
            <p className="mt-2 text-3xl font-bold">{totalBundles}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground">Featured Products</h3>
            <p className="mt-2 text-3xl font-bold">{featuredProducts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground">Featured Bundles</h3>
            <p className="mt-2 text-3xl font-bold">{featuredBundles}</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-2xl font-bold text-foreground">Products</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-0">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col relative m-0 p-0">
              {product.isFeatured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-yellow-500 text-yellow-900 font-semibold px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
              <CardContent className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(product.status)} className="text-xs">
                    {product.status}
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      ${product.price.amount}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {product.price.currency}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="capitalize">{product.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{product.questionIds.length} questions</span>
                  </div>
                  {product.publishedAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Published: {new Date(product.publishedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>

              <div className="p-4 bg-muted/30 rounded-b-xl border-t mt-auto">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openEditProductDrawer(product)}
                >
                  Edit Product
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bundles Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-2xl font-bold text-foreground">Bundles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-0">
          {bundles.map((bundle) => (
            <Card key={bundle.id} className="flex flex-col relative m-0 p-0">
              {bundle.isFeatured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-yellow-500 text-yellow-900 font-semibold px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
              <CardContent className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{bundle.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{bundle.description}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(bundle.status)} className="text-xs">
                    {bundle.status}
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      ${bundle.price.amount}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {bundle.price.currency}
                    </span>
                  </div>
                  {bundle.discountPercentage && bundle.discountPercentage > 0 && (
                    <div className="text-sm text-green-600 font-medium">
                      {bundle.discountPercentage}% discount
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span>{bundle.productIds.length} products included</span>
                  </div>
                  {bundle.publishedAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Published: {new Date(bundle.publishedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>

              <div className="p-4 bg-muted/30 rounded-b-xl border-t mt-auto">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openEditBundleDrawer(bundle)}
                >
                  Edit Bundle
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Product/Bundle Editor Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full max-w-lg p-0 flex flex-col">
          <SheetHeader className="p-6 border-b flex-shrink-0 flex flex-row justify-between items-center">
            <SheetTitle className="text-2xl font-bold">
              {isCreating 
                ? `Create New ${isEditingProduct ? 'Product' : 'Bundle'}` 
                : `Edit ${isEditingProduct ? 'Product' : 'Bundle'}`}
            </SheetTitle>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={closeDrawer}>Cancel</Button>
              <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
                {isCreating ? 'Create' : 'Save Changes'}
              </Button>
            </div>
          </SheetHeader>

          <div className="flex-grow p-8 space-y-6 overflow-y-auto">
            {/* Basic Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="font-medium text-sm">Name</Label>
                <Input
                  id="name"
                  placeholder={`e.g., ${isEditingProduct ? 'PMP Mock Exam #1' : 'Exam Readiness Pack'}`}
                  value={isEditingProduct ? newProduct.name || '' : newBundle.name || ''}
                  onChange={(e) => {
                    if (isEditingProduct) {
                      setNewProduct(prev => ({ ...prev, name: e.target.value }));
                    } else {
                      setNewBundle(prev => ({ ...prev, name: e.target.value }));
                    }
                  }}
                  className="w-full mt-1"
                />
              </div>

              <div>
                <Label htmlFor="slug" className="font-medium text-sm">Slug</Label>
                <Input
                  id="slug"
                  placeholder={`e.g., ${isEditingProduct ? 'pmp-mock-exam-1' : 'exam-readiness'}`}
                  value={isEditingProduct ? newProduct.slug || '' : newBundle.slug || ''}
                  onChange={(e) => {
                    if (isEditingProduct) {
                      setNewProduct(prev => ({ ...prev, slug: e.target.value }));
                    } else {
                      setNewBundle(prev => ({ ...prev, slug: e.target.value }));
                    }
                  }}
                  className="w-full mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="font-medium text-sm">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description..."
                  value={isEditingProduct ? newProduct.description || '' : newBundle.description || ''}
                  onChange={(e) => {
                    if (isEditingProduct) {
                      setNewProduct(prev => ({ ...prev, description: e.target.value }));
                    } else {
                      setNewBundle(prev => ({ ...prev, description: e.target.value }));
                    }
                  }}
                  className="w-full mt-1"
                  rows={3}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Pricing</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="font-medium text-sm">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={isEditingProduct ? newProduct.price?.amount || 0 : newBundle.price?.amount || 0}
                    onChange={(e) => {
                      const amount = parseFloat(e.target.value) || 0;
                      if (isEditingProduct) {
                        setNewProduct(prev => ({ 
                          ...prev, 
                          price: { amount, currency: 'USD' } 
                        }));
                      } else {
                        setNewBundle(prev => ({ 
                          ...prev, 
                          price: { amount, currency: 'USD' } 
                        }));
                      }
                    }}
                    className="w-full mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currency" className="font-medium text-sm">Currency</Label>
                  <Select
                    value={isEditingProduct ? newProduct.price?.currency || 'USD' : newBundle.price?.currency || 'USD'}
                    onValueChange={(value: 'USD') => {
                      if (isEditingProduct) {
                        setNewProduct(prev => ({ 
                          ...prev, 
                          price: { 
                            amount: prev.price?.amount || 0, 
                            currency: value 
                          } 
                        }));
                      } else {
                        setNewBundle(prev => ({ 
                          ...prev, 
                          price: { 
                            amount: prev.price?.amount || 0, 
                            currency: value 
                          } 
                        }));
                      }
                    }}
                  >
                    <SelectTrigger id="currency" className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {!isEditingProduct && (
                <div>
                  <Label htmlFor="discount" className="font-medium text-sm">Discount Percentage</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={newBundle.discountPercentage || 0}
                    onChange={(e) => setNewBundle(prev => ({ 
                      ...prev, 
                      discountPercentage: parseFloat(e.target.value) || 0 
                    }))}
                    className="w-full mt-1"
                  />
                </div>
              )}
            </div>

            {/* Product-specific fields */}
            {isEditingProduct && (
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Product Details</h4>
                
                <div>
                  <Label htmlFor="type" className="font-medium text-sm">Type</Label>
                  <Select
                    value={newProduct.type || 'Exam'}
                    onValueChange={(value: 'Exam' | 'Quiz' | 'DomainQuiz') => 
                      setNewProduct(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger id="type" className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Exam">Full Exam</SelectItem>
                      <SelectItem value="Quiz">Quiz</SelectItem>
                      <SelectItem value="DomainQuiz">Domain Quiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="questionIds" className="font-medium text-sm">Question IDs (comma separated)</Label>
                  <Input
                    id="questionIds"
                    placeholder="e.g., q1,q2,q3"
                    value={newProduct.questionIds?.join(',') || ''}
                    onChange={(e) => setNewProduct(prev => ({ 
                      ...prev, 
                      questionIds: e.target.value.split(',').filter(id => id.trim() !== '') 
                    }))}
                    className="w-full mt-1"
                  />
                </div>
              </div>
            )}

            {/* Bundle-specific fields */}
            {!isEditingProduct && (
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Bundle Details</h4>
                
                <div>
                  <Label htmlFor="productIds" className="font-medium text-sm">Product IDs (comma separated)</Label>
                  <Input
                    id="productIds"
                    placeholder="e.g., prod_1,prod_2,prod_3"
                    value={newBundle.productIds?.join(',') || ''}
                    onChange={(e) => setNewBundle(prev => ({ 
                      ...prev, 
                      productIds: e.target.value.split(',').filter(id => id.trim() !== '') 
                    }))}
                    className="w-full mt-1"
                  />
                </div>
              </div>
            )}

            {/* Settings */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Settings</h4>

              <div>
                <Label htmlFor="status" className="font-medium text-sm">Status</Label>
                <Select
                  value={isEditingProduct ? newProduct.status || 'Draft' : newBundle.status || 'Draft'}
                  onValueChange={(value: 'Active' | 'Draft' | 'Archived') => {
                    if (isEditingProduct) {
                      setNewProduct(prev => ({ ...prev, status: value }));
                    } else {
                      setNewBundle(prev => ({ ...prev, status: value }));
                    }
                  }}
                >
                  <SelectTrigger id="status" className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={isEditingProduct ? newProduct.isFeatured || false : newBundle.isFeatured || false}
                  onCheckedChange={(checked) => {
                    if (isEditingProduct) {
                      setNewProduct(prev => ({ ...prev, isFeatured: checked }));
                    } else {
                      setNewBundle(prev => ({ ...prev, isFeatured: checked }));
                    }
                  }}
                />
                <Label htmlFor="featured" className="text-sm">Mark as &quot;Featured&quot;</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={isEditingProduct 
                    ? newProduct.publishedAt !== null 
                    : newBundle.publishedAt !== null}
                  onCheckedChange={(checked) => {
                    if (isEditingProduct) {
                      setNewProduct(prev => ({ 
                        ...prev, 
                        publishedAt: checked ? new Date() : null 
                      }));
                    } else {
                      setNewBundle(prev => ({ 
                        ...prev, 
                        publishedAt: checked ? new Date() : null 
                      }));
                    }
                  }}
                />
                <Label htmlFor="published" className="text-sm">Published</Label>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </AuthGuard>
  );
}