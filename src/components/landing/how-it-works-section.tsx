import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    number: 1,
    title: 'Take a Test',
    description: 'Establish your baseline with a mock exam or diagnostic test.'
  },
  {
    number: 2,
    title: 'Review Analytics',
    description: 'Instantly see your score and identify knowledge gaps.'
  },
  {
    number: 3,
    title: 'Improve & Pass',
    description: 'Use targeted quizzes to turn weaknesses into strengths.'
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Your Path to Certification in 3 Steps</h2>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {steps.map((step) => (
            <Card key={step.number} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-16 h-16 bg-muted text-primary mx-auto rounded-full text-2xl font-bold mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
