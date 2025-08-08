export function ProgressChart() {
  const progress = 66; // 66%
  const completedTests = 8;
  const totalTests = 12;

  return (
    <div className="bg-white p-6 rounded-xl border border-border shadow-sm text-center">
      <h3 className="font-bold text-foreground mb-4">Overall Progress</h3>
      <div className="relative w-40 h-40 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          {/* Background circle */}
          <path 
            d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" 
            fill="none" 
            stroke="#E2E8F0" 
            strokeWidth="3.5"
          />
          {/* Progress circle */}
          <path 
            d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" 
            fill="none" 
            stroke="#1E3A8A" 
            strokeWidth="3.5" 
            strokeDasharray={`${progress}, 100`} 
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(-90 18 18)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-primary">{progress}%</span>
          <span className="text-sm text-muted-foreground">Completed</span>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        You&apos;ve completed <strong>{completedTests} of {totalTests}</strong> available tests.
      </p>
    </div>
  );
}
