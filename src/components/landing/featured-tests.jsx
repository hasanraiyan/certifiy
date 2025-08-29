'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import * as mockApi from '@/lib/mock-api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function FeaturedTests() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const [products, bundles] = await Promise.all([
          mockApi.products.fetchAllProducts(),
          mockApi.bundles.fetchAllBundles()
        ]);

        // Get featured products and bundles
        const featuredProducts = products.filter(p => p.isFeatured);
        const featuredBundles = bundles.filter(b => b.isFeatured);

        // Combine and limit to 3 items for the homepage display
        const combined = [...featuredProducts, ...featuredBundles].slice(0, 3);
        setFeaturedItems(combined);
      } catch (error) {
        console.error('Failed to fetch featured items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  if (loading) {
    return (
      <section id="featured-tests" className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Start with Our Most Popular Tests</h2>
            <p className="mt-4 text-lg text-muted-foreground">These are the exams and quizzes our most successful students start with.</p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Helper function to determine if item is a bundle
  const isBundle = (item) => {
    return 'productIds' in item;
  };

  // Helper function to get type badge
  const getTypeBadge = (item) => {
    if (isBundle(item)) {
      return (
        <div className="flex justify-between items-center">
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
  const getItemLink = (item) => {
    if (isBundle(item)) {
      return `/bundles/${item.slug}`;
    } else {
      return `/tests/${item.slug}`;
    }
  };

  // Helper function to get button text
  const getButtonText = (item) => {
    if (isBundle(item)) {
      return 'View Bundle';
    } else {
      return 'View Details';
    }
  };

  return (
    <section id="featured-tests" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Start with Our Most Popular Tests</h2>
          <p className="mt-4 text-lg text-muted-foreground">These are the exams and quizzes our most successful students start with.</p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item) => (
            <div 
              key={item.id} 
              className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col ${
                isBundle(item) ? 'border-2 border-accent' : ''
              }`}
            >
              <div className="p-8">
                {getTypeBadge(item)}
                <h3 className="mt-4 text-2xl font-bold text-foreground">{item.name}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </div>

              <div className="mt-auto bg-muted/30 p-6 rounded-b-xl flex justify-between items-center">
                <p className="text-3xl font-extrabold text-primary">${item.price.amount}</p>
                <Button asChild className={isBundle(item) ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}>
                  <Link href={getItemLink(item)}>{getButtonText(item)}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/tests" className="text-primary font-semibold hover:underline">
            ...or see our entire test library &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}