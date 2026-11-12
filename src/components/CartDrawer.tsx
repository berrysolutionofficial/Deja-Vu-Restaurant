import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { formatPrice } from '../utils/format';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Bike, MapPin } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    deliveryFee,
    orderType,
    selectedArea,
    setIsLocationModalOpen,
    setIsCheckoutModalOpen,
  } = useRestaurant();

  if (!isCartDrawerOpen) return null;

  const total = cartSubtotal + deliveryFee;

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex justify-end pl-0 sm:pl-10">
        <div className="w-full sm:w-[420px] max-w-full bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col text-stone-900 dark:text-stone-100 h-full overflow-hidden">
          
          {/* Drawer Header */}
          <div className="px-4 sm:px-5 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="font-serif-luxury font-bold text-lg">Your Order Bag</h2>
              <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold tabular-nums">
                {cartCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Location Summary Strip */}
          <div className="px-4 sm:px-5 py-2.5 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 truncate">
              {orderType === 'delivery' ? (
                <>
                  <Bike className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="text-stone-500 dark:text-stone-400">Delivering to:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                    {selectedArea.name.split(' - ')[0]}
                  </span>
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-semibold capitalize text-stone-800 dark:text-stone-200">
                    {orderType} (Johar Block 1)
                  </span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="text-amber-600 dark:text-amber-400 font-bold text-[11px] hover:underline shrink-0 ml-2"
            >
              Change
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-40 text-stone-500" />
                </div>
                <p className="font-bold text-base text-stone-700 dark:text-stone-300">Your bag is empty</p>
                <p className="text-xs text-stone-400 mt-1 max-w-xs">
                  Explore our sizzling steaks, charcoal BBQ platters, and burgers to add delicious dishes.
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="mt-4 px-4 py-2 rounded-xl bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] text-stone-950 text-xs font-bold shadow-md transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              cart.map((cartItem) => {
                const imgSource = (cartItem.item.image || '').replace('/src/assets/', '/assets/');
                return (
                  <div
                    key={cartItem.cartItemId}
                    className="flex items-center justify-between gap-2.5 p-2.5 sm:p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-700 shrink-0">
                        <img
                          src={imgSource}
                          alt={cartItem.item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/assets/images/bbq_charcoal_platter_1794462153034.jpg';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-xs sm:text-sm text-stone-900 dark:text-stone-100 truncate">
                          {cartItem.item.name}
                        </h4>
                        {cartItem.portion && (
                          <p className="text-[11px] text-amber-500 font-medium">
                            {cartItem.portion.label}
                          </p>
                        )}
                        <p className="text-xs font-bold text-stone-700 dark:text-stone-300 tabular-nums">
                          {formatPrice(cartItem.unitPrice)}
                        </p>
                      </div>
                    </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden bg-white dark:bg-stone-900">
                      <button
                        type="button"
                        onClick={() => updateQuantity(cartItem.cartItemId, -1)}
                        className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-bold tabular-nums">
                        {cartItem.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(cartItem.cartItemId, 1)}
                        className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(cartItem.cartItemId)}
                      className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
          </div>

          {/* Drawer Footer Billing & Actions */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/60 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-200 tabular-nums">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>

                {orderType === 'delivery' && (
                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Delivery Fee ({selectedArea.name.split(' - ')[0]} ~{selectedArea.distanceKm} km)</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-200 tabular-nums">
                      {formatPrice(deliveryFee)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-stone-900 dark:text-stone-100 font-bold text-sm pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span>Total Amount</span>
                  <span className="text-[#c99a2c] dark:text-amber-400 text-base font-extrabold tabular-nums">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={handleCheckoutClick}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-sm text-stone-950 bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] hover:brightness-110 shadow-lg shadow-amber-900/30 transition-all active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="w-full text-center text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 py-1"
              >
                Clear Entire Bag
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
