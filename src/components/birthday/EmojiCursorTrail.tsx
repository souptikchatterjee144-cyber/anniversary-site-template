import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getTemplateEmojiKit, pickTemplateEmoji } from "@/config/emojiKits";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useIsMobile } from "@/hooks/use-mobile";

interface TrailParticle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  drift: number;
  rise: number;
  rotate: number;
  duration: number;
  scaleStart?: number;
}

const MAX_PARTICLES_DESKTOP = 18;
const MAX_PARTICLES_MOBILE = 10;

const MIN_DISTANCE_DESKTOP = 15;
const MIN_DISTANCE_MOBILE = 12;

const MIN_DELAY_DESKTOP = 30;
const MIN_DELAY_MOBILE = 32;

const TAP_BURST_COUNT = 5;

export const EmojiCursorTrail = () => {
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();
  const [particles, setParticles] = useState<TrailParticle[]>([]);
  const config = useBirthdayStore((state) => state.config);
  const kit = useMemo(() => getTemplateEmojiKit(config), [config]);

  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef<{
    x: number;
    y: number;
  } | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastEmitRef = useRef<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const cleanupTimersRef = useRef<number[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (reduceMotion || typeof window === "undefined") return undefined;

    const maxParticles = isMobile ? MAX_PARTICLES_MOBILE : MAX_PARTICLES_DESKTOP;
    const minDistance = isMobile ? MIN_DISTANCE_MOBILE : MIN_DISTANCE_DESKTOP;
    const minDelay = isMobile ? MIN_DELAY_MOBILE : MIN_DELAY_DESKTOP;

    // Check if touch/mouse is over interactive UI
    const isOverInteractiveElement = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof HTMLElement)) return false;
      return Boolean(
        target.closest(
          "button, canvas, input, textarea, a, [role='button'], [draggable='true'], .cursor-grab, .cursor-grabbing, [data-interactive='true']"
        )
      );
    };

    // 1. Single Continuous Trail Particle Emission (Drag / Move)
    const emitTrailParticle = () => {
      rafRef.current = null;
      const pointer = pointerRef.current;
      if (!pointer) return;

      const now = performance.now();
      const last = lastEmitRef.current;
      const distance = last
        ? Math.hypot(pointer.x - last.x, pointer.y - last.y)
        : Number.POSITIVE_INFINITY;

      if (last && (distance < minDistance || now - last.time < minDelay)) {
        return;
      }

      lastEmitRef.current = { x: pointer.x, y: pointer.y, time: now };

      const particle: TrailParticle = {
        id: idRef.current++,
        emoji: pickTemplateEmoji(kit.cursor),
        x: pointer.x,
        y: pointer.y,
        size: isMobile ? 18 + Math.random() * 6 : 20 + Math.random() * 12,
        drift: (Math.random() - 0.5) * (isMobile ? 36 : 56),
        rise: isMobile ? 38 + Math.random() * 32 : 56 + Math.random() * 48,
        rotate: (Math.random() - 0.5) * 70,
        duration: isMobile ? 0.6 : 0.85,
        scaleStart: 0.4,
      };

      setParticles((current) => [...current.slice(-(maxParticles - 1)), particle]);

      const timer = window.setTimeout(() => {
        setParticles((current) => current.filter((item) => item.id !== particle.id));
        cleanupTimersRef.current = cleanupTimersRef.current.filter((id) => id !== timer);
      }, particle.duration * 1000 + 60);

      cleanupTimersRef.current.push(timer);
    };

    // 2. Radial Fountain Burst Emission (Tap)
    const emitTapBurst = (originX: number, originY: number) => {
      const burstParticles: TrailParticle[] = [];
      const count = isMobile ? TAP_BURST_COUNT : TAP_BURST_COUNT + 1;

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * (Math.PI * 2) + (Math.random() - 0.5) * 0.4;
        const radius = isMobile ? 28 + Math.random() * 32 : 36 + Math.random() * 44;
        const driftX = Math.cos(angle) * radius;
        const riseY = -Math.sin(angle) * radius + (isMobile ? 24 : 36);

        burstParticles.push({
          id: idRef.current++,
          emoji: pickTemplateEmoji(kit.cursor),
          x: originX,
          y: originY,
          size: isMobile ? 18 + Math.random() * 6 : 22 + Math.random() * 8,
          drift: driftX,
          rise: riseY,
          rotate: (Math.random() - 0.5) * 90,
          duration: isMobile ? 0.65 : 0.8,
          scaleStart: 0.25,
        });
      }

      setParticles((current) => [...current.slice(-(maxParticles - burstParticles.length)), ...burstParticles]);

      const timer = window.setTimeout(() => {
        const idsToRemove = new Set(burstParticles.map((p) => p.id));
        setParticles((current) => current.filter((item) => !idsToRemove.has(item.id)));
        cleanupTimersRef.current = cleanupTimersRef.current.filter((id) => id !== timer);
      }, 750);

      cleanupTimersRef.current.push(timer);
    };

    // Desktop Mouse Handlers
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return; // Touch handled by touch events
      if (isOverInteractiveElement(event.target)) return;

      pointerRef.current = { x: event.clientX, y: event.clientY };
      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(emitTrailParticle);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (isOverInteractiveElement(event.target)) return;
      emitTapBurst(event.clientX, event.clientY);
    };

    // Mobile Touch Handlers
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 0) return;
      if (isOverInteractiveElement(event.target)) return;

      const touch = event.touches[0];
      touchStartPosRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: performance.now(),
      };
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 0) return;
      if (isOverInteractiveElement(event.target)) return;

      const touch = event.touches[0];
      pointerRef.current = { x: touch.clientX, y: touch.clientY };

      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(emitTrailParticle);
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!touchStartPosRef.current) return;

      const start = touchStartPosRef.current;
      const now = performance.now();
      const elapsed = now - start.time;

      // If finger lifted quickly with minimal movement (<14px in <300ms) -> Tap Burst!
      const currentPointer = pointerRef.current || start;
      const distance = Math.hypot(currentPointer.x - start.x, currentPointer.y - start.y);

      if (elapsed < 300 && distance < 14) {
        if (!isOverInteractiveElement(event.target)) {
          emitTapBurst(start.x, start.y);
        }
      }

      touchStartPosRef.current = null;
      pointerRef.current = null;
      lastEmitRef.current = null;
    };

    const handlePointerLeave = () => {
      pointerRef.current = null;
      lastEmitRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      cleanupTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      cleanupTimersRef.current = [];
    };
  }, [isMobile, kit.cursor, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[90] overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 0,
              scale: particle.scaleStart || 0.4,
              rotate: 0,
            }}
            animate={{
              x: particle.x + particle.drift,
              y: particle.y - particle.rise,
              opacity: [0, 0.95, 0],
              scale: [particle.scaleStart || 0.4, 1.1, 0.7],
              rotate: particle.rotate,
            }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: particle.duration, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-0 select-none will-change-transform"
            style={{
              fontSize: particle.size,
              transform: "translate3d(0,0,0)",
              filter: isMobile ? undefined : "drop-shadow(0 6px 12px rgba(0,0,0,0.2))",
            }}
          >
            {particle.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
};
