import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RELATIONSHIP_CONFIG } from "@/config/relationshipConfig";
import { useConfetti } from "./Confetti";
import { Heart, Sparkles } from "lucide-react";
import { soundEffects } from "@/lib/soundEffects";

export interface BigQuestionProps {
  onComplete: () => void;
}

export const BigQuestion = ({ onComplete }: BigQuestionProps) => {
  const [noTapCount, setNoTapCount] = useState(0);
  const [resolved, setResolved] = useState(false);
  const [noPosition, setNoPosition] = useState<{ x: number; y: number } | null>(null);
  const [shake, setShake] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);

  const { fireCinematicCelebration, fireCannon, fireStars } = useConfetti();

  // Calculate safe random coordinates for the dodging No button accounting for mobile viewports & safe areas
  const getSafeRandomPosition = useCallback(() => {
    if (typeof window === "undefined") return { x: 0, y: 0 };
    const width = window.innerWidth;
    const height = window.innerHeight;

    const buttonWidth = 140;
    const buttonHeight = 52;
    
    // Generous safe-area padding for mobile notches, status bars, and navigation bars
    const safePaddingX = 24;
    const safePaddingTop = Math.max(90, Math.floor(height * 0.12));
    const safePaddingBottom = Math.max(100, Math.floor(height * 0.14));

    const minX = safePaddingX;
    const maxX = Math.max(minX, width - buttonWidth - safePaddingX);
    const minY = safePaddingTop;
    const maxY = Math.max(minY, height - buttonHeight - safePaddingBottom);

    let x = Math.floor(Math.random() * (maxX - minX)) + minX;
    let y = Math.floor(Math.random() * (maxY - minY)) + minY;

    // Ensure safe clearance from Yes button center
    if (yesButtonRef.current) {
      const rect = yesButtonRef.current.getBoundingClientRect();
      const yesCenterX = rect.left + rect.width / 2;
      const yesCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(x + buttonWidth / 2 - yesCenterX, y + buttonHeight / 2 - yesCenterY);

      if (dist < 150) {
        x = x < yesCenterX ? Math.max(minX, x - 110) : Math.min(maxX, x + 110);
        y = y < yesCenterY ? Math.max(minY, y - 110) : Math.min(maxY, y + 110);
      }
    }

    return { x, y };
  }, []);

  const handleNoTap = () => {
    if (resolved) return;
    soundEffects.playClick();

    const nextCount = noTapCount + 1;
    setNoTapCount(nextCount);

    if (nextCount === 1) {
      // Tap 1: Shake in place
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } else if (nextCount < 5) {
      // Taps 2-4: Teleport and shrink
      setNoPosition(getSafeRandomPosition());
    }
  };

  // Re-clamp position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (noPosition) {
        setNoPosition(getSafeRandomPosition());
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [noPosition, getSafeRandomPosition]);

  const handleYesTap = () => {
    if (resolved) return;
    soundEffects.playClick();
    soundEffects.playPartyPopperSound();
    setResolved(true);

    // Fire big celebratory confetti
    fireCinematicCelebration();
    fireCannon();
    fireStars();

    // Advance to balloons section after celebration
    setTimeout(() => {
      onComplete();
    }, 1800);
  };

  // Scale of No button shrinks at each tap: 1.0 -> 0.85 -> 0.70 -> 0.55 -> 0
  const noScale = Math.max(0.5, 1 - (noTapCount - 1) * 0.15);
  const isNoGone = noTapCount >= 5;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center p-4 select-none overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-[20%] left-[10%] w-[32rem] h-[32rem] rounded-full bg-[radial-gradient(circle,rgba(242,65,126,0.2)_0%,transparent_70%)] blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-[32rem] h-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,210,51,0.15)_0%,transparent_70%)] blur-[120px] pointer-events-none" />

      {/* Floating background hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-400/20"
            style={{
              left: `${10 + i * 12}%`,
              bottom: "-10%",
            }}
            animate={{
              y: ["0vh", "-120vh"],
              rotate: [0, 360],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 8 + (i % 4) * 2,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "linear",
            }}
          >
            <Heart className="w-8 h-8 fill-current" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-xl text-center px-4"
      >
        {/* Decorative Subtitle */}
        <p
          className="text-amber-200/80 text-xl sm:text-2xl mb-2 font-medium"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          You already know the answer...
        </p>

        {/* Big Question Heading */}
        <h1
          className="text-2xl sm:text-4xl md:text-5xl font-bold text-amber-50 drop-shadow-[0_4px_20px_rgba(242,65,126,0.4)] leading-tight mb-12"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {RELATIONSHIP_CONFIG.BIG_QUESTION_TEXT}{" "}
          <span className="inline-block animate-bounce drop-shadow-[0_0_15px_rgba(255,210,51,0.8)]">
            💍
          </span>
        </h1>

        {/* Buttons Area */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 min-h-[90px] relative">
          {/* YES Button */}
          <motion.button
            ref={yesButtonRef}
            layout
            onClick={handleYesTap}
            whileHover={{ scale: isNoGone ? 1.05 : 1.08 }}
            whileTap={{ scale: 0.95 }}
            animate={
              isNoGone
                ? {
                    width: "min(90vw, 420px)",
                    height: "76px",
                    fontSize: "1.4rem",
                    boxShadow: [
                      "0 0 30px rgba(242,65,126,0.6)",
                      "0 0 60px rgba(242,65,126,0.9)",
                      "0 0 30px rgba(242,65,126,0.6)",
                    ],
                  }
                : {
                    boxShadow: [
                      "0 0 20px rgba(242,65,126,0.4)",
                      "0 0 35px rgba(242,65,126,0.7)",
                      "0 0 20px rgba(242,65,126,0.4)",
                    ],
                  }
            }
            transition={{
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              layout: { duration: 0.5, ease: "easeOut" },
            }}
            className={`flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold tracking-wide shadow-2xl cursor-pointer border border-pink-300/40 z-20 touch-manipulation ${
              isNoGone
                ? "px-8 py-5"
                : "px-10 py-4 text-lg min-w-[170px]"
            }`}
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            <Sparkles className="w-5 h-5 text-amber-200 animate-spin" style={{ animationDuration: "5s" }} />
            <span>{isNoGone ? "YES! FOREVER YES! 💖" : "YES! 💖"}</span>
            <Sparkles className="w-5 h-5 text-amber-200 animate-spin" style={{ animationDuration: "5s" }} />
          </motion.button>

          {/* NO Button (Dodging / Shrinking) */}
          <AnimatePresence>
            {!isNoGone && (
              <motion.button
                layout
                onClick={handleNoTap}
                onMouseEnter={() => {
                  // Only dodge on hover if on a mouse/hover device to prevent premature dodge on touch screens
                  if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
                    if (noTapCount >= 1) {
                      setNoPosition(getSafeRandomPosition());
                    }
                  }
                }}
                animate={
                  noPosition
                    ? {
                        position: "fixed",
                        left: `${noPosition.x}px`,
                        top: `${noPosition.y}px`,
                        scale: noScale,
                      }
                    : shake
                    ? { x: [0, -12, 12, -12, 12, 0], scale: 1 }
                    : { scale: 1 }
                }
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                }}
                className="px-8 py-3.5 rounded-full border border-pink-400/30 bg-white/[0.04] text-pink-200/70 hover:text-pink-100 font-semibold text-base backdrop-blur-md transition-colors z-20 min-w-[140px] touch-manipulation cursor-pointer"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                No 🙈
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Playful hint text if she tried tapping No */}
        {noTapCount > 0 && !isNoGone && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs sm:text-sm text-pink-300/60 mt-6 italic"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            {noTapCount === 1 && "Hey! That button seems stuck..."}
            {noTapCount === 2 && "Where are you clicking? 😉"}
            {noTapCount === 3 && "Running away from destiny, are we?"}
            {noTapCount === 4 && "Almost out of escapes..."}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};
