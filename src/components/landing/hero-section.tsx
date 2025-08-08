import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative bg-gray-50 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Column (Text Content) */}
        <div className="text-center md:text-left z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-tight">
            The Smartest Way to Prepare for Your PMP Exam
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-xl mx-auto md:mx-0">
            Go beyond memorization. Our adaptive practice exams pinpoint your weaknesses and create a focused study plan, so you pass with confidence.
          </p>
          <div className="mt-8 flex justify-center md:justify-start">
            <Link href="/signup" className="bg-accent hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg shadow-amber-500/30 transition-all duration-300 transform hover:scale-105">
              Start Your First Free Test
            </Link>
          </div>
        </div>

        {/* Right Column (Illustration) */}
        <div className="hidden md:block absolute -right-24 top-1/2 -translate-y-1/2 w-1/2 opacity-20 md:opacity-100">
          <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <path fill="#1E3A8A" d="M386.7,288.5Q350.8,327,332.3,379.8Q313.8,432.7,259.9,436.9Q206,441.2,162.4,411.6Q118.8,382,66.1,357.2Q13.5,332.3,27.6,268Q41.7,203.7,68,157.9Q94.3,112.2,139.6,90.2Q184.8,68.2,234.4,69.5Q284,70.8,328.6,95.5Q373.2,120.2,398.2,168Q423.2,215.8,404.2,252.9Q385.2,290,386.7,288.5Z" opacity="0.1"></path>
            <g transform="translate(100, 100)">
              <rect x="50" y="200" width="20" height="100" fill="#F59E0B" rx="5" />
              <rect x="90" y="150" width="20" height="150" fill="#1E3A8A" rx="5" />
              <rect x="130" y="180" width="20" height="120" fill="#F59E0B" rx="5" />
              <rect x="170" y="100" width="20" height="200" fill="#1E3A8A" rx="5" />
              <rect x="210" y="220" width="20" height="80" fill="#F59E0B" rx="5" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
