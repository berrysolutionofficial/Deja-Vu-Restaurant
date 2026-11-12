import React, { useRef, useState, useEffect } from 'react';
import { MenuItem } from '../data/menuData';
import { useRestaurant } from '../context/RestaurantContext';
import { formatPrice } from '../utils/format';
import { Plus, Check, Flame, Sparkles, Star } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { addToCart } = useRestaurant();
  const [selectedPortion, setSelectedPortion] = useState(
    item.portionSizes ? item.portionSizes[0] : undefined
  );
  const [justAdded, setJustAdded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Smooth scroll reveal animation hook
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '40px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const currentPrice = selectedPortion ? selectedPortion.price : item.price;
  const ratingValue = item.rating || 4.9;
  const reviewsTotal = item.reviewCount || 168;

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    const sourceEl = imgRef.current || e.currentTarget;
    addToCart(item, selectedPortion, sourceEl);

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <div
      ref={cardRef}
      className={`group relative flex flex-col justify-between rounded-xl sm:rounded-2xl bg-white dark:bg-[#15151e] border border-stone-200/90 dark:border-stone-800/80 p-2.5 sm:p-4 shadow-xs hover:shadow-xl dark:hover:shadow-amber-950/20 transition-all duration-500 ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-6 scale-95'
      }`}
    >
      <div>
        {/* Full Image Representation */}
        <div className="relative w-full h-28 sm:h-48 rounded-lg sm:rounded-xl overflow-hidden mb-2 sm:mb-3 bg-stone-100 dark:bg-stone-800">
          <img
            ref={imgRef}
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/images/bbq_charcoal_platter_1794462153034.jpg';
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {item.isSpecial && (
            <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-linear-to-r from-red-600 to-amber-600 text-white text-[9px] sm:text-[11px] font-bold backdrop-blur-xs shadow-md">
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Special
            </span>
          )}

          {item.isPopular && !item.isSpecial && (
            <span className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-amber-500 text-stone-950 text-[9px] sm:text-[11px] font-extrabold backdrop-blur-xs shadow-md">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Popular
            </span>
          )}
        </div>

        {/* Title & Price with Comma Formatting */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-0.5 sm:gap-2 mb-1">
          <h3 className="font-bold text-xs sm:text-base text-stone-900 dark:text-stone-100 leading-snug group-hover:text-amber-500 transition-colors line-clamp-1 sm:line-clamp-none">
            {item.name}
          </h3>
          <div className="shrink-0">
            <span className="font-extrabold text-xs sm:text-base text-[#c99a2c] dark:text-amber-300 tabular-nums">
              {formatPrice(currentPrice)}
            </span>
          </div>
        </div>

        {/* Visual 5-Star Rating System below Menu Item */}
        <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
          <div className="flex items-center gap-0.5 text-amber-400">
            {[1, 2, 3, 4, 5].map((starIdx) => (
              <Star
                key={starIdx}
                className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400 stroke-amber-400"
              />
            ))}
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-stone-800 dark:text-stone-200 tabular-nums">
            {ratingValue.toFixed(1)}
          </span>
          <span className="text-[9px] sm:text-[11px] text-stone-400 dark:text-stone-500">
            ({reviewsTotal})
          </span>
        </div>

        {/* Description */}
        <p className="text-[10px] sm:text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-2 mb-2 sm:mb-3">
          {item.description}
        </p>

        {/* Portion Selector if available with comma prices */}
        {item.portionSizes && item.portionSizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
            {item.portionSizes.map((portion) => (
              <button
                key={portion.label}
                type="button"
                onClick={() => setSelectedPortion(portion)}
                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold transition-colors ${
                  selectedPortion?.label === portion.label
                    ? 'bg-stone-900 dark:bg-amber-500 text-amber-300 dark:text-stone-950 shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {portion.label} ({formatPrice(portion.price)})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Action Button styled with Deja Vu Logo Gold */}
      <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1 sm:gap-2">
        <span className="hidden sm:inline text-[11px] font-medium text-stone-400 dark:text-stone-500">
          Fresh to order
        </span>

        <button
          type="button"
          onClick={handleAdd}
          className={`flex items-center justify-center gap-1 sm:gap-1.5 py-1.5 sm:py-2 px-2.5 sm:px-4 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs shadow-md transition-all active:scale-95 ${
            justAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] hover:brightness-110 text-stone-950'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
