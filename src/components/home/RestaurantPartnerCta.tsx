import React from 'react';
import { ChefHat, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RestaurantPartnerCta: React.FC = () => {
  return (
    <section className="py-20 bg-warm-50 border-b border-warm-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-charcoal-900 rounded-4xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-tangerine-500/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
                <ChefHat className="w-3.5 h-3.5" />
                Restaurant Operations
              </span>

              <h2 className="text-3xl sm:text-5xl font-black font-editorial tracking-tight leading-tight text-warm-50">
                Your kitchen. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-tangerine-400 to-amber-300">
                  More customers. Zero friction.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-warm-200/90 font-light max-w-lg leading-relaxed">
                Connect your kitchen directly to our high-throughput restaurant delivery network. Manage menu offerings, review live tickets, and accept or decline incoming orders in real time.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-warm-200">
                  <CheckCircle2 className="w-4 h-4 text-tangerine-400 shrink-0" />
                  <span>Real-time Order Acceptance &amp; Rejection</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-warm-200">
                  <CheckCircle2 className="w-4 h-4 text-tangerine-400 shrink-0" />
                  <span>Dynamic Menu Item Management</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-warm-200">
                  <CheckCircle2 className="w-4 h-4 text-tangerine-400 shrink-0" />
                  <span>Restaurant Partner Portal</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-warm-200">
                  <CheckCircle2 className="w-4 h-4 text-tangerine-400 shrink-0" />
                  <span>Automated Feign Client Sync</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/dashboard"
                  className="px-8 py-3.5 bg-tangerine-500 hover:bg-tangerine-600 text-white font-bold rounded-2xl shadow-glow-tangerine transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <span>Launch Partner Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-warm-400 text-center sm:text-left flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Backed by Spring Cloud Gateway</span>
                </span>
              </div>
            </div>

            {/* Right Card: Operator Preview Teaser */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="bg-charcoal-950/90 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-warm-200">Kitchen Terminal: Online</span>
                  </div>
                  <span className="text-[11px] font-mono text-warm-400">Order Service: Port 8083</span>
                </div>

                {/* Mock Incoming Order Alert Card */}
                <div className="bg-charcoal-900 border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Incoming Order #QB-9410</span>
                    <span className="text-xs font-bold text-tangerine-400">₹748.00</span>
                  </div>
                  <p className="text-[11px] text-warm-400">
                    2x Smoked Wagyu Smash Burger, 1x Truffle Fries
                  </p>
                  <div className="flex gap-2 pt-1">
                    <div className="flex-1 py-1.5 bg-emerald-600/80 text-white text-center rounded-xl text-xs font-semibold">
                      Accept
                    </div>
                    <div className="flex-1 py-1.5 bg-rose-600/80 text-white text-center rounded-xl text-xs font-semibold">
                      Decline
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-warm-400 text-center italic">
                  Live REST endpoints connected to RestaurantController
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
