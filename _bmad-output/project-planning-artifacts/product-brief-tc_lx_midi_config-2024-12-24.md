---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - /Users/Nick/Dropbox/Tetrachords/Code/tc_lx_midi_config/docs/lx_palette_ux.md
date: 2024-12-24
author: Nick
workflowType: product-brief
lastStep: 5
project_name: tc_lx_midi_config
user_name: Nick
---

# Product Brief: tc_lx_midi_config

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

tc_lx_midi_config is a web-based MIDI palette editor that empowers Tetrachords device users—particularly those with color blindness—to customize LED color palettes without manufacturer intervention. The tool addresses a critical accessibility gap where colorblind users (approximately 10% of the predominantly male user base) experience increased cognitive load when distinguishing between tracks. By providing real-time device synchronization via Web MIDI, users can iterate on palette designs with immediate visual feedback on their hardware, eliminating the slow and painful process of requesting hard-coded palette changes. The solution transforms accessibility customization from a weeks-long manufacturer bottleneck into a minutes-long self-service workflow, while enabling community-driven palette sharing for different types of color blindness.

---

## Core Vision

### Problem Statement

Tetrachords device users with color blindness struggle to distinguish between tracks using the default LED color palette, forcing them to memorize track positions and increasing their cognitive load during use. While a second hard-coded palette provides some improvement, it was designed by a non-colorblind person and still falls short of meeting diverse colorblind users' needs. Currently, obtaining a custom palette requires contacting the manufacturer to hard-code changes and use specialized SD card workflows—a process that is slow, painful, and creates a significant barrier to accessibility.

### Problem Impact

**For Colorblind Users (≈10% of user base):**
- Cannot rely on visual color cues to identify tracks
- Must remember track positions mentally, increasing cognitive load
- Device is harder to use, especially in performance/real-time contexts
- Current "better" palette helps but isn't personalized to their specific color blindness type

**For Manufacturer:**
- Manual bottleneck for each custom palette request
- Time-consuming special mode + SD card workflow required
- Cannot gather community-tested palettes from actual colorblind users
- Limited ability to include optimal colorblind palettes as hard-coded defaults

### Why Existing Solutions Fall Short

**Current Two Hard-Coded Palettes:**
- Limited to manufacturer's design choices without colorblind user testing
- No personalization for different types of color blindness (deuteranopia, protanopia, tritanopia)
- Fixed at firmware level—no user control

**Custom Palette Request Process:**
- Requires manufacturer intervention and specialized hardware access
- Weeks-long turnaround time
- Not scalable for diverse user needs
- Prevents rapid iteration and testing by actual colorblind users

**Industry Standard (Other Hardware MIDI Controllers):**
- Most devices offer no LED customization at all
- Colorblind accessibility largely ignored in music hardware industry
- No web-based tools for hardware LED configuration

### Proposed Solution

A browser-based Web MIDI application that enables users to:

1. **Sync palettes bidirectionally** with Tetrachords device in real-time
2. **Edit color values** for all LED contexts (track lights: dim/medium/bright; track buttons)
3. **Preview changes instantly** on hardware via MIDI SysEx commands
4. **Save custom palettes** to device SD card as `.lxp` files
5. **Share palette files** with community (enabling colorblind users to share tested solutions)
6. **Copy/paste RGB values** with brightness adjustment sliders for efficient palette design
7. **Reset to default** palette via device controls when experimenting

**Technical Foundation:**
- Web MIDI API (no installation required)
- LX Palette UX Command API (already implemented in firmware)
- Real-time MIDI SysEx communication for instant LED feedback
- SD card persistence for saved palettes

**Simplest Effective Version:**
- Color picker interface for each LED context (no device mockup UI)
- Sync from/to device controls
- Save/load palette files
- No guidance templates (full user freedom initially)

### Key Differentiators

**Accessibility-First Design:**
- Unlike industry standard, explicitly solves for colorblind users
- Empowers affected users to design their own optimal solutions
- Enables community-tested palettes to become hard-coded defaults

**Real-Time Hardware Preview:**
- See changes immediately on actual device LEDs (not just web simulation)
- No "apply" delay—instant feedback loop during design
- Test in actual use context while editing

