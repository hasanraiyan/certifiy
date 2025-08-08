import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

const testItems = [
  {
    id: 1,
    title: 'Agile Practice Test',
    description: '60 Questions • 1.5 Hours • Domain Quiz',
    isPremium: false,
    href: '/exam/setup'
  },
  {
    id: 2,
    title: 'Integration Management',
    description: '50 Questions • 1 Hour • Knowledge Area',
    isPremium: false,
    href: '/exam/setup'
  },
  {
    id: 3,
    title: 'PMP Mock Exam #3 (Premium)',
    description: '180 Questions • 4 Hours • Full Exam',
    isPremium: true,
    href: '/pricing'
  }
];

export function TestLibrary() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-4">Test Library</h2>
      <div className="space-y-4">
        {testItems.map((test) => (
          <div 
            key={test.id}
            className={`bg-white p-4 rounded-xl border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              test.isPremium ? 'opacity-70' : ''
            }`}
          >
            <div>
              <h3 className="font-semibold text-foreground">{test.title}</h3>
              <p className="text-sm text-muted-foreground">{test.description}</p>
            </div>
            {test.isPremium ? (
              <Button 
                variant="outline" 
                disabled 
                className="w-full sm:w-auto flex items-center justify-center bg-gray-200 text-gray-600 font-bold py-2 px-4 rounded-lg text-sm cursor-not-allowed"
              >
                <Lock className="w-4 h-4 mr-2" />
                Unlock
              </Button>
            ) : (
              <Button asChild variant="outline" className="w-full sm:w-auto border border-border text-primary font-bold py-2 px-4 rounded-lg text-sm hover:bg-muted transition-all">
                <Link href={test.href}>Start</Link>
              </Button>
            )}
          </div>
        ))}
      </div>
      {/* 'View All' BUTTON */}
      <div className="mt-6">
        <Button asChild variant="outline" className="w-full border-2 border-border text-muted-foreground font-bold py-3 px-6 rounded-lg hover:bg-white hover:border-primary hover:text-primary transition-all">
          <Link href="/pricing">View All Tests &raquo;</Link>
        </Button>
      </div>
    </div>
  );
}
