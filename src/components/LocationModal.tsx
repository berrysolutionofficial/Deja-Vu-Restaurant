import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { KARACHI_AREAS, KarachiArea } from '../data/karachiAreas';
import { MapPin, Navigation, Bike, ShoppingBag, Utensils, X, Search, CheckCircle } from 'lucide-react';

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    orderType,
    setOrderType,
    selectedArea,
    setSelectedArea,
    customAddress,
    setCustomAddress,
    tableNumber,
    setTableNumber,
    detectCurrentLocation,
    isDetectingLocation,
    locationError,
  } = useRestaurant();

  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [detectedSuccessMsg, setDetectedSuccessMsg] = useState<string | null>(null);

  if (!isLocationModalOpen) return null;

  const filteredAreas = KARACHI_AREAS.filter(area =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    area.zone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectArea = (area: KarachiArea) => {
    setSelectedArea(area);
    localStorage.setItem('dejavu_selected_area', area.id);
    localStorage.setItem('dejavu_area_chosen', 'true');
    setDropdownOpen(false);
    setSearchQuery('');
  };

  const handleUseCurrentLocation = async () => {
    const detectedName = await detectCurrentLocation();
    setDetectedSuccessMsg(`Detected: ${detectedName}`);
    setTimeout(() => setDetectedSuccessMsg(null), 3000);
  };

  const handleConfirm = () => {
    localStorage.setItem('dejavu_area_chosen', 'true');
    if (customAddress) {
      localStorage.setItem('dejavu_custom_address', customAddress);
    }
    setIsLocationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden transition-all text-stone-900 dark:text-stone-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsLocationModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Restaurant Brand Logo Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-full p-1 border-2 border-amber-400/60 bg-black shadow-lg mb-3">
            <img
              src="/assets/aistudio/Deja_Vu_logo_03d51cef.png"
              alt="Deja Vu Restaurant BBQ & Grill"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-xl font-bold font-serif-luxury tracking-wide text-stone-900 dark:text-amber-100">
            Select Your Order Type
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Plot # B-54/13, Johar Hill Rd, Block&nbsp;1, Gulistan-e-Johar, Karachi
          </p>
        </div>

        {/* Order Type Toggle Tabs with Logo Gold */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setOrderType('delivery')}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
              orderType === 'delivery'
                ? 'bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] text-stone-950 shadow-md'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Bike className="w-4 h-4 mb-1" />
            <span>Delivery</span>
          </button>
          <button
            type="button"
            onClick={() => setOrderType('takeaway')}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
              orderType === 'takeaway'
                ? 'bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] text-stone-950 shadow-md'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4 mb-1" />
            <span>Takeaway</span>
          </button>
          <button
            type="button"
            onClick={() => setOrderType('dine-in')}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
              orderType === 'dine-in'
                ? 'bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] text-stone-950 shadow-md'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Utensils className="w-4 h-4 mb-1" />
            <span>Dine-In</span>
          </button>
        </div>

        {/* Delivery Details */}
        {orderType === 'delivery' && (
          <div className="space-y-4">
            {/* Auto GPS Detect Button */}
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isDetectingLocation}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-50/60 dark:bg-amber-950/20 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 text-xs font-bold transition-colors disabled:opacity-50"
            >
              <Navigation className={`w-4 h-4 text-amber-500 ${isDetectingLocation ? 'animate-spin' : ''}`} />
              <span>{isDetectingLocation ? 'Getting location...' : 'Use Current Location'}</span>
            </button>

            {detectedSuccessMsg && (
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{detectedSuccessMsg}</span>
              </div>
            )}

            {locationError && (
              <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg">
                {locationError}
              </p>
            )}

            {/* Karachi Area Dropdown */}
            <div className="relative">
              <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1.5">
                Please select your area in Karachi
              </label>
              
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-left text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="truncate">{selectedArea.name}</span>
                </div>
                <span className="text-xs text-stone-400 ml-2 shrink-0">▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 max-h-56 overflow-y-auto z-30 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl shadow-xl p-2 space-y-1">
                  <div className="sticky top-0 bg-white dark:bg-stone-800 pb-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search Karachi area..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {filteredAreas.length === 0 ? (
                    <div className="p-3 text-center text-xs text-stone-400">
                      No matching Karachi area found
                    </div>
                  ) : (
                    filteredAreas.map((area) => (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => handleSelectArea(area)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-colors ${
                          selectedArea.id === area.id
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold'
                            : 'hover:bg-stone-100 dark:hover:bg-stone-700/60 text-stone-700 dark:text-stone-200'
                        }`}
                      >
                        <span className="truncate">{area.name}</span>
                        <span className="text-stone-400 text-[11px] shrink-0 ml-2">
                          ~{area.distanceKm} km
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Custom Street Address */}
            <div>
              <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1.5">
                Exact Street / House / Apartment Details
              </label>
              <input
                type="text"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="e.g. House B-12, Street 4, near Johar Chowrangi"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        )}

        {/* Takeaway Details */}
        {orderType === 'takeaway' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2 mb-4">
            <div className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span>Self Pickup Counter</span>
            </div>
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
              Your freshly grilled meal will be packaged and ready for pickup at our express takeaway counter:
            </p>
            <p className="font-bold text-stone-900 dark:text-stone-100">
              Plot # B-54/13, Johar Hill Rd, Block&nbsp;1, Gulistan-e-Johar, Karachi.
            </p>
          </div>
        )}

        {/* Dine-In Details */}
        {orderType === 'dine-in' && (
          <div className="space-y-3 mb-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
              <div className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-amber-500" />
                <span>Table Dining &amp; Reservation</span>
              </div>
              <p className="text-stone-600 dark:text-stone-300">
                Experience our sizzling steaks and charcoal aroma right at the restaurant!
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1.5">
                Table Number (If already seated) or Guest Count
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. Table 8 or Party of 4"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        )}

        {/* Confirm Button with Logo Gold */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full mt-6 py-3 px-4 rounded-xl font-extrabold text-sm text-stone-950 bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#a87a1c] hover:brightness-110 shadow-lg shadow-amber-900/30 transition-all active:scale-[0.99]"
        >
          Select &amp; Start Ordering
        </button>
      </div>
    </div>
  );
};
