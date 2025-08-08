import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function WelcomeSection() {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">Welcome back, John!</h1>
      <div className="mt-4 p-5 bg-white rounded-xl border border-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground">Pick up where you left off:</p>
          <h2 className="text-xl font-bold text-primary">Risk Management Quiz</h2>
        </div>
        <Button asChild className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-all">
          <Link href="/exam/setup">Continue Test</Link>
        </Button>
      </div>
    </div>
  );
}
