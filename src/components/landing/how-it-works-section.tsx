export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Your Path to Certification in 3 Steps</h2>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-xl border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-50 text-primary mx-auto rounded-full text-2xl font-bold">1</div>
            <h3 className="mt-6 text-xl font-semibold">Take a Test</h3>
            <p className="mt-2 text-gray-600 leading-relaxed">Establish your baseline with a mock exam or diagnostic test.</p>
          </div>
          {/* Step 2 */}
          <div className="bg-white p-8 rounded-xl border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-50 text-primary mx-auto rounded-full text-2xl font-bold">2</div>
            <h3 className="mt-6 text-xl font-semibold">Review Analytics</h3>
            <p className="mt-2 text-gray-600 leading-relaxed">Instantly see your score and identify knowledge gaps.</p>
          </div>
          {/* Step 3 */}
          <div className="bg-white p-8 rounded-xl border-2 border-gray-200 shadow-sm">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-50 text-primary mx-auto rounded-full text-2xl font-bold">3</div>
            <h3 className="mt-6 text-xl font-semibold">Improve & Pass</h3>
            <p className="mt-2 text-gray-600 leading-relaxed">Use targeted quizzes to turn weaknesses into strengths.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
