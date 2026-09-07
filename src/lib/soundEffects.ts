import * as Tone from "tone";

/**
 * Procedural Audio Engine for Anniversary Celebration.
 * Features:
 * - Crisp, neutral UI click sound for general buttons
 * - Soft, gentle descending minor chime (playSadTone) for Love Q&A negative answers
 * - Bright, warm ascending chime (playHappyTone) for Love Q&A positive answers
 * - Realistic multi-layered Firecracker / Party Popper crackle-pop burst
 * - Synthesized candle breath blow-out sound
 * - Celebratory cake jingle & Web Speech API anniversary phrase
 * - Complete mute/unmute management
 */

class SoundEffectsEngine {
  private isInitialized = false;
  private isMuted = false;

  // Synths
  private clickSynth: Tone.MembraneSynth | null = null;
  private chimeSynth: Tone.PolySynth | null = null;
  private sadSynth: Tone.PolySynth | null = null;
  private happySynth: Tone.PolySynth | null = null;
  private popperMembrane: Tone.MembraneSynth | null = null;

  // Noise & Envelopes for Candle Breath & Firecracker
  private breathFilter: Tone.Filter | null = null;
  private breathEnv: Tone.AmplitudeEnvelope | null = null;
  private noiseNode: Tone.Noise | null = null;

  private popperCrackEnv: Tone.AmplitudeEnvelope | null = null;
  private popperNoise: Tone.Noise | null = null;

