import { useState } from "react";
import { motion } from "framer-motion";
import { CakeCutting } from "./CakeCutting";
import { ArrowRight, Sparkles } from "lucide-react";
import { soundEffects } from "@/lib/soundEffects";

export interface CakeSectionProps {
  onComplete: () => void;
}

export const CakeSection = ({ onComplete }: CakeSectionProps) => {
  const [readyForNext, setReadyForNext] = useState(false);

  const handleNext = () => {
    soundEffects.playClick();
    onComplete();
  };

  return (
    <div className="relative min-h-screen z-20 py-12 px-4 flex flex-col items-center justify-between overflow-y-auto">
      {/* Background Ambience */}
      <div className="fixed top-[15%] right-[10%] w-[32rem] h-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,210,51,0.12)_0%,transparent_70%)] blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[10%] left-[10%] w-[32rem] h-[32rem] rounded-full bg-[radial-gradient(circle,rgba(242,65,126,0.15)_0%,transparent_70%)] blur-[120px] pointer-events-none" />

      {/* Main Cake Cutting Component */}
      <div className="w-full max-w-6xl my-auto">
        <CakeCutting />
      </div>

      {/* Floating or Bottom Next Button to Advance to Puzzles */}
      <div className="sticky bottom-6 z-40 mt-8 mb-4">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(242,65,126,0.6)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-sm sm:text-base shadow-[0_6px_25px_rgba(242,65,126,0.4)] border border-pink-300/30 backdrop-blur-xl cursor-pointer"
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        >
          <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: "6s" }} />
          <span>Next: Our Memory Puzzle 🧩</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
