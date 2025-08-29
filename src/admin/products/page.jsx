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
                  {products.map((product) => (
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
                        <Switch checked={product.isFeatured} />
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => openEditProductDrawer(product)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
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
                  {bundles.map((bundle) => (
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
                        <div className="text-sm text-muted-foreground">
                          {bundle.discountPercentage}% off
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="outline" className={getStatusBadge(bundle.status)}>
                          {bundle.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Switch checked={bundle.isFeatured} />
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" onClick={() => openEditBundleDrawer(bundle)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Editor Drawer */}
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
              />
            </div>
            
            <div>
              <Label htmlFor="slug" className="font-semibold">Slug</Label>
              <Input 
                id="slug" 
                value={formData.slug || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))} 
                className="mt-2" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="price" className="font-semibold">Price ($)</Label>
                <Input 
                  id="price" 
                  type="number" 
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
                  <Label htmlFor="questionIds" className="font-semibold">Question IDs (comma separated)</Label>
                  <Input 
                    id="questionIds" 
                    value={formData.questionIds?.join(', ') || ''} 
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      questionIds: e.target.value.split(',').map(id => id.trim()).filter(id => id) 
                    }))} 
                    className="mt-2" 
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="productIds" className="font-semibold">Product IDs (comma separated)</Label>
                  <Input 
                    id="productIds" 
                    value={formData.productIds?.join(', ') || ''} 
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      productIds: e.target.value.split(',').map(id => id.trim()).filter(id => id) 
                    }))} 
                    className="mt-2" 
                  />
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
                <Label htmlFor="featured">Featured Product</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}