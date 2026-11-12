import React from 'react';
import { Phone, MapPin, Clock, MessageSquare, ExternalLink } from 'lucide-react';
import { RESTAURANT_LOCATION } from '../data/karachiAreas';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-100 dark:bg-stone-950 text-stone-700 dark:text-stone-300 border-t border-stone-200 dark:border-stone-800 transition-colors pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full p-0.5 bg-stone-100 dark:bg-black border border-amber-500/60 shadow-md">
                <img
                  src="/assets/aistudio/Deja_Vu_logo_03d51cef.png"
                  alt="Deja Vu Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif-luxury font-bold text-lg text-stone-900 dark:text-amber-200">
                  D&eacute;j&agrave; Vu
                </h3>
                <p className="text-[10px] tracking-widest uppercase text-[#c99a2c] dark:text-amber-400 font-bold">
                  Restaurant BBQ &amp; Grill
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Serving Karachi's finest prime sizzling steaks, authentic charcoal barbecue, and aromatic karahis with warm family hospitality.
            </p>
          </div>

          {/* Col 2: Restaurant Location */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury font-bold text-sm text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              Gulistan-e-Johar Branch
            </h4>
            <div className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="block">Plot # B-54/13, Johar Hill Rd, Block&nbsp;1,</span>
                <span className="block">Gulistan-e-Johar, Karachi, Pakistan 75290</span>
              </div>
            </div>
            <a
              href={RESTAURANT_LOCATION.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold"
            >
              <span>Get Directions on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Col 3: Kitchen & Delivery Hours (11:00 AM – 2:00 AM) */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury font-bold text-sm text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              Hours of Service
            </h4>
            <div className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-400">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-stone-900 dark:text-stone-200">Monday – Sunday</p>
                <p className="text-[#c99a2c] dark:text-amber-400 font-bold mt-0.5">11:00 AM – 2:00 AM</p>
                <p className="text-stone-500 text-[11px] mt-1">Dine-In, Takeaway &amp; Online Delivery</p>
              </div>
            </div>
          </div>

          {/* Col 4: Direct WhatsApp Contact */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury font-bold text-sm text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              WhatsApp Order Desk
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              For direct orders, catering, and table bookings:
            </p>
            <a
              href={`https://wa.me/${RESTAURANT_LOCATION.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs transition-colors shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp: 0325-9111555</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <p>
            &copy; {new Date().getFullYear()} D&eacute;j&agrave; Vu Restaurant BBQ &amp; Grill. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span>Dine-In</span>
            <span>·</span>
            <span>Takeaway</span>
            <span>·</span>
            <span>Home Delivery Across Karachi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
