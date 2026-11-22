import React from 'react';
import { Search, CreditCard, Activity } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: Search,
    title: 'Explore & Select',
    description:
      'Browse curated restaurant menus, filter by diet or craving, and craft your bespoke culinary order.',
  },
  {
    step: '02',
    icon: CreditCard,
    title: 'Instant Checkout & Payment',
    description:
      'Seamlessly submit your order to the Order Service, orchestrating automatic payment processing in one step.',
  },
  {
    step: '03',
    icon: Activity,
    title: 'Live Order Tracking',
    description:
      'Watch your meal transition in real time from Kitchen Acceptance to Live Valet Dispatch and Delivery.',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-warm-100/70 border-b border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-tangerine-600 bg-tangerine-50 px-3 py-1 rounded-full border border-tangerine-200">
            Friction-Free Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-editorial text-charcoal-900 tracking-tight">
            How QuickBite Works
          </h2>
          <p className="text-sm sm:text-base text-charcoal-700">
            Designed for uncompromising speed, clarity, and delight at every touchpoint.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="bg-white rounded-3xl p-8 border border-warm-200 shadow-card hover:shadow-card-hover transition-all space-y-5 relative group"
              >
                {/* Step number badge */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-tangerine-50 text-tangerine-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-tangerine-500 group-hover:text-white transition-all shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-editorial text-3xl font-black text-warm-300 group-hover:text-tangerine-400 transition-colors">
                    {step.step}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-charcoal-900">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
