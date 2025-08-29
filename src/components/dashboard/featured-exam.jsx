import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function FeaturedExam() {
  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-8 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h2 className="text-2xl font-bold">Featured: PMP Mock Exam #2</h2>
        <p className="mt-2 opacity-80 max-w-lg">
          Ready to test your knowledge? Take this full-length exam to simulate the real PMP experience.
        </p>
        <p className="mt-3 text-sm font-semibold opacity-90">180 Questions • 4 Hours</p>
      </div>
      <Button asChild className="w-full md:w-auto flex-shrink-0 bg-accent hover:bg-accent/90 text-primary font-bold py-3 px-6 rounded-lg transition-all">
        <Link href="/exam/setup">Start Full Exam</Link>
      </Button>
    </div>
  );
}