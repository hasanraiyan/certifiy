export function FeatureComparison() {
  const features = [
    {
      name: 'Practice Questions',
      free: '50',
      payPerTest: '180',
      fullAccess: '1,000+',
      fullAccessBold: true
    },
    {
      name: 'Full Mock Exams',
      free: '-',
      payPerTest: '1',
      fullAccess: 'Unlimited',
      fullAccessBold: true
    },
    {
      name: 'Detailed Explanations',
      free: '✔',
      payPerTest: '✔',
      fullAccess: '✔',
      allCheckmarks: true
    },
    {
      name: 'Performance Analytics',
      free: '-',
      payPerTest: 'For that test only',
      fullAccess: 'Advanced',
      fullAccessBold: true
    },
    {
      name: 'All Question Types',
      free: '-',
      payPerTest: '✔',
      fullAccess: '✔',
      payPerTestCheckmark: true,
      fullAccessCheckmark: true
    },
    {
      name: 'Email Support',
      free: '-',
      payPerTest: '-',
      fullAccess: 'Priority',
      fullAccessBold: true
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Compare Features</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find the right fit for your study needs.
          </p>
        </div>
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead>
              <tr>
                <th className="py-4 text-xl font-bold">Features</th>
                <th className="py-4 w-48 text-center font-semibold">Free</th>
                <th className="py-4 w-48 text-center font-semibold">Pay Per Test</th>
                <th className="py-4 w-48 text-center font-semibold text-primary">Full Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {features.map((feature, index) => (
                <tr key={feature.name} className={index % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                  <td className="px-4 py-3 font-semibold">{feature.name}</td>
                  <td className="text-center text-muted-foreground">{feature.free}</td>
                  <td className="text-center text-muted-foreground">{feature.payPerTest}</td>
                  <td className={`text-center ${feature.fullAccessBold ? 'font-bold' : ''} ${
                    feature.fullAccessCheckmark ? 'text-green-500' : ''
                  }`}>
                    {feature.fullAccess}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
