# Anniversary Site — Full Interaction Flow Guide

This extends `guide.md`. Everything below is additive: the reskin from before stays,
this defines the exact journey she'll go through, page by page, plus copy-paste
prompts for your AI IDE and the actual written content (questions, love lines, letter).

Replace `[TARGET_DATETIME]` everywhere with your real date/time — e.g. `2026-08-31T00:00:00`.

**Design note:** the new sections (Love Q&A, Big Question, puzzle, scratch card) have no
equivalent in the original repo, so your AI IDE will use Stitch MCP to design their UI.
To keep them visually identical to the rest of the site — same theme, same color
palette, same fonts/spacing — do Step A0 below *before* any Stitch prompt, and paste the
extracted tokens into every Stitch prompt afterward. Skipping this is how you end up
with new sections that look like a different website bolted onto the old one.

---

## The Full Flow (in order)

1. **Lock screen** — "Something special is loading…" + live countdown to `[TARGET_DATETIME]`. Auto-opens the moment the clock hits zero.
2. **Love Q&A** — 5 playful questions, each with a "think again" loop on the negative answer.
3. **The Big Question** — "Do you want to be my girlfriend... again?" with a dodging No button.
4. **Balloon animation** (reused from BirthdayV2, as-is).
5. **Cake + candles** (reused from BirthdayV2, as-is) — blow + cut interaction.
6. **Photo puzzle x3** — solve a sliding/jigsaw puzzle of a couple photo → photo settles into place → a love line types out beneath it. Repeats for 3 different photos.
7. **Scratch reveal** — one more photo, hidden under a "Scratch here" card, revealed by dragging the mouse → a love paragraph types out beneath it.
8. **Final gallery** — like BirthdayV2's last section: a wall of photos with multiple short love lines scattered in.
9. **The letter** — a sealed envelope with a heart/love sticker. Tap → letter slides out → the best, longest message types out like a handwritten letter.
10. **Goodbye screen** — the site closes on a short, warm goodbye line.

A **Next** button appears on every page transition except the two automatic ones (lock-screen auto-open, and Big-Question → balloons).

---

## PART A — Build Prompts (use in order, one at a time)

### A0. Extract the site's design tokens (do this first, once)

```
Inspect the existing codebase (tailwind.config.ts/js, globals.css, and the section
components under src/components/sections/) and produce a single design-tokens summary:
- Color palette: every custom color/hex or Tailwind theme color in use, with what it's
  used for (background, accent, text, card surfaces, borders, glow/shadow colors).
- Typography: font families in use (headings vs body), sizes/weights for headings,
  body text, and captions.
- Texture/decoration: any paper/scrapbook textures, washi tape, grain overlays, or
  border/frame treatments used on cards or sections.
- Motion style: typical transition duration/easing used by Framer Motion/GSAP across
  sections (e.g. fade+scale, spring settings).
- Corner radius, shadow, and spacing conventions used on cards/buttons.
Output this as a short reference doc (design-tokens.md) I can paste into future prompts,
so any new section — including ones designed via Stitch — matches the existing site
exactly instead of introducing a new visual style.
```

Keep `design-tokens.md` open and paste its contents into every Stitch MCP prompt below,
with an instruction like: *"Match this exact palette/typography/texture — do not
introduce new colors, fonts, or a different visual style."* Stitch is only there to help
lay out screens it has no prior template for (Q&A cards, the dodging-button screen, the
puzzle grid, the scratch card) — not to reinterpret the site's look.

### A1. Exact-datetime lock screen

```
Replace the countdown logic in CountdownLockScreen.tsx so it counts down to one exact
hardcoded JS Date — RELATIONSHIP_CONFIG.REVEAL_AT (type Date, e.g.
new Date("2026-08-31T00:00:00")) — instead of counting down to "today's nearest
anniversary". Requirements:
- Display format: "00 Years : 00 Months : 00 Days : 23 Hours : 59 Mins : 42 Secs"
  (compute full calendar breakdown, not just total seconds — years/months should
  normally read 00 unless the target is far out).
- Heading text: "Something Special Is Loading…" (pull from
  RELATIONSHIP_CONFIG.TIMER_HEADING).
- When the countdown hits zero, auto-transition to the main site (no button, no
  confirmation) using the existing reveal animation from BirthdayGatekeeper.tsx.
- If someone opens the link after REVEAL_AT has already passed, skip straight to the
  main site — don't get stuck at "00:00:00:00".
Add REVEAL_AT: Date to relationshipConfig.ts as the single source of truth for this date.
```

### A2. Love Q&A engine (build once, reuse for all 5 questions)

