import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export const MENU_CARD_IMAGES = [
  { title: 'Burgers', src: '/assets/aistudio/Menu_Card__1__a6fd183c.jpg' },
  { title: 'Starters & Wings', src: '/assets/aistudio/Menu_Card__2__f1a6c75a.jpg' },
  { title: 'Chicken Steaks', src: '/assets/aistudio/Menu_Card__3__dfd79978.jpg' },
  { title: 'Chicken Steaks Cont.', src: '/assets/aistudio/Menu_Card__4__65c07c77.jpg' },
  { title: 'Chinese & Fried Rice', src: '/assets/aistudio/Menu_Card__5__4b60bd4d.jpg' },
  { title: 'Pasta & Lasagna', src: '/assets/aistudio/Menu_Card__6__09191e41.jpg' },
  { title: 'Beef Steaks', src: '/assets/aistudio/Menu_Card__7__96572fda.jpg' },
  { title: 'Starters & Platters', src: '/assets/aistudio/Menu_Card__8__98c2a552.jpg' },
  { title: 'Sandwiches', src: '/assets/aistudio/Menu_Card__9__31f864bc.jpg' },
  { title: 'Prime Beef Steaks', src: '/assets/aistudio/Menu_Card__10__a47be750.jpg' },
  { title: 'BBQ & Chicken Karahi', src: '/assets/aistudio/Menu_Card__11__9d3b9b56.jpg' },
  { title: 'Hot Corner & Cold Coffee', src: '/assets/aistudio/Menu_Card__12__dd3ddf0f.jpg' },
  { title: 'Soft Drinks & Naan', src: '/assets/aistudio/Menu_Card__13__d63a9f1d.jpg' },
  { title: 'Seafood & Pizzas', src: '/assets/aistudio/Menu_Card__14__08ee7b30.jpg' },
  { title: 'Salads & Soups', src: '/assets/aistudio/Menu_Card__15__1d434b24.jpg' },
  { title: 'Desserts & Smoothies', src: '/assets/aistudio/Menu_Card__16__12a8a019.jpg' },
  { title: 'Biryani & Rolls', src: '/assets/aistudio/Menu_Card__17__bdb6da26.jpg' },
  { title: 'BBQ Platters & Mutton Karahi', src: '/assets/aistudio/Menu_Card__18__bf02afd0.jpg' },
];

interface MenuCardViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export const MenuCardViewerModal: React.FC<MenuCardViewerModalProps> = ({
  isOpen,
  onClose,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen) return null;

  const currentCard = MENU_CARD_IMAGES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % MENU_CARD_IMAGES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + MENU_CARD_IMAGES.length) % MENU_CARD_IMAGES.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col items-center bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl p-4">
        
        {/* Top Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-stone-800 text-stone-200">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif-luxury font-bold text-sm sm:text-base text-amber-200">
              {currentCard.title} ({currentIndex + 1} of {MENU_CARD_IMAGES.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Card Display */}
        <div className="relative flex-1 w-full flex items-center justify-center overflow-auto py-2">
          <img
            src={currentCard.src}
            alt={currentCard.title}
            className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-xl"
          />

          {/* Nav buttons */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black/90 border border-stone-700 text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black/90 border border-stone-700 text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Thumbnail Selector Strip */}
        <div className="w-full flex gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none">
          {MENU_CARD_IMAGES.map((card, idx) => (
            <button
              key={card.src}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`shrink-0 w-12 h-16 rounded overflow-hidden border-2 transition-all ${
                idx === currentIndex ? 'border-amber-400 scale-105' : 'border-stone-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img src={card.src} alt={card.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
