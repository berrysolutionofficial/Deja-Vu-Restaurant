import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { MapPin, Clock, Phone, Navigation, ExternalLink, Bike } from 'lucide-react';
import { RESTAURANT_LOCATION } from '../data/karachiAreas';
import { formatPrice } from '../utils/format';

export const RestaurantInfoSection: React.FC = () => {
  const { selectedArea, setIsLocationModalOpen } = useRestaurant();

  return (
    <section id="location-section" className="py-14 sm:py-20 bg-stone-100 dark:bg-stone-950/80 border-t border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Location Details & Distance Fee Calculator */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c99a2c] dark:text-amber-400 mb-2">
                <MapPin className="w-4 h-4" />
                <span>Visit &amp; Contact Us</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-luxury text-stone-900 dark:text-stone-100 tracking-tight leading-snug">
                <span className="block">D&eacute;j&agrave; Vu Restaurant</span>
                <span className="block text-[#c99a2c] dark:text-amber-300">BBQ &amp; Grill</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                Enjoy outdoor dining, family halls, sizzling cast-iron steaks, and authentic charcoal BBQ in the heart of Gulistan-e-Johar, Karachi.
              </p>
            </div>

            {/* Address & Timings Cards */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100">Official Address</h4>
                  <p className="text-stone-600 dark:text-stone-400 text-xs mt-1 leading-relaxed">
                    <span className="block">Plot # B-54/13, Johar Hill Rd, Block&nbsp;1,</span>
                    <span className="block">Gulistan-e-Johar, Karachi, Pakistan 75290</span>
                  </p>
                  <a
                    href={RESTAURANT_LOCATION.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline mt-1.5"
                  >
                    <span>Open in Google Maps App</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100">Service Hours</h4>
                  <p className="text-stone-600 dark:text-stone-400 text-xs mt-0.5 font-semibold text-amber-700 dark:text-amber-300">
                    Daily: 11:00 AM – 2:00 AM
                  </p>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    Lunch, Dinner &amp; Late Night BBQ for Dine-In, Takeaway &amp; Delivery.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-stone-100">Direct Contact &amp; Booking</h4>
                  <p className="text-stone-600 dark:text-stone-400 text-xs mt-0.5">
                    Phone &amp; WhatsApp: <span className="font-bold text-stone-900 dark:text-stone-100">{RESTAURANT_LOCATION.phone}</span>
                  </p>
                  <div className="flex gap-3 mt-1.5">
                    <a
                      href={`tel:${RESTAURANT_LOCATION.phone}`}
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Call Now
                    </a>
                    <span className="text-stone-400">·</span>
                    <a
                      href={`https://wa.me/${RESTAURANT_LOCATION.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Distance & Fuel-Rate Delivery Fee Card with Comma Formatting */}
            <div className="p-4 rounded-2xl bg-linear-to-br from-amber-500/10 via-stone-900/5 to-amber-600/10 dark:from-stone-900 dark:to-stone-900 border border-amber-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 dark:text-amber-200 flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-amber-500" />
                  Your Delivery Estimate
                </span>
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="text-amber-600 dark:text-amber-400 text-[11px] font-bold hover:underline"
                >
                  Change Area
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Area</span>
                  <p className="font-bold text-xs truncate text-stone-800 dark:text-stone-200">
                    {selectedArea.name.split(' - ')[0]}
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Distance</span>
                  <p className="font-bold text-xs text-stone-800 dark:text-stone-200 tabular-nums">
                    ~{selectedArea.distanceKm} km
                  </p>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold">Delivery Fee</span>
                  <p className="font-bold text-xs text-[#c99a2c] dark:text-amber-400 tabular-nums">
                    {formatPrice(selectedArea.deliveryFee)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Interactive Embed & Direction Guide */}
          <div className="lg:col-span-7 flex flex-col rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl">
            {/* Map Top Bar */}
            <div className="px-4 sm:px-5 py-3 bg-stone-950 text-stone-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                <div className="text-xs font-bold font-serif-luxury tracking-wide text-amber-200 leading-tight">
                  <span className="block">Johar Hill Road,</span>
                  <span className="block text-amber-300">Block&nbsp;1, Karachi</span>
                </div>
              </div>
              <a
                href={RESTAURANT_LOCATION.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-bold transition-colors shrink-0"
              >
                <span>Directions</span>
                <Navigation className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Embedded Responsive Google Map */}
            <div className="relative flex-1 min-h-[340px] sm:min-h-[420px] w-full bg-stone-200 dark:bg-stone-800">
              <iframe
                title="Deja Vu Restaurant BBQ & Grill Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.305139049405!2d67.1303113!3d24.9185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb338df37775555%3A0x6b15858cf0981977!2sGulistan-e-Johar%2C%20Karachi!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[20%] contrast-[110%]"
              />

              {/* Floating Overlay Badge on Map */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-stone-950/95 text-white backdrop-blur-md p-3.5 rounded-2xl border border-amber-500/30 shadow-xl max-w-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-black border border-amber-400 p-0.5 shrink-0">
                    <img
                      src="/assets/aistudio/Deja_Vu_logo_03d51cef.png"
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="font-bold text-xs text-amber-200">D&eacute;j&agrave; Vu BBQ &amp; Grill</span>
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  <span className="block">Plot # B-54/13, Johar Hill Rd, Block&nbsp;1,</span>
                  <span className="block">Gulistan-e-Johar, Karachi.</span>
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-stone-400 pt-2 border-t border-stone-800">
                  <span>Valet &amp; roadside parking</span>
                  <span className="text-amber-400 font-bold">11:00 AM – 2:00 AM</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
