import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TypeWriter } from "./TypeWriter";
import { Sparkles, ArrowRight, Wand2, Heart } from "lucide-react";
import { soundEffects } from "@/lib/soundEffects";

export interface PhotoPuzzleProps {
  imageSrc: string;
  loveLine: string;
  onComplete: () => void;
}

// Generate a valid solvable 3x3 sliding tile puzzle
function generateSolvableGrid(): number[] {
  // Numbers 0 to 7 representing tiles, 8 is the empty slot
  const tiles = [0, 1, 2, 3, 4, 5, 6, 7];

  // Perform Fisher-Yates shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }

  // Count inversions
  let inversions = 0;
  for (let i = 0; i < tiles.length - 1; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] > tiles[j]) {
        inversions++;
      }
    }
  }

  // If odd inversions, swap two adjacent elements to make it solvable
  if (inversions % 2 !== 0) {
    [tiles[0], tiles[1]] = [tiles[1], tiles[0]];
  }

  // Append empty tile (8) at the end
  if(tiles.every((tile,i)=>tile===i)) [tiles[0],tiles[1],tiles[2]]=[tiles[1],tiles[2],tiles[0]];
  return [...tiles, 8];
}

function isSolved(grid: number[]): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[i] !== i) return false;
  }
  return true;
}