**Zero Manufacturer Dependency:**
- Self-service workflow replaces weeks-long manual process
- Users control their own accessibility needs
- Manufacturer freed from palette customization bottleneck

**Community-Driven Palette Sharing:**
- Colorblind users can share tested solutions with others
- Different color blindness types can each have optimized palettes
- Best community palettes can be promoted to factory defaults

**No Installation Barrier:**
- Browser-based Web MIDI (works on any modern browser)
- Instant access via URL—no software to download
- Cross-platform by default

**Efficient Design Workflow:**
- Copy/paste RGB with brightness modifiers for rapid iteration
- Leverages existing firmware API (no hardware changes needed)
- Simple UI focused on function over form (for v1)

---

## Target Users

### Primary Users

**Colorblind Tetrachords Owners**

The primary users are Tetrachords device owners with color blindness (approximately 10% of the 250+ user base, predominantly male). These users struggle to distinguish between tracks using default LED palettes, forcing them to rely on memorization rather than visual feedback. They need a way to customize colors so the device's visual system actually works for their specific type of color vision deficiency.

**Key Characteristics:**
- Own and use Tetrachords hardware (varied contexts: performance, studio, jamming)
- Have deuteranopia, protanopia, tritanopia, or other color vision deficiency
- Comfortable with music hardware but may vary in web/tech comfort level
- Currently experience increased cognitive load when using the device
- Seek a one-time or occasional solution (not daily tool usage)

**Current Workaround:**
Must memorize track positions instead of using color cues, or use the second hard-coded "better" palette that still doesn't fully meet their needs.

**Success Vision:**
A customized palette where all track colors are easily distinguishable, allowing them to use visual feedback naturally without mental overhead. Would use the tool a few times to find the right palette, save it, and be done.

---

**Aesthetic Customizers**

Secondary users are non-colorblind Tetrachords owners who want to personalize their device's appearance for aesthetic or creative reasons.

**Key Characteristics:**
- Own Tetrachords hardware
- Motivated by preference rather than necessity
- May experiment with multiple palettes for different moods or settings
- Lower priority but still benefit from the tool

**Success Vision:**
Ability to make the device look unique or match their setup aesthetic. May explore palette customization as a creative extension of their hardware.

---

### Secondary Users / Stakeholders

**Manufacturer (Tetrachords Team)**

**Needs:**
- Reduce manual custom palette support burden
- Gather community-tested palettes from actual colorblind users
- Identify optimal palettes to promote as hard-coded factory defaults
- Enable users to be self-sufficient for accessibility customization

**Benefits:**
- Eliminates weeks-long custom palette request bottleneck
- Gains data-driven insights into what palettes work for different color blindness types
- Scales accessibility support without scaling manual effort

---

### User Journey

**1. Discovery**
- User learns about the tool via Modwiggler forum post, YouTube video, or direct contact from manufacturer
- Accesses web app URL (no installation required)

**2. First Use**
- Opens browser, navigates to web app
- Connects Tetrachords device via Web MIDI
- Clicks "Sync from device" to load current palette into editor
- Interface is self-explanatory (minimal tutorial needed)

**3. Experimentation & Testing**
- Adjusts color values using color pickers
- Sees LED changes immediately on physical hardware in real-time
- Uses device to test if track colors are distinguishable in actual use
- Iterates quickly with instant visual feedback loop
- Can press reset on device (in palette mode) to return to default if needed

**4. Success Moment**
- Finds a palette where all tracks are clearly distinguishable
- Clicks "Sync to device" to save palette to SD card as `.lxp` file
- Device now permanently uses their custom palette

**5. Optional Community Sharing**
- May share `.lxp` palette file on Modwiggler forum for others with similar colorblindness
- Contributes to community-tested palette library
- Helps inform future factory default palettes

---

## Success Metrics

### User Success Metrics

**Primary Success Indicator: Low-Friction Experience**
- Users can discover the web app, connect their device, adjust colors with real-time LED feedback, and save a custom palette with minimal friction
- Success = users complete the full workflow (sync → edit → save) without needing support
- Measured by: Qualitative feedback, support ticket volume

