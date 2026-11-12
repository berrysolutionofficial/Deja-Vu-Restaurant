import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { formatPrice } from '../utils/format';
import { X, Bike, ShoppingBag, Utensils, ArrowRight, MessageSquare, ShieldCheck } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    cartSubtotal,
    deliveryFee,
    orderType,
    selectedArea,
    customAddress,
    tableNumber,
    placeOrder,
    user,
  } = useRestaurant();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(customAddress || '');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online' | 'cash'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutModalOpen) return null;

  const total = cartSubtotal + (orderType === 'delivery' ? deliveryFee : 0);

  const handleSubmit = (e: React.FormEvent, sendToWhatsapp: boolean) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your full name and phone number to confirm your order.');
      return;
    }
    if (orderType === 'delivery' && !address.trim()) {
      alert('Please enter your complete street / house address for delivery.');
      return;
    }

    setIsSubmitting(true);

    const createdOrder = placeOrder({
      customerName,
      customerPhone,
      deliveryAddress: address,
      specialNotes: notes,
      paymentMethod,
    });

    if (sendToWhatsapp) {
      // Build clean WhatsApp message to 0325-9111555
      const itemsList = cart
        .map(c => `• ${c.quantity}x ${c.item.name}${c.portion ? ` (${c.portion.label})` : ''} - ${formatPrice(c.totalPrice)}`)
        .join('%0A');

      const waText = 
        `*NEW ORDER FROM DEJA VU WEBSITE*%0A` +
        `*Order ID:* ${createdOrder.orderNumber}%0A` +
        `*Order Type:* ${orderType.toUpperCase()}%0A` +
        `*Customer Name:* ${encodeURIComponent(customerName)}%0A` +
        `*Phone:* ${encodeURIComponent(customerPhone)}%0A` +
        (orderType === 'delivery' ? `*Area:* ${encodeURIComponent(selectedArea.name)} (~${selectedArea.distanceKm} km)%0A*Address:* ${encodeURIComponent(address)}%0A` : '') +
        (orderType === 'dine-in' ? `*Table/Party:* ${encodeURIComponent(tableNumber || 'Seated')} %0A` : '') +
        `------------------------%0A` +
        `*ITEMS:*%0A${itemsList}%0A` +
        `------------------------%0A` +
        `*Subtotal:* ${formatPrice(cartSubtotal)}%0A` +
        (orderType === 'delivery' ? `*Delivery Fee:* ${formatPrice(deliveryFee)}%0A` : '') +
        `*TOTAL AMOUNT:* ${formatPrice(total)}%0A` +
        `*Payment Method:* ${paymentMethod.toUpperCase()}%0A` +
        (notes ? `*Special Instructions:* ${encodeURIComponent(notes)}%0A` : '');

      window.open(`https://wa.me/923259111555?text=${waText}`, '_blank');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl p-5 sm:p-7 text-stone-900 dark:text-stone-100">
        
        {/* Close Button */}
        <button
          onClick={() => setIsCheckoutModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c99a2c] dark:text-amber-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Checkout</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury tracking-tight">
            Confirm Your Order
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Deja Vu Restaurant BBQ &amp; Grill · WhatsApp: 0325-9111555 · Timings: 11:00 AM – 2:00 AM
          </p>
        </div>

        {/* Order Mode Badge */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 text-xs mb-4">
          {orderType === 'delivery' && <Bike className="w-4 h-4 text-amber-500 shrink-0" />}
          {orderType === 'takeaway' && <ShoppingBag className="w-4 h-4 text-amber-500 shrink-0" />}
          {orderType === 'dine-in' && <Utensils className="w-4 h-4 text-amber-500 shrink-0" />}
          <div className="flex-1 truncate">
            <span className="font-semibold capitalize text-stone-900 dark:text-stone-100">
              {orderType} Mode
            </span>
            {orderType === 'delivery' && (
              <span className="text-stone-500 dark:text-stone-400 ml-1">
                to {selectedArea.name.split(' - ')[0]} (~{selectedArea.distanceKm} km from Johar Block 1)
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Faizan Sheikh"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                WhatsApp / Phone Number *
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="0325-XXXXXXX"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {orderType === 'delivery' && (
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Complete Delivery Address *
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Apartment number, building name, street, nearby landmark..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {orderType === 'dine-in' && (
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Table Number or Party Size
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Table 12 or Party of 6"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Cooking &amp; Delivery Instructions (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Medium spice, extra mint chutney, call on gate..."
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition-colors ${
                paymentMethod === 'cod'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-amber-500"
                />
                <span>Cash on Delivery (COD)</span>
              </label>

              <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs transition-colors ${
                paymentMethod === 'online'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'online'}
                  onChange={() => setPaymentMethod('online')}
                  className="accent-amber-500"
                />
                <span>EasyPaisa / Bank Transfer</span>
              </label>
            </div>
          </div>

          {/* Bill Breakdown with Comma Formatting */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600 dark:text-stone-400">
              <span>Items Total ({cart.length} items)</span>
              <span className="font-semibold text-stone-900 dark:text-stone-200 tabular-nums">
                {formatPrice(cartSubtotal)}
              </span>
            </div>

            {orderType === 'delivery' && (
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Distance-Based Delivery ({selectedArea.name.split(' - ')[0]} · ~{selectedArea.distanceKm} km)</span>
                <span className="font-semibold text-stone-900 dark:text-stone-200 tabular-nums">
                  {formatPrice(deliveryFee)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-stone-900 dark:text-stone-100 font-bold text-sm pt-2 border-t border-stone-200 dark:border-stone-700">
              <span>Final Bill to Pay</span>
              <span className="text-[#c99a2c] dark:text-amber-400 text-base font-extrabold tabular-nums">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {/* Primary Order & Send to WhatsApp */}
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-700/20 transition-all active:scale-[0.99]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirm &amp; Send Order via WhatsApp</span>
            </button>

            {/* Standard Online Placement with Logo Gold */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-extrabold text-xs text-stone-950 bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] hover:brightness-110 shadow-md transition-colors"
            >
              <span>Place Order on Web &amp; Track Live</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
