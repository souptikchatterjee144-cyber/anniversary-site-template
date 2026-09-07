import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { RELATIONSHIP_CONFIG } from "@/config/relationshipConfig";
import { Sparkles, Heart } from "lucide-react";

interface CountdownLockScreenProps {
  onStart: () => void;
}

interface TimeRemaining {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

function calculateTimeRemaining(targetDate: Date): TimeRemaining {
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }

  // Calculate calendar breakdown
  let years = targetDate.getFullYear() - now.getFullYear();
  let months = targetDate.getMonth() - now.getMonth();
  let days = targetDate.getDate() - now.getDate();
  let hours = targetDate.getHours() - now.getHours();
  let minutes = targetDate.getMinutes() - now.getMinutes();
  let seconds = targetDate.getSeconds() - now.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    // Borrow days from previous month
    const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    days += prevMonthLastDay;
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }
  if (years < 0) {
    years = 0;
  }

  return { years, months, days, hours, minutes, seconds, totalMs: diffMs };
}

function calculateTestTimeRemaining(targetEndMs: number): TimeRemaining {
  const diffMs = targetEndMs - Date.now();
  if (diffMs <= 0) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
  }
  const totalSec = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return { years: 0, months: 0, days, hours, minutes, seconds, totalMs: diffMs };
}

const pad = (n: number) => String(Math.max(0, n)).padStart(2, "0");

export const CountdownLockScreen = ({ onStart }: CountdownLockScreenProps) => {
  const mode = RELATIONSHIP_CONFIG.TIMER_MODE || "real";
  const [testEndTime] = useState<number>(() =>
    Date.now() + (RELATIONSHIP_CONFIG.TEST_DURATION_SECONDS || 30) * 1000
  );

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() => {
    if (mode === "disabled") {
      return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 };
    }
    if (mode === "test") {
      return calculateTestTimeRemaining(Date.now() + (RELATIONSHIP_CONFIG.TEST_DURATION_SECONDS || 30) * 1000);
    }
    return calculateTimeRemaining(RELATIONSHIP_CONFIG.REVEAL_AT);
  });

  const [opening, setOpening] = useState(false);

  const triggerReveal = useCallback(() => {
    if (opening) return;
    setOpening(true);
    setTimeout(() => {
      onStart();
    }, 700);
  }, [opening, onStart]);

  useEffect(() => {
    // 1. If mode is "disabled", bypass immediately
    if (mode === "disabled") {
      onStart();
      return;
    }

    // 2. If mode is "test", count down from test duration
    if (mode === "test") {
      const remaining = calculateTestTimeRemaining(testEndTime);
      if (remaining.totalMs <= 0) {
        triggerReveal();
        return;
      }
      const timer = setInterval(() => {
        const current = calculateTestTimeRemaining(testEndTime);
        setTimeLeft(current);
        if (current.totalMs <= 0) {
          clearInterval(timer);
          triggerReveal();
        }
      }, 1000);
      return () => clearInterval(timer);
    }

    // 3. Real mode: check if target date has already passed on mount
    const initial = calculateTimeRemaining(RELATIONSHIP_CONFIG.REVEAL_AT);
    if (initial.totalMs <= 0) {
      onStart();
      return;
    }

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining(RELATIONSHIP_CONFIG.REVEAL_AT);
      setTimeLeft(remaining);
      if (remaining.totalMs <= 0) {
        clearInterval(timer);
        triggerReveal();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, testEndTime, triggerReveal, onStart]);

  const units = [
    { label: "Years", value: pad(timeLeft.years) },
    { label: "Months", value: pad(timeLeft.months) },
    { label: "Days", value: pad(timeLeft.days) },
    { label: "Hours", value: pad(timeLeft.hours) },
    { label: "Mins", value: pad(timeLeft.minutes) },
    { label: "Secs", value: pad(timeLeft.seconds) },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-700 ${
        opening ? "opacity-0 scale-105 filter blur-sm" : "opacity-100 scale-100"
      }`}
      style={{
        background: "var(--bg-gradient, radial-gradient(ellipse at 50% 20%, #3b0724 0%, #150614 100%))",
      }}
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-[15%] left-[10%] w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(242,65,126,0.25)_0%,transparent_70%)] blur-[90px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] right-[10%] w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(142,73,206,0.25)_0%,transparent_70%)] blur-[100px] pointer-events-none" />

      {/* Floating Sparkles & Heart Icon */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="mb-4 relative"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 backdrop-blur-md border border-pink-500/30 flex items-center justify-center shadow-[0_0_25px_rgba(242,65,126,0.4)]">
          <Heart className="w-8 h-8 text-pink-400 fill-pink-400/60 animate-pulse" />
        </div>
        <Sparkles className="w-5 h-5 text-amber-300 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: "6s" }} />
      </motion.div>

      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-2xl sm:text-4xl md:text-5xl font-bold font-serif text-center px-4 text-amber-50 drop-shadow-[0_2px_12px_rgba(242,65,126,0.3)] mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {RELATIONSHIP_CONFIG.TIMER_HEADING}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-pink-200/70 text-sm sm:text-base font-sans mb-8 tracking-wider"
        style={{ fontFamily: "'Quicksand', sans-serif" }}
      >
        Counting down every heartbeat until our moment
      </motion.p>

      {/* Countdown Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 px-4 max-w-4xl w-full"
      >
        {units.map((unit, idx) => (
          <div
            key={unit.label}
            className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-pink-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:border-pink-500/40 transition-colors"
          >
            <span
              className="text-2xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-pink-200 to-pink-400 font-mono tracking-tight"
              style={{ fontFamily: "'Quicksand', monospace" }}
            >
              {unit.value}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-pink-300/60 uppercase tracking-[0.2em] mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Subtitle / Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-8 flex items-center gap-2 text-pink-300/50 text-xs sm:text-sm font-sans"
        style={{ fontFamily: "'Quicksand', sans-serif" }}
      >
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Live celebration sync</span>
      </motion.div>
    </div>
  );
};
