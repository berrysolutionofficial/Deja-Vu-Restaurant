import React, { useState, useMemo, useRef } from 'react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menuData';
import { MenuItemCard } from './MenuItemCard';
import { Search, Sparkles, UtensilsCrossed, ChevronLeft, ChevronRight } from 'lucide-react';

export const MenuSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('steaks');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Filter items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesCategory = item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleCategoryClick = (catId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    setActiveCategory(catId);
    event.currentTarget.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      tabsContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section id="menu-section" className="pt-6 sm:pt-10 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#c99a2c] dark:text-amber-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Master Crafted Culinary Selection</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif-luxury text-stone-900 dark:text-stone-100 tracking-tight">
            Our Complete Restaurant Menu
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
            From smoking charcoal grills to prime cast-iron sizzlers, explore over 80 authentic specialties prepared fresh for dine-in and fast doorstep delivery.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search steaks, karahi, biryani, burgers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 font-semibold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Interactive Segmented Category Filter Tabs with Left/Right arrows & Smooth Scroll */}
      <div className="relative mb-8 group">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scrollTabs('left')}
          aria-label="Scroll categories left"
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-md flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-amber-500 hover:text-stone-950 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Categories Strip */}
        <div
          ref={tabsContainerRef}
          className="flex items-center gap-2.5 overflow-x-auto px-4 py-2 scrollbar-none scroll-smooth"
        >
          {MENU_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={(e) => handleCategoryClick(cat.id, e)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 shrink-0 transform select-none ${
                  isActive
                    ? 'scale-105 bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] text-stone-950 shadow-lg shadow-amber-900/30 ring-2 ring-amber-400/50'
                    : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700/80 hover:text-stone-900 dark:hover:text-white hover:scale-102 active:scale-95'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scrollTabs('right')}
          aria-label="Scroll categories right"
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-md flex items-center justify-center text-stone-700 dark:text-stone-200 hover:bg-amber-500 hover:text-stone-950 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Menu Items Grid with Smooth Scroll Animations */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40 p-8">
          <UtensilsCrossed className="w-10 h-10 mx-auto text-stone-400 mb-3" />
          <p className="text-base font-semibold text-stone-700 dark:text-stone-300">
            No dishes match "{searchQuery}"
          </p>
          <p className="text-xs text-stone-400 mt-1">
            Try checking spelling or choose another category above
          </p>
          <button
            onClick={() => { setActiveCategory('steaks'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 rounded-lg bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] text-stone-950 text-xs font-bold shadow-md"
          >
            Show Sizzling Steaks
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
};
