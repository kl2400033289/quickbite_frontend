import React from 'react';

export const RestaurantCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-warm-200 shadow-card p-4 space-y-4 animate-pulse">
      <div className="w-full h-48 bg-warm-200 rounded-2xl" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-warm-200 rounded-lg w-2/3" />
          <div className="h-6 bg-warm-200 rounded-lg w-12" />
        </div>
        <div className="h-4 bg-warm-100 rounded w-1/2" />
        <div className="flex gap-2 pt-2">
          <div className="h-5 bg-warm-100 rounded-full w-16" />
          <div className="h-5 bg-warm-100 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
};

export const DishCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-warm-200 shadow-card flex gap-4 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-warm-200 rounded w-3/4" />
        <div className="h-4 bg-warm-100 rounded w-1/4" />
        <div className="h-3 bg-warm-100 rounded w-full" />
      </div>
      <div className="w-24 h-24 bg-warm-200 rounded-xl shrink-0" />
    </div>
  );
};
