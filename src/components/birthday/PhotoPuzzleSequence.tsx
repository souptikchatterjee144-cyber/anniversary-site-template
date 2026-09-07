import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { RELATIONSHIP_CONFIG } from "@/config/relationshipConfig";
import { PhotoPuzzle } from "./PhotoPuzzle";
import { Puzzle, Sparkles } from "lucide-react";

export interface PhotoPuzzleSequenceProps {
  onComplete: () => void;
}

export const PhotoPuzzleSequence = ({ onComplete }: PhotoPuzzleSequenceProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const puzzles = RELATIONSHIP_CONFIG.PUZZLE_PHOTOS;

  const handlePuzzleComplete = () => {
    if (currentIndex < puzzles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const current = puzzles[currentIndex];

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center p-4 select-none overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[10%] right-[10%] w-[32rem] h-[32rem] rounded-full bg-[radial-gradient(circle,rgba(242,65,126,0.18)_0%,transparent_70%)] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[32rem] h-[32rem] rounded-full bg-[radial-gradient(circle,rgba(142,73,206,0.18)_0%,transparent_70%)] blur-[120px] pointer-events-none" />

      {/* Header Tracker */}
      <div className="mb-4 flex flex-col items-center">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-pink-500/20 backdrop-blur-md mb-2">
          <Puzzle className="w-3.5 h-3.5 text-amber-300" />
          <span
            className="text-xs font-bold tracking-widest text-amber-200 uppercase"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            Piece by Piece {currentIndex + 1} of {puzzles.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-1.5">
          {puzzles.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= currentIndex
                  ? "w-8 bg-gradient-to-r from-pink-500 to-amber-400 shadow-[0_0_8px_rgba(242,65,126,0.5)]"
                  : "w-3 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Active Puzzle */}
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <div key={currentIndex}>
            <PhotoPuzzle
              imageSrc={current.src}
              loveLine={current.loveLine}
              onComplete={handlePuzzleComplete}
            />
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};
