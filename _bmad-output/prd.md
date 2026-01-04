---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
inputDocuments:
  - _bmad-output/project-planning-artifacts/product-brief-tc_lx_midi_config-2024-12-24.md
  - docs/lx_palette_ux.md
  - docs/STYLE_GUIDE.md
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 2
workflowType: 'prd'
lastStep: 11
project_name: 'tc_lx_midi_config'
user_name: 'Nick'
date: '2025-12-24'
completed: true
completedDate: '2026-01-01'
---

# Product Requirements Document - tc_lx_midi_config

**Author:** Nick
**Date:** 2025-12-24

## Executive Summary

tc_lx_midi_config is a web-based MIDI palette editor that empowers Tetrachords device users—particularly those with color blindness—to customize LED color palettes without manufacturer intervention. The tool addresses a critical accessibility gap where colorblind users (approximately 10% of the predominantly male user base) experience increased cognitive load when distinguishing between tracks. By providing real-time device synchronization via Web MIDI, users can iterate on palette designs with immediate visual feedback on their hardware, eliminating the slow and painful process of requesting hard-coded palette changes. The solution transforms accessibility customization from a weeks-long manufacturer bottleneck into a minutes-long self-service workflow, while enabling community-driven palette sharing for different types of color blindness.

### What Makes This Special

**Accessibility-First Design:**
Unlike industry standard music hardware, this tool explicitly solves for colorblind users, empowering affected users to design their own optimal solutions. This enables community-tested palettes to become hard-coded defaults, benefiting future colorblind users.

**Real-Time Hardware Preview:**
Users see changes immediately on actual device LEDs (not just web simulation), providing an instant feedback loop during design. There's no "apply" delay—users can test in actual use context while editing.

**Zero Manufacturer Dependency:**
The self-service workflow replaces weeks-long manual process, allowing users to control their own accessibility needs. This frees the manufacturer from palette customization bottleneck while turning accessibility work into a marketing-worthy feature.

**Community-Driven Palette Sharing:**
Colorblind users can share tested solutions with others, enabling different color blindness types to each have optimized palettes. The best community palettes can be promoted to factory defaults.

**No Installation Barrier:**
Browser-based Web MIDI works on any modern browser, providing instant access via URL with no software to download. This makes the tool cross-platform by default and accessible to users regardless of their technical comfort level.

## Project Classification

**Technical Type:** Web Application (SPA)
**Domain:** General (Music Hardware Accessibility)
**Complexity:** Low
**Project Context:** Greenfield - new project

This is a single-page web application that runs in the browser with real-time MIDI communication. The project uses standard web technologies (Web MIDI API) and follows general software development practices. While accessibility is a core concern, this does not fall into a highly regulated domain like healthcare or fintech, keeping complexity manageable. The focus is on creating an intuitive, self-service tool that solves a real accessibility problem for a specific user community.

## Success Criteria

### User Success

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

### Business Success

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

### Technical Success

**Web MIDI Connection**
- Web MIDI connection works reliably on Chromium-based browsers
- Connection status clearly displayed (connected/disconnected)
- Stable and predictable connection behavior

**Bidirectional Sync**
- Sync from device (device → app) functions without data loss
- Sync to device (app → device) saves palette to SD card correctly
- Real-time MIDI SysEx communication using LX Palette UX Command API

**Real-Time Performance**
- Real-time LED updates respond within acceptable latency (<100ms)
- Color adjustments immediately update device LEDs via MIDI SysEx
- Instant visual feedback while editing

**File Format Integrity**
- `.lxp` file format correctly saves/loads all 24 colors
- Palette file management works reliably (save, load, naming)

**Reliability**
- Zero critical bugs that block core workflow
- Basic error handling for connection failures and sync errors
- Self-explanatory interface requires minimal support/explanation

### Measurable Outcomes

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
- Development time investment feels proportional to value created
- Tool is maintainable with minimal ongoing effort

