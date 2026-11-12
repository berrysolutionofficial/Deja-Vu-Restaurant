import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { formatPrice } from '../utils/format';
import { X, LogOut, Bike, RotateCcw } from 'lucide-react';

export const CustomerDashboardModal: React.FC = () => {
  const {
    isDashboardOpen,
    setIsDashboardOpen,
    user,
    logout,
    orders,
    setActiveTrackingOrder,
    addToCart,
  } = useRestaurant();

  if (!isDashboardOpen || !user) return null;

  const handleReorder = (order: typeof orders[0]) => {
    order.items.forEach(it => {
      addToCart(it.item, it.portion);
    });
    setIsDashboardOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl p-5 sm:p-7 text-stone-900 dark:text-stone-100">
        
        {/* Close Button */}
        <button
          onClick={() => setIsDashboardOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Profile Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-stone-200 dark:border-stone-800 mb-6">
          <div className="w-14 h-14 rounded-full bg-linear-to-tr from-[#f0d06f] to-[#a87a1c] p-0.5 shadow-md shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-amber-300 font-extrabold text-lg">
                {user.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-serif-luxury truncate">
                {user.name}
              </h2>
              {/* Google Verified Indicator */}
              <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                <svg className="w-3 h-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                Google Verified
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
              {user.email || 'Google User'} {user.phone ? `· ${user.phone}` : ''}
            </p>
            <span className="inline-block mt-1 text-[11px] font-semibold text-[#c99a2c] dark:text-amber-400">
              D&eacute;j&agrave; Vu VIP Member
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
            className="p-2.5 rounded-xl text-stone-400 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Orders Section */}
        <div className="space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-800 dark:text-stone-200">
              Your Orders ({orders.length})
            </h3>
            <span className="text-[11px] text-stone-400">
              Real-time kitchen updates
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="p-6 text-center rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-stone-400 text-xs">
              No orders placed yet. Browse the menu to place your first order!
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[11px] text-stone-400 ml-2">
                        {new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      ord.status === 'delivered'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 animate-pulse'
                    }`}>
                      {ord.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-1">
                    {ord.items.map(i => `${i.quantity}x ${i.item.name}`).join(', ')}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200 dark:border-stone-700 text-xs">
                    <span className="font-extrabold text-[#c99a2c] dark:text-amber-400 tabular-nums">
                      {formatPrice(ord.total)} ({ord.paymentMethod.toUpperCase()})
                    </span>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleReorder(ord)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-800 dark:text-stone-200 font-semibold text-[11px] transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reorder</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsDashboardOpen(false);
                          setActiveTrackingOrder(ord);
                        }}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-linear-to-r from-[#f0d06f] to-[#a87a1c] text-stone-950 font-extrabold text-[11px] shadow-sm transition-colors"
                      >
                        <Bike className="w-3 h-3" />
                        <span>Track</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
