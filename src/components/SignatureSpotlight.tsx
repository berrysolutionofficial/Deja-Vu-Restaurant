import React, { useRef } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { MENU_ITEMS } from '../data/menuData';
import { formatPrice } from '../utils/format';
import { Flame, Plus, Sparkles } from 'lucide-react';

export const SignatureSpotlight: React.FC = () => {
  const { addToCart } = useRestaurant();

  const steakSpecial = MENU_ITEMS.find(i => i.id === 'beef-dejavu-special') || MENU_ITEMS[0];
  const tarragonSteak = MENU_ITEMS.find(i => i.id === 'beef-tarragon-steak') || MENU_ITEMS[4];
  const bbqFamilyPlatter = MENU_ITEMS.find(i => i.id === 'bbq-family-platter') || MENU_ITEMS[26];

  const steakImgRef = useRef<HTMLImageElement>(null);
  const bbqImgRef = useRef<HTMLImageElement>(null);

  return (
    <section className="py-12 sm:py-16 bg-stone-50 dark:bg-black/40 border-t border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Spot 1: Sizzling Steaks Spotlight */}
        <div id="steaks-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 group">
            <img
              ref={steakImgRef}
              src="/assets/images/hero_sizzling_steak_1794462151749.jpg"
              alt="Deja Vu Sizzling Steaks"
              className="w-full h-[320px] sm:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-[#f0d06f] to-[#a87a1c] text-stone-950 text-xs font-extrabold mb-2 shadow-md">
                <Flame className="w-3.5 h-3.5" /> Sizzler Special
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-amber-200">
                {steakSpecial.name}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 line-clamp-2">
                {steakSpecial.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c99a2c] dark:text-amber-400">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>Smoking Cast-Iron Sizzlers</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-luxury text-stone-900 dark:text-stone-100 tracking-tight">
              Hand-Cut Beef &amp; Chicken Steaks
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Every steak is char-grilled over intense heat and served on piping hot cast-iron skillets. Choose between our French Tarragon Cream, Wild Mushroom Reduction, Spicy Mexican Salsa, or Chef Special Sundried Tomato Glaze.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between hover:border-amber-400/50 transition-all">
                <div className="flex gap-3 items-start">
                  <img
                    src="/assets/images/hero_sizzling_steak_1794462151749.jpg"
                    alt={steakSpecial.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-amber-500/20 shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">{steakSpecial.name}</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">Char-grilled with pesto &amp; veg</p>
                    <span className="block mt-1.5 font-extrabold text-[#c99a2c] dark:text-amber-300 text-sm tabular-nums">
                      {formatPrice(steakSpecial.price)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => addToCart(steakSpecial, undefined, steakImgRef.current || e.currentTarget)}
                  className="mt-3 w-full py-2.5 px-3 rounded-xl bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] hover:brightness-110 text-stone-950 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Special Steak</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between hover:border-amber-400/50 transition-all">
                <div className="flex gap-3 items-start">
                  <img
                    src="/assets/images/dish_tarragon_chicken_1794464868496.jpg"
                    alt={tarragonSteak.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-amber-500/20 shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">{tarragonSteak.name}</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">Rich creamy tarragon sauce</p>
                    <span className="block mt-1.5 font-extrabold text-[#c99a2c] dark:text-amber-300 text-sm tabular-nums">
                      {formatPrice(tarragonSteak.price)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => addToCart(tarragonSteak, undefined, steakImgRef.current || e.currentTarget)}
                  className="mt-3 w-full py-2.5 px-3 rounded-xl bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] hover:brightness-110 text-stone-950 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Tarragon Steak</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Spot 2: Charcoal BBQ Platter Spotlight */}
        <div id="bbq-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-stone-200 dark:border-stone-800/60">
          <div className="lg:col-span-6 order-2 lg:order-1 space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c99a2c] dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Traditional Charcoal Flames</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-luxury text-stone-900 dark:text-stone-100 tracking-tight">
              Authentic BBQ Platters &amp; Karahi
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Marinated in secret family spice blends and grilled over live charcoal coals. Indulge in our famous chicken malai boti, succulent beef seekh kababs, and slow-simmered Lahori red karahi with freshly baked sesame roghni naans.
            </p>

            <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-400/50 transition-all">
              <div className="flex gap-3 items-center min-w-0">
                <img
                  src="/assets/images/bbq_charcoal_platter_1794462153034.jpg"
                  alt={bbqFamilyPlatter.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-amber-500/20 shadow-xs"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">{bbqFamilyPlatter.name}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">Tikka, Malai Boti, Seekh Kabab, Bihari &amp; Naans</p>
                  <span className="font-extrabold text-[#c99a2c] dark:text-amber-300 text-sm sm:text-base tabular-nums">
                    {formatPrice(bbqFamilyPlatter.price)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => addToCart(bbqFamilyPlatter, undefined, bbqImgRef.current || e.currentTarget)}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] hover:brightness-110 text-stone-950 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Family Platter</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 group">
            <img
              ref={bbqImgRef}
              src="/assets/images/bbq_charcoal_platter_1794462153034.jpg"
              alt="Deja Vu BBQ Platter"
              className="w-full h-[320px] sm:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-[#f0d06f] to-[#a87a1c] text-stone-950 text-xs font-extrabold mb-2 shadow-md">
                <Flame className="w-3.5 h-3.5" /> Best Seller
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-amber-200">
                {bbqFamilyPlatter.name}
              </h3>
              <p className="text-xs text-stone-300 mt-1 line-clamp-1">
                Serves 4–6 persons with hot roghni naans &amp; mint raita
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