```
Create src/components/sections/LoveQuestion.tsx, a reusable component with this prop
shape:

type LoveQuestionProps = {
  question: string;
  negativeOption: string;
  positiveOption: string;
  finalPositiveOptions: [string, string]; // shown after 2 negative taps
  onResolved: () => void; // called once she picks any positive answer
};

Behavior:
- Attempt 1: show `question` with two buttons — negativeOption and positiveOption.
- If positiveOption is tapped at any attempt: play a small confirm animation (heart pop
  or similar, match existing site aesthetic) then call onResolved().
- If negativeOption is tapped on attempt 1: show an overlay "Think again 😏" for ~1s,
  then re-show the SAME question (attempt 2), same two options.
- If negativeOption is tapped on attempt 2: show an overlay "Last chance!" for ~1s, then
  re-show the question a THIRD time — but now with finalPositiveOptions as the two
  buttons instead of negative/positive. Whichever she taps, call onResolved().
- Use Framer Motion for the question-to-question transitions (fade + slight scale,
  matching the site's existing transition style).

Then create src/components/sections/LoveQuestionsSection.tsx that renders 5
LoveQuestion instances in sequence (one visible at a time, advancing on each
onResolved), sourcing question data from RELATIONSHIP_CONFIG.LOVE_QUESTIONS (array of 5
objects matching the props above — I'll give you the actual content next). Show a
"Next" button only after the 5th question resolves, leading to the Big Question section.

For the card layout itself, use Stitch MCP to design the question card + button
treatment — paste design-tokens.md into the Stitch prompt and require it to match the
existing palette, typography, and card/border style exactly (no new colors or fonts).
```

### A3. The Big Question (dodging No button)

```
Create src/components/sections/BigQuestion.tsx.

State: noTapCount (starts 0), resolved (false).

Layout: centered question "Do you want to be my girlfriend... again? 💍" (pull from
RELATIONSHIP_CONFIG.BIG_QUESTION_TEXT) with a Yes button and a No button, both normal
size and position initially.

Behavior on No tap:
- Tap 1: nothing special happens except a tiny shake animation on the No button (stays
  in place). Increment noTapCount to 1.
- Taps 2–4: on each tap, teleport the No button to a new random position within the
  viewport (avoid overlapping the Yes button — keep a safe margin), and shrink it
  slightly each time (e.g. 100% → 85% → 70% size). Increment noTapCount.
- Tap 5 (noTapCount reaches 5): remove the No button entirely. Grow the Yes button into
  a large, centered, glowing/pulsing button as the only option on screen.

Behavior on Yes tap (whenever it happens): set resolved = true, play a celebratory
transition (confetti burst using the existing canvas-confetti setup), then navigate to
the balloon animation section.

Use Framer Motion's `animate` with random x/y within safe bounds for the No button's
teleport positions — recalculate bounds on window resize.

Use Stitch MCP for the layout of this screen (question text placement, button styling
at each size stage, the final glowing YES state) — feed it design-tokens.md and require
it to stay within the existing palette and typography rather than inventing a new look.
```

### A4. Reuse balloons + cake as-is

```
Import/reuse the balloon animation component and BirthdayCake.tsx from the original
BirthdayV2 structure without visual changes. Wire them so BigQuestion's Yes tap leads to
the balloon section, which leads to BirthdayCake.tsx, keeping its existing blow-and-cut
candle interaction untouched. After the candle is blown out and cut, show a "Next"
button leading into the photo puzzle section.
```

### A5. Photo puzzle (repeats 3x)

```
Create src/components/sections/PhotoPuzzle.tsx. Build a simple sliding-tile or
jigsaw-style puzzle (pick sliding-tile for simplicity — 3x3 grid) that takes a single
image src as a prop. On puzzle completion:
- Snap all tiles into place with a smooth animation so the full photo is clearly visible
  with no grid lines/gaps.
- Below the photo, type out (letter-by-letter, like a typewriter — reuse any existing
  typewriter effect in the codebase, e.g. from EnvelopeSection.tsx, or build one with
  Framer Motion) a caption line passed in as a `loveLine` prop.
- Show a "Next" button once the typewriter finishes.

Then create PhotoPuzzleSequence.tsx that renders PhotoPuzzle three times in a row (one
photo at a time, advancing on "Next"), sourcing images and loveLines from
RELATIONSHIP_CONFIG.PUZZLE_PHOTOS (array of 3 { src, loveLine } objects — content
provided below).

Use Stitch MCP for the puzzle frame/tile styling and the "Next" button that appears
after — pass in design-tokens.md so the puzzle border, shadows, and typewriter caption
text match the rest of the site instead of looking like a generic puzzle widget.
```

### A6. Scratch-card reveal