**What Success Looks Like:**
In 6 months, you can point any user requesting palette customization to the web app, and they successfully create their own solution without your manual intervention. You receive mostly positive feedback, obtain at least one excellent colorblind-tested palette for factory defaults, and the tool becomes a marketing point for Tetrachords' accessibility commitment. The project feels "worth it" because it solved a real problem with reasonable effort.

## Product Scope

### MVP - Minimum Viable Product

**Core Features:**

1. **Web MIDI Connection**
   - Detect and connect to Tetrachords device via Web MIDI API
   - Display connection status (connected/disconnected)
   - Works on any browser with Web MIDI API support (Chrome, Edge, Opera, Chromium-based browsers)

2. **Bidirectional Palette Sync**
   - **Sync from Device:** Load current palette from connected device into web editor
   - **Sync to Device:** Save edited palette to device SD card as `.lxp` file
   - Real-time MIDI SysEx communication using LX Palette UX Command API

3. **Color Editing Interface**
   - Color pickers for all 24 LED contexts:
     - `track_smd` - 4 colors (normal brightness track LEDs)
     - `track_smd_dim` - 4 colors (dim brightness)
     - `track_smd_medium` - 4 colors (medium/highlight brightness)
     - `track_btn[4][3]` - 12 colors (track buttons: 4 tracks × 3 brightness levels)
   - Simple, functional layout (no device UI mockup)
   - Self-explanatory interface design (tooltips added only if needed)

4. **Real-Time LED Preview**
   - Color adjustments immediately update device LEDs via MIDI SysEx
   - Instant visual feedback while editing
   - Test changes on actual hardware in real-time

5. **RGB Copy/Paste with Brightness Adjustment**
   - Copy RGB values from any color slot
   - Paste to other slots with optional brightness modifier slider
   - Efficiently create consistent color schemes with variations

