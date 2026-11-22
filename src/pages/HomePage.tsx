import React, { useEffect, useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { FoodDiscovery } from '../components/home/FoodDiscovery';
import { FeaturedRestaurants } from '../components/home/FeaturedRestaurants';
import { SignatureDishes } from '../components/home/SignatureDishes';
import { ScrollStory } from '../components/home/ScrollStory';
import { HowItWorks } from '../components/home/HowItWorks';
import { RestaurantPartnerCta } from '../components/home/RestaurantPartnerCta';
import { FinalCta } from '../components/home/FinalCta';
import { restaurantService } from '../services/restaurantService';
import { EnrichedRestaurant } from '../types/api';

export const HomePage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<EnrichedRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    restaurantService
      .listRestaurants()
      .then((data) => {
        if (mounted) {
          setRestaurants(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-warm-50">
      {/* SECTION B — CINEMATIC HERO */}
      <HeroSection />

      {/* SECTION C — FOOD DISCOVERY */}
      <FoodDiscovery restaurants={restaurants} isLoading={isLoading} />

      {/* SECTION D — FEATURED RESTAURANTS */}
      <FeaturedRestaurants restaurants={restaurants} />

      {/* SECTION E — SIGNATURE DISHES */}
      <SignatureDishes />

      {/* SECTION F — SCROLL STORY: CRAVING TO DELIVERY */}
      <ScrollStory />

      {/* SECTION G — HOW QUICKBITE WORKS */}
      <HowItWorks />

      {/* SECTION H — RESTAURANT PARTNER CTA */}
      <RestaurantPartnerCta />

      {/* SECTION I — FINAL CTA */}
      <FinalCta />
    </main>
  );
};
