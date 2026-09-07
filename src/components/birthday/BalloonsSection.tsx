import { useEffect } from "react";
import { motion } from "framer-motion";
import { Balloons } from "./Balloons";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import { soundEffects } from "@/lib/soundEffects";

export interface BalloonsSectionProps {
  onComplete: () => void;
}

export const BalloonsSection = ({ onComplete }: BalloonsSectionProps) => {
  // Auto-advance after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 5200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleNext = () => {
    soundEffects.playClick();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[10%] left-[20%] w-[36rem] h-[36rem] rounded-full bg-[radial-gradient(circle,rgba(242,65,126,0.22)_0%,transparent_70%)] blur-[120px] pointer-events-none animate-pulse" />

      {/* Fullscreen Floating Balloons Animation */}
      <Balloons count={24} />

      {/* Floating Center Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 text-center px-6 py-8 max-w-lg mx-4 rounded-3xl bg-white/[0.04] backdrop-blur-xl border border-pink-500/20 shadow-[0_0_50px_rgba(242,65,126,0.3)]"
      >
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-400/30">
          <Heart className="w-7 h-7 text-pink-400 fill-pink-400 animate-pulse" />
        </div>

        <h2
          className="text-2xl sm:text-4xl font-bold text-amber-50 mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          She said YES! 💖
        </h2>

        <p
          className="text-pink-200/80 text-sm sm:text-base font-sans leading-relaxed mb-6"
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        >
          Let the sweet celebration begin! Making a wish together...
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs uppercase tracking-widest transition-all cursor-pointer"
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        >
          <span>Jump to Cake</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
};