**Qualitative Validation**
- Positive user feedback outweighs negative feedback (forum posts, direct messages, YouTube comments)
- Colorblind users report improved usability and reduced cognitive load
- Community sentiment: "this is helpful" vs "this is broken/stupid"
- Measured by: Forum monitoring, direct user communication

**Accessibility Outcome**
- At least one production-quality, user-tested colorblind palette emerges from the tool
- This palette can be promoted to factory default, benefiting future colorblind users
- Measured by: Beta testing feedback, palette submission quality

**Adoption Baseline**
- Colorblind users (and aesthetic customizers) successfully adopt the tool when directed to it
- Users complete the journey: load palette → adjust → test on device → save
- Measured by: Direct user reports, forum activity

---

### Business Objectives

**Support Burden Reduction**
- Transform custom palette support requests from manual bottleneck into self-service workflow
- Zero post-launch manual palette customization requests (users directed to tool instead)
- Turns accessibility work into marketing-worthy feature and community goodwill

**Marketing & Community Value**
- Tool becomes sharable feature that demonstrates accessibility commitment
- Can be promoted in YouTube video, Modwiggler posts, product marketing
- Positions Tetrachords as accessibility-conscious in music hardware industry
- Differentiates from competitors who ignore colorblind users

**Factory Default Improvement**
- Obtain at least one well-tested colorblind palette for potential factory default inclusion
- Reduces guesswork in designing accessible palettes
- Future devices ship with better out-of-box accessibility

---

### Key Performance Indicators

**Launch Success (First 3 Months)**
- Tool is live and accessible via URL
- YouTube tutorial video published
- Modwiggler forum announcement posted
- At least 3-5 users successfully create and save custom palettes
- Zero critical bugs reported that block core workflow

**User Experience Quality**
- Users report the workflow is "low friction" and intuitive
- Self-explanatory interface requires minimal support/explanation
- Real-time LED preview works reliably across browsers
- Web MIDI connection is stable and predictable

**Accessibility Impact (6-12 Months)**
- At least one colorblind user provides tested palette that's production-ready
- Positive qualitative feedback from colorblind users about improved usability
- Support requests shift from "I need custom palette" to "here's the tool link"

**Project Efficiency**
- MVP scope achieved: color controls + real-time LED sync + save/load functionality
- No device UI mockup required (out of scope)
- Development time investment feels proportional to value created
- Tool is maintainable with minimal ongoing effort

---

**What Success Looks Like:**

In 6 months, you can point any user requesting palette customization to the web app, and they successfully create their own solution without your manual intervention. You receive mostly positive feedback, obtain at least one excellent colorblind-tested palette for factory defaults, and the tool becomes a marketing point for Tetrachords' accessibility commitment. The project feels "worth it" because it solved a real problem with reasonable effort.

---

## MVP Scope

### Core Features

**1. Web MIDI Connection**
- Detect and connect to Tetrachords device via Web MIDI API
- Display connection status (connected/disconnected)
- Works on any browser with Web MIDI API support (Chrome, Edge, Opera, Chromium-based browsers)

**2. Bidirectional Palette Sync**
- **Sync from Device:** Load current palette from connected device into web editor
- **Sync to Device:** Save edited palette to device SD card as `.lxp` file
- Real-time MIDI SysEx communication using LX Palette UX Command API

**3. Color Editing Interface**
- Color pickers for all 24 LED contexts:
  - `track_smd` - 4 colors (normal brightness track LEDs)
  - `track_smd_dim` - 4 colors (dim brightness)
  - `track_smd_medium` - 4 colors (medium/highlight brightness)
  - `track_btn[4][3]` - 12 colors (track buttons: 4 tracks × 3 brightness levels)
- Simple, functional layout (no device UI mockup)
- Self-explanatory interface design (tooltips added only if needed)

**4. Real-Time LED Preview**
- Color adjustments immediately update device LEDs via MIDI SysEx
- Instant visual feedback while editing
- Test changes on actual hardware in real-time

