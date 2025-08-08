import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonitorSmartphone, MessageSquareQuote, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: MonitorSmartphone,
    title: 'Realistic Exam Simulator',
    description: 'Format, questions, and timing identical to the real PMP exam environment.',
  },
  {
    icon: MessageSquareQuote,
    title: 'Expert-Written Explanations',
    description: 'Clear, detailed rationales for every question help you master the underlying concepts.',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Track your progress by knowledge area to focus your studies where they\'re needed most.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Everything You Need to Pass</h2>
          <p className="mt-4 text-lg text-muted-foreground">A toolkit built for serious PMP candidates.</p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card key={feature.title} className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="bg-primary text-primary-foreground h-12 w-12 rounded-lg flex items-center justify-center shadow-md mb-5">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground mb-2">{feature.title}</CardTitle>
                  <p className="text-base text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
