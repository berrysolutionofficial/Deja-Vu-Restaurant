import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { X, ShieldCheck, Loader2, AlertCircle, Award, History, RotateCcw, Star } from 'lucide-react';

export const CustomerAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginWithGoogle,
    isAuthLoading,
    authError,
  } = useRestaurant();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-stone-900 dark:text-stone-100">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          disabled={isAuthLoading}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand & Heading */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full p-1 border border-amber-500/40 bg-black mx-auto mb-3 shadow-lg">
            <img
              src="/assets/aistudio/Deja_Vu_logo_03d51cef.png"
              alt="Deja Vu Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury tracking-tight text-stone-900 dark:text-amber-100">
            Welcome to D&eacute;j&agrave; Vu
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
            Sign in with your Google account to unlock your Customer Dashboard, Loyalty Wallet, and Order History.
          </p>
        </div>

        {/* Member Benefits Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-6 text-left">
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
            <Award className="w-4 h-4 text-[#c99a2c] dark:text-amber-400 mb-1" />
            <p className="text-[11px] font-bold text-stone-900 dark:text-stone-100">Loyalty Points</p>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">Earn on every order &amp; redeem for discounts</p>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
            <History className="w-4 h-4 text-[#c99a2c] dark:text-amber-400 mb-1" />
            <p className="text-[11px] font-bold text-stone-900 dark:text-stone-100">Full Order History</p>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">Access past orders across all devices</p>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
            <RotateCcw className="w-4 h-4 text-[#c99a2c] dark:text-amber-400 mb-1" />
            <p className="text-[11px] font-bold text-stone-900 dark:text-stone-100">1-Tap Repeat Order</p>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">Reorder favorite meals instantly</p>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
            <Star className="w-4 h-4 text-[#c99a2c] dark:text-amber-400 mb-1" />
            <p className="text-[11px] font-bold text-stone-900 dark:text-stone-100">Rate &amp; Review</p>
            <p className="text-[10px] text-stone-500 dark:text-stone-400">Share feedback on your dining experience</p>
          </div>
        </div>

        {/* Auth Error Banner if any */}
        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{authError}</span>
          </div>
        )}

        {/* Primary Premium Login with Google Button */}
        <button
          type="button"
          onClick={() => loginWithGoogle(true)}
          disabled={isAuthLoading}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] hover:brightness-110 text-stone-950 font-extrabold text-sm shadow-lg shadow-amber-900/20 transition-all active:scale-[0.99] disabled:opacity-60"
        >
          {isAuthLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-stone-950" />
              <span>Signing in with Google...</span>
            </>
          ) : (
            <>
              <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-xs shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              </span>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <div className="mt-5 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Secured by Google Authentication · Guest checkout also available</span>
        </div>
      </div>
    </div>
  );
};
