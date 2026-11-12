import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { ShoppingBag, Moon, Sun, User, MapPin, Bike, Clock } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const {
    theme,
    toggleTheme,
    cartCount,
    isCartWiggling,
    setIsCartDrawerOpen,
    selectedArea,
    orderType,
    setIsLocationModalOpen,
    user,
    setIsAuthModalOpen,
    setIsDashboardOpen,
    orders,
    setActiveTrackingOrder,
    timingStatus,
    timingSimulation,
    setTimingSimulation,
  } = useRestaurant();

  // Active tracking order if any
  const latestActiveOrder = orders.find(o => o.status !== 'delivered');

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-stone-950/95 border-b border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-100 transition-colors shadow-sm dark:shadow-md">
      
      {/* Top micro announcement bar: Real Time / Karachi Time & Timing Cutoff & Preview Tester */}
      <div className="bg-stone-100 dark:bg-[#121218] border-b border-stone-200/80 dark:border-stone-800/80 py-1 px-3 sm:px-6 text-[10px] sm:text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2 truncate">
            <span className={`inline-flex items-center gap-1 font-bold ${
              timingStatus.isOpen
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-amber-700 dark:text-amber-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                timingStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`} />
              <span>{timingStatus.isOpen ? 'OPEN NOW' : 'CLOSED NOW'}</span>
            </span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-600 dark:text-stone-400 hidden xs:inline truncate">
              Daily 11:00 AM &ndash; 2:00 AM PKT
            </span>
            <span className="text-stone-400 hidden sm:inline">·</span>
            <span className="text-stone-500 dark:text-stone-400 hidden sm:inline">
              Karachi Time: <strong className="text-stone-800 dark:text-stone-200">{timingStatus.currentPKTTime}</strong>
            </span>
          </div>

          {/* Quick Simulation Mode & WhatsApp Order Info */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
              <Clock className="w-3 h-3 text-[#c99a2c] shrink-0" />
              <span className="hidden md:inline">Time Mode:</span>
              <select
                value={timingSimulation}
                onChange={(e) => setTimingSimulation(e.target.value as any)}
                className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-1.5 py-0.5 text-[10px] text-stone-700 dark:text-stone-200 font-semibold focus:outline-none"
                title="Test Restaurant Timings (Open, Cutoff, Closed)"
              >
                <option value="live">Live PKT Time</option>
                <option value="open">Test: Open (8:00 PM)</option>
                <option value="near-closing">Test: Cutoff (1:35 AM)</option>
                <option value="closed">Test: Closed (4:00 AM)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-16 sm:h-20">
          
          {/* Zone 1: Brand Zone - 100% visible without cutting off */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a href="#" className="flex items-center gap-2 sm:gap-2.5 group">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full p-0.5 bg-stone-100 dark:bg-black/90 border border-amber-500/50 shadow-sm group-hover:border-amber-400 transition-all shrink-0">
                <img
                  src="/assets/aistudio/Deja_Vu_logo_03d51cef.png"
                  alt="Deja Vu Restaurant Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-luxury font-bold text-base sm:text-xl tracking-wider text-stone-900 dark:text-amber-200 group-hover:text-amber-600 dark:group-hover:text-amber-100 transition-colors whitespace-nowrap">
                  D&eacute;j&agrave; Vu
                </span>
                <span className="text-[10px] sm:text-[11px] tracking-widest uppercase text-[#c99a2c] dark:text-amber-400 font-extrabold -mt-0.5 sm:-mt-1 whitespace-nowrap">
                  BBQ &amp; Grill
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs xl:text-sm font-semibold text-stone-600 dark:text-stone-300">
            <a href="#menu-section" className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors whitespace-nowrap shrink-0">
              Menu
            </a>
            <a href="#steaks-section" className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors whitespace-nowrap shrink-0">
              Sizzling Steaks
            </a>
            <a href="#bbq-section" className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors whitespace-nowrap shrink-0">
              Charcoal BBQ
            </a>
            <a href="#location-section" className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors whitespace-nowrap shrink-0">
              Location &amp; Timings
            </a>
            {latestActiveOrder && (
              <button
                type="button"
                onClick={() => setActiveTrackingOrder(latestActiveOrder)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 dark:bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition-colors whitespace-nowrap shrink-0"
              >
                <Bike className="w-3.5 h-3.5 animate-bounce text-amber-500" />
                <span>Track ({latestActiveOrder.orderNumber})</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Primary Actions (Mobile Safe, No Hamburger, No Location on Mobile) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Quick Location Badge (Hidden on mobile as requested, visible on tablet & desktop) */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-850 border border-stone-200 dark:border-amber-500/30 text-stone-700 dark:text-stone-200 text-xs transition-colors max-w-[170px]"
              title="Change Delivery Location"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate text-xs font-semibold">
                {orderType === 'dine-in' ? 'Dine-In' : selectedArea.name.split(' - ')[0]}
              </span>
            </button>

            {/* In-App PWA Install Button */}
            <PWAInstallButton compact />

            {/* Dark / Light High-Contrast Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-850 border border-stone-200 dark:border-stone-800 text-amber-600 dark:text-amber-400 transition-all active:scale-95 shrink-0"
              title={theme === 'dark' ? 'Switch to Full Light Mode' : 'Switch to Full Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700" />
              )}
            </button>

            {/* Customer User Login / Profile Dashboard Button */}
            {user ? (
              <button
                type="button"
                onClick={() => setIsDashboardOpen(true)}
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 border border-stone-200 dark:border-amber-500/50 text-stone-800 dark:text-amber-200 text-xs font-semibold transition-all shrink-0"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-4 h-4 text-amber-500" />
                )}
                <span className="hidden sm:inline truncate max-w-[70px]">{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 text-xs font-medium transition-all shrink-0"
                title="Sign in with Google"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span className="hidden md:inline font-semibold">Sign In</span>
              </button>
            )}

            {/* Shopping Cart Button styled with Deja Vu Logo Gold */}
            <button
              id="navbar-cart-btn"
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className={`relative flex items-center justify-center p-2 sm:px-4 sm:py-2 rounded-xl bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] hover:brightness-110 text-stone-950 font-extrabold text-xs shadow-md transition-transform shrink-0 ${
                isCartWiggling ? 'animate-cart-wiggle scale-110' : 'active:scale-95'
              }`}
              aria-label={`View cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 sm:static sm:top-auto sm:right-auto sm:ml-1.5 flex items-center justify-center min-w-4.5 h-4.5 sm:min-w-5 sm:h-5 px-1 bg-stone-950 text-amber-300 text-[10px] sm:text-[11px] font-extrabold rounded-full shadow-sm tabular-nums border border-amber-400">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
