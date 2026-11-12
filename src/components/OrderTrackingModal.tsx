import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { formatPrice } from '../utils/format';
import { X, CheckCircle2, Clock, Bike, Flame, Utensils, Phone, MessageSquare } from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const { activeTrackingOrder, setActiveTrackingOrder } = useRestaurant();

  if (!activeTrackingOrder) return null;

  const order = activeTrackingOrder;

  const steps = [
    {
      key: 'placed',
      title: 'Order Confirmed',
      desc: 'Received at Deja Vu kitchen',
      icon: CheckCircle2,
      active: true,
      done: true,
    },
    {
      key: 'grilling',
      title: 'Grilling on Embers',
      desc: 'Steaks & BBQ sizzling on high heat',
      icon: Flame,
      active: order.status === 'grilling' || order.status === 'out_for_delivery' || order.status === 'delivered',
      done: order.status === 'out_for_delivery' || order.status === 'delivered',
    },
    {
      key: 'out_for_delivery',
      title: order.orderType === 'delivery' ? 'Rider on the Way' : 'Ready at Counter',
      desc: order.orderType === 'delivery' ? `Heading towards ${order.area?.name.split(' - ')[0] || 'your address'}` : 'Warm and packed for pickup',
      icon: order.orderType === 'delivery' ? Bike : Utensils,
      active: order.status === 'out_for_delivery' || order.status === 'delivered',
      done: order.status === 'delivered',
    },
    {
      key: 'delivered',
      title: order.orderType === 'delivery' ? 'Delivered' : 'Completed',
      desc: 'Enjoy your meal!',
      icon: CheckCircle2,
      active: order.status === 'delivered',
      done: order.status === 'delivered',
    },
  ];

  const handleWhatsappHelp = () => {
    const text = `Hi Deja Vu Restaurant! I am checking on my Order ${order.orderNumber} (${order.customerName}). Please let me know the status.`;
    window.open(`https://wa.me/923259111555?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl p-5 sm:p-7 text-stone-900 dark:text-stone-100">
        
        {/* Close Button */}
        <button
          onClick={() => setActiveTrackingOrder(null)}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
            <Bike className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Live Order Tracker
            </span>
            <h2 className="text-xl font-bold font-serif-luxury tracking-tight">
              Order {order.orderNumber}
            </h2>
            <p className="text-xs text-stone-400">
              Placed on {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* ETA Highlight Card */}
        <div className="p-4 rounded-2xl bg-linear-to-r from-amber-500/10 via-amber-600/10 to-transparent border border-amber-500/30 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-xs text-stone-500 dark:text-stone-400">Estimated Delivery Time</p>
              <p className="text-sm sm:text-base font-bold text-stone-900 dark:text-amber-200">
                {order.status === 'delivered' ? 'Delivered!' : `~${order.estimatedDeliveryMinutes} Minutes`}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 capitalize">
            {order.status.replace('_', ' ')}
          </span>
        </div>

        {/* Animated Progress Timeline */}
        <div className="space-y-6 relative pl-6 border-l-2 border-stone-200 dark:border-stone-800 ml-3 mb-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.key} className="relative">
                {/* Timeline node */}
                <div
                  className={`absolute -left-[33px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                    step.done
                      ? 'bg-amber-500 border-amber-500 text-stone-950'
                      : step.active
                      ? 'bg-[#f0d06f] border-amber-400 text-stone-950 animate-pulse'
                      : 'bg-stone-200 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div>
                  <h4 className={`text-xs sm:text-sm font-bold ${
                    step.active ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Items Summary with Comma Formatting */}
        <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 mb-6 space-y-2">
          <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
            Order Items ({order.items.length})
          </p>
          <div className="space-y-1 text-xs">
            {order.items.map((it) => (
              <div key={it.cartItemId} className="flex justify-between text-stone-600 dark:text-stone-400">
                <span className="truncate pr-2">
                  {it.quantity}x {it.item.name} {it.portion ? `(${it.portion.label})` : ''}
                </span>
                <span className="font-semibold tabular-nums text-stone-900 dark:text-stone-200 shrink-0">
                  {formatPrice(it.totalPrice)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-between font-bold text-xs text-stone-900 dark:text-stone-100">
            <span>Total Bill Paid ({order.paymentMethod.toUpperCase()})</span>
            <span className="text-[#c99a2c] dark:text-amber-400 font-extrabold tabular-nums">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Contact Restaurant / WhatsApp Help */}
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={handleWhatsappHelp}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Kitchen</span>
          </button>

          <a
            href="tel:03259111555"
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-xs transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call 0325-9111555</span>
          </a>
        </div>
      </div>
    </div>
  );
};
