import { useState } from "react";
import { motion } from "framer-motion";
import { RELATIONSHIP_CONFIG } from "@/config/relationshipConfig";
import { Heart, Sparkles, ArrowRight, Camera } from "lucide-react";
import { soundEffects } from "@/lib/soundEffects";

export interface FinalGallerySectionProps {
  onComplete: () => void;
}

export const FinalGallerySection = ({ onComplete }: FinalGallerySectionProps) => {
  const gallery = RELATIONSHIP_CONFIG.FINAL_GALLERY;
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setBrokenImages((prev) => ({ ...prev, [index]: true }));
  };

  const handleNext = () => {
    soundEffects.playClick();
    onComplete();
  };

  const captions = gallery.captions || gallery.loveLines;

  return (
    <div className="relative min-h-screen z-20 py-12 px-4 flex flex-col items-center overflow-y-auto">
      {/* Background Ambience */}
      <div className="fixed top-[10%] left-[10%] w-[36rem] h-[36rem] rounded-full bg-[radial-gradient(circle,rgba(242,65,126,0.14)_0%,transparent_70%)] blur-[130px] pointer-events-none" />
      <div className="fixed bottom-[10%] right-[10%] w-[36rem] h-[36rem] rounded-full bg-[radial-gradient(circle,rgba(142,73,206,0.14)_0%,transparent_70%)] blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-pink-500/20 backdrop-blur-md mb-3">
          <Camera className="w-4 h-4 text-pink-400" />
          <span
            className="text-xs font-bold tracking-widest text-pink-200/90 uppercase"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            Memories & Moments
          </span>
        </div>

        <h1
          className="text-3xl sm:text-5xl font-bold text-amber-50 drop-shadow-md mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Our Story in Frames
        </h1>

        <p
          className="text-pink-200/70 text-sm sm:text-base font-sans"
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        >
          Every glance, every laughter, every second spent with you
        </p>
      </div>

      {/* Gallery Wall Grid */}
      <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
        {gallery.photos.map((photoSrc, photoIdx) => {
          if (!photoSrc) return null;
          const isBroken = brokenImages[photoIdx];
          const isSpecial = photoIdx === 2; // gallery-3.jpg is special
          const caption = captions[photoIdx] || "";
          const rotation = isSpecial
            ? "rotate-0"
            : photoIdx % 2 === 0
            ? "-rotate-1 sm:-rotate-2"
            : "rotate-1 sm:rotate-2";

          return (
            <motion.div
              key={photoIdx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (photoIdx % 2) * 0.15 }}
              whileHover={{ scale: isSpecial ? 1.02 : 1.03, rotate: 0 }}
              onClick={() => soundEffects.playClick()}
              className={`bg-white p-4 sm:p-5 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] transform ${rotation} transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isSpecial
                  ? "sm:col-span-2 max-w-xl mx-auto w-full ring-2 ring-amber-300/60 shadow-[0_20px_50px_rgba(242,65,126,0.35),0_0_30px_rgba(251,191,36,0.25)] bg-gradient-to-b from-amber-50/95 via-white to-pink-50/90"
                  : ""
              }`}
            >
              {isSpecial && (
                <div className="flex items-center justify-center gap-1.5 mb-3 text-amber-700/90 font-bold text-xs uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span style={{ fontFamily: "'Quicksand', sans-serif" }}>
                    Our Very First Photo ✨
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </div>
              )}

              {/* Photo Image */}
              <div
                className={`w-full rounded-xl overflow-hidden bg-zinc-900 relative shadow-inner ${
                  isSpecial ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-[4/5] sm:aspect-square"
                }`}
              >
                {!isBroken ? (
                  <img
                    src={photoSrc}
                    alt={`Memory ${photoIdx + 1}`}
                    className="w-full h-full object-cover"
                    loading={photoIdx < 2 ? "eager" : "lazy"}
                    decoding="async"
                    onError={() => handleImageError(photoIdx)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-500/80 via-purple-600/80 to-rose-500/80 flex flex-col items-center justify-center p-4 text-center">
                    <Heart className="w-10 h-10 text-white/80 fill-white/50 mb-2 animate-pulse" />
                    <span className="text-white font-bold text-sm tracking-wide">
                      Cherished Moment {photoIdx + 1}
                    </span>
                  </div>
                )}
              </div>

              {/* Caption Area */}
              <div className="mt-4 flex flex-col items-center">
                <p
                  className={`leading-relaxed text-center ${
                    isSpecial
                      ? "text-base sm:text-lg md:text-xl text-zinc-900 font-semibold italic whitespace-pre-line px-2 drop-shadow-sm"
                      : "text-sm sm:text-base text-zinc-800 font-medium italic px-1"
                  }`}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  "{caption}"
                </p>

                <div className="mt-3 w-full flex justify-between items-center px-1 pt-2 border-t border-zinc-200/60">
                  <span
                    className="text-[11px] font-semibold text-zinc-400 tracking-wider"
                    style={{ fontFamily: "'Quicksand', sans-serif" }}
                  >
                    Memory #{photoIdx + 1}
                  </span>
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isSpecial
                        ? "text-amber-500 fill-amber-500/80 animate-pulse"
                        : "text-pink-500 fill-pink-500/60"
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Advance to Letter Button */}
      <div className="sticky bottom-6 z-40 mt-16 mb-4">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(242,65,126,0.7)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="flex items-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-base sm:text-lg shadow-[0_8px_30px_rgba(242,65,126,0.5)] border border-pink-300/30 cursor-pointer backdrop-blur-xl"
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        >
          <Sparkles className="w-5 h-5 text-amber-200 animate-spin" style={{ animationDuration: "5s" }} />
          <span>One Last Letter For You 💌</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};
