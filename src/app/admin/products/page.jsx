'use client';

import { useState, useEffect } from 'react'; // FIX: Imported useEffect for slug generation.
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tag, Package, Star, Settings } from 'lucide-react';
import { useAdmin } from '@/context/admin-context';
import MultiSelectSheet from '@/components/admin/multi-select-sheet';

// FIX: Helper function to generate a URL-friendly slug from a string.
const generateSlug = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};


// --- COMPONENT ---
export default function ProductManagement() {
  const { products, bundles, questions, createProduct, updateProduct, createBundle, updateBundle } = useAdmin();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: { amount: 0, currency: 'USD' },
    description: '',
    type: 'Exam',
    questionIds: [],
    productIds: [],
    discountPercentage: 0,
    status: 'Draft',
    isFeatured: false,
    publishedAt: null
  });

  // Multi-select sheet states
  const [isQuestionSelectOpen, setIsQuestionSelectOpen] = useState(false);
  const [isProductSelectOpen, setIsProductSelectOpen] = useState(false);

  // FIX: Added a useEffect hook to automatically generate the slug from the name when creating a new item.
  useEffect(() => {
    if (isCreating) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(prev.name)
      }));
    }
  }, [formData.name, isCreating]);


  const openCreateProductDrawer = () => {
    setIsCreating(true);
    setIsEditingProduct(true);
    setSelectedProduct(null);
    setFormData({
      name: '', slug: '', price: { amount: 0, currency: 'USD' }, description: '',
      type: 'Exam', questionIds: [], status: 'Draft', isFeatured: false, publishedAt: null
    });
    setIsDrawerOpen(true);
  };

  const openCreateBundleDrawer = () => {
    setIsCreating(true);
    setIsEditingProduct(false);
    setSelectedBundle(null);
    setFormData({
      name: '', slug: '', price: { amount: 0, currency: 'USD' }, description: '',
      productIds: [], status: 'Draft', isFeatured: false, discountPercentage: 0, publishedAt: null
    });
    setIsDrawerOpen(true);
  };

  const openEditProductDrawer = (product) => {
    setIsCreating(false);
    setIsEditingProduct(true);
    setSelectedProduct(product);
    setFormData({ ...product });
    setIsDrawerOpen(true);
  };

  const openEditBundleDrawer = (bundle) => {
    setIsCreating(false);
    setIsEditingProduct(false);
    setSelectedBundle(bundle);
    setFormData({ ...bundle });
    setIsDrawerOpen(true);
  };

  const handleSave = async () => {
    if (isEditingProduct) {
      if (isCreating) {
        await createProduct(formData);
      } else if (selectedProduct) {
        await updateProduct(selectedProduct.id, formData);
      }
    } else {
      if (isCreating) {
        await createBundle(formData);
      } else if (selectedBundle) {
        await updateBundle(selectedBundle.id, formData);
      }
    }
    setIsDrawerOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'Exam': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Quiz': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DomainQuiz': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
            <p className="mt-1 text-muted-foreground">Manage exams, quizzes, and product bundles.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={openCreateProductDrawer} className="w-full sm:w-auto">
              <Package className="w-5 h-5 mr-2" />
              New Product
            </Button>
            <Button variant="secondary" onClick={openCreateBundleDrawer} className="w-full sm:w-auto">
              <Tag className="w-5 h-5 mr-2" />
              New Bundle
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Tag className="h-6 w-6 text-secondary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Bundles</p>
                  <p className="text-2xl font-bold">{bundles.filter(b => b.status === 'Active').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Featured Items</p>
                  <p className="text-2xl font-bold">
                    {products.filter(p => p.isFeatured).length + bundles.filter(b => b.isFeatured).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card className="p-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="p-4 font-semibold">Product</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Featured</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* FIX: Implemented an empty state message when no products are available. */}
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-muted-foreground">
                        No products found. Click 'New Product' to create one.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="border-b border-border hover:bg-muted/30">
                        <td className="p-4">
                          <div>
                            <div className="font-semibold">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.slug}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={getTypeBadge(product.type)}>
                            {product.type}
                          </Badge>
                        </td>
                        <td className="p-4 font-medium">${product.price.amount.toFixed(2)} {product.price.currency}</td>
                        <td className="p-4">
                          <Badge variant="outline" className={getStatusBadge(product.status)}>
                            {product.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Switch
                            checked={product.isFeatured}
                            onCheckedChange={(checked) =>
                              updateProduct(product.id, { ...product, isFeatured: checked })
                            }
                          />
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" onClick={() => openEditProductDrawer(product)}>
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Bundles Table */}
        <Card className="p-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="p-4 font-semibold">Bundle</th>
                    <th className="p-4 font-semibold">Products</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Featured</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* FIX: Implemented an empty state message when no bundles are available. */}
                  {bundles.length === 0 ? (
                     <tr>
                      <td colSpan={6} className="text-center p-8 text-muted-foreground">
                        No bundles found. Click 'New Bundle' to create one.
                      </td>
                    </tr>
                  ) : (
                    bundles.map((bundle) => (
                      <tr key={bundle.id} className="border-b border-border hover:bg-muted/30">
                        <td className="p-4">
                          <div>
                            <div className="font-semibold">{bundle.name}</div>
                            <div className="text-sm text-muted-foreground">{bundle.slug}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex -space-x-2">
                            {bundle.productIds.slice(0, 3).map((id, index) => (
                              <div key={index} className="w-8 h-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-bold text-primary">
                                {products.find(p => p.id === id)?.name.charAt(0) || '?'}
                              </div>
                            ))}
                            {bundle.productIds.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-bold text-muted-foreground">
                                +{bundle.productIds.length - 3}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">${bundle.price.amount.toFixed(2)} {bundle.price.currency}</div>
                          {bundle.discountPercentage > 0 && (
                            <div className="text-sm text-green-600">
                                {bundle.discountPercentage}% off
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={getStatusBadge(bundle.status)}>
                            {bundle.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Switch
                            checked={bundle.isFeatured}
                            onCheckedChange={(checked) =>
                              updateBundle(bundle.id, { ...bundle, isFeatured: checked })
                            }
                          />
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" onClick={() => openEditBundleDrawer(bundle)}>
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full max-w-2xl sm:max-w-2xl p-0 flex flex-col">
          <SheetHeader className="p-6 border-b">
            <SheetTitle>
              {isCreating
                ? (isEditingProduct ? 'Create New Product' : 'Create New Bundle')
                : (isEditingProduct ? 'Edit Product' : 'Edit Bundle')
              }
            </SheetTitle>
          </SheetHeader>

          <div className="flex-grow p-6 space-y-6 overflow-y-auto">
            <div>
              <Label htmlFor="name" className="font-semibold">Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-2"
                placeholder="e.g., Ultimate Practice Exam"
              />
            </div>

            <div>
              <Label htmlFor="slug" className="font-semibold">Slug</Label>
              <Input
                id="slug"
                value={formData.slug || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="mt-2"
                placeholder="e.g., ultimate-practice-exam"
                readOnly={isCreating} // Make it read-only when auto-generating
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="price" className="font-semibold">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  // FIX: Added step="0.01" for better UX with decimals.
                  step="0.01"
                  value={formData.price?.amount || 0}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    price: { ...prev.price, amount: parseFloat(e.target.value) || 0 }
                  }))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="currency" className="font-semibold">Currency</Label>
                <Select
                  value={formData.price?.currency || 'USD'}
                  onValueChange={(value) => setFormData(prev => ({
                    ...prev,
                    price: { ...prev.price, currency: value }
                  }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="font-semibold">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="mt-2"
                placeholder="A brief description of the product or bundle..."
              />
            </div>

            {isEditingProduct ? (
              <>
                <div>
                  <Label htmlFor="type" className="font-semibold">Type</Label>
                  <Select
                    value={formData.type || 'Exam'}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Exam">Full Exam</SelectItem>
                      <SelectItem value="Quiz">Practice Quiz</SelectItem>
                      <SelectItem value="DomainQuiz">Domain Quiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="font-semibold">Questions</Label>
                  <div className="mt-2 space-y-2">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setIsQuestionSelectOpen(true)}
                      className="w-full justify-start"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Select Questions ({formData.questionIds?.length || 0} selected)
                    </Button>
                    {formData.questionIds?.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {formData.questionIds.length} question{formData.questionIds.length !== 1 ? 's' : ''} selected
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label className="font-semibold">Products</Label>
                  <div className="mt-2 space-y-2">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setIsProductSelectOpen(true)}
                      className="w-full justify-start"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Select Products ({formData.productIds?.length || 0} selected)
                    </Button>
                    {formData.productIds?.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {formData.productIds.length} product{formData.productIds.length !== 1 ? 's' : ''} selected
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="discountPercentage" className="font-semibold">Discount Percentage</Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    value={formData.discountPercentage || 0}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      discountPercentage: parseInt(e.target.value) || 0
                    }))}
                    className="mt-2"
                    placeholder="e.g., 15"
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="status" className="font-semibold">Status</Label>
              <Select
                value={formData.status || 'Draft'}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.isFeatured || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                />
                <Label htmlFor="featured">Featured Product/Bundle</Label>
              </div>
            </div>
          </div>

          <div className="p-6 border-t bg-muted/50">
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Question Selection Sheet */}
      <MultiSelectSheet
        isOpen={isQuestionSelectOpen}
        onOpenChange={setIsQuestionSelectOpen}
        title="Select Questions"
        items={questions || []}
        selectedIds={formData.questionIds || []}
        onSave={(selectedIds) => setFormData(prev => ({ ...prev, questionIds: selectedIds }))}
        itemDisplayField="text"
        itemSearchFields={['text', 'domain']}
        itemFilterField="domain"
        itemFilterOptions={['People', 'Process', 'Business Environment']}
        renderItem={(question) => (
          <div className="flex-1">
            <div className="font-medium">{question?.text || 'Untitled Question'}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{question?.domain || 'Unknown'}</Badge>
              <Badge variant="outline">{question?.difficulty || 'Unknown'}</Badge>
            </div>
          </div>
        )}
        renderSelectedItem={(question) => (
          <div className="flex-1">
            <div className="font-medium truncate">{question?.text || 'Untitled Question'}</div>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">{question?.domain || 'Unknown'}</Badge>
            </div>
          </div>
        )}
      />

      {/* Product Selection Sheet */}
      <MultiSelectSheet
        isOpen={isProductSelectOpen}
        onOpenChange={setIsProductSelectOpen}
        title="Select Products for Bundle"
        items={products || []}
        selectedIds={formData.productIds || []}
        onSave={(selectedIds) => setFormData(prev => ({ ...prev, productIds: selectedIds }))}
        itemDisplayField="name"
        itemSearchFields={['name', 'description']}
        itemFilterField="type"
        itemFilterOptions={['Exam', 'Quiz', 'DomainQuiz']}
        renderItem={(product) => (
          <div className="flex-1">
            <div className="font-medium">{product?.name || 'Untitled Product'}</div>
            <div className="text-sm text-muted-foreground mt-1">{product?.description || ''}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{product?.type || 'Unknown'}</Badge>
              <Badge variant="outline">${product?.price?.amount || 0}</Badge>
              <Badge variant="outline">{product?.status || 'Unknown'}</Badge>
            </div>
          </div>
        )}
        renderSelectedItem={(product) => (
          <div className="flex-1">
            <div className="font-medium">{product?.name || 'Untitled Product'}</div>
            <div className="text-sm text-muted-foreground">${product?.price?.amount || 0} • {product?.type || 'Unknown'}</div>
          </div>
        )}
      />
    </>
  );
}