  // Master bus
  private masterGain: Tone.Gain | null = null;
  private reverb: Tone.Reverb | null = null;

  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.voices = window.speechSynthesis.getVoices();
    }
  }

  private async initialize() {
    if (this.isInitialized) return;

    this.masterGain = new Tone.Gain(0.35).toDestination();

    // Reverb bus for soft warm chimes
    this.reverb = new Tone.Reverb({
      decay: 3.5,
      preDelay: 0.08,
      wet: 0.38,
    });
    await this.reverb.generate();

    // 1. Neutral UI Click Synth (Short soft pop tick)
    this.clickSynth = new Tone.MembraneSynth({
      pitchDecay: 0.008,
      octaves: 2,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.035, sustain: 0, release: 0.02 },
    });
    this.clickSynth.volume.value = -8;
    this.clickSynth.connect(this.masterGain);

    // 2. Soft Sad/Disappointed Tone (Gentle descending minor chime)
    this.sadSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.05, decay: 0.9, sustain: 0.15, release: 1.2 },
    });
    this.sadSynth.volume.value = -9;
    this.sadSynth.chain(this.reverb, this.masterGain);

    // 3. Warm Happy Tone (Bright ascending major chime)
    this.happySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.02, decay: 1.0, sustain: 0.2, release: 1.2 },
    });
    this.happySynth.volume.value = -8;
    this.happySynth.chain(this.reverb, this.masterGain);

    // 4. Cake Celebratory Chime Synth
    this.chimeSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.02, decay: 1.4, sustain: 0.1, release: 1.8 },
    });
    this.chimeSynth.volume.value = -9;
    this.chimeSynth.chain(this.reverb, this.masterGain);

    // 5. Candle Blow Breath Synthesizer
    this.breathFilter = new Tone.Filter({
      frequency: 750,
      type: "bandpass",
      Q: 1.6,
    });
    this.breathEnv = new Tone.AmplitudeEnvelope({
      attack: 0.14,
      decay: 0.55,
      sustain: 0.05,
      release: 0.35,
    });
    this.noiseNode = new Tone.Noise("pink").start();
    this.noiseNode.volume.value = -6;
    this.noiseNode.chain(this.breathFilter, this.breathEnv, this.masterGain);

    // 6. Realistic Firecracker / Party Popper Synthesizer
    // Sharp white-noise crack transient
    this.popperCrackEnv = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: 0.045,
      sustain: 0,
      release: 0.02,
    });
    this.popperNoise = new Tone.Noise("white").start();
    this.popperNoise.volume.value = +2;
    this.popperNoise.chain(this.popperCrackEnv, this.masterGain);

    // Downward membrane pop
    this.popperMembrane = new Tone.MembraneSynth({
      pitchDecay: 0.04,
      octaves: 5,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.08 },
    });
    this.popperMembrane.volume.value = -2;
    this.popperMembrane.connect(this.masterGain);

    this.isInitialized = true;
  }

  /**
   * Neutral click sound for generic buttons (Next, envelope, etc.)
   */
  async playClick() {
    if (this.isMuted) return;
    try {
      if (Tone.context.state !== "running") await Tone.start();
      await this.initialize();
      const now = Tone.now();
      this.clickSynth?.triggerAttackRelease("C5", "32n", now, 0.6);
    } catch (e) {
      console.debug("Click notice:", e);
    }
  }

  /**
   * Soft, gentle descending minor chime when negative answer is tapped in Love Q&A.
   */
  async playSadTone() {
    if (this.isMuted) return;
    try {
      if (Tone.context.state !== "running") await Tone.start();
      await this.initialize();
      const now = Tone.now();
      const notes = [
        { note: "E4", time: 0, dur: "8n" },
        { note: "C4", time: 0.15, dur: "8n" },
        { note: "A3", time: 0.32, dur: "4n" },
      ];
      notes.forEach(({ note, time, dur }) => {
        this.sadSynth?.triggerAttackRelease(note, dur, now + time, 0.75);
      });
    } catch (e) {
      console.debug("Sad tone notice:", e);
    }
  }

  /**
   * Warm, bright ascending major chime when positive answer is tapped in Love Q&A.
   */
  async playHappyTone() {
    if (this.isMuted) return;
    try {
      if (Tone.context.state !== "running") await Tone.start();
      await this.initialize();
      const now = Tone.now();
      const notes = [
        { note: "D4", time: 0, dur: "16n" },
        { note: "F#4", time: 0.09, dur: "16n" },
        { note: "A4", time: 0.18, dur: "16n" },
        { note: "D5", time: 0.28, dur: "4n" },
      ];
      notes.forEach(({ note, time, dur }) => {
        this.happySynth?.triggerAttackRelease(note, dur, now + time, 0.85);
      });
    } catch (e) {
      console.debug("Happy tone notice:", e);
    }
  }

  /**
   * Synthesized candle blow breath whoosh sound.
   */
  async playCandleBlowSound() {
    if (this.isMuted) return;
    try {
      if (Tone.context.state !== "running") await Tone.start();
      await this.initialize();
      const now = Tone.now();
      this.breathEnv?.triggerAttackRelease(0.55, now);
    } catch (e) {
      console.debug("Blow sound notice:", e);
    }
  }

  /**
   * Celebratory ascending cake jingle.
   */
  async playCakeCelebrationJingle() {
    if (this.isMuted) return;
    try {
      if (Tone.context.state !== "running") await Tone.start();
      await this.initialize();
      const now = Tone.now();
      const notes = ["D5", "F#5", "A5", "C#6", "D6", "F#6"];
      notes.forEach((note, index) => {
        this.chimeSynth?.triggerAttackRelease(note, "8n", now + index * 0.11);
      });
    } catch (e) {
      console.debug("Cake jingle notice:", e);
    }
  }

  /**
   * Realistic Party Popper / Firecracker burst:
   * Sharp initial white-noise crack transient + rapid succession of 3 crackle-pops.
   */
  async playPartyPopperSound() {
    if (this.isMuted) return;
    try {
      if (Tone.context.state !== "running") await Tone.start();
      await this.initialize();
      const now = Tone.now();

      // 1. Initial explosive crack + deep thump
      this.popperCrackEnv?.triggerAttackRelease(0.04, now);
      this.popperMembrane?.triggerAttackRelease("C3", "16n", now, 1.0);

      // 2. Immediate micro-crack burst at +35ms
      this.popperCrackEnv?.triggerAttackRelease(0.03, now + 0.035);
      this.popperMembrane?.triggerAttackRelease("G2", "16n", now + 0.035, 0.8);

      // 3. Secondary trailing pop at +85ms
      this.popperCrackEnv?.triggerAttackRelease(0.025, now + 0.085);
      this.popperMembrane?.triggerAttackRelease("Eb2", "16n", now + 0.085, 0.7);

      // 4. Final distant snap at +140ms
      this.popperCrackEnv?.triggerAttackRelease(0.02, now + 0.14);
    } catch (e) {
      console.debug("Party popper notice:", e);
    }
  }

  /**
   * Spoken anniversary phrase disabled (safe no-op).
   */
  speakAnniversary(onEnd?: () => void) {
    if (onEnd) {
      onEnd();
    }
  }

  stopSpeech() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 0.35;
    }
    if (this.isMuted) {
      this.stopSpeech();
    }
    return this.isMuted;
  }

  getIsMuted(): boolean {
    return this.isMuted;
  }

  // Safe no-ops for any legacy background music calls
  stopAllMusic() {
    this.stopSpeech();
  }
  start() {}
  pause() {}
  resume() {}
  stop() {
    this.stopSpeech();
  }
  startLovePhraseLoop() {}
  resumeLovePhraseLoop() {}
  playQuestionSadCue() {
    this.playSadTone();
  }
  playQuestionHappyCue() {
    this.playHappyTone();
  }
}

export const soundEffects = new SoundEffectsEngine();
export const backgroundMusic = soundEffects;
