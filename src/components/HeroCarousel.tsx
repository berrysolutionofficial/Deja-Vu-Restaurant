import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Flame, ChevronLeft, ChevronRight, Clock, MapPin, ArrowRight } from 'lucide-react';

interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  tagline: string;
  highlight: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 'slide-entrance',
    image: '/assets/aistudio/dejavu_entrance.jpg',
    title: 'Welcome to D\u00e9j\u00e0 Vu Restaurant',
    subtitle: 'Gulistan-e-Johar, Karachi',
    tagline: 'Experience authentic charcoal grilling, sizzling cast-iron steaks, and royal handis under warm ambient elegance.',
    highlight: 'Official Main Entrance \u00b7 Johar Hill Road'
  },
  {
    id: 'slide-dining-indoor',
    image: '/assets/aistudio/Deja_Vu_Restaurant_Dining_6c7bfd87.jpg',
    title: 'Royal Indoor Dining Hall',
    subtitle: 'Fine Dining & Luxury Lounge',
    tagline: 'Step into our plush air-conditioned hall with opulent leather seating, warm golden chandeliers, and table hospitality.',
    highlight: 'Family Dining \u00b7 Executive Seating'
  },
  {
    id: 'slide-terrace-outdoor',
    image: '/assets/aistudio/Deja_Vu_Restaurant_Out_Dining_804b5850.jpg',
    title: 'Open-Air Terrace & Grill Patio',
    subtitle: 'Under the Karachi Evening Breeze',
    tagline: 'Enjoy sizzling platters and fresh naan under ambient rustic brick walls, open skies, and live barbecue aromas.',
    highlight: 'Outdoor Seating \u00b7 Charcoal BBQ'
  },
  {
    id: 'slide-garden-lounge',
    image: '/assets/aistudio/dejavu_garden_lounge.jpg',
    title: 'Lush Garden Lounge & Ambiance',
    subtitle: 'Bougainvillea Floral Canopy',
    tagline: 'Unwind amidst blooming bougainvillea trees, gentle garden night-lights, and an intimate open courtyard.',
    highlight: 'Garden Ambiance \u00b7 Midnight Dining'
  },
  {
    id: 'slide-walkway',
    image: '/assets/aistudio/dejavu_walkway_ambiance.jpg',
    title: 'Peaceful Greenery & Walkways',
    subtitle: 'A Serene Oasis in Johar',
    tagline: 'Stroll through our illuminated pathway flanked by lush tropical foliage and warm antique lanterns.',
    highlight: 'Dine-In \u00b7 Takeaway \u00b7 Fast Delivery'
  }
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setIsLocationModalOpen } = useRestaurant();

  // Automatic slide loop every 3 seconds as strictly requested by user
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((currentSlide + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <section className="relative w-full h-[540px] sm:h-[620px] lg:h-[700px] overflow-hidden bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-white select-none transition-colors duration-500">
      
      {/* Background Slides with Cross-Fade / Zoom */}
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Real Restaurant Entrance & Ambiance Image with higher clarity & 10-15% boosted opacity */}
            <img
              src={slide.image}
              alt={slide.title}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className={`w-full h-full object-cover transition-transform duration-6000 ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />

            {/* Complete Light / Dark Theme Adaptive Scrim Overlays */}
            <div className="absolute inset-0 bg-linear-to-r from-stone-50/95 via-stone-50/80 to-stone-50/35 dark:from-black/75 dark:via-black/50 dark:to-black/25 transition-colors duration-500" />
            <div className="absolute inset-0 bg-linear-to-t from-[#fcfbf7] via-transparent to-stone-100/40 dark:from-stone-950/90 dark:via-transparent dark:to-black/35 transition-colors duration-500" />
          </div>
        );
      })}

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl space-y-4 sm:space-y-6">
          
          {/* Top Kicker */}
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider uppercase text-[#a87a1c] dark:text-amber-300">
            <Flame className="w-4 h-4 text-[#c99a2c] fill-[#c99a2c]" />
            <span>{HERO_SLIDES[currentSlide].highlight}</span>
          </div>

          {/* Luxury Display Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif-luxury tracking-tight leading-tight text-stone-950 dark:text-white drop-shadow-xs text-balance">
            {HERO_SLIDES[currentSlide].title}
          </h1>

          {/* Subtitle / Description */}
          <p className="text-sm sm:text-base lg:text-lg text-stone-700 dark:text-stone-200 leading-relaxed max-w-xl font-medium">
            {HERO_SLIDES[currentSlide].tagline}
          </p>

          {/* Call-to-Action Buttons with Logo-Matching Royal Gold Color */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <a
              href="#menu-section"
              className="inline-flex items-center justify-center gap-2 py-3.5 px-6 sm:px-8 rounded-xl font-extrabold text-sm text-stone-950 bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] hover:brightness-110 shadow-xl shadow-amber-900/30 active:scale-95 transition-all"
            >
              <span>Explore Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm text-stone-900 dark:text-stone-200 bg-white/90 hover:bg-white dark:bg-stone-900/80 dark:hover:bg-stone-800 border border-stone-300 dark:border-amber-500/30 shadow-md backdrop-blur-md transition-all active:scale-95"
            >
              <MapPin className="w-4 h-4 text-[#c99a2c] dark:text-amber-400" />
              <span>Select Location</span>
            </button>
          </div>

          {/* Real Restaurant Timings updated to 11am to 2am */}
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-4 text-xs text-stone-700 dark:text-stone-300 font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#c99a2c] dark:text-amber-400" />
              <span>Timings: 11:00 AM – 2:00 AM</span>
            </div>
            <span className="text-stone-400 dark:text-stone-500">·</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c99a2c] dark:text-amber-400" />
              <span>Plot # B-54/13, Johar Hill Rd, Block&nbsp;1, Karachi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Slide Controls */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white text-stone-900 dark:bg-black/50 dark:hover:bg-black/80 border border-stone-200 dark:border-amber-500/30 dark:text-white shadow-md backdrop-blur-xs transition-colors hidden sm:flex items-center justify-center"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white text-stone-900 dark:bg-black/50 dark:hover:bg-black/80 border border-stone-200 dark:border-amber-500/30 dark:text-white shadow-md backdrop-blur-xs transition-colors hidden sm:flex items-center justify-center"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentSlide ? 'w-8 bg-[#c99a2c] dark:bg-[#e5c158]' : 'w-2 bg-stone-400/50 dark:bg-white/40 hover:bg-stone-500 dark:hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
