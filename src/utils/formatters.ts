export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getOrderStatusDetails(status: string): {
  label: string;
  badgeClass: string;
  dotColor: string;
  stepIndex: number;
} {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'PLACED':
      return {
        label: 'Order Placed',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        dotColor: 'bg-amber-500',
        stepIndex: 1,
      };
    case 'ACCEPTED':
      return {
        label: 'Kitchen Confirmed',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
        dotColor: 'bg-blue-500',
        stepIndex: 2,
      };
    case 'PREPARING':
      return {
        label: 'Chef Preparing',
        badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        dotColor: 'bg-indigo-500',
        stepIndex: 2,
      };
    case 'OUT_FOR_DELIVERY':
      return {
        label: 'Valet En Route',
        badgeClass: 'bg-tangerine-100 text-tangerine-800 border-tangerine-200',
        dotColor: 'bg-tangerine-500',
        stepIndex: 3,
      };
    case 'DELIVERED':
      return {
        label: 'Delivered',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        dotColor: 'bg-emerald-500',
        stepIndex: 4,
      };
    case 'REJECTED':
      return {
        label: 'Declined by Kitchen',
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        dotColor: 'bg-rose-500',
        stepIndex: 0,
      };
    default:
      return {
        label: s || 'Processing',
        badgeClass: 'bg-warm-200 text-charcoal-800 border-warm-300',
        dotColor: 'bg-charcoal-700',
        stepIndex: 1,
      };
  }
}
