import React, { useState } from 'react';
import {
  useRestaurant,
  LOYALTY_EARN_RATE_RS,
  LOYALTY_POINT_VALUE_RS,
} from '../context/RestaurantContext';
import { formatPrice } from '../utils/format';
import {
  X,
  LogOut,
  Bike,
  RotateCcw,
  Award,
  Star,
  CheckCircle2,
  MapPin,
  Sparkles,
  Send,
  ShoppingBag,
} from 'lucide-react';
import { Order } from '../types';

export const CustomerDashboardModal: React.FC = () => {
  const {
    isDashboardOpen,
    setIsDashboardOpen,
    user,
    logout,
    orders,
    setActiveTrackingOrder,
    repeatOrder,
    submitOrderReview,
  } = useRestaurant();

  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [reviewingOrderId, setReviewingOrderId] = useState<string | null>(null);
  const [draftRating, setDraftRating] = useState<number>(5);
  const [draftReviewText, setDraftReviewText] = useState<string>('');
  const [isSavingReview, setIsSavingReview] = useState<boolean>(false);

  if (!isDashboardOpen || !user) return null;

  const filteredOrders = orders.filter((ord) => {
    if (orderFilter === 'active') return ord.status !== 'delivered';
    if (orderFilter === 'delivered') return ord.status === 'delivered';
    return true;
  });

  const loyaltyBalance = user.loyaltyPoints || 0;
  const loyaltyValueRs = loyaltyBalance * LOYALTY_POINT_VALUE_RS;
  const lifetimeEarned = user.totalPointsEarned || 0;
  const tierName =
    lifetimeEarned >= 250
      ? 'Royal Platinum'
      : lifetimeEarned >= 75
      ? 'Gold Connoisseur'
      : 'Silver Member';

  const openReviewForm = (order: Order) => {
    setReviewingOrderId(order.id);
    setDraftRating(order.rating || 5);
    setDraftReviewText(order.review || '');
  };

  const handleReviewSubmit = async (e: React.FormEvent, orderId: string) => {
    e.preventDefault();
    setIsSavingReview(true);
    try {
      await submitOrderReview(orderId, draftRating, draftReviewText);
      setReviewingOrderId(null);
      setDraftReviewText('');
    } finally {
      setIsSavingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl p-5 sm:p-7 text-stone-900 dark:text-stone-100">
        
        {/* Close Button */}
        <button
          onClick={() => setIsDashboardOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="Close Dashboard"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Profile Header */}
        <div className="flex items-center gap-3.5 sm:gap-4 pb-5 border-b border-stone-200 dark:border-stone-800 mb-5 pr-8">
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
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold font-serif-luxury truncate">
                {user.name}
              </h2>
              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
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
              {user.email || 'Google Account'} {user.phone ? `· ${user.phone}` : ''}
            </p>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-[#c99a2c] dark:text-amber-400">
              <Sparkles className="w-3 h-3" />
              <span>D&eacute;j&agrave; Vu {tierName}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-stone-500 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-xs font-semibold shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

        {/* Deja Vu Loyalty Points Wallet Card */}
        <div className="mb-6 rounded-2xl p-4 sm:p-5 bg-linear-to-br from-stone-900 via-[#1b1710] to-stone-950 border border-amber-500/40 text-stone-100 shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                <Award className="w-4 h-4 text-amber-400" />
                <span>D&eacute;j&agrave; Vu Loyalty Rewards Wallet</span>
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-extrabold text-white tabular-nums">
                  {loyaltyBalance.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-amber-300 uppercase">Points Available</span>
              </div>
              <p className="text-xs text-stone-300">
                Redeemable Value: <strong className="text-emerald-400">{formatPrice(loyaltyValueRs)}</strong> discount on future orders
              </p>
            </div>

            <div className="flex sm:flex-col gap-3 sm:gap-1.5 sm:text-right text-xs border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-800">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Lifetime Earned</span>
                <span className="font-bold text-amber-300 tabular-nums">{lifetimeEarned.toLocaleString()} pts</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase">Points Redeemed</span>
                <span className="font-bold text-stone-200 tabular-nums">{(user.totalPointsRedeemed || 0).toLocaleString()} pts</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-3 pt-2.5 border-t border-stone-800/90 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-400">
            <span>Earn <strong className="text-amber-300">1 Point</strong> for every <strong className="text-amber-300">{formatPrice(LOYALTY_EARN_RATE_RS)}</strong> spent</span>
            <span>Redeem <strong className="text-emerald-400">1 Point = {formatPrice(LOYALTY_POINT_VALUE_RS)}</strong> off at checkout</span>
          </div>
        </div>

        {/* Orders History Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                Order History ({orders.length})
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Repeat any past order in 1 tap or rate &amp; review your meal
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl self-start">
              {(['all', 'active', 'delivered'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setOrderFilter(tab)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors ${
                    orderFilter === tab
                      ? 'bg-linear-to-r from-[#f0d06f] to-[#c99a2c] text-stone-950 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-stone-400 space-y-3">
              <ShoppingBag className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs">
                {orders.length === 0
                  ? 'No orders placed yet. Explore our menu to place your first order and earn loyalty points!'
                  : `No ${orderFilter} orders found.`}
              </p>
              <button
                type="button"
                onClick={() => setIsDashboardOpen(false)}
                className="px-4 py-2 rounded-xl bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] text-stone-950 font-extrabold text-xs shadow-sm"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredOrders.map((ord) => {
                const isReviewing = reviewingOrderId === ord.id;
                return (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 space-y-3"
                  >
                    {/* Order Top Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[11px] text-stone-400 ml-2">
                          {new Date(ord.createdAt).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="ml-2 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                          {ord.orderType}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 animate-pulse'
                        }`}
                      >
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {/* Itemized Breakdown */}
                    <div className="space-y-1 text-xs text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900/60 p-2.5 rounded-xl border border-stone-200/70 dark:border-stone-700/60">
                      {ord.items.map((it) => (
                        <div key={it.cartItemId} className="flex justify-between gap-2">
                          <span className="truncate">
                            <strong className="text-stone-900 dark:text-stone-100">{it.quantity}x</strong>{' '}
                            {it.item.name}
                            {it.portion ? ` (${it.portion.label})` : ''}
                          </span>
                          <span className="font-semibold tabular-nums shrink-0 text-stone-600 dark:text-stone-400">
                            {formatPrice(it.totalPrice)}
                          </span>
                        </div>
                      ))}
                      {ord.deliveryAddress && ord.orderType === 'delivery' && (
                        <div className="pt-1.5 mt-1.5 border-t border-stone-100 dark:border-stone-800 flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                          <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">{ord.deliveryAddress}</span>
                        </div>
                      )}
                    </div>

                    {/* Loyalty Summary & Price */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-[#c99a2c] dark:text-amber-400 tabular-nums text-sm">
                          {formatPrice(ord.total)}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          ({ord.paymentMethod.toUpperCase()})
                        </span>
                        {typeof ord.pointsEarned === 'number' && ord.pointsEarned > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                            +{ord.pointsEarned} pts earned
                          </span>
                        )}
                        {typeof ord.pointsRedeemed === 'number' && ord.pointsRedeemed > 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                            -{ord.pointsRedeemed} pts redeemed ({formatPrice(ord.loyaltyDiscount || 0)} off)
                          </span>
                        )}
                      </div>

                      {/* Primary Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => repeatOrder(ord)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-900 dark:text-stone-100 font-bold text-[11px] transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Repeat Order</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsDashboardOpen(false);
                            setActiveTrackingOrder(ord);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-linear-to-r from-[#f0d06f] to-[#a87a1c] text-stone-950 font-extrabold text-[11px] shadow-sm transition-colors"
                        >
                          <Bike className="w-3 h-3" />
                          <span>Track</span>
                        </button>
                      </div>
                    </div>

                    {/* Rating & Review Section (Saved to Firestore) */}
                    <div className="pt-2.5 border-t border-stone-200 dark:border-stone-700/80">
                      {isReviewing ? (
                        <form onSubmit={(e) => handleReviewSubmit(e, ord.id)} className="space-y-2.5 bg-white dark:bg-stone-900 p-3 rounded-xl border border-amber-500/30">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                              Rate Your Order ({draftRating}/5)
                            </span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((starVal) => (
                                <button
                                  key={starVal}
                                  type="button"
                                  onClick={() => setDraftRating(starVal)}
                                  className="p-0.5 transition-transform hover:scale-110"
                                  aria-label={`Rate ${starVal} stars`}
                                >
                                  <Star
                                    className={`w-5 h-5 ${
                                      starVal <= draftRating
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-stone-300 dark:text-stone-600'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <textarea
                            rows={2}
                            maxLength={500}
                            value={draftReviewText}
                            onChange={(e) => setDraftReviewText(e.target.value)}
                            placeholder="How were the steaks, BBQ, packaging, and delivery speed?"
                            className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />

                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setReviewingOrderId(null)}
                              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={isSavingReview}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] text-stone-950 font-extrabold text-[11px] shadow-sm disabled:opacity-60"
                            >
                              <Send className="w-3 h-3" />
                              <span>{isSavingReview ? 'Saving...' : 'Save Review'}</span>
                            </button>
                          </div>
                        </form>
                      ) : ord.rating ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="font-bold text-stone-700 dark:text-stone-300 text-[11px]">Your Review:</span>
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3.5 h-3.5 ${
                                      s <= (ord.rating || 0)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-stone-300 dark:text-stone-700'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            {ord.review && (
                              <p className="text-[11px] italic text-stone-600 dark:text-stone-400 pl-5">
                                &ldquo;{ord.review}&rdquo;
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => openReviewForm(ord)}
                            className="text-[11px] font-bold text-[#c99a2c] dark:text-amber-400 hover:underline self-start sm:self-center shrink-0"
                          >
                            Edit Review
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openReviewForm(ord)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#c99a2c] dark:text-amber-400 hover:underline"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>Rate &amp; Review This Order</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
