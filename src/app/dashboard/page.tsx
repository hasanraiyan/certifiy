'use client';

import { WelcomeSection } from '@/components/dashboard/welcome-section';
import { FeaturedExam } from '@/components/dashboard/featured-exam';
import { TestLibrary } from '@/components/dashboard/test-library';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { DomainPerformance } from '@/components/dashboard/domain-performance';
import { StudyStreak } from '@/components/dashboard/study-streak';

export default function DashboardPage() {
  return (
    <main className="container mx-auto p-6 md:p-8 bg-muted/30 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area (Left Column) */}
        <div className="lg:col-span-2 space-y-8">
          <WelcomeSection />
          <FeaturedExam />
          <TestLibrary />
        </div>

        {/* Stats & Progress Sidebar (Right Column) */}
        <div className="space-y-8">
          <ProgressChart />
          <DomainPerformance />
          <StudyStreak />
        </div>
      </div>
    </main>
  );
}