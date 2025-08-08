import Link from 'next/link';

export function PricingSection() {
    return (
        <section id="pricing" className="py-20 md:py-28 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
                <p className="mt-4 text-lg text-gray-600">Choose the plan that's right for you. Get started for free.</p>
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-gray-50 rounded-xl shadow-md p-8 flex flex-col hover:shadow-xl transition-shadow">
                        <h3 className="text-lg font-semibold text-primary">Free</h3>
                        <p className="mt-4 text-4xl font-extrabold text-gray-900">$0</p>
                        <p className="mt-1 text-gray-600">A perfect starting point.</p>
                        <ul className="mt-6 space-y-3 text-left text-gray-600 flex-grow">
                            <li className="flex items-center"><span className="text-green-500 mr-3">✔</span> 1 Free Sample Test</li>
                            <li className="flex items-center"><span className="text-green-500 mr-3">✔</span> Basic Answer Review</li>
                        </ul>
                        <Link href="/signup" className="mt-8 w-full block text-center border-2 border-primary text-primary font-bold py-3 px-6 rounded-lg hover:bg-primary hover:text-white transition-all">
                            Get Started
                        </Link>
                    </div>

                    {/* Full Access Plan */}
                    <div className="bg-primary text-white rounded-xl shadow-2xl p-8 flex flex-col transform lg:scale-105">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold">Full Access</h3>
                            <span className="bg-accent text-blue-900 text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</span>
                        </div>
                        <p className="mt-4 text-5xl font-extrabold">$49</p>
                        <p className="mt-1 opacity-80">One-time payment.</p>
                        <ul className="mt-6 space-y-3 text-left flex-grow">
                            <li className="flex items-center"><span className="text-accent mr-3">✔</span> <b>Everything in Free, plus:</b></li>
                            <li className="flex items-center"><span className="text-accent mr-3">✔</span> Unlimited Practice Exams</li>
                            <li className="flex items-center"><span className="text-accent mr-3">✔</span> Complete 1,000+ Question Bank</li>
                            <li className="flex items-center"><span className="text-accent mr-3">✔</span> Detailed Performance Analytics</li>
                            <li className="flex items-center"><span className="text-accent mr-3">✔</span> 90-Day Access</li>
                        </ul>
                        <Link href="/signup" className="mt-8 w-full block text-center bg-accent hover:bg-amber-600 text-blue-900 font-bold py-3 px-6 rounded-lg transition-all">
                            Choose Full Access
                        </Link>
                    </div>

                    {/* Per-Test Plan */}
                    <div className="bg-gray-50 rounded-xl shadow-md p-8 flex flex-col hover:shadow-xl transition-shadow">
                        <h3 className="text-lg font-semibold text-primary">Pay Per Test</h3>
                        <p className="mt-4 text-4xl font-extrabold text-gray-900">$15</p>
                        <p className="mt-1 text-gray-600">For a final review.</p>
                        <ul className="mt-6 space-y-3 text-left text-gray-600 flex-grow">
                            <li className="flex items-center"><span className="text-green-500 mr-3">✔</span> 1 Full-Length Exam</li>
                            <li className="flex items-center"><span className="text-green-500 mr-3">✔</span> Detailed Analytics for Test</li>
                        </ul>
                        <Link href="/signup" className="mt-8 w-full block text-center border-2 border-primary text-primary font-bold py-3 px-6 rounded-lg hover:bg-primary hover:text-white transition-all">
                            Buy One Test
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
