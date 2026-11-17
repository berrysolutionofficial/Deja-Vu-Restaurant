import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  trail: { x: number; y: number }[];
  twinkle: boolean;
}

interface FireworkRocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  exploded: boolean;
}

const GOLD_CELEBRATION_PALETTE = [
  '#fff4cc', // Champagne White
  '#f0d06f', // Light Metallic Gold
  '#e5b842', // Royal Gold
  '#c99a2c', // Deep Gold
  '#ff9f1c', // Warm Ember Amber
  '#ff5400', // BBQ Flame Orange-Red
  '#ffd166', // Sparkle Yellow
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Trigger smooth exit sequence after celebration intro completes
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const totalDuration = prefersReducedMotion ? 1000 : 3200;

    // Smooth progress bar tick
    const startTime = performance.now();
    let rafProgressId: number;
    const updateProgress = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(pct);
      if (pct < 100) {
        rafProgressId = requestAnimationFrame(updateProgress);
      }
    };
    rafProgressId = requestAnimationFrame(updateProgress);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, totalDuration);

    const finishTimer = setTimeout(() => {
      onComplete();
    }, totalDuration + 550);

    return () => {
      cancelAnimationFrame(rafProgressId);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  // High-DPI Canvas Celebration Fireworks Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: FireworkParticle[] = [];
    const rockets: FireworkRocket[] = [];

    const createBurst = (cx: number, cy: number, count = 52, spreadSpeed = 6.5) => {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.28;
        const speed = (0.35 + Math.random() * 0.85) * spreadSpeed;
        const color =
          GOLD_CELEBRATION_PALETTE[Math.floor(Math.random() * GOLD_CELEBRATION_PALETTE.length)];
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.011 + Math.random() * 0.013,
          color,
          size: 1.5 + Math.random() * 2.3,
          trail: [],
          twinkle: Math.random() > 0.45,
        });
      }
    };

    const launchRocket = (startXRatio: number, targetYRatio: number) => {
      const startX = width * startXRatio;
      const targetY = height * targetYRatio;
      const color =
        GOLD_CELEBRATION_PALETTE[Math.floor(Math.random() * GOLD_CELEBRATION_PALETTE.length)];
      rockets.push({
        x: startX,
        y: height + 10,
        targetY,
        vx: (Math.random() - 0.5) * 1.4,
        vy: -10.5 - Math.random() * 3.5,
        color,
        exploded: false,
      });
    };

    // Choreographed celebration bursts timed with the logo bounce!
    const scheduledTimeouts: number[] = [];

    // 1) Immediate dual side celebratory rockets launching on entry
    launchRocket(0.22, 0.28);
    launchRocket(0.78, 0.26);

    // 2) Center halo burst synced with logo elastic peak bounce (~380ms)
    scheduledTimeouts.push(
      window.setTimeout(() => {
        createBurst(width * 0.5, height * 0.44, 68, 7.6);
      }, 380)
    );

    // 3) Staggered multi-sky festival bursts
    scheduledTimeouts.push(
      window.setTimeout(() => {
        createBurst(width * 0.24, height * 0.3, 44, 5.8);
        createBurst(width * 0.76, height * 0.32, 44, 5.8);
      }, 720)
    );

    scheduledTimeouts.push(
      window.setTimeout(() => {
        launchRocket(0.35, 0.22);
        launchRocket(0.65, 0.22);
      }, 900)
    );

    scheduledTimeouts.push(
      window.setTimeout(() => {
        createBurst(width * 0.18, height * 0.55, 36, 5.2);
        createBurst(width * 0.82, height * 0.52, 36, 5.2);
      }, 1450)
    );

    scheduledTimeouts.push(
      window.setTimeout(() => {
        createBurst(width * 0.5, height * 0.35, 64, 7.2);
      }, 1950)
    );

    scheduledTimeouts.push(
      window.setTimeout(() => {
        createBurst(width * 0.3, height * 0.25, 42, 5.5);
        createBurst(width * 0.7, height * 0.28, 42, 5.5);
      }, 2400)
    );

    const render = () => {
      // Soft trail fade over transparent canvas
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      // Update rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.x += r.vx;
        r.y += r.vy;
        r.vy *= 0.985;

        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();

        if (r.y <= r.targetY || r.vy > -1.5) {
          createBurst(r.x, r.y, 48, 6.2);
          rockets.splice(i, 1);
        }
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 6) p.trail.shift();

        p.vx *= 0.965;
        p.vy *= 0.965;
        p.vy += 0.085; // Gravity pull
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0.02) {
          particles.splice(i, 1);
          continue;
        }

        const flicker = p.twinkle ? 0.55 + Math.random() * 0.45 : 1;
        const drawAlpha = Math.max(0, p.alpha * flicker);

        // Draw spark streak trail
        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let t = 1; t < p.trail.length; t++) {
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
          }
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = drawAlpha * 0.55;
          ctx.lineWidth = p.size * 0.8;
          ctx.stroke();
        }

        // Draw bright glowing spark head
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = drawAlpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scheduledTimeouts.forEach((id) => clearTimeout(id));
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 350);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="dejavu-splash-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 1.03 : 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#08080c] text-white select-none ${
          isExiting ? 'pointer-events-none' : ''
        }`}
        aria-label="Loading Deja Vu Restaurant BBQ and Grill"
      >
        {/* Warm Charcoal & Gold Radial Center Backdrop Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(201, 154, 44, 0.22) 0%, rgba(168, 122, 28, 0.08) 32%, rgba(8, 8, 12, 0.98) 72%)',
          }}
        />

        {/* Real-Time Canvas Celebration Fireworks Layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Expanding Golden Shockwave Rings Synced to Logo Bounce */}
        <motion.div
          initial={{ scale: 0.2, opacity: 0.9 }}
          animate={{ scale: 2.8, opacity: 0 }}
          transition={{ duration: 1.4, delay: 0.25, ease: 'easeOut' }}
          className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border-2 border-[#f0d06f]/70 pointer-events-none z-10"
        />
        <motion.div
          initial={{ scale: 0.2, opacity: 0.7 }}
          animate={{ scale: 3.4, opacity: 0 }}
          transition={{ duration: 1.7, delay: 0.45, ease: 'easeOut' }}
          className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-[#c99a2c]/50 pointer-events-none z-10"
        />

        {/* Central Luxury Crest & Bouncing Zoom-In Logo Animation */}
        <div className="relative z-20 flex flex-col items-center text-center px-6">
          
          {/* Rotating Dual Orbital Crest Rings + Bouncing Logo */}
          <div className="relative flex items-center justify-center mb-6 sm:mb-8">
            
            {/* Outer Dotted Golden Orbital Ring */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 0.85, rotate: 360 }}
              transition={{
                scale: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
                opacity: { duration: 0.5 },
                rotate: { duration: 14, repeat: Infinity, ease: 'linear' },
              }}
              className="absolute -inset-5 sm:-inset-6 rounded-full border border-dashed border-[#f0d06f]/55 pointer-events-none"
            />

            {/* Inner Glowing Halo Aura */}
            <motion.div
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.45, 0.85, 0.45],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -inset-2 rounded-full bg-linear-to-tr from-[#f0d06f]/30 via-[#c99a2c]/20 to-[#ff9f1c]/30 blur-xl pointer-events-none"
            />

            {/* Main Logo Container: Dramatic Zoom-In + Elastic Bouncing Celebration */}
            <motion.div
              initial={{ scale: 0.1, opacity: 0, rotate: -20, y: 24 }}
              animate={{
                scale: [0.1, 1.24, 0.9, 1.1, 0.97, 1],
                opacity: [0, 1, 1, 1, 1, 1],
                rotate: [-20, 6, -4, 2, -1, 0],
                y: [24, -14, 6, -5, 2, 0],
              }}
              transition={{
                duration: 1.15,
                times: [0, 0.42, 0.62, 0.78, 0.9, 1],
                ease: 'easeOut',
              }}
              className="relative"
            >
              {/* Subtle continuous celebratory hover bounce after landing */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  delay: 1.2,
                  duration: 1.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative w-32 h-32 sm:w-44 sm:h-44 rounded-full p-2 bg-linear-to-br from-[#f0d06f] via-[#c99a2c] to-[#7c560d] shadow-[0_0_55px_rgba(240,208,111,0.45)] overflow-hidden"
              >
                <div className="w-full h-full rounded-full bg-black p-2.5 sm:p-3 flex items-center justify-center relative overflow-hidden">
                  <img
                    src="/assets/aistudio/Deja_Vu_logo_03d51cef.png"
                    alt="Deja Vu Restaurant BBQ & Grill Logo"
                    className="w-full h-full object-contain drop-shadow-[0_0_16px_rgba(240,208,111,0.55)]"
                  />
                  {/* Metallic Light Sheen Sweep across Logo */}
                  <motion.div
                    initial={{ x: '-140%' }}
                    animate={{ x: '220%' }}
                    transition={{ delay: 0.75, duration: 1.1, ease: 'easeInOut' }}
                    className="absolute inset-y-0 w-1/2 -skew-x-25 bg-linear-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Restaurant Brand Wordmark Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.55, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-2"
          >
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-[0.28em] uppercase text-[#f0d06f]">
              <Flame className="w-3.5 h-3.5 text-[#f0d06f] fill-[#f0d06f]" />
              <span>Welcome To</span>
              <Flame className="w-3.5 h-3.5 text-[#f0d06f] fill-[#f0d06f]" />
            </div>

            <h1 className="font-serif-luxury font-extrabold text-3xl sm:text-5xl tracking-[0.14em] bg-linear-to-r from-[#fff3c4] via-[#f0d06f] to-[#c99a2c] bg-clip-text text-transparent drop-shadow-sm">
              D&Eacute;J&Agrave; VU
            </h1>

            <p className="text-xs sm:text-sm font-bold tracking-[0.32em] uppercase text-stone-300">
              Restaurant BBQ &amp; Grill
            </p>
            <p className="text-[11px] text-stone-400 tracking-wide pt-0.5">
              Gulistan-e-Johar, Karachi · Daily 11:00 AM &ndash; 2:00 AM
            </p>
          </motion.div>

          {/* Sleek Gold Loading Progress Strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-7 w-56 sm:w-64 space-y-2"
          >
            <div className="w-full h-1.5 rounded-full bg-stone-800/90 overflow-hidden border border-amber-500/20">
              <div
                className="h-full rounded-full bg-linear-to-r from-[#f0d06f] via-[#c99a2c] to-[#ff9f1c] transition-all duration-100 ease-out shadow-[0_0_12px_rgba(240,208,111,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] text-amber-200/80 font-medium tracking-wider tabular-nums">
              Igniting the Charcoal Grill... {Math.round(progress)}%
            </p>
          </motion.div>
        </div>

        {/* Skip Intro Button (Clean & Accessible >= 40px touch target) */}
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={handleSkip}
          className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900/85 hover:bg-stone-800 border border-amber-500/35 text-xs font-bold text-amber-200 hover:text-white backdrop-blur-md transition-all active:scale-95"
        >
          <span>Enter Restaurant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};
