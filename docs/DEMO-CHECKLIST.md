# Demo Presentation Checklist

This checklist prepares the presenter and environment for executing a flawless 60–120 second demonstration of DealMemory.

## 1. Before Recording / Presentation

- [ ] **Reset & Seed Bank**: Run `npm run seed` to ensure all 12 interactions across Acme Corp, TechFlow, and CyberShield are fresh in Hindsight.
- [ ] **Browser Setup**: Open Chrome or Edge in an incognito window with no extraneous bookmarks, extensions, or open tabs.
- [ ] **Screen Sizing**: Set browser zoom to 110%–125% and resolution to 1080p (1920x1080) for sharp text rendering.
- [ ] **Server Status**: Verify `npm run dev` is active at `http://localhost:3000` with 0 console warnings or errors.
- [ ] **Audio/Video Setup**: Test microphone clarity and ensure notifications are muted (Do Not Disturb enabled).

## 2. During Recording / Presentation (Timeline Walkthrough)

- [ ] **0:00 - 0:15 (The Problem)**:
  - Start on `/deals`.
  - State the thesis: "Traditional sales AI summarizes calls into static notes. If offering a discount stalled your deal two weeks ago, a stateless bot will recommend another discount today."
- [ ] **0:15 - 0:40 (Memory OFF vs. ON)**:
  - Navigate to `/deals/deal_acme_001/prepare`.
  - Click **Memory: OFF**: Show the generic prompt advising a 15% discount.
  - Click **Memory: ON**: Show the immediate contrast—warning against discounts due to the Oct 24 failure and recommending an engineer-led migration roadmap.
- [ ] **0:40 - 1:00 (Traceable Evidence)**:
  - Scroll to the Evidence block: show document IDs `deal:acme-001:interaction:002` (discount stalled) and `004` (roadmap progressed).
  - Highlight the conflict warning box: $100k budget from Call #001 vs. $85k cap from Call #005.
- [ ] **1:00 - 1:30 (Live Ingestion & Closing the Loop)**:
  - Open `/demo` and navigate to Step 4.
  - Log the new interaction outcome (SOC2 bridge letter accepted, sandbox kickoff confirmed).
  - Click "Ingest & Retain in Hindsight" and show Step 5's updated Acme Corp Deal Progression Model.

## 3. After Recording

- [ ] Inspect video duration (must be between 2:00 and 5:00 minutes).
- [ ] Verify audio level and visual clarity of document IDs.
- [ ] Upload to YouTube with title, description, and links from `content/video/youtube-metadata.md`.
- [ ] Attach 16:9 thumbnail designed per `content/prompts/05-thumbnail.md`.