```
Create src/components/sections/ScratchReveal.tsx. Use an HTML canvas overlay
("Scratch Here ✨" label, matching site color palette) on top of a hidden photo — track
mouse/touch drag to erase canvas pixels (standard scratch-card technique: draw with
globalCompositeOperation = "destination-out" following pointer movement). Once ~60% of
the canvas area is scratched away, auto-clear the rest with a fade so the full photo is
visible, then type out a love paragraph below it (same typewriter approach as the puzzle
section). Source the photo and paragraph from RELATIONSHIP_CONFIG.SCRATCH_PHOTO. Show
"Next" once the paragraph finishes typing.

Use Stitch MCP for the scratch-card frame and "Scratch Here ✨" label styling — pass in
design-tokens.md so the card's border/texture/shadow matches the site's existing card
treatment rather than a generic scratch-card look.
```

### A7. Final gallery page

```
Reuse the layout pattern from BirthdayV2's final gallery/last section (same grid/photo
treatment) but source photos from RELATIONSHIP_CONFIG.FINAL_GALLERY.photos and
intersperse RELATIONSHIP_CONFIG.FINAL_GALLERY.loveLines between/around the photos the
same way the original repo's last section mixes text and images. Show "Next" leading to
the envelope/letter section.
```

### A8. The letter

```
Update EnvelopeSection.tsx (or create a new instance of it for this final placement) so:
- The envelope is shown sealed with a heart/love sticker graphic instead of the
  original wax seal (swap the asset, keep the same open interaction).
- On tap, the existing slide-out-letter animation plays.
- The letter content types out using RELATIONSHIP_CONFIG.FINAL_LETTER.paragraphs —
  written in first-person, formatted like an actual handwritten letter (opening line,
  paragraphs, closing signature line), not like short caption text elsewhere on the site.
This is the last content page — after the letter finishes, show whatever
closing/thank-you element the original repo ends on, then replace its text with
RELATIONSHIP_CONFIG.GOODBYE_MESSAGE.
```

---

## PART B — Content (paste into `relationshipConfig.ts`)

Everything below is written for you — simple, warm, no purple prose. Swap in real
names/photos where marked.

```ts
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
    src: "/photos/puzzle-1.jpg",
    loveLine:
      "Every piece of this photo took a second to fall into place. You took a lot less time to steal my heart.",
  },
  {
    src: "/photos/puzzle-2.jpg",
    loveLine:
      "Some things are worth putting back together, piece by piece. You're at the top of that list.",
  },
  {
    src: "/photos/puzzle-3.jpg",
    loveLine:
      "Look at us. Even scattered into pieces, we still make sense together.",
  },
],

SCRATCH_PHOTO: {
  src: "/photos/scratch-reveal.jpg",
  loveLine:
    "Some of the best things in life are hidden until you're patient enough to uncover them. You were worth every second of waiting.",
},

FINAL_GALLERY: {
  photos: [
    "/photos/gallery-1.jpg",
    "/photos/gallery-2.jpg",
    "/photos/gallery-3.jpg",
    "/photos/gallery-4.jpg",
    "/photos/gallery-5.jpg",
    "/photos/gallery-6.jpg",
  ],
  loveLines: [
    "Every photo here is proof that I got lucky the day I met you.",
    "You didn't just walk into my life. You made yourself at home in it.",
    "I don't need a special day to love you. But I'm glad we have one anyway.",
    "If I had to pick every one of these moments again, I wouldn't change a single one.",
  ],
},

FINAL_LETTER: {
  paragraphs: [
    "My dearest [NAME],",
    "By the time you're reading this, you've clicked through a lot of silly buttons, dodged a runaway 'No', and solved a few puzzles just to get here. I hope every second of it made you smile, because that's really all I wanted.",
    "I'm not good at saying big things out loud, so I put them here instead. You make ordinary days feel worth remembering. You make the hard days easier just by being in them. And somehow, the more time passes, the more sure I am that I want you in all of mine.",
    "This isn't a grand gesture. It's just a small website built with a lot of love, for someone who deserves a lot more than that. Thank you for choosing to stay, for laughing at my terrible jokes, and for being exactly who you are.",
    "Here's to us, and to every day still ahead.",
    "Forever yours,",
    "[YOUR NAME]",
  ],
},

GOODBYE_MESSAGE: "That's it for now. But this? Us? Still going. 💛",
```

---

## Notes

- Run A0 first, every time — it's a one-off, but if you restart the AI IDE session or
  switch chats partway through, re-paste design-tokens.md before any further Stitch
  prompt so the new sections don't drift from the original look.
- Build order matters: get A1–A3 working and reviewed before touching A4–A8 — the Q&A engine and Big Question are the trickiest logic, everything after is mostly content + reused patterns.
- All photo paths above are placeholders — drop your actual couple photos into `/public/photos/` with matching filenames, or rename the paths in the config once you have them.
- `[TARGET_DATETIME]` in A1 and `[NAME]` / `[YOUR NAME]` in the letter are the only things you need to fill in by hand — everything else is ready to paste.
