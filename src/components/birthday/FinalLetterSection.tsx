import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { RELATIONSHIP_CONFIG } from "@/config/relationshipConfig";
import { TypeWriter } from "./TypeWriter";
import { Heart, Sparkles, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { soundEffects } from "@/lib/soundEffects";

export interface FinalLetterSectionProps {
  onComplete: () => void;
}

type LetterStage = "envelope" | "scroll" | "unrolled";

export const FinalLetterSection = ({ onComplete }: FinalLetterSectionProps) => {
  const isMobile = useIsMobile();
  const [stage, setStage] = useState<LetterStage>("envelope");
  const [isFlapOpen, setIsFlapOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isUntying, setIsUntying] = useState(false);
  const [activeParagraphIdx, setActiveParagraphIdx] = useState(0);
  const [allTypingDone, setAllTypingDone] = useState(false);

  // Motion values for drag interactions
  const sealDragY = useMotionValue(0);
  const flapRotateX = useTransform(sealDragY, [-85, 0], [180, 0]);
  const interiorDepthOpacity = useTransform(sealDragY, [-85, 0], [0.75, 0]);

  const scrollDragY = useMotionValue(0);
  const knotDragY = useMotionValue(0);
  const ribbonStretchY = useTransform(knotDragY, [0, 80], [1, 1.35]);

  const letter = RELATIONSHIP_CONFIG.FINAL_LETTER;
  const paragraphs = letter.paragraphs;

  // Step 1: Drag Heart Seal to open flap in 3D
  const handleSealDragEnd = (_: any, info: { offset: { y: number } }) => {
    if (info.offset.y <= -50) {
      soundEffects.playClick();
      animate(sealDragY, -85, { duration: 0.25 });
      setIsFlapOpen(true);
    } else {
      animate(sealDragY, 0, { type: "spring", stiffness: 350, damping: 25 });
    }
  };

  // Step 2: Drag scroll out of envelope pocket (fully manual)
  const handleScrollDragEnd = (_: any, info: { offset: { y: number } }) => {
    if (info.offset.y <= -95) {
      soundEffects.playClick();
      setIsExtracting(true);
      setTimeout(() => {
        setStage("scroll");
        setIsExtracting(false);
      }, 350);
    }
  };

  // Step 3: Drag ribbon knot downward to untie
  const handleKnotDragEnd = (_: any, info: { offset: { y: number } }) => {
    if (info.offset.y >= 45) {
      soundEffects.playClick();
      setIsUntying(true);
      setTimeout(() => {
        setStage("unrolled");
      }, 600);
    } else {
      animate(knotDragY, 0, { type: "spring", stiffness: 350, damping: 25 });
    }
  };

  const handleParagraphComplete = (idx: number) => {
    if (idx < paragraphs.length - 1) {
      setTimeout(() => {
        setActiveParagraphIdx((prev) => prev + 1);
      }, 350);
    } else {
      setAllTypingDone(true);
    }
  };

  return (
    <div className="relative min-h-screen z-30 py-12 px-4 flex flex-col items-center justify-center select-none overflow-y-auto">
      {/* Background Ambience */}
      <div className={`fixed top-[15%] left-[20%] ${isMobile ? "w-64 h-64 blur-3xl opacity-20" : "w-[36rem] h-[36rem] blur-[130px]"} rounded-full bg-[radial-gradient(circle,rgba(242,65,126,0.18)_0%,transparent_70%)] pointer-events-none`} />
      <div className={`fixed bottom-[15%] right-[20%] ${isMobile ? "w-64 h-64 blur-3xl opacity-15" : "w-[36rem] h-[36rem] blur-[130px]"} rounded-full bg-[radial-gradient(circle,rgba(255,210,51,0.14)_0%,transparent_70%)] pointer-events-none`} />

      <AnimatePresence mode="wait">
        {/* ========================================================================= */}
        {/* STAGE 0: Realistic Ivory Envelope with Drag-to-Peel Seal & Drag-Out Scroll */}
        {/* ========================================================================= */}
        {stage === "envelope" && (
          <motion.div
            key="envelope-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center max-w-sm sm:max-w-md w-full my-auto [perspective:1200px]"
          >
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-pink-500/20 backdrop-blur-md mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span
                className="text-xs font-bold tracking-widest text-pink-200/90 uppercase"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                A Special Sealed Keepsake
              </span>
            </div>

            {/* Realistic Ivory Envelope Container */}
            <div className="relative w-80 sm:w-96 h-52 sm:h-60 select-none [perspective:1200px]">
              {/* Drop Shadow beneath Envelope */}
              <div className="absolute -bottom-4 inset-x-4 h-8 bg-black/50 blur-xl rounded-full pointer-events-none" />

              {/* Envelope Back Pocket */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden border border-[#d6c7b2]"
                style={{
                  background: "linear-gradient(180deg, #ede4d6 0%, #e2d6c2 100%)",
                  boxShadow: "0 20px 45px rgba(0,0,0,0.5), inset 0 2px 10px rgba(0,0,0,0.15)",
                }}
              >
                {/* Dark Inner Depth Revealed when Flap Opens */}
                <motion.div
                  style={{ opacity: isFlapOpen ? 0.75 : interiorDepthOpacity }}
                  className="absolute inset-0 bg-gradient-to-b from-[#2a1a10]/80 via-[#3d2719]/40 to-transparent pointer-events-none"
                />
              </div>

              {/* =============================================================== */}
              {/* PEEKING ROLLED SCROLL (Manual Drag-Out upward)                  */}
              {/* =============================================================== */}
              <AnimatePresence>
                {isFlapOpen && (
                  <motion.div
                    key="peeking-scroll"
                    initial={{ y: 15, opacity: 0 }}
                    animate={
                      isExtracting
                        ? { y: -160, opacity: 1, scale: 1.05 }
                        : { y: -45, opacity: 1 }
                    }
                    exit={{ opacity: 0 }}
                    transition={{ duration: isExtracting ? 0.35 : 0.4, ease: "easeOut" }}
                    drag={isExtracting ? false : "y"}
                    dragConstraints={{ top: -140, bottom: 0 }}
                    dragElastic={0.12}
                    style={{ y: scrollDragY }}
                    onDragEnd={handleScrollDragEnd}
                    className="absolute inset-x-6 top-3 h-24 z-10 cursor-grab active:cursor-grabbing flex flex-col items-center justify-start"
                  >
                    {/* Top Cylinder Portion Peeking Out */}
                    <div
                      className="w-full h-16 rounded-xl relative overflow-hidden shadow-lg border border-[#c4b098]"
                      style={{
                        background:
                          "linear-gradient(180deg, #cbb49e 0%, #fffdfa 32%, #fcf6eb 60%, #ded0bd 100%)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.35), inset 0 2px 4px rgba(255,255,255,0.8)",
                      }}
                    >
                      {/* Ribbon segment visible on peeking scroll */}
                      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 bg-gradient-to-r from-rose-800 via-rose-600 to-rose-800 border-x border-amber-300/40 shadow-sm flex items-center justify-center">
                        <Heart className="w-3.5 h-3.5 text-amber-100 fill-amber-100 opacity-90" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Envelope Front Pocket (Lower Triangular & Fold Texture) */}
              <div
                className="absolute inset-x-0 bottom-0 h-44 z-20 rounded-b-2xl pointer-events-none overflow-hidden"
                style={{
                  background:
                    "linear-gradient(180deg, #fdfaf4 0%, #f7f0e3 60%, #eee4d4 100%)",
                  boxShadow: "0 -4px 15px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.8)",
                  borderBottom: "1px solid #d5c5b0",
                  borderLeft: "1px solid #e0d2c0",
                  borderRight: "1px solid #e0d2c0",
                }}
              >
                <div
                  className="absolute inset-0 bg-[#f4ebd9] opacity-40"
                  style={{ clipPath: "polygon(0 0, 0 100%, 50% 50%)" }}
                />
                <div
                  className="absolute inset-0 bg-[#f4ebd9] opacity-40"
                  style={{ clipPath: "polygon(100% 0, 100% 100%, 50% 50%)" }}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#ebdcc7] to-transparent opacity-60"
                  style={{ clipPath: "polygon(0 100%, 100% 100%, 50% 45%)" }}
                />
              </div>

              {/* =============================================================== */}
              {/* ENVELOPE TOP FLAP (3D Perspective Peel Open driven by Drag)      */}
              {/* =============================================================== */}
              <motion.div
                style={{
                  rotateX: isFlapOpen ? 180 : flapRotateX,
                  transformOrigin: "top",
                  transformStyle: "preserve-3d",
                  zIndex: isFlapOpen ? 0 : 30,
                }}
                className={`absolute top-0 inset-x-0 h-32 ${
                  isFlapOpen ? "pointer-events-none" : ""
                }`}
              >
                {/* Triangular Flap Body */}
                <div
                  className="w-full h-full shadow-md"
                  style={{
                    background:
                      "linear-gradient(180deg, #f7efe2 0%, #ede2d1 70%, #dfd1bd 100%)",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    borderTop: "1px solid rgba(255,255,255,0.8)",
                  }}
                />

                {/* Wax Heart Seal (Static on hover, DRAG HANDLE to peel flap open) */}
                {!isFlapOpen && (
                  <motion.div
                    drag="y"
                    dragConstraints={{ top: -90, bottom: 0 }}
                    dragElastic={0.1}
                    style={{ y: sealDragY }}
                    onDragEnd={handleSealDragEnd}
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-rose-700 via-rose-500 to-amber-500 shadow-[0_4px_16px_rgba(242,65,126,0.7)] border-2 border-amber-200 flex items-center justify-center cursor-grab active:cursor-grabbing"
                  >
                    <Heart className="w-7 h-7 text-amber-100 fill-amber-100/95" />
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Instruction Labels */}
            <div className="mt-8">
              {!isFlapOpen ? (
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.08] border border-pink-400/30 text-amber-200 text-sm font-semibold tracking-wide backdrop-blur-md shadow-lg">
                  <ArrowUp className="w-4 h-4 text-amber-300 animate-bounce" />
                  <span>Drag heart seal up to peel open 💌</span>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-200 text-sm font-bold tracking-wide shadow-md"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  <ArrowUp className="w-4 h-4 text-amber-300 animate-bounce" />
                  <span>Drag scroll up to pull out 📜</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 1: Realistic 3D Cylindrical Scroll with DRAG-TO-UNTIE Knot          */}
        {/* ========================================================================= */}
        {stage === "scroll" && (
          <motion.div
            key="rolled-scroll"
            initial={{ opacity: 0, y: 70, scale: 0.85, rotateX: 30 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(6px)" }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="flex flex-col items-center justify-center text-center max-w-md w-full my-auto [perspective:1000px]"
          >
            <p
              className="text-pink-200/90 text-xs sm:text-sm uppercase tracking-widest font-bold mb-8 flex items-center gap-2"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>A Handwritten Letter for You</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </p>

            {/* 3D Rolled Cylinder Container */}
            <div
              className="relative w-80 sm:w-96 h-28 sm:h-32 flex items-center justify-center select-none"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Soft Drop Shadow under Cylinder */}
              <div className="absolute -bottom-5 w-[85%] h-8 rounded-full bg-black/60 blur-lg pointer-events-none transform rotateX-60" />

              {/* Left End-Cap Face (Spiral Cross-Section) */}
              <div
                className="absolute -left-3.5 z-20 w-8 sm:w-9 h-full rounded-[50%] flex items-center justify-center shadow-lg"
                style={{
                  background:
                    "radial-gradient(ellipse at center, #785a3c 0%, #b89f82 35%, #ecdcc8 65%, #fffef8 90%, #a48668 100%)",
                  boxShadow:
                    "inset 0 0 8px rgba(0,0,0,0.6), -4px 0 10px rgba(0,0,0,0.4)",
                  border: "1px solid rgba(160, 130, 100, 0.6)",
                }}
              >
                <div className="w-5 h-5 rounded-full border border-[#806140] opacity-60 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4a3420] opacity-80" />
                </div>
              </div>

              {/* 3D Cylinder Body with Curved Surface Shading */}
              <div
                className="w-full h-full rounded-lg relative overflow-hidden flex items-center justify-between"
                style={{
                  background:
                    "linear-gradient(180deg, #cbb49e 0%, #e6d8c7 12%, #fffdfa 32%, #fcf6eb 55%, #e2d2be 82%, #9f8266 100%)",
                  boxShadow:
                    "0 15px 35px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -3px 6px rgba(0,0,0,0.3)",
                  borderTop: "1px solid rgba(255,255,255,0.8)",
                  borderBottom: "1px solid rgba(130,105,80,0.7)",
                }}
              >
                {/* Specular Ridge Highlight */}
                <div className="absolute top-[28%] inset-x-0 h-4 bg-gradient-to-b from-white/60 via-white/20 to-transparent pointer-events-none" />

                {/* Horizontal Texture Creases */}
                <div className="absolute inset-y-0 inset-x-8 flex flex-col justify-around py-4 opacity-15 pointer-events-none">
                  <div className="h-[1px] bg-[#664b30] w-full" />
                  <div className="h-[1px] bg-[#664b30] w-full" />
                  <div className="h-[1px] bg-[#664b30] w-full" />
                </div>
              </div>

              {/* Right End-Cap Face (Spiral Cross-Section) */}
              <div
                className="absolute -right-3.5 z-10 w-8 sm:w-9 h-full rounded-[50%] flex items-center justify-center shadow-lg"
                style={{
                  background:
                    "radial-gradient(ellipse at center, #6b4d32 0%, #9e8568 35%, #decbb4 65%, #fffdf7 90%, #856a50 100%)",
                  boxShadow:
                    "inset 0 0 8px rgba(0,0,0,0.7), 4px 0 10px rgba(0,0,0,0.4)",
                  border: "1px solid rgba(160, 130, 100, 0.6)",
                }}
              >
                <div className="w-5 h-5 rounded-full border border-[#6b4d32] opacity-60 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3b2716] opacity-80" />
                </div>
              </div>

              {/* 3D Wrapped Red Velvet Ribbon with Drag Knot */}
              <AnimatePresence>
                {!isUntying ? (
                  <motion.div
                    key="wrapped-ribbon"
                    initial={{ opacity: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 1.35,
                      y: 35,
                      rotate: 15,
                      transition: { duration: 0.5, ease: "easeIn" },
                    }}
                    className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
                  >
                    {/* Ribbon Vertical Band */}
                    <motion.div
                      style={{ scaleY: ribbonStretchY }}
                      className="w-14 sm:w-16 h-full relative flex items-center justify-center"
                    >
                      <div
                        className="w-full h-full"
                        style={{
                          background:
                            "linear-gradient(180deg, #700c22 0%, #9f1239 15%, #e11d48 35%, #be123c 60%, #881337 85%, #580618 100%)",
                          boxShadow:
                            "0 0 16px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.5), -4px 0 8px rgba(0,0,0,0.3), 4px 0 8px rgba(0,0,0,0.3)",
                          borderLeft: "1px solid rgba(253, 224, 71, 0.6)",
                          borderRight: "1px solid rgba(253, 224, 71, 0.6)",
                        }}
                      >
                        <div className="absolute inset-y-0 left-1.5 w-[1px] bg-amber-200/50" />
                        <div className="absolute inset-y-0 right-1.5 w-[1px] bg-amber-200/50" />
                      </div>

                      {/* 3D Medallion Knot (DRAGGABLE HANDLE to untie) */}
                      <motion.div
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 90 }}
                        dragElastic={0.15}
                        style={{ y: knotDragY }}
                        onDragEnd={handleKnotDragEnd}
                        className="absolute z-40 w-12 h-12 rounded-full bg-gradient-to-tr from-rose-700 via-rose-500 to-amber-500 border-2 border-amber-200/90 shadow-[0_6px_20px_rgba(0,0,0,0.7),0_0_15px_rgba(242,65,126,0.6)] flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto"
                      >
                        <Heart className="w-5 h-5 text-amber-100 fill-amber-100 drop-shadow-sm" />
                      </motion.div>

                      {/* Bow Tails */}
                      <div
                        className="absolute -bottom-4 left-1 w-5 h-8 bg-gradient-to-b from-rose-600 via-rose-700 to-rose-900 transform -rotate-15 shadow-md border-r border-amber-300/40"
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)" }}
                      />
                      <div
                        className="absolute -bottom-4 right-1 w-5 h-8 bg-gradient-to-b from-rose-600 via-rose-700 to-rose-900 transform rotate-15 shadow-md border-l border-amber-300/40"
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)" }}
                      />
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 1, scale: 0.6 }}
                    animate={{ opacity: 0, scale: 2.2 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
                  >
                    <Sparkles className="w-16 h-16 text-amber-300 drop-shadow-[0_0_20px_rgba(255,210,51,0.9)]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Drag Knot Hint */}
            <div className="mt-10 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-pink-500/20 border border-pink-400/30 text-amber-200 text-sm font-semibold tracking-wide shadow-md">
              <ArrowDown className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>Drag ribbon knot down to untie 🎀</span>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: Unrolled Deckled Paper with Persistent Idle Tension Curl Memory   */}
        {/* ========================================================================= */}
        {stage === "unrolled" && (
          <motion.div
            key="unrolled-letter"
            initial={{
              opacity: 0,
              scaleY: 0.12,
              scaleX: 0.75,
              rotateX: 55,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scaleY: [0.12, 0.45, 0.85, 1.03, 1],
              scaleX: [0.75, 0.9, 0.98, 1.01, 1],
              rotateX: [55, 25, -8, 3, 0],
              y: [40, 20, 0, -4, 0],
            }}
            transition={{
              duration: 0.95,
              times: [0, 0.35, 0.65, 0.85, 1],
              ease: "easeInOut",
            }}
            className="w-full max-w-2xl relative my-8 origin-top [perspective:1000px]"
          >
            {/* Physical Paper Sheet with Subtle Idle Tension Breathing */}
            <motion.div
              animate={{
                rotateX: [-0.6, 0.6, -0.6],
                scaleY: [1, 0.997, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative p-7 sm:p-12 overflow-hidden transform -rotate-1 sm:-rotate-[1.2deg]"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 45%, #fffdf8 35%, #faf2e4 70%, #eddac1 100%)",
                backgroundImage:
                  "radial-gradient(#ded2c1 1.2px, transparent 1.2px), radial-gradient(ellipse at 50% 45%, #fffdf8 35%, #faf2e4 70%, #eddac1 100%)",
                backgroundSize: "22px 22px, 100% 100%",
                borderRadius: "32px 10px 28px 14px / 16px 30px 18px 26px",
                boxShadow:
                  "0 25px 60px rgba(0,0,0,0.65), 0 8px 24px rgba(46,17,34,0.35), inset 0 0 50px rgba(180, 140, 90, 0.22)",
                border: "1px solid rgba(210, 190, 162, 0.9)",
              }}
            >
              {/* Organic Wavy / Deckled Top Border with Idle Edge Curl Oscillation */}
              <motion.div
                animate={{
                  y: [-1, 1, -1],
                  opacity: [0.45, 0.6, 0.45],
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-0 right-0 h-2.5 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%, transparent 55%, rgba(190, 165, 135, 0.85) 100%) repeat-x",
                  backgroundSize: "14px 7px",
                }}
              />

              {/* Watermark Heart Stamp in Corner */}
              <div className="absolute top-6 right-6 opacity-15 pointer-events-none">
                <Heart className="w-14 h-14 text-rose-900 fill-rose-900" />
              </div>

              {/* Sparkle Pin Accent */}
              <Sparkles className="w-4 h-4 text-amber-700/30 absolute top-6 left-6 pointer-events-none" />

              {/* ================================================================= */}
              {/* PRONOUNCED PAPER CURL MEMORY WAVES (6 Horizontal Undulation Bands) */}
              {/* ================================================================= */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.6 }}
                className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between py-8 px-1"
              >
                {/* 1. Top tight curl memory crease */}
                <div
                  className="w-full h-4 opacity-40"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(70,40,15,0.25) 0%, rgba(70,40,15,0.06) 45%, rgba(255,255,255,0.7) 70%, transparent 100%)",
                    borderRadius: "50% / 5px",
                  }}
                />

                {/* 2. Upper secondary curl wave */}
                <div
                  className="w-full h-3.5 opacity-30"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(70,40,15,0.18) 0%, rgba(70,40,15,0.04) 45%, rgba(255,255,255,0.6) 70%, transparent 100%)",
                    borderRadius: "50% / 4px",
                  }}
                />

                {/* 3. Mid-upper wave */}
                <div
                  className="w-full h-3 opacity-25"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(70,40,15,0.15) 0%, rgba(70,40,15,0.03) 45%, rgba(255,255,255,0.5) 70%, transparent 100%)",
                    borderRadius: "50% / 3px",
                  }}
                />

                {/* 4. Mid-lower wave */}
                <div
                  className="w-full h-3 opacity-25"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(70,40,15,0.15) 0%, rgba(70,40,15,0.03) 45%, rgba(255,255,255,0.5) 70%, transparent 100%)",
                    borderRadius: "50% / 3px",
                  }}
                />

                {/* 5. Lower secondary curl wave */}
                <div
                  className="w-full h-3.5 opacity-30"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(70,40,15,0.18) 0%, rgba(70,40,15,0.04) 45%, rgba(255,255,255,0.6) 70%, transparent 100%)",
                    borderRadius: "50% / 4px",
                  }}
                />

                {/* 6. Bottom tight curl memory crease */}
                <div
                  className="w-full h-4 opacity-40"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(70,40,15,0.25) 0%, rgba(70,40,15,0.06) 45%, rgba(255,255,255,0.7) 70%, transparent 100%)",
                    borderRadius: "50% / 5px",
                  }}
                />
              </motion.div>

              {/* Letter Content Container */}
              <div className="space-y-4 sm:space-y-6 pt-2 relative z-10">
                {paragraphs.map((p, idx) => {
                  if (idx > activeParagraphIdx) return null;

                  const isGreeting = idx === 0;
                  const isSignature = idx >= paragraphs.length - 2;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className={`leading-[1.8] ${
                        isGreeting
                          ? "text-2xl sm:text-3xl font-bold text-[#320d20] mb-3 tracking-wide drop-shadow-sm"
                          : isSignature
                          ? "text-right text-xl sm:text-2xl font-bold text-[#3a0d24] mt-6 tracking-wide"
                          : "text-xl sm:text-2xl font-semibold text-[#260a18] tracking-wide"
                      }`}
                      style={{
                        fontFamily: isGreeting || isSignature ? "'Playfair Display', serif" : "'Caveat', cursive",
                      }}
                    >
                      {idx === activeParagraphIdx ? (
                        <TypeWriter
                          text={p}
                          speed={28}
                          delay={idx === 0 ? 300 : 100}
                          onComplete={() => handleParagraphComplete(idx)}
                        />
                      ) : (
                        <span>{p}</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Organic Wavy / Deckled Bottom Border with Idle Curl Oscillation */}
              <motion.div
                animate={{
                  y: [1, -1, 1],
                  opacity: [0.45, 0.6, 0.45],
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-0 right-0 h-2.5 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 100%, transparent 55%, rgba(190, 165, 135, 0.85) 100%) repeat-x",
                  backgroundSize: "14px 7px",
                }}
              />
            </motion.div>

            {/* Advance to Goodbye Button */}
            {allTypingDone && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-10 text-center relative z-10"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(242,65,126,0.75)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    soundEffects.playClick();
                    onComplete();
                  }}
                  className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-base sm:text-lg shadow-[0_8px_30px_rgba(242,65,126,0.5)] border border-pink-300/30 cursor-pointer transition-all"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  <Sparkles className="w-5 h-5 text-amber-200 animate-spin" style={{ animationDuration: "6s" }} />
                  <span>Always & Forever</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
