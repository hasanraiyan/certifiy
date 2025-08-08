const domainStats = [
  { name: 'People', percentage: 83 },
  { name: 'Process', percentage: 76 },
  { name: 'Business Env.', percentage: 78 }
];

export function DomainPerformance() {
  return (
    <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
      <h3 className="font-bold text-foreground mb-4">Domain Performance</h3>
      <div className="space-y-4">
        {domainStats.map((domain) => (
          <div key={domain.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">{domain.name}</span>
              <span className="font-medium">{domain.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${domain.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