export const PhotoPuzzle = ({ imageSrc, loveLine, onComplete }: PhotoPuzzleProps) => {
  const [grid, setGrid] = useState<number[]>(() => generateSolvableGrid());
  const [selected,setSelected]=useState<number|null>(null);
  const pointer=useRef<{index:number;x:number;y:number}|null>(null);
  const [solved, setSolved] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload the image once using Image() constructor — tiles show
  // the actual photo only after this confirms success
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);
    img.src = imageSrc;
  }, [imageSrc]);

  // Trigger victory sequence: warm golden pulsing glow for 1.5s, then start typewriter caption
  const triggerVictory = useCallback(() => {
    setSolved(true);
    setIsGlowing(true);

    setTimeout(() => {
      setIsGlowing(false);
    }, 1500);

    setTimeout(() => {
      setShowCaption(true);
    }, 1600);
  }, []);

  // Check victory
  const checkVictory = useCallback((newGrid: number[]) => {
    if (isSolved(newGrid)) {
      triggerVictory();
    }
  }, [triggerVictory]);

  const moveTile = (from:number,to:number) => {
    if(solved || from===to || grid[from]===8 || to<0 || to>8)return;
    const next=[...grid];
    const [tile]=next.splice(from,1);
    next.splice(to,0,tile);
    setGrid(next);
    setSelected(null);
    soundEffects.playClick();
    checkVictory(next);
  };
  const handleTileClick = (index:number) => {
    if(solved)return;
    if(selected===index){setSelected(null);return;}
    if(selected!==null){moveTile(selected,index);return;}
    if(grid[index]!==8)setSelected(index);
  };
  const handleAutoSolve = () => {
    soundEffects.playClick();
    const solvedGrid = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    setGrid(solvedGrid);
    triggerVictory();
  };

  const handleNext = () => {
    soundEffects.playClick();
    onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-4">
      {/* Puzzle Card Container */}
      <div
        className="w-full rounded-3xl p-4 sm:p-6 backdrop-blur-2xl border border-pink-500/20 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_30px_-5px_rgba(242,65,126,0.25)] relative"
        style={{
          background: "linear-gradient(145deg, rgba(46, 17, 34, 0.88) 0%, rgba(26, 8, 20, 0.98) 100%)",
        }}
      >
        {/* 3x3 Tile Grid with Warm Golden Pulsing Glow Effect on Completion */}
        <motion.div
          animate={
            isGlowing
              ? {
                  filter: [
                    "drop-shadow(0 0 0px rgba(251, 191, 36, 0))",
                    "drop-shadow(0 0 25px rgba(251, 191, 36, 0.9)) drop-shadow(0 0 50px rgba(245, 158, 11, 0.6))",
                    "drop-shadow(0 0 15px rgba(251, 191, 36, 0.5))",
                    "drop-shadow(0 0 30px rgba(251, 191, 36, 0.95)) drop-shadow(0 0 60px rgba(245, 158, 11, 0.7))",
                    "drop-shadow(0 0 0px rgba(251, 191, 36, 0))",
                  ],
                  scale: [1, 1.03, 1.015, 1.035, 1],
                }
              : {
                  filter: "drop-shadow(0 0 0px rgba(251, 191, 36, 0))",
                  scale: 1,
                }
          }
          transition={{
            duration: 1.5,
            ease: "easeInOut",
          }}
          className={`grid grid-cols-3 aspect-square w-full max-w-[320px] mx-auto rounded-2xl overflow-hidden bg-black/40 border ${
            solved
              ? isGlowing
                ? "border-amber-400 gap-0 shadow-[0_0_40px_rgba(251,191,36,0.5)]"
                : "border-pink-500/30 gap-0 shadow-[0_0_35px_rgba(242,65,126,0.3)]"
              : "border-pink-500/30 gap-1 p-1"
          }`}
        >
          {grid.map((tileValue, currentIndex) => {
            const isBlank = tileValue === 8 && !solved;
            const tileRow = Math.floor(tileValue / 3);
            const tileCol = tileValue % 3;

            return (
              <div
                key={`tile-${currentIndex}`}
                data-puzzle-index={currentIndex}
                role="button"
                tabIndex={solved?-1:0}
                aria-label={isBlank?"Empty slot":("Puzzle piece "+(tileValue+1))}
                aria-pressed={selected===currentIndex}
                onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();handleTileClick(currentIndex);}}}
                onPointerDown={e=>{if(solved||isBlank||e.button!==0)return;pointer.current={index:currentIndex,x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId);}}
                onPointerCancel={()=>{pointer.current=null;}}
                onPointerUp={e=>{const p=pointer.current;pointer.current=null;if(!p){handleTileClick(currentIndex);return;}if(Math.hypot(e.clientX-p.x,e.clientY-p.y)>8){const cell=document.elementFromPoint(e.clientX,e.clientY)?.closest("[data-puzzle-index]");if(cell){const to=Number(cell.getAttribute("data-puzzle-index"));if(Number.isInteger(to))moveTile(p.index,to);}return;}handleTileClick(currentIndex);}}
                className={`relative aspect-square overflow-hidden touch-none select-none ${
                  isBlank
                    ? "bg-black/30 border border-dashed border-pink-400/20 rounded-lg"
                    : "cursor-grab rounded-lg hover:brightness-110 shadow-sm active:cursor-grabbing"
                } ${solved ? "rounded-none" : ""} ${selected===currentIndex ? "ring-2 ring-inset ring-amber-300 brightness-110" : ""}`}
                style={
                  !isBlank
                    ? imageLoaded
                      ? {
                          backgroundImage: `url("${imageSrc}")`,
                          backgroundSize: "300% 300%",
                          backgroundPosition: `${tileCol * 50}% ${tileRow * 50}%`,
                        }
                      : {
                          background: "linear-gradient(135deg, #f2417e 0%, #8e49ce 100%)",
                        }
                    : undefined
                }
              >
                {!isBlank && !imageLoaded && (
                  <div className="w-full h-full flex items-center justify-center text-white/50 text-xs font-bold">
                    <Heart className="w-4 h-4 fill-white/40" />
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Action button if not solved */}
        {!solved && (
          <div className="mt-4 flex justify-between items-center px-1">
            <span
              className="text-xs text-pink-300/60 font-sans tracking-wide"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              Select a tile, then tap any slot, or drag and drop
            </span>
            <button
              onClick={handleAutoSolve}
              className="inline-flex items-center gap-1 text-xs text-amber-300/80 hover:text-amber-200 transition-colors cursor-pointer touch-manipulation"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Auto-solve</span>
            </button>
          </div>
        )}

        {/* Solved Caption Typewriter */}
        <AnimatePresence>
          {showCaption && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 text-center"
            >
              <div className="flex items-center justify-center gap-1.5 text-amber-300 mb-2">
                <Sparkles className="w-4 h-4" />
                <span
                  className="text-xs uppercase font-bold tracking-widest text-amber-200"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  Memory Unlocked
                </span>
                <Sparkles className="w-4 h-4" />
              </div>

              <div
                className="text-amber-50 text-base sm:text-lg font-medium leading-relaxed min-h-[60px] italic px-2 drop-shadow-sm"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <TypeWriter
                  text={loveLine}
                  speed={40}
                  delay={200}
                  onComplete={() => setTypingDone(true)}
                />
              </div>

              {/* Next Button */}
              {typingDone && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(242,65,126,0.6)" }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm sm:text-base shadow-lg cursor-pointer touch-manipulation"
                    style={{ fontFamily: "'Quicksand', sans-serif" }}
                  >
                    <span>Next Memory</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
