import React from 'react';
import { ArrowRight, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FinalCta: React.FC = () => {
  return (
    <section className="py-24 bg-warm-100 relative overflow-hidden text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        <div className="w-16 h-16 rounded-3xl bg-tangerine-500 text-white mx-auto flex items-center justify-center shadow-glow-tangerine">
          <UtensilsCrossed className="w-8 h-8" />
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl sm:text-6xl font-black font-editorial text-charcoal-900 tracking-tight leading-tight">
            WHAT ARE YOU CRAVING TODAY?
          </h2>
          <p className="text-base sm:text-lg text-charcoal-700 max-w-xl mx-auto">
            From smoky woodfire grills to hand-rolled pasta, discover unforgettable dining ready to be dispatched to your table.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2.5 px-9 py-4 bg-tangerine-500 hover:bg-tangerine-600 text-white font-bold text-base rounded-2xl shadow-glow-tangerine transition-all hover:scale-105 active:scale-95"
          >
            <span>Explore Complete Menu</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
