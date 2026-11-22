import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, ArrowRight, Clock, ShieldCheck, Home } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const PaymentResultPage: React.FC = () => {
  const [params] = useSearchParams();
  const orderId = params.get('orderId') || '1001';
  const status = (params.get('status') || 'PLACED').toUpperCase();
  const amount = Number(params.get('amount') || '499');
  const restaurantName = params.get('restaurantName') || 'QuickBite Partner';

  const isSuccess = status === 'PLACED' || status === 'ACCEPTED' || status === 'SUCCESS';

  return (
    <div className="pt-32 pb-20 min-h-screen bg-warm-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-4xl p-8 sm:p-10 border border-warm-200 shadow-2xl text-center space-y-6">
        {/* Status Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
          {isSuccess ? (
            <CheckCircle2 className="w-10 h-10" />
          ) : (
            <AlertTriangle className="w-10 h-10 text-amber-500" />
          )}
        </div>

        {/* Message */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Payment &amp; Order Orchestrated
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-editorial text-charcoal-900">
            Order #{orderId} Placed!
          </h1>
          <p className="text-sm text-charcoal-700 max-w-sm mx-auto">
            Your payment of <span className="font-bold text-charcoal-900">{formatCurrency(amount)}</span> has been confirmed. The order has been routed to{' '}
            <span className="font-bold text-charcoal-900">{restaurantName}</span>.
          </p>
        </div>

        {/* Transaction Summary Card */}
        <div className="bg-warm-50 rounded-2xl p-5 border border-warm-200/90 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center text-charcoal-700">
            <span>Order Reference</span>
            <span className="font-mono font-bold text-charcoal-900">QB-ORD-{orderId}</span>
          </div>
          <div className="flex justify-between items-center text-charcoal-700">
            <span>Payment Status</span>
            <span className="font-bold text-emerald-600">CONFIRMED (200 OK)</span>
          </div>
          <div className="flex justify-between items-center text-charcoal-700">
            <span>Estimated Kitchen Dispatch</span>
            <span className="font-semibold text-charcoal-900 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-tangerine-500" />
              25 - 30 minutes
            </span>
          </div>
          <div className="pt-2 border-t border-warm-200/80 flex justify-between items-center font-bold text-sm text-charcoal-900">
            <span>Amount Paid</span>
            <span className="text-tangerine-600 font-extrabold">{formatCurrency(amount)}</span>
          </div>
        </div>

        {/* Microservices trace note */}
        <div className="p-3 bg-warm-100/60 rounded-xl text-[11px] text-charcoal-700 text-left flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Feign client communication between <strong>order-service</strong> (8083) and <strong>payment-service</strong> (8084) succeeded.
          </span>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to={`/track/${orderId}`}
            className="flex-1 py-3.5 px-6 bg-tangerine-500 hover:bg-tangerine-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-glow-tangerine transition-all text-sm"
          >
            <span>Track Order Progress</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/"
            className="px-6 py-3.5 bg-warm-100 hover:bg-warm-200 text-charcoal-800 font-semibold rounded-2xl transition-all text-sm flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