**5. RGB Copy/Paste with Brightness Adjustment**
- Copy RGB values from any color slot
- Paste to other slots with optional brightness modifier slider
- Efficiently create consistent color schemes with variations

**6. Palette File Management**
- Name palettes within the app
- Optional slot number prefix (1_ through 8_) for organized device storage
- Save palette as `.lxp` file (downloads to user's computer)
- Load `.lxp` files back into editor via file picker
- Standard browser download/upload workflow

**7. Basic Error Handling**
- Connection failure messages
- Simple error states (device not found, sync failed, etc.)
- No extensive troubleshooting guidance in MVP

---

### Out of Scope for MVP

**Device UI Mockup**
- SVG graphics showing physical Tetrachords interface
- Visual representation of how colors appear on actual device
- **Rationale:** Significant development effort with limited value gain; users have physical device for real-time preview

**Colorblind Palette Templates or Guidance**
- Pre-built colorblind-optimized palettes
- Color picker guidance for accessibility
- **Rationale:** Full user freedom approach initially; community will generate tested palettes organically

**Built-in Community Palette Sharing**
- In-app palette library or marketplace
- User accounts or palette ratings
- **Rationale:** Users can share `.lxp` files manually via Modwiggler forum; built-in features add complexity without proven need

**Analytics or Usage Tracking**
- User behavior tracking
- Feature usage metrics
- **Rationale:** 250-user base doesn't justify analytics infrastructure; qualitative feedback sufficient

**Extensive Browser Compatibility Testing**
- Safari, Firefox, or non-Chromium browsers
- **Rationale:** Web MIDI API has limited browser support; focus on Chromium-based browsers where API works

**Advanced Features**
- Palette animation or transitions
- Multi-device management
- Palette version history or undo/redo beyond browser defaults
- Color harmony suggestions or palette generation tools

---

### MVP Success Criteria

**Technical Validation**
- Web MIDI connection works reliably on Chromium-based browsers
- Bidirectional sync (device → app, app → device) functions without data loss
- Real-time LED updates respond within acceptable latency (<100ms)
- `.lxp` file format correctly saves/loads all 24 colors

**User Validation**
- At least 3-5 users successfully complete full workflow (sync → edit → save)
- Colorblind user can create and save custom palette without support
- Interface is intuitive enough that YouTube tutorial covers basics in <5 minutes
- Zero critical bugs that block core workflow

**Business Validation**
- Tool reduces custom palette support requests to near-zero
- Can confidently direct users to web app instead of manual palette work
- Development time investment feels proportional to accessibility value created
- At least one production-quality colorblind palette emerges for potential factory default

**Go/No-Go Decision Point**
- If MVP receives mostly positive feedback and achieves user validation metrics → consider future enhancements
- If MVP fails to reduce support burden or users struggle with workflow → reassess approach or iterate

---

### Future Vision

**If Wildly Successful (6-12+ Months):**

**Device UI Mockup**
- Visual representation using SVG graphics
- See color changes on virtual device interface in browser
- Helps users understand LED placement without physical device connected

**Palette Templates & Guidance**
- Community-contributed colorblind palettes built into app
- Quick-start templates for common color blindness types
- Color picker with accessibility indicators (contrast warnings, colorblind simulation)

**Community Features**
- In-app palette browser with user submissions
- Palette ratings and comments
- "Most popular colorblind palettes" section
- Direct integration with Modwiggler community

**Advanced Editing Tools**
- Palette color harmony analyzer
- Bulk brightness adjustments across all colors
- A/B comparison mode (compare two palettes side-by-side)
- Palette animation preview (simulate transitions between states)

**Multi-Device & Expansion**
- Support future Tetrachords hardware revisions
- Extend to other configurable parameters (brightness, button sensitivity, themes)
- API for third-party palette editors or tools

**Platform Evolution**
- Mobile-responsive design for tablet use
- Progressive Web App (PWA) for offline editing
- Cloud sync for user palette libraries across devices

**Long-Term Ecosystem**
- Position as reference implementation for music hardware accessibility tools
- Open-source components for other manufacturers
- Industry leadership in accessible music hardware configuration

