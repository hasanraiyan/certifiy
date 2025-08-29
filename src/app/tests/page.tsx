'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, Bundle } from '@/types/ecommerce';
import * as mockApi from '@/lib/mock-api';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  Package, 
  Clock, 
  Star, 
  Filter,
  Search,
  ShoppingCart
} from 'lucide-react';

export default function TestLibraryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredBundles, setFilteredBundles] = useState<Bundle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | Product['type']>('all');
  const [loading, setLoading] = useState(true);
  const { addItem, itemCount } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedProducts, fetchedBundles] = await Promise.all([
          mockApi.products.fetchAllProducts(),
          mockApi.bundles.fetchAllBundles()
        ]);
        setProducts(fetchedProducts);
        setBundles(fetchedBundles);
        setFilteredProducts(fetchedProducts);
        setFilteredBundles(fetchedBundles);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply search and filter
    let resultProducts = products;
    let resultBundles = bundles;

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      resultProducts = resultProducts.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term)
      );
      resultBundles = resultBundles.filter(b => 
        b.name.toLowerCase().includes(term) || 
        b.description.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      resultProducts = resultProducts.filter(p => p.type === filterType);
    }

    setFilteredProducts(resultProducts);
    setFilteredBundles(resultBundles);
  }, [searchTerm, filterType, products, bundles]);

  // Helper function to determine if item is a bundle
  const isBundle = (item: Product | Bundle): item is Bundle => {
    return 'productIds' in item;
  };

  // Helper function to get type badge
  const getTypeBadge = (item: Product | Bundle) => {
    if (isBundle(item)) {
      return (
        <div className="flex gap-2">
          <Badge className="bg-accent/10 text-accent hover:bg-accent/20 px-3 py-1 rounded-full">
            Bundle
          </Badge>
          {item.discountPercentage && item.discountPercentage > 0 && (
            <Badge className="bg-green-100 text-green-800 font-bold text-xs">
              SAVE {item.discountPercentage}%
            </Badge>
          )}
        </div>
      );
    } else {
      return (
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded-full">
          {item.type === 'Exam' ? 'Full Mock Exam' : item.type === 'DomainQuiz' ? 'Domain Quiz' : 'Quiz'}
        </Badge>
      );
    }
  };

  // Helper function to get link href
  const getItemLink = (item: Product | Bundle) => {
    if (isBundle(item)) {
      return `/bundles/${item.slug}`;
    } else {
      return `/tests/${item.slug}`;
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Test Library</h1>
          <p className="mt-4 text-xl opacity-90 max-w-3xl mx-auto">
            Browse our collection of PMP practice tests and exam bundles designed to help you pass on your first attempt.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-muted/30 border-b">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search tests..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant={filterType === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterType('all')}
              >
                <Filter className="w-4 h-4 mr-2" />
                All Types
              </Button>
              <Button 
                variant={filterType === 'Exam' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterType('Exam')}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Full Exams
              </Button>
              <Button 
                variant={filterType === 'Quiz' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterType('Quiz')}
              >
                <Clock className="w-4 h-4 mr-2" />
                Quizzes
              </Button>
              <Button 
                variant={filterType === 'DomainQuiz' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterType('DomainQuiz')}
              >
                <Star className="w-4 h-4 mr-2" />
                Domain Quizzes
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-64 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                    <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3 mb-6"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-8 bg-muted rounded w-1/4"></div>
                      <div className="h-10 bg-muted rounded w-1/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      {!loading && (
        <section className="py-16">
          <div className="container mx-auto px-6">
            {/* Products Section */}
            <div className="mb-16">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Individual Tests</h2>
                <span className="text-sm text-muted-foreground">
                  ({filteredProducts.length} {filteredProducts.length === 1 ? 'test' : 'tests'})
                </span>
              </div>
              
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No tests match your current filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="flex flex-col hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg">{product.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                          </div>
                          {product.isFeatured && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        
                        {getTypeBadge(product)}
                        
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="w-4 h-4" />
                          <span>{product.questionIds.length} questions</span>
                        </div>
                      </CardContent>
                      
                      <div className="p-4 bg-muted/30 rounded-b-xl border-t mt-auto">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-primary">${product.price.amount}</span>
                          <Button asChild size="sm">
                            <Link href={getItemLink(product)}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            {/* Bundles Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-5 h-5 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">Test Bundles</h2>
                <span className="text-sm text-muted-foreground">
                  ({filteredBundles.length} {filteredBundles.length === 1 ? 'bundle' : 'bundles'})
                </span>
              </div>
              
              {filteredBundles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No bundles match your current filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredBundles.map((bundle) => (
                    <Card key={bundle.id} className="flex flex-col hover:shadow-lg transition-shadow border-2 border-accent/30">
                      <CardContent className="p-6 flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg">{bundle.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{bundle.description}</p>
                          </div>
                          {bundle.isFeatured && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        
                        {getTypeBadge(bundle)}
                        
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <Package className="w-4 h-4" />
                          <span>{bundle.productIds.length} tests included</span>
                        </div>
                      </CardContent>
                      
                      <div className="p-4 bg-muted/30 rounded-b-xl border-t mt-auto">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-primary">${bundle.price.amount}</span>
                          <Button asChild size="sm" variant="secondary">
                            <Link href={getItemLink(bundle)}>View Bundle</Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}