import React, { useEffect, useState } from 'react';
import { FlyingItemData } from '../types';

interface FlyingCartAnimationProps {
  flyingItems: FlyingItemData[];
}

export const FlyingCartAnimation: React.FC<FlyingCartAnimationProps> = ({ flyingItems }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {flyingItems.map(item => (
        <FlyingItem key={item.id} data={item} />
      ))}
    </div>
  );
};

const FlyingItem: React.FC<{ data: FlyingItemData }> = ({ data }) => {
  const [phase, setPhase] = useState<'start' | 'flying'>('start');

  useEffect(() => {
    // Start smooth trajectory after microtask
    const frame = requestAnimationFrame(() => {
      setPhase('flying');
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const currentX = phase === 'start' ? data.startX : data.targetX;
  const currentY = phase === 'start' ? data.startY : data.targetY;
  const currentScale = phase === 'start' ? 1.15 : 0.24;
  const currentOpacity = phase === 'start' ? 1 : 0.2;

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate3d(${currentX - 28}px, ${currentY - 28}px, 0) scale(${currentScale})`,
        opacity: currentOpacity,
        transition: phase === 'flying'
          ? 'transform 0.85s cubic-bezier(0.18, 0.89, 0.32, 1.15), opacity 0.85s ease-in'
          : 'none',
        willChange: 'transform, opacity',
      }}
      className="w-14 h-14 rounded-full overflow-hidden shadow-2xl border-2 border-[#c99a2c] bg-stone-950 flex items-center justify-center p-0.5 shadow-amber-500/40"
    >
      {data.image ? (
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-linear-to-tr from-[#f0d06f] to-[#a87a1c] flex items-center justify-center text-stone-950 text-[10px] font-bold text-center px-1">
          {data.name.substring(0, 10)}
        </div>
      )}
    </div>
  );
};
