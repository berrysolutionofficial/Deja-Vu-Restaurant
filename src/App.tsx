import React from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { SignatureSpotlight } from './components/SignatureSpotlight';
import { MenuSection } from './components/MenuSection';
import { RestaurantInfoSection } from './components/RestaurantInfoSection';
import { Footer } from './components/Footer';
import { FlyingCartAnimation } from './components/FlyingCartAnimation';
import { LocationModal } from './components/LocationModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { CustomerDashboardModal } from './components/CustomerDashboardModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

const RestaurantApp: React.FC = () => {
  const { flyingItems } = useRestaurant();

  return (
    <div className="min-h-screen bg-[#fcf9f5] dark:bg-[#0d0d11] text-stone-900 dark:text-stone-100 transition-colors duration-300">
      
      {/* Top Sticky Navigation */}
      <Navbar />

      {/* Hero Carousel with 3-second continuous loop */}
      <HeroCarousel />

      {/* Complete Authentic Restaurant Menu (Search Bar, Category Buttons & 2-Col Mobile Menu) */}
      <MenuSection />

      {/* Signature Steaks & Charcoal BBQ Spotlight */}
      <SignatureSpotlight />

      {/* Restaurant Location, Timings, Google Map Embed & Distance Calculation */}
      <RestaurantInfoSection />

      {/* Footer */}
      <Footer />

      {/* Flying Add-to-Cart Animation */}
      <FlyingCartAnimation flyingItems={flyingItems} />

      {/* Floating WhatsApp Button on the Bottom LEFT */}
      <FloatingWhatsApp />

      {/* Modals & Slide-overs */}
      <LocationModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <CustomerAuthModal />
      <CustomerDashboardModal />
    </div>
  );
};

export default function App() {
  return (
    <RestaurantProvider>
      <RestaurantApp />
    </RestaurantProvider>
  );
}
