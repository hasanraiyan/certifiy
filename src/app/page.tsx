import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Master Your PMP Certification
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive practice tests and mock exams to help you pass the PMP certification 
            on your first try. Join thousands of successful project managers.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Comprehensive Question Bank</h3>
            <p className="text-gray-600">Over 2000+ practice questions covering all PMP domains</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⏱️</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Timed Mock Exams</h3>
            <p className="text-gray-600">Realistic exam simulation with detailed performance analytics</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">Track your improvement with detailed analytics and reports</p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What Our Students Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <p className="text-gray-600 mb-4 italic">
                "The practice tests were incredibly helpful. I passed my PMP on the first try!"
              </p>
              <p className="font-semibold">- Sarah Johnson, PMP</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-4 italic">
                "Excellent question quality and detailed explanations. Highly recommended!"
              </p>
              <p className="font-semibold">- Michael Chen, PMP</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of successful PMP candidates today
          </p>
          <Button asChild size="lg">
            <Link href="/signup">Create Free Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}