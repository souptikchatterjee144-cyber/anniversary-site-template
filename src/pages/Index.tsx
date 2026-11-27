import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CountdownLockScreen } from "@/components/birthday/CountdownLockScreen";
import { LoveQuestionsSection } from "@/components/birthday/LoveQuestionsSection";
import { BigQuestion } from "@/components/birthday/BigQuestion";
import { BalloonsSection } from "@/components/birthday/BalloonsSection";
import { CakeSection } from "@/components/birthday/CakeSection";
import { PhotoPuzzleSequence } from "@/components/birthday/PhotoPuzzleSequence";
import { ScratchReveal } from "@/components/birthday/ScratchReveal";
import { FinalGallerySection } from "@/components/birthday/FinalGallerySection";
import { FinalLetterSection } from "@/components/birthday/FinalLetterSection";
import { GoodbyeScreen } from "@/components/birthday/GoodbyeScreen";
import { EmojiCursorTrail } from "@/components/birthday/EmojiCursorTrail";
import { useSoundManager } from "@/components/birthday/SoundManager";
import { Volume2, VolumeX } from "lucide-react";

export type AnniversaryPhase =
  | "countdown"
  | "loveqa"
  | "bigquestion"
  | "balloons"
  | "cake"
  | "puzzles"
  | "scratch"
  | "gallery"
  | "letter"
  | "goodbye";

import { RELATIONSHIP_CONFIG, PERSONALIZED } from "@/config/relationshipConfig";

// Developer / QA Test Mode helper: allows preview of all sections via ?devkey=SECRET_KEY
const checkQaMode = (): boolean => {
  if (typeof window === "undefined") return false;
  const secretKey = RELATIONSHIP_CONFIG.DEV_BYPASS_KEY;
  if (!secretKey || typeof secretKey !== "string" || secretKey.trim() === "") {
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  const providedKey = params.get("devkey") || params.get("key");

  if (providedKey && providedKey === secretKey.trim()) {
    console.warn(
      "⚠️ [DEV PREVIEW ACTIVE]: Lock screen countdown bypassed via secret developer key. Send the clean link (without ?devkey) to your partner!"
    );
    return true;
  }
  return false;
};

const Index = () => {
  const [phase, setPhase] = useState<AnniversaryPhase>(() =>
    checkQaMode() || RELATIONSHIP_CONFIG.TIMER_MODE === "disabled" ? "loveqa" : "countdown"
  );
  const [isMuted, setIsMuted] = useState(false);
  const { startMusic, toggleMute } = useSoundManager();
  const musicStartedRef = useRef(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = PERSONALIZED ? (RELATIONSHIP_CONFIG.SITE_TITLE || "Our Anniversary") : "Celebration by Souptik | Free Anniversary Website Maker";
    }
  }, []);

  const handleStartMusic = useCallback(() => {
    if (!musicStartedRef.current) {
      musicStartedRef.current = true;
      startMusic();
    }
  }, [startMusic]);

  const handleToggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleStartMusic();
    const muted = toggleMute();
    setIsMuted(muted);
  };

  const advanceFromCountdown = () => {
    handleStartMusic();
    setPhase("loveqa");
  };

  return (
    <main
      aria-label="Anniversary Celebration Experience"
      className="min-h-screen transition-colors duration-1000 relative overflow-hidden text-amber-50"
      style={{ background: "var(--bg-gradient, #150614)" }}
      onClick={handleStartMusic}
    >
      {/* Dreamy Ambient Bokeh Auras */}
      <div className="fixed top-[5%] left-[8%] w-[38rem] h-[38rem] rounded-full bg-[radial-gradient(circle,rgba(242,65,126,0.18)_0%,transparent_70%)] blur-[120px] pointer-events-none animate-subtle-float" />
      <div className="fixed top-[20%] right-[8%] w-[34rem] h-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,210,51,0.12)_0%,transparent_70%)] blur-[130px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-[10%] left-[25%] w-[42rem] h-[42rem] rounded-full bg-[radial-gradient(circle,rgba(142,73,206,0.16)_0%,transparent_70%)] blur-[140px] pointer-events-none" />

      {!PERSONALIZED && <header className="fixed top-3 left-3 z-[60] max-w-[75vw] rounded-xl bg-black/40 px-3 py-2 text-xs text-pink-100 backdrop-blur-md"><p className="font-semibold">Celebration by Souptik</p><a href="/create" className="underline text-pink-200">Free anniversary website maker</a><a href="/about.html" className="block text-pink-200 underline">Developer: Souptik Chatterjee</a></header>}

      {/* Floating Audio Mute / Unmute Button */}
      <button
        onClick={handleToggleAudio}
        aria-label={isMuted ? "Unmute sound" : "Mute sound"}
        className="fixed top-4 right-4 z-50 p-2.5 rounded-full bg-white/[0.07] hover:bg-white/[0.14] border border-pink-500/20 text-pink-200/80 hover:text-pink-100 backdrop-blur-xl transition-all shadow-lg cursor-pointer"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>

      {/* Lightweight ambient cursor trail */}
      <EmojiCursorTrail />

      {/* Vignette overlay */}
      <div className="vignette" />

      {/* 10-Phase Journey */}
      <AnimatePresence mode="wait">
        {phase === "countdown" && (
          <motion.div
            key="countdown"
            className="w-full min-h-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.7 }}
          >
            <CountdownLockScreen onStart={advanceFromCountdown} />
          </motion.div>
        )}

        {phase === "loveqa" && (
          <motion.div
            key="loveqa"
            className="w-full min-h-screen flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.6 }}
          >
            <LoveQuestionsSection onComplete={() => setPhase("bigquestion")} />
          </motion.div>
        )}

        {phase === "bigquestion" && (
          <motion.div
            key="bigquestion"
            className="w-full min-h-screen"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.6 }}
          >
            <BigQuestion onComplete={() => setPhase("balloons")} />
          </motion.div>
        )}

        {phase === "balloons" && (
          <motion.div
            key="balloons"
            className="w-full min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
          >
            <BalloonsSection onComplete={() => setPhase("cake")} />
          </motion.div>
        )}

        {phase === "cake" && (
          <motion.div
            key="cake"
            className="w-full min-h-screen"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            <CakeSection onComplete={() => setPhase("puzzles")} />
          </motion.div>
        )}

        {phase === "puzzles" && (
          <motion.div
            key="puzzles"
            className="w-full min-h-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            <PhotoPuzzleSequence onComplete={() => setPhase("scratch")} />
          </motion.div>
        )}

        {phase === "scratch" && (
          <motion.div
            key="scratch"
            className="w-full min-h-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            <ScratchReveal onComplete={() => setPhase("gallery")} />
          </motion.div>
        )}

        {phase === "gallery" && (
          <motion.div
            key="gallery"
            className="w-full min-h-screen"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            <FinalGallerySection onComplete={() => setPhase("letter")} />
          </motion.div>
        )}

        {phase === "letter" && (
          <motion.div
            key="letter"
            className="w-full min-h-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.7 }}
          >
            <FinalLetterSection onComplete={() => setPhase("goodbye")} />
          </motion.div>
        )}

        {phase === "goodbye" && (
          <motion.div
            key="goodbye"
            className="w-full min-h-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
          >
            <GoodbyeScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Index;
