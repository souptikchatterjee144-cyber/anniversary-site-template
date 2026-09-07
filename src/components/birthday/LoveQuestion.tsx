import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { soundEffects } from "@/lib/soundEffects";

export interface LoveQuestionProps {
  questionIndex?: number;
  question: string;
  negativeOption: string;
  positiveOption: string;
  finalPositiveOptions: [string, string];
  onResolved: () => void;
}

export const LoveQuestion = ({
  question,
  negativeOption,
  positiveOption,
  finalPositiveOptions,
  onResolved,
}: LoveQuestionProps) => {
  const [attempt, setAttempt] = useState<1 | 2 | 3>(1);
  const [overlayText, setOverlayText] = useState<string | null>(null);
  const [resolved, setResolved] = useState(false);
  const [heartPop, setHeartPop] = useState(false);

  const handlePositiveTap = () => {
    if (resolved) return;
    soundEffects.playHappyTone();
    setResolved(true);
    setHeartPop(true);
    setTimeout(() => {
      onResolved();
    }, 700);
  };

  const handleNegativeTap = () => {
    if (resolved || overlayText) return;

    soundEffects.playSadTone();

    if (attempt === 1) {
      setOverlayText("Think again 😏");
      setTimeout(() => {
        setOverlayText(null);
        setAttempt(2);
      }, 1100);
    } else if (attempt === 2) {
      setOverlayText("Last chance! 😜");
      setTimeout(() => {
        setOverlayText(null);
        setAttempt(3);
      }, 1100);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto px-2 sm:px-4">
      {/* Question Card Container */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -15 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative rounded-3xl p-6 sm:p-8 backdrop-blur-2xl border border-pink-500/20 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_30px_-5px_rgba(242,65,126,0.3)] overflow-hidden flex flex-col justify-between"
        style={{
          background: "linear-gradient(145deg, rgba(46, 17, 34, 0.9) 0%, rgba(26, 8, 20, 0.98) 100%)",
        }}
      >
        {/* Decorative corner sparkles */}
        <Sparkles className="w-5 h-5 text-amber-300/60 absolute top-4 right-4 animate-pulse pointer-events-none" />
        <Heart className="w-4 h-4 text-pink-400/30 absolute top-5 left-5 pointer-events-none" />

        {/* Question Title */}
        <h2
          className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-amber-50 leading-snug drop-shadow-md mb-6 pt-1 px-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {question}
        </h2>

        {/* Option Buttons Container */}
        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4 relative z-10 w-full mt-2">
          {attempt < 3 ? (
            <>
              {/* Negative Choice */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNegativeTap}
                className="w-full sm:flex-1 py-3.5 sm:py-4 px-4 rounded-xl border border-pink-400/25 bg-white/[0.04] hover:bg-white/[0.1] active:bg-white/[0.15] text-pink-200 hover:text-white font-semibold text-sm sm:text-base transition-all duration-200 focus:outline-none cursor-pointer touch-manipulation min-h-[48px] flex items-center justify-center text-center shadow-sm"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                <span>{negativeOption}</span>
              </motion.button>

              {/* Positive Choice */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(242, 65, 126, 0.6)" }}
                whileTap={{ scale: 0.96 }}
                onClick={handlePositiveTap}
                className="w-full sm:flex-1 py-3.5 sm:py-4 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-[0_4px_20px_rgba(242,65,126,0.45)] transition-all duration-200 focus:outline-none cursor-pointer touch-manipulation min-h-[48px] flex items-center justify-center text-center"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                <span>{positiveOption}</span>
              </motion.button>
            </>
          ) : (
            <>
              {/* Final positive 1 */}
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(242, 65, 126, 0.6)" }}
                whileTap={{ scale: 0.96 }}
                onClick={handlePositiveTap}
                className="w-full sm:flex-1 py-3.5 sm:py-4 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm sm:text-base shadow-[0_4px_20px_rgba(242,65,126,0.45)] transition-all cursor-pointer touch-manipulation min-h-[48px] flex items-center justify-center text-center"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                <span>{finalPositiveOptions[0]}</span>
              </motion.button>

              {/* Final positive 2 */}
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(142, 73, 206, 0.6)" }}
                whileTap={{ scale: 0.96 }}
                onClick={handlePositiveTap}
                className="w-full sm:flex-1 py-3.5 sm:py-4 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm sm:text-base shadow-[0_4px_20px_rgba(142,73,206,0.45)] transition-all cursor-pointer touch-manipulation min-h-[48px] flex items-center justify-center text-center"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                <span>{finalPositiveOptions[1]}</span>
              </motion.button>
            </>
          )}
        </div>

        {/* Heart Pop Animation */}
        <AnimatePresence>
          {heartPop && (
            <motion.div
              initial={{ scale: 0, opacity: 1, y: 0 }}
              animate={{ scale: 2.8, opacity: 0, y: -60 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
            >
              <Heart className="w-16 h-16 text-pink-400 fill-pink-400 drop-shadow-[0_0_20px_rgba(242,65,126,0.8)]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Playful Overlay ("Think again", "Last chance") */}
        <AnimatePresence>
          {overlayText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-6 z-20 text-center"
            >
              <span
                className="text-2xl sm:text-3xl font-bold text-amber-200 drop-shadow-[0_0_15px_rgba(255,210,51,0.6)]"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {overlayText}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
