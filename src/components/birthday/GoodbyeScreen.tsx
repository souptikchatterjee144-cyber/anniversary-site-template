import { motion } from "framer-motion";
import { RELATIONSHIP_CONFIG } from "@/config/relationshipConfig";
import { Heart, Sparkles, Stars } from "lucide-react";

export const GoodbyeScreen = () => {
  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[20%] left-[20%] w-[36rem] h-[36rem] rounded-full bg-[radial-gradient(circle,rgba(242,65,126,0.18)_0%,transparent_70%)] blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] right-[20%] w-[36rem] h-[36rem] rounded-full bg-[radial-gradient(circle,rgba(255,210,51,0.15)_0%,transparent_70%)] blur-[120px] pointer-events-none" />

      {/* Floating gentle particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-400/25"
            style={{
              left: `${8 + i * 9}%`,
              bottom: "-10%",
            }}
            animate={{
              y: ["0vh", "-120vh"],
              rotate: [0, 360],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 10 + (i % 4) * 3,
              repeat: Infinity,
              delay: i * 0.9,
              ease: "linear",
            }}
          >
            <Heart className="w-6 h-6 fill-current" />
          </motion.div>
        ))}
      </div>

      {/* Center Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 max-w-xl p-8 sm:p-12 rounded-3xl backdrop-blur-2xl border border-pink-500/20 shadow-[0_15px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(242,65,126,0.2)]"
        style={{
          background: "linear-gradient(145deg, rgba(46, 17, 34, 0.85) 0%, rgba(26, 8, 20, 0.95) 100%)",
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-tr from-pink-500/30 to-purple-500/30 border border-pink-400/40 flex items-center justify-center shadow-[0_0_25px_rgba(242,65,126,0.4)]"
        >
          <Heart className="w-8 h-8 text-pink-400 fill-pink-400/70" />
        </motion.div>

        <h1
          className="text-2xl sm:text-4xl md:text-5xl font-bold text-amber-50 leading-relaxed mb-6 drop-shadow-md"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {RELATIONSHIP_CONFIG.GOODBYE_MESSAGE}
        </h1>

        <div className="flex items-center justify-center gap-2 text-pink-300/70 text-sm font-sans tracking-widest uppercase">
          <Stars className="w-4 h-4 text-amber-300" />
          <span style={{ fontFamily: "'Quicksand', sans-serif" }}>Happy Anniversary, My Love</span>
          <Stars className="w-4 h-4 text-amber-300" />
        </div>
      </motion.div>
    </div>
  );
};