6. **Palette File Management**
   - Name palettes within the app
   - Optional slot number prefix (1_ through 8_) for organized device storage
   - Save palette as `.lxp` file (downloads to user's computer)
   - Load `.lxp` files back into editor via file picker
   - Standard browser download/upload workflow

7. **Basic Error Handling**
   - Connection failure messages
   - Simple error states (device not found, sync failed, etc.)
   - No extensive troubleshooting guidance in MVP

**Out of Scope for MVP:**
- Device UI Mockup (SVG graphics showing physical interface)
- Colorblind Palette Templates or Guidance (pre-built palettes)
- Built-in Community Palette Sharing (in-app library or marketplace)
- Analytics or Usage Tracking
- Extensive Browser Compatibility Testing (Safari, Firefox)
- Advanced Features (palette animation, multi-device management, version history, color harmony suggestions)

### Growth Features (Post-MVP)

**If MVP Validates Success:**

- **Device UI Mockup**
  - Visual representation using SVG graphics
  - See color changes on virtual device interface in browser
  - Helps users understand LED placement without physical device connected

- **Palette Templates & Guidance**
  - Community-contributed colorblind palettes built into app
  - Quick-start templates for common color blindness types
  - Color picker with accessibility indicators (contrast warnings, colorblind simulation)

- **Community Features**
  - In-app palette browser with user submissions
  - Palette ratings and comments
  - "Most popular colorblind palettes" section
  - Direct integration with Modwiggler community

- **Advanced Editing Tools**
  - Palette color harmony analyzer
  - Bulk brightness adjustments across all colors
  - A/B comparison mode (compare two palettes side-by-side)
  - Palette animation preview (simulate transitions between states)

### Vision (Future)

**Long-Term Ecosystem (6-12+ Months):**

- **Multi-Device & Expansion**
  - Support future Tetrachords hardware revisions
  - Extend to other configurable parameters (brightness, button sensitivity, themes)
  - API for third-party palette editors or tools

- **Platform Evolution**
  - Mobile-responsive design for tablet use
  - Progressive Web App (PWA) for offline editing
  - Cloud sync for user palette libraries across devices

- **Industry Leadership**
  - Position as reference implementation for music hardware accessibility tools
  - Open-source components for other manufacturers
  - Industry leadership in accessible music hardware configuration

## User Journeys

### Journey 1: Marcus Chen - Reclaiming Visual Feedback

Marcus is a professional musician with deuteranopia who uses his Tetrachords device in live performances. He struggles to distinguish between tracks using the default LED palette, forcing him to memorize track positions and increasing his cognitive load during shows. After a particularly stressful performance where he lost track of which pattern was active, he searches for solutions and discovers a Modwiggler forum post about the new palette editor.

The next day, he opens the web app on his laptop. The interface is immediately clear—he connects his Tetrachords device via Web MIDI, clicks "Sync from device" to load his current palette, and sees all 24 color values displayed in an organized layout. He starts adjusting the track colors using color pickers, and immediately sees the LED changes on his physical device in real-time. He tests each track to ensure they're distinguishable with his color vision, iterating quickly with instant visual feedback.

The breakthrough comes when he finds a palette where all four tracks are clearly distinguishable to his eyes. He clicks "Sync to device" to save the palette to the SD card, and his device now permanently uses his custom palette. In his next performance, he can rely on visual feedback again instead of mental memorization, reducing cognitive load and improving his confidence on stage.

### Journey 2: Sarah Martinez - Personalizing Her Studio Setup

Sarah is a music producer who wants her Tetrachords device to match her studio aesthetic. She's not colorblind, but wants a cohesive visual look that matches her creative space. She discovers the palette editor through a YouTube tutorial and decides to experiment with it.

She opens the web app, connects her device, and syncs the current palette. She experiments with different color combinations, using the RGB copy/paste feature with brightness adjustments to create a consistent color scheme with variations. Each change updates the device LEDs in real-time, so she can see exactly how it looks in her studio lighting.

She saves a palette that perfectly matches her setup aesthetic and names it "Studio Night." She realizes she can load different palettes for different moods or projects, making the device feel more personal and integrated into her creative space. The self-explanatory interface means she never needed to read documentation—she just explored and discovered the features naturally.

### Journey 3: The Manufacturer - Reducing Support Burden

The Tetrachords team previously handled every custom palette request manually, requiring weeks of turnaround time and creating a significant support bottleneck. With the new web tool, they can now direct users to a self-service solution.

When a user contacts support requesting a custom palette, the support team sends them the web app link with a brief explanation. The user creates their own palette without any manufacturer intervention. Over time, the team gathers community-tested palettes from actual colorblind users, identifying optimal palettes for different types of color blindness that can be promoted as factory defaults.

The tool transforms accessibility work from a support burden into a marketing-worthy feature. The team can focus on other priorities while users get faster, personalized solutions. Support requests shift from "I need a custom palette" to "here's the tool link," and the community-driven approach provides data-driven insights into what actually works for colorblind users.

### Journey Requirements Summary

These journeys reveal the following core capabilities needed for tc_lx_midi_config:

**Self-Explanatory Interface Design**
- Minimal tutorial needed—users should understand the interface through exploration
- Clear visual hierarchy and intuitive controls
- Obvious connection status and sync actions
- Tooltips only added if truly necessary

**Connection and Sync Workflows**
- Simple Web MIDI device connection process
- Clear "Sync from device" action to load current palette
- Clear "Sync to device" action to save palette to SD card
- Visual feedback for connection status and sync progress

**Real-Time Visual Feedback**
- Immediate LED updates on physical device when colors are adjusted
- No delay between color picker changes and hardware response
- Ability to test palette in actual use context while editing

**Intuitive Color Editing**
- Color pickers for all 24 LED contexts organized logically
- RGB copy/paste with brightness adjustment for efficient palette design
- Ability to name and organize palettes
- File management (save/load `.lxp` files)

**Error Recovery**
- Clear error messages for connection failures
- Simple error states for sync failures
- Ability to recover from errors without losing work
- Self-explanatory error resolution (e.g., "Device not found—check USB connection")

**Community and Sharing Foundation**
- Ability to save palette files for sharing
- File format that can be easily shared via forums or other channels
- Foundation for future community features (even if not in MVP)

## Web Application Specific Requirements

### Technical Architecture

**Frontend Framework & Tooling:**
- **SPA Architecture**: Single Page Application built with React + Vite
- **Rationale**: Well-documented, battle-tested, excellent LLM-assisted development support
- **Build tooling**: Vite for fast development and optimized production builds
- **No backend required**: Pure client-side application (Web MIDI + file downloads/uploads)

**Browser Support:**
- **Target**: Chromium-based browsers only (Chrome, Edge, Opera, Brave)
- **Rationale**: Web MIDI API support is Chromium-exclusive; no need to support Firefox/Safari
- **Detection**: Display browser compatibility message for non-Chromium browsers on load
- **Version**: Modern browsers with Web MIDI API support (Chrome 43+, Edge 79+)

**Performance & Real-Time Requirements:**
- **LED Update Latency**: Target 50-100ms for real-time MIDI SysEx LED updates
- **Acceptable user experience**: Changes feel "instant" during color editing
- **MIDI Communication**: Optimize SysEx message batching if needed to stay under latency target
- **UI Responsiveness**: Color picker interactions remain smooth during MIDI communication

**Accessibility Standards:**
- **Target Level**: WCAG 2.1 Level AA compliance
- **Keyboard Navigation**: All controls accessible via Tab, Enter, Arrow keys
- **Semantic HTML**: Proper heading structure, form labels, ARIA attributes
- **Color Contrast**: Text meets 4.5:1 contrast ratio (for non-LED UI elements)
- **Focus Indicators**: Clear visual focus states for keyboard users
- **Rationale**: Standard accessibility for developer/configuration tools; appropriate for hardware configurator

**Web Standards & APIs:**
- **Web MIDI API**: Core requirement for bidirectional device communication
- **File API**: For .lxp palette file download/upload
- **Modern ES6+**: Use modern JavaScript features supported by target browsers
- **No polyfills needed**: Chromium-only target eliminates browser compatibility overhead

### Deployment & Distribution

**Hosting:**
- **Static hosting**: Simple deployment (Netlify, Vercel, GitHub Pages, or similar)
- **No server infrastructure**: Pure client-side app reduces deployment complexity
- **HTTPS required**: Web MIDI API requires secure context

**Discovery & Distribution:**
- **Direct links**: Users find tool via Modwiggler forum, YouTube tutorial, manufacturer website
- **SEO not critical**: No search engine optimization needed (direct access pattern)
- **Simple URL**: Memorable domain or subdomain for easy sharing

### Implementation Considerations

**Development Approach:**
- **LLM-assisted development**: Tooling optimized for AI code generation (React + Vite = excellent docs)
- **Component-based**: Break UI into logical React components (ColorPicker, MIDIConnection, PaletteManager)
- **State management**: Simple useState/useContext (no Redux needed for MVP scope)

**Web MIDI Integration:**
- **Device detection**: Enumerate MIDI devices and filter for Tetrachords device
- **SysEx communication**: LX Palette UX Command API implementation
- **Connection state**: Handle connect/disconnect events gracefully
- **Error handling**: MIDI permission denials, device not found, communication failures

**File Format Handling:**
- **.lxp file structure**: Parse and generate palette files matching device expectations
- **Browser downloads**: Standard download API for saving palettes
- **File picker**: Standard file input for loading palettes
- **Validation**: Basic file format validation on load

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP

tc_lx_midi_config follows a lean, problem-solving MVP strategy focused on delivering the minimum feature set that solves the core accessibility problem. The philosophy is "solve it well, then expand" rather than attempting comprehensive functionality upfront.

**Why This Approach:**
- **User validation first**: Get colorblind users testing real solutions quickly
- **Technical de-risking**: Validate Web MIDI + SysEx communication works reliably
- **Feedback-driven**: Let actual usage inform which growth features matter most
- **Resource efficiency**: Solo development with LLM assistance requires tight scope

**MVP Success Criteria:**
- 3-5 users successfully complete full workflow (sync → edit → save)
- At least one colorblind user creates production-ready palette
- Zero critical bugs blocking core workflow
- Tool reduces custom palette support requests to near-zero

**Resource Requirements:**
- **Team size**: 1 developer (LLM-assisted)
- **Tech stack**: React + Vite (well-documented for AI assistance)
- **Timeline**: No time estimates (AI-assisted development speed varies)
- **Infrastructure**: Static hosting only (Netlify/Vercel/GitHub Pages)

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Colorblind users creating custom palettes (Marcus journey)
- Aesthetic customizers personalizing devices (Sarah journey)
- Manufacturer directing users to self-service tool (Manufacturer journey)

**Must-Have Capabilities:**

1. **Web MIDI Connection**
   - Detect Tetrachords device via Web MIDI API
   - Display connection status (connected/disconnected)
   - Browser compatibility detection (Chromium-only message for others)

2. **Bidirectional Palette Sync**
   - Sync from device: Load current palette into editor (PALETTE_QUERY)
   - Sync to device: Save palette to SD card as .lxp file (PALETTE_SAVE)
   - Real-time MIDI SysEx using LX Palette UX Command API

3. **Color Editing Interface**
   - Color pickers for all 24 LED contexts (track_smd, track_smd_dim, track_smd_medium, track_btn[4][3])
   - Simple, functional layout (no device UI mockup)
   - Self-explanatory interface (minimal tutorial needed)

4. **Real-Time LED Preview**
   - Color adjustments update device LEDs immediately (PALETTE_SET_RGB)
   - 50-100ms latency target for instant feedback
   - Test changes on actual hardware while editing

5. **RGB Copy/Paste with Brightness Adjustment**
   - Copy RGB values from any color slot
   - Paste to other slots with brightness modifier slider
   - Efficient palette design workflow

6. **Palette File Management**
   - Name palettes in app
   - Optional slot number prefix (1_ through 8_)
   - Save as .lxp file (browser download)
   - Load .lxp files (file picker upload)

7. **Basic Error Handling**
   - Connection failure messages
   - Simple error states (device not found, sync failed)
   - MIDI permission denials handled gracefully
   - No extensive troubleshooting in MVP

**Explicitly Out of Scope for MVP:**
- Device UI mockup (SVG graphics of hardware interface)
- Colorblind palette templates or guidance
- Built-in community palette sharing (in-app library)
- Analytics or usage tracking
- Extensive browser compatibility (Safari/Firefox support)
- Advanced features (palette animation, multi-device, undo/redo beyond browser defaults, color harmony tools)

### Post-MVP Features

**Phase 2 (Growth) - If MVP Validates Success:**

Triggered by: Positive user feedback + reduced support burden + production-ready colorblind palette delivered

**Enhancement Focus:**
- **Device UI Mockup**: SVG visualization showing LED placement
- **Palette Templates & Guidance**: Community palettes for different colorblindness types
- **Community Features**: In-app palette browser with ratings and comments
- **Advanced Editing Tools**: Color harmony analyzer, bulk adjustments, A/B comparison

**Phase 3 (Expansion) - Long-Term Vision:**

**Multi-Device & Platform Evolution:**
- Support future Tetrachords hardware revisions
- Extend to other configurable parameters (brightness, button sensitivity, themes)
- Mobile-responsive design for tablet use
- Progressive Web App (PWA) for offline editing
- Cloud sync for user palette libraries

**Industry Leadership:**
- Reference implementation for music hardware accessibility tools
- Open-source components for other manufacturers
- API for third-party palette editors
- Industry leadership in accessible music hardware configuration

### Risk Mitigation Strategy

**Technical Risks:**

**Risk:** Web MIDI API reliability across browsers/OS
- **Mitigation**: Chromium-only target eliminates cross-browser complexity
- **Validation**: Test on Chrome/Edge/Opera early in development
- **Fallback**: Clear browser compatibility message for unsupported browsers

**Risk:** Real-time LED update latency exceeds 100ms
- **Mitigation**: Use PALETTE_SET_RGB for individual color updates (firmware spec: <10ms)
- **Validation**: Profile SysEx communication early
- **Fallback**: Debounce UI updates if needed (50ms debounce on color picker)

**Risk:** .lxp file format parsing/generation issues
- **Mitigation**: LX Palette UX API spec provides complete file format documentation
- **Validation**: Test save/load with actual device early
- **Fallback**: Manual file inspection/debugging tools

**Market Risks:**

**Risk:** Colorblind users don't adopt tool (too complex)
- **Mitigation**: Self-explanatory interface design, minimal tutorial needed
- **Validation**: Beta test with actual colorblind users before public launch
- **Fallback**: Iterate on UX based on beta feedback

**Risk:** Tool doesn't reduce support burden (users still contact manufacturer)
- **Mitigation**: YouTube tutorial video + Modwiggler announcement with clear instructions
- **Validation**: Track support requests pre/post launch
- **Fallback**: Improve documentation and add troubleshooting guide

**Risk:** No production-ready colorblind palette emerges
- **Mitigation**: Start with theoretically accessible palette, pass to beta tester
- **Validation**: Work directly with colorblind beta testers
- **Fallback**: Manufacturer designs palette based on beta feedback

**Resource Risks:**

**Risk:** Development takes longer than expected
- **Mitigation**: LLM-assisted development with well-documented tech stack (React + Vite)
- **Validation**: Build core MIDI communication proof-of-concept first
- **Fallback**: Release with reduced feature set if needed (e.g., skip copy/paste initially)

**Risk:** Maintenance burden exceeds capacity
- **Mitigation**: Static hosting, no backend, minimal ongoing infrastructure
- **Validation**: Code for maintainability (clear component structure)
- **Fallback**: Community contributions if tool gains traction

## Functional Requirements

### Device Connection & Communication

- FR1: Users can detect Tetrachords devices connected via Web MIDI API
- FR2: Users can view connection status (connected/disconnected) for their device
- FR3: Users can establish MIDI SysEx communication with connected Tetrachords device
- FR4: Users can receive browser compatibility warnings when using non-Chromium browsers
- FR5: System can handle MIDI permission requests and denials gracefully

### Palette Synchronization

- FR6: Users can load the current active palette from their connected device into the editor
- FR7: Users can query palette data for all 24 LED contexts from the device
- FR8: Users can save edited palettes from the editor to the device SD card
- FR9: Users can specify palette names when saving to device
- FR10: Users can include optional slot number prefixes (1_ through 8_) in palette names

### Color Editing & Customization

- FR11: Users can edit RGB values for track_smd LED contexts (4 colors, normal brightness)
- FR12: Users can edit RGB values for track_smd_dim LED contexts (4 colors, dim brightness)
- FR13: Users can edit RGB values for track_smd_medium LED contexts (4 colors, medium/highlight brightness)
- FR14: Users can edit RGB values for track_btn LED contexts (12 colors: 4 tracks × 3 brightness levels)
- FR15: Users can select colors using standard color picker interfaces
- FR16: Users can copy RGB values from any color slot
- FR17: Users can paste RGB values to other color slots
- FR18: Users can apply brightness adjustment modifiers when pasting colors
- FR19: Users can view all 24 LED color contexts simultaneously in the interface

### Real-Time Visual Feedback

- FR20: Users can see color changes immediately on physical device LEDs as they edit
- FR21: System can send individual RGB value updates via MIDI SysEx (PALETTE_SET_RGB)
- FR22: Users can test palette distinguishability on actual hardware during editing
- FR23: System can maintain LED update latency within acceptable thresholds for instant feedback

### Palette File Management

- FR24: Users can save palettes as .lxp files to their computer
- FR25: Users can load .lxp files from their computer into the editor
- FR26: Users can name palettes within the application
- FR27: System can validate .lxp file format on load
- FR28: Users can download palette files using standard browser download mechanisms
- FR29: Users can upload palette files using standard browser file picker

### User Assistance & Error Handling

- FR30: Users can view error messages when device connection fails
- FR31: Users can view error messages when MIDI synchronization fails
- FR32: Users can view error messages when palette save operations fail
- FR33: Users can view error messages when palette load operations fail
- FR34: Users can view error messages when device is not found
- FR35: System can detect and report MIDI permission denial
- FR36: System can provide clear error states without requiring technical knowledge
- FR37: Users with keyboard-only navigation can access all editor functionality (WCAG 2.1 AA)
- FR38: Users with screen readers can understand interface structure and controls (WCAG 2.1 AA)

## Non-Functional Requirements

### Performance

**Real-Time LED Update Latency:**
- NFR1: LED color updates must complete within 50-100ms of user color picker interaction to provide instant visual feedback
- NFR2: MIDI SysEx message transmission (PALETTE_SET_RGB) must complete within <10ms per individual color update
- NFR3: Color picker UI interactions must remain responsive (no freezing or lag) during MIDI communication
- NFR4: Initial palette query (PALETTE_QUERY) must complete within 500ms of connection establishment

**UI Responsiveness:**
- NFR5: User interface must respond to all user interactions within 100ms (buttons, inputs, color pickers)
- NFR6: Application must load and become interactive within 3 seconds on typical broadband connections

### Accessibility

**WCAG 2.1 Level AA Compliance:**
- NFR7: All interactive controls must be operable via keyboard alone (Tab, Enter, Arrow keys)
- NFR8: All form fields and controls must have proper semantic HTML labels
- NFR9: All meaningful images and icons must have text alternatives
- NFR10: Color contrast for all text elements must meet 4.5:1 ratio minimum
- NFR11: Focus indicators must be clearly visible for keyboard navigation
- NFR12: Screen reader users must be able to understand and operate all editor functionality
- NFR13: Application must provide proper ARIA attributes for complex interactions

### Integration

**Web MIDI API Compatibility:**
- NFR14: Application must successfully establish Web MIDI access with SysEx permission on Chromium-based browsers (Chrome 43+, Edge 79+, Opera, Brave)
- NFR15: Application must detect and enumerate Tetrachords devices via Web MIDI API within 2 seconds of connection
- NFR16: Application must maintain stable bidirectional MIDI communication without dropped messages under normal network conditions
- NFR17: Application must handle MIDI device disconnect/reconnect gracefully without data loss

**LX Palette UX Command API Compliance:**
- NFR18: All MIDI SysEx messages must conform to LX Palette UX Command API specification (manufacturer ID 0x77, device ID 0x01, command 0x41)
- NFR19: Application must correctly encode/decode 12-bit RGB values (0-4095) using two 7-bit MIDI bytes
- NFR20: Application must handle all LX Palette UX API error codes (0x01-0x16) and display appropriate user messages

**File Format Compatibility:**
- NFR21: Application must correctly parse and generate .lxp palette files matching device expectations
- NFR22: Application must validate .lxp file structure on load and reject invalid formats with clear error messages

### Reliability

**Error Handling & Recovery:**
- NFR23: Application must detect and report all MIDI connection failures with actionable error messages
- NFR24: Application must gracefully handle MIDI permission denials and guide users to grant access
- NFR25: Application must detect browser incompatibility (non-Chromium) on load and display compatibility warning
- NFR26: Application must recover from temporary MIDI communication errors without requiring page reload
- NFR27: Application must prevent user data loss during palette editing (browser localStorage fallback for unsaved changes)

**Uptime & Availability:**
- NFR28: Static hosting infrastructure must maintain 99% uptime (measured monthly)
- NFR29: Application must function completely offline once loaded (no runtime API dependencies)
- NFR30: Application must handle network disconnects gracefully and resume MIDI communication when reconnected

