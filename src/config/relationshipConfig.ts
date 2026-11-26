export interface LoveQuestionData {
  question: string;
  negativeOption: string;
  positiveOption: string;
  finalPositiveOptions: [string, string];
}

export interface PuzzlePhotoData {
  src: string;
  loveLine: string;
}

export interface ScratchPhotoData {
  src: string;
  loveLine: string;
}

export interface FinalGalleryData {
  photos: string[];
  captions?: string[];
  loveLines: string[];
}

export interface FinalLetterData {
  paragraphs: string[];
}

export interface PhotosConfig {
  hero: string;
}

export type TimerMode = "real" | "disabled" | "test";

export interface RelationshipConfig {
  SITE_TITLE?: string;
  PHOTOS?: PhotosConfig;
  CAKE_HEADING?: string;
  CAKE_SUBHEADING?: string;
  TIMER_MODE: TimerMode;
  TEST_DURATION_SECONDS: number;
  REVEAL_AT: Date;
  TIMER_HEADING: string;
  DEV_BYPASS_KEY?: string;
  LOVE_QUESTIONS: LoveQuestionData[];
  BIG_QUESTION_TEXT: string;
  PUZZLE_PHOTOS: PuzzlePhotoData[];
  SCRATCH_PHOTO: ScratchPhotoData;
  FINAL_GALLERY: FinalGalleryData;
  FINAL_LETTER: FinalLetterData;
  GOODBYE_MESSAGE: string;
}

