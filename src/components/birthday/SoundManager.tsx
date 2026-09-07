import { useCallback, useMemo, useRef } from "react";
import { backgroundMusic } from "@/lib/backgroundMusic";

class AudioManager {
  private started = false;
  private muted = false;

  start() {
    if (this.started) return;
    this.started = true;
    backgroundMusic.start();
  }

  toggleMute(): boolean {
    this.muted = backgroundMusic.toggleMute();
    return this.muted;
  }

  getIsMuted(): boolean {
    return backgroundMusic.getIsMuted();
  }

  fadeOutBgMusic() {
    backgroundMusic.pause();
  }

  setBgVolume(_volume?: number) {
    // Controlled via Tone.js master bus
  }

  playEffect(_type: "typeClick" | "whoosh" | "reveal" | "pop" | "boom") {
    // Procedural sound effects handled via Tone.js synths
  }

  stop() {
    backgroundMusic.stop();
    this.started = false;
  }
}

const globalAudioManager = new AudioManager();

export const useSoundManager = () => {
  const managerRef = useRef(globalAudioManager);

  const startMusic = useCallback(() => {
    managerRef.current.start();
  }, []);

  const toggleMute = useCallback(() => {
    return managerRef.current.toggleMute();
  }, []);

  const getIsMuted = useCallback(() => {
    return managerRef.current.getIsMuted();
  }, []);

  const playType = useCallback(() => {
    managerRef.current.playEffect("typeClick");
  }, []);

  const playWhoosh = useCallback(() => {
    managerRef.current.playEffect("whoosh");
  }, []);

  const playReveal = useCallback(() => {
    managerRef.current.playEffect("reveal");
  }, []);

  const playPop = useCallback(() => {
    managerRef.current.playEffect("pop");
  }, []);

  const playBoom = useCallback(() => {
    managerRef.current.playEffect("boom");
  }, []);

  const fadeOut = useCallback(() => {
    managerRef.current.fadeOutBgMusic();
  }, []);

  const setBgVolume = useCallback((volume?: number) => {
    managerRef.current.setBgVolume(volume);
  }, []);

  const playClick = useCallback(() => {
    backgroundMusic.playClick();
  }, []);

  return useMemo(
    () => ({
      playClick,
      startMusic,
      toggleMute,
      getIsMuted,
      playType,
      playWhoosh,
      playReveal,
      playPop,
      playBoom,
      fadeOut,
      setBgVolume,
    }),
    [playClick, startMusic, toggleMute, getIsMuted, playType, playWhoosh, playReveal, playPop, playBoom, fadeOut, setBgVolume]
  );
};
