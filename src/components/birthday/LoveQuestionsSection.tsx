import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RELATIONSHIP_CONFIG } from "@/config/relationshipConfig";
import { LoveQuestion } from "./LoveQuestion";
import { ArrowRight, Heart, Sparkles } from "lucide-react";
import { soundEffects } from "@/lib/soundEffects";
import { useConfetti } from "./Confetti";

export interface LoveQuestionsSectionProps {
  onComplete: () => void;
}

export const LoveQuestionsSection = ({ onComplete }: LoveQuestionsSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const questions = RELATIONSHIP_CONFIG.LOVE_QUESTIONS;
  const { fireCinematicCelebration } = useConfetti();

  const handleResolved = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setAllDone(true);
      fireCinematicCelebration();
      soundEffects.playPartyPopperSound();
    }
  };

  const handleNext = () => {
    soundEffects.playClick();
    onComplete();
  };

  const currentQ = questions[currentIndex] || questions[0];

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 select-none relative z-30">
      {/* Background ambient lighting */}
      <div className="fixed top-[10%] right-[15%] w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(242,65,126,0.18)_0%,transparent_70%)] blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[10%] left-[10%] w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(142,73,206,0.18)_0%,transparent_70%)] blur-[120px] pointer-events-none" />

      {/* Header / Step Tracker */}
      <div className="mb-6 flex flex-col items-center relative z-10">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-pink-500/20 backdrop-blur-md mb-3 shadow-sm">
          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
          <span
            className="text-xs font-bold tracking-widest text-pink-200/90 uppercase"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            Love Trivia {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i < currentIndex
                  ? "w-6 bg-pink-500 shadow-[0_0_8px_rgba(242,65,126,0.6)]"
                  : i === currentIndex
                  ? "w-8 bg-amber-400 shadow-[0_0_10px_rgba(255,210,51,0.8)]"
                  : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Active Question */}
      <div className="w-full max-w-lg relative z-10">
        <AnimatePresence mode="wait">
          {!allDone ? (
            <div key={currentIndex}>
              <LoveQuestion
                questionIndex={currentIndex}
                question={currentQ.question}
                negativeOption={currentQ.negativeOption}
                positiveOption={currentQ.positiveOption}
                finalPositiveOptions={currentQ.finalPositiveOptions}
                onResolved={handleResolved}
              />
            </div>
          ) : (
            <motion.div
              key="completed-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl p-8 backdrop-blur-2xl border border-pink-500/30 text-center shadow-[0_0_40px_rgba(242,65,126,0.35)]"
              style={{
                background: "linear-gradient(145deg, rgba(46, 17, 34, 0.9) 0%, rgba(26, 8, 20, 0.98) 100%)",
              }}
            >
              <div className="inline-flex p-3 rounded-full bg-pink-500/20 text-pink-300 mb-4 border border-pink-500/30">
                <Sparkles className="w-8 h-8 text-amber-300 animate-spin" style={{ animationDuration: "8s" }} />
              </div>

              <h3
                className="text-2xl sm:text-3xl font-bold text-amber-50 mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                You passed with 100% Love! 💖
              </h3>

              <p
                className="text-pink-200/80 text-sm sm:text-base font-sans mb-8 leading-relaxed"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                Now that we know we're on the same page, there is one very important question left...
              </p>

              {/* Glowing Next Button */}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(242, 65, 126, 0.75)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-base sm:text-lg shadow-[0_8px_30px_rgba(242,65,126,0.5)] border border-pink-300/30 transition-all cursor-pointer"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                <span>Continue to The Big Question</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