export const DEMO_CONFIG: RelationshipConfig = {
  /**
   * Browser tab title and OpenGraph site name.
   */
  SITE_TITLE: "Our Anniversary | A Little Something Special 💖",

  /**
   * Hero and feature photos
   */
  PHOTOS: {
    hero: "/photos/hero.svg",
  },

  /**
   * Cake Section Headings
   */
  CAKE_HEADING: "Choose Our Anniversary Cake",
  CAKE_SUBHEADING: "PICK A FLAVOR TO CELEBRATE US",

  /**
   * ========================================================================
   * TIMER MODE CONFIGURATION (FOR TESTING & PRODUCTION)
   * ========================================================================
   * 
   * Options for TIMER_MODE:
   * 1. "real" (DEFAULT): Count down to REVEAL_AT exactly. Use this for production!
   * 2. "disabled": Skip the lock screen entirely and jump directly to Love Q&A.
   * 3. "test": Count down from TEST_DURATION_SECONDS (e.g. 30s) starting on page load,
   *    letting you watch the full countdown and auto-transition in real time.
   * 
   * ⚠️ REMINDER: Always set TIMER_MODE back to "real" before sending the link!
   */
  TIMER_MODE: "test",
  TEST_DURATION_SECONDS: 10,

  /**
   * Secret developer/QA preview key.
   * To preview the site before REVEAL_AT, append `?devkey=YOUR_KEY` to the URL.
   * Change this string to your own secret, or set to "" to completely disable preview bypass.
   */
  DEV_BYPASS_KEY: "",

  /**
   * Target reveal date & time for the countdown lock screen (when TIMER_MODE === "real").
   * IMPORTANT: Always use an explicit ISO 8601 string with a timezone offset
   * (e.g. "+05:30" for IST, "-04:00" for EDT, "+00:00" or "Z" for UTC)
   * so that the timer synchronizes consistently regardless of the viewer's device timezone.
   * Format: YYYY-MM-DDTHH:mm:ss±HH:mm
   */
  REVEAL_AT: new Date("2026-08-31T00:00:00+05:30"),
  TIMER_HEADING: "Something Special Is Loading…",

  LOVE_QUESTIONS: [
    {
      question: "How am I looking today?",
      negativeOption: "Meh, not really",
      positiveOption: "Absolutely stunning",
      finalPositiveOptions: ["Stunning as always", "The best I've ever seen"],
    },
    {
      question: "Who am I to you?",
      negativeOption: "Just some random person",
      positiveOption: "My favorite person",
      finalPositiveOptions: ["My favorite person", "The best part of my day"],
    },
    {
      question: "Do you actually like spending time with me?",
      negativeOption: "Not really",
      positiveOption: "More than anything",
      finalPositiveOptions: ["More than anything", "Every single second of it"],
    },
    {
      question: "Am I annoying you right now?",
      negativeOption: "A little, yeah",
      positiveOption: "Never",
      finalPositiveOptions: ["Never", "Not even a tiny bit"],
    },
    {
      question: "Do these silly questions make you smile?",
      negativeOption: "No",
      positiveOption: "Yes, a lot",
      finalPositiveOptions: ["Yes, a lot", "You have no idea"],
    },
  ],

  BIG_QUESTION_TEXT: "Do you want to be my girlfriend... again?",

  PUZZLE_PHOTOS: [
    {
      src: "/photos/puzzle-1.svg",
      loveLine: "Every time I look at you, I fall a little more.",
    },
    {
      src: "/photos/puzzle-2.svg",
      loveLine: "Us, on our best days — and every day feels like one.",
    },
    {
      src: "/photos/puzzle-3.svg",
      loveLine: "Two people, one story. Still writing it.",
    },
  ],

  SCRATCH_PHOTO: {
    src: "/photos/scratch-reveal.svg",
    loveLine: "Some moments don't need words. This one just needs us.",
  },

  FINAL_GALLERY: {
    photos: [
      "/photos/gallery-1.svg",
      "/photos/gallery-2.svg",
      "/photos/gallery-3.svg",
      "/photos/gallery-4.svg",
      "/photos/gallery-5.svg",
      "/photos/gallery-6.svg",
      "/photos/gallery-7.svg",
    ],
    captions: [
      "Every date with you feels like the first one.",
      "Sitting beside you is my favourite place to be.",
      "This was the very first photo we ever took together.\nI didn't know it then — but this was the moment everything changed.\nThis picture holds the beginning of us, and I'll keep it forever.",
      "You make every ordinary moment feel unforgettable.",
      "Matching outfits, matching hearts.",
      "Even in a crowd, I only ever see you.",
      "A little memory to keep forever.",
    ],
    loveLines: [
      "Every date with you feels like the first one.",
      "Sitting beside you is my favourite place to be.",
      "This was the very first photo we ever took together.\nI didn't know it then — but this was the moment everything changed.\nThis picture holds the beginning of us, and I'll keep it forever.",
      "You make every ordinary moment feel unforgettable.",
      "Matching outfits, matching hearts.",
      "Even in a crowd, I only ever see you.",
      "A little memory to keep forever.",
    ],
  },

  FINAL_LETTER: {
    paragraphs: [
      "My dearest Mia,",
      "By the time you're reading this, you've clicked through a lot of silly buttons, dodged a runaway 'No', and solved a few puzzles just to get here. I hope every second of it made you smile, because that's really all I wanted.",
      "I'm not good at saying big things out loud, so I put them here instead. You make ordinary days feel worth remembering. You make the hard days easier just by being in them. And somehow, the more time passes, the more sure I am that I want you in all of mine.",
      "This isn't a grand gesture. It's just a small website built with a lot of love, for someone who deserves a lot more than that. Thank you for choosing to stay, for laughing at my terrible jokes, and for being exactly who you are.",
      "Here's to us, and to every day still ahead.",
      "Forever yours,",
      "Alex 💖",
    ],
  },

  GOODBYE_MESSAGE: "That's it for now. But this? Us? Still going. 💛",
};

export const PERSONALIZED = Boolean((window as any).__ANNIVERSARY_CONFIG__) || new URLSearchParams(window.location.search).get("preview") === "1";
const raw = (window as any).__ANNIVERSARY_CONFIG__ || (PERSONALIZED ? JSON.parse(sessionStorage.getItem("anniversary-preview") || "null") : null);
export const RELATIONSHIP_CONFIG: RelationshipConfig = raw ? {...DEMO_CONFIG,...raw,REVEAL_AT:new Date(raw.REVEAL_AT)} : DEMO_CONFIG;
