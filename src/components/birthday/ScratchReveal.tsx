import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RELATIONSHIP_CONFIG } from "@/config/relationshipConfig";
import { TypeWriter } from "./TypeWriter";
import { Sparkles, ArrowRight, Wand2, Heart } from "lucide-react";
import { soundEffects } from "@/lib/soundEffects";

export interface ScratchRevealProps {
  onComplete: () => void;
}

export const ScratchReveal = ({ onComplete }: ScratchRevealProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isScratching, setIsScratching] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

  const scratchData = RELATIONSHIP_CONFIG.SCRATCH_PHOTO;

  // Initialize and paint metallic gold overlay on canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.offsetWidth || 300;
    const height = canvas.offsetHeight || 300;
    canvas.width = width;
    canvas.height = height;

    // Draw metallic gradient background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#e8a838");
    grad.addColorStop(0.3, "#ffd255");
    grad.addColorStop(0.5, "#d48f28");
    grad.addColorStop(0.7, "#f5be42");
    grad.addColorStop(1, "#c27c1b");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add subtle sparkle pattern
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    for (let i = 0; i < 45; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 2.5 + 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw label
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = 8;
    ctx.font = "bold 20px 'Quicksand', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch Here ✨", width / 2, height / 2);
  }, []);

  useEffect(() => {
    initCanvas();
    const handleResize = () => {
      if (!revealed) initCanvas();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initCanvas, revealed]);

  // Check how much of canvas has been erased
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      let transparentCount = 0;
      const totalPixels = pixels.length / 4;

      // Sample every 4th pixel for high performance
      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] < 128) {
          transparentCount++;
        }
      }

      const percentage = transparentCount / (totalPixels / 4);
      if (percentage >= 0.55) {
        setRevealed(true);
      }
    } catch {
      // Fallback
    }
  }, [revealed]);

  const scratchCountRef = useRef(0);

  const scratchAtCoordinates = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.fill();

    scratchCountRef.current++;
    if (scratchCountRef.current % 8 === 0) {
      checkScratchPercentage();
    }
  };

  // Pointer Events (Mouse, Touch, Stylus unified)
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsScratching(true);
    scratchAtCoordinates(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isScratching) return;
    scratchAtCoordinates(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    setIsScratching(false);
    checkScratchPercentage();
  };

  // Explicit Touch Events for older WebKit / mobile fallbacks
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches && e.touches.length > 0) {
      scratchAtCoordinates(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleAutoReveal = () => {
    soundEffects.playClick();
    setRevealed(true);
  };

  const handleNext = () => {
    soundEffects.playClick();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center p-4 select-none overflow-y-auto">
      {/* Ambience */}
      <div className="absolute top-[15%] left-[15%] w-[32rem] h-[32rem] rounded-full bg-[radial-gradient(circle,rgba(255,210,51,0.18)_0%,transparent_70%)] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[15%] w-[32rem] h-[32rem] rounded-full bg-[radial-gradient(circle,rgba(242,65,126,0.18)_0%,transparent_70%)] blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-3xl p-5 sm:p-7 backdrop-blur-2xl border border-pink-500/20 shadow-[0_12px_40px_rgba(0,0,0,0.5),0_0_35px_rgba(255,210,51,0.2)] text-center relative"
        style={{
          background: "linear-gradient(145deg, rgba(46, 17, 34, 0.9) 0%, rgba(26, 8, 20, 0.98) 100%)",
        }}
      >
        <div className="flex items-center justify-center gap-1.5 text-amber-300 mb-4">
          <Sparkles className="w-4 h-4" />
          <span
            className="text-xs uppercase font-bold tracking-widest text-amber-200"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            Special Surprise Card
          </span>
          <Sparkles className="w-4 h-4" />
        </div>

        {/* Scratch Area Frame */}
        <div
          ref={containerRef}
          className="relative aspect-square w-full max-w-[280px] sm:max-w-[300px] mx-auto rounded-2xl overflow-hidden shadow-inner border border-pink-500/30 bg-black/40"
        >
          {/* Photo Underneath */}
          {imageLoaded ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url("${scratchData.src}")`,
              }}
            >
              <img
                src={scratchData.src}
                alt=""
                className="hidden"
                decoding="async"
                onError={() => setImageLoaded(false)}
              />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/80 via-purple-600/80 to-rose-500/80 flex flex-col items-center justify-center p-4 text-center">
              <Heart className="w-12 h-12 text-white/90 fill-white/60 mb-2 animate-pulse" />
              <span className="text-white font-bold text-sm tracking-wide">
                Special Uncovered Memory
              </span>
            </div>
          )}

          {/* Scratch Canvas Overlay */}
          {!revealed && (
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onTouchMove={handleTouchMove}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none transition-opacity duration-500"
              style={{ touchAction: "none" }}
            />
          )}
        </div>

        {!revealed && (
          <div className="mt-3 flex justify-between items-center px-2">
            <span
              className="text-xs text-pink-300/60 font-sans tracking-wide"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              Swipe or drag to reveal photo
            </span>
            <button
              onClick={handleAutoReveal}
              className="inline-flex items-center gap-1 text-xs text-amber-300/80 hover:text-amber-200 transition-colors cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Reveal Magic</span>
            </button>
          </div>
        )}

        {/* Revealed Typewriter Love Line */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 text-center"
            >
              <div
                className="text-amber-50 text-sm sm:text-base font-medium leading-relaxed min-h-[70px] italic px-2 drop-shadow-sm"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <TypeWriter
                  text={scratchData.loveLine}
                  speed={35}
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
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm sm:text-base shadow-lg cursor-pointer touch-manipulation"
                    style={{ fontFamily: "'Quicksand', sans-serif" }}
                  >
                    <span>Our Gallery of Moments</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
