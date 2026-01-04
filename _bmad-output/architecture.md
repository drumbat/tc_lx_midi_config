---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
completedAt: '2026-01-04'
inputDocuments:
  - _bmad-output/prd.md
  - _bmad-output/project-planning-artifacts/ux-design-specification.md
  - _bmad-output/project-planning-artifacts/product-brief-tc_lx_midi_config-2024-12-24.md
  - docs/lx_palette_ux.md
  - docs/STYLE_GUIDE.md
  - docs/TC_Faceplate.svg
workflowType: 'architecture'
project_name: 'tc_lx_midi_config'
user_name: 'Nick'
date: '2026-01-04'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The PRD defines 38 functional requirements spanning 6 categories:

1. **Device Connection & Communication** (FR1-5): Web MIDI API integration with Tetrachords device detection, SysEx communication, and graceful permission handling
2. **Palette Synchronization** (FR6-10): Bidirectional sync using PALETTE_QUERY and PALETTE_SAVE operations, with slot naming support (1-8 prefix)
3. **Color Editing & Customization** (FR11-19): Full editing for 24 LED contexts organized into 4 field types, with copy/paste and brightness adjustment
4. **Real-Time Visual Feedback** (FR20-23): Immediate hardware LED updates via PALETTE_SET_RGB during color picker interaction
5. **Palette File Management** (FR24-29): .lxp file save/load using browser File API with format validation
6. **User Assistance & Error Handling** (FR30-38): Clear error messaging for all failure modes, WCAG 2.1 AA accessibility

**Non-Functional Requirements:**
30 NFRs organized into 4 categories with specific, measurable targets:

- **Performance** (NFR1-6): 50-100ms LED latency, <10ms per SysEx, 3s initial load
- **Accessibility** (NFR7-13): WCAG 2.1 Level AA, keyboard navigation, ARIA support
- **Integration** (NFR14-22): Web MIDI API, LX Palette UX Command API compliance, .lxp format
- **Reliability** (NFR23-30): Error recovery, localStorage fallback, 99% uptime

**Scale & Complexity:**

- Primary domain: Web SPA with hardware integration (Web MIDI + MIDI SysEx)
- Complexity level: Low-Medium
- Estimated architectural components: 8-12 React components + MIDI service layer

### Technical Constraints & Dependencies

**Browser Constraints:**
- Chromium-only target (Chrome, Edge, Opera, Brave) - Web MIDI API requirement
- HTTPS required for Web MIDI access
- SysEx permission must be explicitly requested

**Hardware Protocol Constraints:**
- All MIDI bytes must be 7-bit (0x00-0x7F)
- 12-bit RGB values (0-4095) encoded as MSB/LSB pairs
- 256-byte maximum SysEx message buffer
- RGB channel order is R, B, G (not RGB)
- Factory slots 0-1 are write-protected

**Data Structure Constraints:**
- 24 colors organized into 4 fields with different indexing:
  - Fields 0-2: Single index (track_idx 0-3)
  - Field 3: Double index (track_idx 0-3, brightness_idx 0-2)
- Palette names: alphanumeric, underscore, hyphen only; max 32 chars

### Cross-Cutting Concerns Identified

1. **MIDI Communication Layer**: All palette operations depend on stable bidirectional SysEx communication with request/response patterns and timeout handling
2. **Error State Management**: 17 error codes from firmware must map to user-friendly messages across all operations
3. **Real-Time Feedback Loop**: Color picker → MIDI SysEx → hardware LED must complete in <100ms consistently
4. **Accessibility**: Every interactive element needs keyboard navigation, focus states, and ARIA attributes
5. **State Synchronization**: UI state must reflect actual device state; handle disconnect/reconnect gracefully

## Starter Template Evaluation

### Primary Technology Domain

Web SPA with Hardware Integration - Client-side React application with real-time MIDI device communication via Web MIDI API.

### Starter Options Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| Official Vite React-TS | Maintained, minimal, current | Manual Tailwind setup | ✅ Selected |
| Third-party boilerplates | Pre-configured Tailwind | Extra dependencies, may be stale | ❌ Too opinionated |
| Create React App | Familiar | Deprecated, slow builds | ❌ Not recommended |

### Selected Starter: Vite React-TS + Tailwind v4

**Rationale for Selection:**
- Official Vite template ensures long-term maintenance and Vite 7.x compatibility
- Tailwind CSS v4 Vite plugin provides zero-config integration with first-party support
- Clean TypeScript setup optimized for LLM-assisted development
- No unnecessary abstractions that could complicate Web MIDI integration
- Matches PRD's explicit technology choices

**Initialization Command:**

```bash
npm create vite@latest tc_lx_midi_config -- --template react-ts
cd tc_lx_midi_config
npm install
npm install -D tailwindcss @tailwindcss/vite
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript 5.x with strict mode enabled
- ES2022+ target for modern browser features
- ESM-only distribution (Vite 7.x default)

**Styling Solution:**
- Tailwind CSS v4 via `@tailwindcss/vite` plugin
- CSS-based configuration (no tailwind.config.js needed)
- Single `@import "tailwindcss";` in main CSS file

**Build Tooling:**
- Vite 7.x with ESBuild for development (fast HMR)
- Rollup for production builds (optimized bundles)
- Lightning CSS for production CSS optimization

**Code Organization:**
- `src/` directory with `main.tsx` entry point
- `src/App.tsx` as root component
- `public/` for static assets

**Development Experience:**
- Hot Module Replacement with React Fast Refresh
- Native ESM for instant server start
- TypeScript type checking in IDE

**Testing Framework:**
- Not included by default
- Vitest recommended for Vite-native testing

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- MIDI communication layer architecture
- TypeScript interfaces for palette data
- Testing infrastructure

**Important Decisions (Shape Architecture):**
- State management approach
- Component folder structure
- Error handling strategy

**Deferred Decisions:**
- None - full production build

### Frontend Architecture

**State Management: useState + useContext**
- Rationale: Project scale doesn't require external state library
- Palette data is tightly coupled, edited as a unit
- Connection state managed via dedicated context
- No Redux or Zustand needed

**Component Architecture: Type-Based Folders**
```
src/
  components/     # UI components (ColorWheel, Faceplate, etc.)
  hooks/          # Custom hooks (useMidiConnection, usePalette)
  services/       # MIDI communication layer
  types/          # TypeScript interfaces
  utils/          # Helper functions (encoding, color math)
```

**MIDI Communication Layer: Service Class + Hooks**
- `services/midi/MidiService.ts` - Web MIDI API wrapper, connection management
- `services/midi/LXPaletteAPI.ts` - 9 palette operations implementation
- `services/midi/SysExParser.ts` - Message encoding/decoding
- `hooks/useMidiConnection.ts` - Connection state for React
- `hooks/usePalette.ts` - Palette data + operations for React

### Data Architecture

**TypeScript Interfaces:**
```typescript
interface RGB12 {
  r: number;  // 0-4095
  g: number;  // 0-4095
  b: number;  // 0-4095
}

interface Palette {
  slot: number;
  status: 'empty' | 'factory' | 'user_loaded' | 'user_modified';
  track_smd: [RGB12, RGB12, RGB12, RGB12];
  track_smd_dim: [RGB12, RGB12, RGB12, RGB12];
  track_smd_medium: [RGB12, RGB12, RGB12, RGB12];
  track_btn: [[RGB12, RGB12, RGB12], [RGB12, RGB12, RGB12],
              [RGB12, RGB12, RGB12], [RGB12, RGB12, RGB12]];
}

interface SlotInfo {
  activeSlot: number;
  hwVersion: 0 | 1;
  slotStatus: Array<'empty' | 'factory' | 'user_loaded' | 'user_modified'>;
}
```

**Error Handling: Categorized Error Messages**
```typescript
type ErrorCategory = 'connection' | 'sd' | 'validation' | 'protocol';

const UX_ERRORS: Record<number, { message: string; category: ErrorCategory }> = {
  0x01: { message: 'Invalid slot number', category: 'validation' },
  0x02: { message: 'Invalid field ID', category: 'validation' },
  0x03: { message: 'Invalid track index', category: 'validation' },
  0x04: { message: 'Invalid brightness index', category: 'validation' },
  0x05: { message: 'Invalid channel', category: 'validation' },
  0x06: { message: 'Value out of range', category: 'validation' },
  0x07: { message: 'Slot is empty', category: 'validation' },
  0x08: { message: 'Cannot modify factory palette', category: 'validation' },
  0x10: { message: 'SD card not ready. Check card is inserted.', category: 'sd' },
  0x11: { message: 'Failed to write to SD card', category: 'sd' },
  0x12: { message: 'Palette name too long (max 32 characters)', category: 'validation' },
  0x13: { message: 'Invalid characters in palette name', category: 'validation' },
  0x14: { message: 'Palette file not found', category: 'sd' },
  0x15: { message: 'Palette file is corrupted', category: 'sd' },
  0x16: { message: 'Hardware version mismatch', category: 'protocol' },
};
```

### Infrastructure & Deployment

**Hosting: GitHub Pages**
- Static site deployment from `gh-pages` branch or `/docs` folder
- HTTPS provided (required for Web MIDI API)
- Free tier sufficient for project scale
- CI/CD via GitHub Actions

### Testing Strategy

**Full Production Testing Stack:**

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest 4.x | MIDI encoding/decoding, color math, utility functions |
| Component | Vitest + @testing-library/react | UI components, accessibility, user interactions |
| E2E | Playwright | Complete user journeys with mocked MIDI |

**Test Infrastructure:**
- Vitest for unit and component tests (Vite-native, fast)
- React Testing Library for component testing (accessibility-first)
- Playwright for E2E tests (real browser, reliable)
- Custom MIDI mock service for simulating device responses
- Coverage reporting via Vitest

**Testing Priorities:**
1. MIDI protocol layer (encoding/decoding correctness is critical)
2. Color manipulation utilities (12-bit conversion, brightness adjustment)
3. Accessibility compliance (keyboard navigation, ARIA attributes)
4. User journey flows (connect → edit → save)

### Decision Impact Analysis

**Implementation Sequence:**
1. Project initialization with Vite + Tailwind
2. TypeScript interfaces and types
3. MIDI service layer with unit tests
4. React hooks wrapping MIDI service
5. UI components with component tests
6. E2E test suite with mocked MIDI
7. GitHub Pages deployment pipeline

**Cross-Component Dependencies:**
- All UI components depend on `usePalette` hook
- `usePalette` depends on `LXPaletteAPI` service
- `LXPaletteAPI` depends on `MidiService` for transport
- Error handling flows through all layers to UI

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Addressed:** 15 areas where AI agents could make different choices, now standardized.

### Naming Patterns

**File Naming Conventions:**

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase.tsx | `ColorWheel.tsx`, `FaceplateViewer.tsx` |
| Hooks | camelCase with `use` prefix | `useMidiConnection.ts`, `usePalette.ts` |
| Services | PascalCase with descriptive suffix | `MidiService.ts`, `LXPaletteAPI.ts` |
| Utilities | camelCase | `colorMath.ts`, `sysexEncoding.ts` |
| Types | PascalCase in `types/` | `types/palette.ts`, `types/midi.ts` |
| Tests | Same name + `.test.ts` | `MidiService.test.ts` |

**Code Naming Conventions:**

| Type | Convention | Example |
|------|------------|---------|
| Interfaces | PascalCase, no `I` prefix | `Palette`, `RGB12`, `SlotInfo` |
| Type aliases | PascalCase | `ErrorCategory`, `SlotStatus` |
| Functions | camelCase, verb-first | `queryPalette()`, `encode12Bit()` |
| Constants | SCREAMING_SNAKE_CASE | `UX_ERRORS`, `MANUFACTURER_ID` |
| React components | PascalCase | `ColorWheel`, `TrackButton` |
| Hook returns | object with named properties | `{ palette, isLoading, error, setColor }` |

### Structure Patterns

**Test Location:** Co-located with source files
```
src/
  services/
    midi/
      MidiService.ts
      MidiService.test.ts
      LXPaletteAPI.ts
      LXPaletteAPI.test.ts
  components/
    ColorWheel/
      ColorWheel.tsx
      ColorWheel.test.tsx
```

**Component Organization:** Flat within `components/`, subfolder only if component has multiple files
```
src/components/
  ConnectionStatus.tsx        # Simple component
  ColorWheel/                 # Complex component with sub-files
    ColorWheel.tsx
    ColorWheel.test.tsx
    useColorWheelInteraction.ts
```

### Format Patterns

**Color Value Representations:**
```typescript
// Internal: Always use RGB12 interface (0-4095)
const color: RGB12 = { r: 2048, g: 1024, b: 512 };

// Display: Convert to CSS hex for rendering
const cssHex = rgb12ToCssHex(color); // "#808040"

// MIDI: Encode as MSB/LSB pairs only at transmission boundary
const [rMsb, rLsb] = encode12Bit(color.r);
```

**Hook Return Signatures:**
```typescript
// Consistent pattern for all data hooks
interface UseHookResult<T> {
  data: T | null;
  isLoading: boolean;
  error: AppError | null;
}

// Example usage
const { palette, isLoading, error } = usePalette(slotIndex);
```

**Error Objects:**
```typescript
interface AppError {
  message: string;           // User-facing message
  category: ErrorCategory;   // 'connection' | 'sd' | 'validation' | 'protocol'
  code?: number;             // UX_ERR_* code if from firmware
  recoverable: boolean;      // Can user retry?
}
```

### Communication Patterns

**State Update Pattern:** Immutable updates only
```typescript
// ✅ Correct: Return new object
setPalette(prev => ({
  ...prev,
  track_smd: prev.track_smd.map((c, i) =>
    i === trackIdx ? newColor : c
  ) as [RGB12, RGB12, RGB12, RGB12]
}));

// ❌ Wrong: Never mutate directly
palette.track_smd[trackIdx] = newColor;
```

**Event/Callback Naming:**
```typescript
// Props: on + Event
onColorChange?: (color: RGB12) => void;
onSlotSelect?: (slot: number) => void;
onConnectionChange?: (connected: boolean) => void;

// Handlers: handle + Event
const handleColorChange = (color: RGB12) => { ... };
```

### Process Patterns

**Loading State Pattern:**
```typescript
// Each async operation has its own loading state
const [isConnecting, setIsConnecting] = useState(false);
const [isSyncing, setIsSyncing] = useState(false);
const [isSaving, setIsSaving] = useState(false);

// Never use a single global isLoading for multiple operations
```

**Error Recovery Pattern:**
```typescript
// Connection errors: Show reconnect button
// SD card errors: Show retry button with clear message
// Validation errors: Highlight field, show inline message
// Protocol errors: Show "Contact support" message
```

**MIDI Timeout Pattern:**
```typescript
const MIDI_TIMEOUT_MS = 500;

// All MIDI requests timeout after 500ms
// Timeout results in recoverable error with retry option
```

### Enforcement Guidelines

**All AI Agents MUST:**
1. Follow naming conventions exactly (PascalCase components, camelCase hooks)
2. Co-locate test files with source files
3. Use `RGB12` interface for all internal color handling
4. Return `{ data, isLoading, error }` pattern from data hooks
5. Use immutable state updates only
6. Never directly mutate palette data
7. Use TypeScript strict mode - no `any` types

**Pattern Verification:**
- ESLint rules enforce naming conventions
- TypeScript compiler enforces type patterns
- Test coverage requirements enforce test co-location
- Code review checklist includes pattern compliance

### Pattern Examples

**Good Example - Component with Hook:**
```typescript
// src/components/ColorWheel/ColorWheel.tsx
import { useColorPicker } from '../../hooks/useColorPicker';
import type { RGB12 } from '../../types/palette';

interface ColorWheelProps {
  color: RGB12;
  onColorChange: (color: RGB12) => void;
}

export function ColorWheel({ color, onColorChange }: ColorWheelProps) {
  const { handleWheelClick, handleDrag } = useColorPicker(onColorChange);
  // ...
}
```

**Anti-Patterns to Avoid:**
```typescript
// ❌ Wrong file name: colorWheel.tsx (should be PascalCase)
// ❌ Wrong interface: IColorWheelProps (no I prefix)
// ❌ Wrong constant: manufacturerId (should be MANUFACTURER_ID)
// ❌ Wrong mutation: color.r = 2048 (use immutable update)
// ❌ Wrong hook return: return [data, loading] (use object)
```

## Project Structure & Boundaries

### Requirements to Structure Mapping

| FR Category | Maps To |
|-------------|---------|
| Device Connection (FR1-5) | `services/midi/`, `hooks/useMidiConnection.ts` |
| Palette Sync (FR6-10) | `services/midi/LXPaletteAPI.ts`, `hooks/usePalette.ts` |
| Color Editing (FR11-19) | `components/ColorWheel/`, `components/BrightnessSlider.tsx` |
| Real-Time Feedback (FR20-23) | `hooks/usePalette.ts`, `services/midi/` |
| File Management (FR24-29) | `utils/fileHandlers.ts`, `components/FileControls.tsx` |
| Error Handling (FR30-38) | `components/ErrorDisplay.tsx`, `types/errors.ts` |

### Complete Project Directory Structure

```
tc_lx_midi_config/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Test + lint on PR
│       └── deploy.yml                # Deploy to GitHub Pages
├── public/
│   ├── TC_Faceplate.svg              # Interactive faceplate
│   └── favicon.ico
├── src/
│   ├── main.tsx                      # App entry point
│   ├── App.tsx                       # Root component with providers
│   ├── index.css                     # Tailwind import + custom styles
│   │
│   ├── components/
│   │   ├── App/
│   │   │   ├── App.tsx               # Main layout wrapper
│   │   │   └── App.test.tsx
│   │   ├── ConnectionStatus.tsx      # MIDI connection indicator
│   │   ├── ConnectionStatus.test.tsx
│   │   ├── ColorWheel/
│   │   │   ├── ColorWheel.tsx        # HSL color wheel with complementary line
│   │   │   ├── ColorWheel.test.tsx
│   │   │   └── useColorWheelDrag.ts  # Drag interaction hook
│   │   ├── BrightnessSlider.tsx      # Vertical brightness control
│   │   ├── BrightnessSlider.test.tsx
│   │   ├── RGBInputGroup.tsx         # R/G/B numeric inputs
│   │   ├── RGBInputGroup.test.tsx
│   │   ├── Faceplate/
│   │   │   ├── Faceplate.tsx         # Interactive SVG faceplate
│   │   │   ├── Faceplate.test.tsx
│   │   │   └── useFaceplateClick.ts  # LED click handling
│   │   ├── TrackButtons.tsx          # Virtual track button controls
│   │   ├── TrackButtons.test.tsx
│   │   ├── SlotSelector.tsx          # Palette slot dropdown (1-8)
│   │   ├── SlotSelector.test.tsx
│   │   ├── FileControls.tsx          # Save/Load .lxp buttons
│   │   ├── FileControls.test.tsx
│   │   ├── ErrorDisplay.tsx          # Toast/alert for errors
│   │   └── ErrorDisplay.test.tsx
│   │
│   ├── hooks/
│   │   ├── useMidiConnection.ts      # Connection state + reconnect
│   │   ├── useMidiConnection.test.ts
│   │   ├── usePalette.ts             # Palette data + edit operations
│   │   ├── usePalette.test.ts
│   │   ├── useColorPicker.ts         # Color selection coordination
│   │   └── useColorPicker.test.ts
│   │
│   ├── services/
│   │   └── midi/
│   │       ├── MidiService.ts        # Web MIDI API wrapper
│   │       ├── MidiService.test.ts
│   │       ├── LXPaletteAPI.ts       # 9 palette operations
│   │       ├── LXPaletteAPI.test.ts
│   │       ├── SysExParser.ts        # Message encode/decode
│   │       ├── SysExParser.test.ts
│   │       └── constants.ts          # MANUFACTURER_ID, opcodes
│   │
│   ├── types/
│   │   ├── palette.ts                # RGB12, Palette, SlotInfo
│   │   ├── midi.ts                   # MidiMessage, SysExResponse
│   │   └── errors.ts                 # AppError, ErrorCategory
│   │
│   ├── utils/
│   │   ├── colorMath.ts              # rgb12ToCssHex, hslToRgb12, etc.
│   │   ├── colorMath.test.ts
│   │   ├── sysexEncoding.ts          # encode12Bit, decode12Bit
│   │   ├── sysexEncoding.test.ts
│   │   ├── fileHandlers.ts           # .lxp file read/write
│   │   └── fileHandlers.test.ts
│   │
│   └── context/
│       ├── MidiContext.tsx           # MIDI connection provider
│       └── PaletteContext.tsx        # Palette state provider
│
├── tests/
│   ├── e2e/
│   │   ├── connect-and-edit.spec.ts  # Full user journey
│   │   ├── save-load-palette.spec.ts # File operations
│   │   └── fixtures/
│   │       └── mockMidiDevice.ts     # Mock MIDI for E2E
│   └── setup.ts                      # Vitest global setup
│
├── .gitignore
├── .eslintrc.cjs                     # ESLint config
├── index.html                        # Vite entry HTML
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts                    # Vite + Tailwind plugin
├── vitest.config.ts                  # Vitest config
├── playwright.config.ts              # Playwright E2E config
└── README.md
```

### Architectural Boundaries

**Component Boundary Diagram:**
```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   MidiContext                           ││
│  │  ┌──────────────────────────────────────────────────┐  ││
│  │  │                PaletteContext                     │  ││
│  │  │                                                    │  ││
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │  ││
│  │  │  │Faceplate │  │ColorWheel│  │  TrackButtons    │ │  ││
│  │  │  └────┬─────┘  └────┬─────┘  └────────┬─────────┘ │  ││
│  │  │       │              │                 │           │  ││
│  │  │       └──────────────┴─────────────────┘           │  ││
│  │  │                      │                             │  ││
│  │  │               usePalette()                         │  ││
│  │  └──────────────────────┼────────────────────────────┘  ││
│  │                         │                               ││
│  │                 useMidiConnection()                     ││
│  └─────────────────────────┼───────────────────────────────┘│
│                            │                                 │
│                    ┌───────▼───────┐                        │
│                    │ LXPaletteAPI  │                        │
│                    └───────┬───────┘                        │
│                            │                                 │
│                    ┌───────▼───────┐                        │
│                    │  MidiService  │                        │
│                    └───────┬───────┘                        │
│                            │                                 │
│                    ┌───────▼───────┐                        │
│                    │ Web MIDI API  │ (Browser)              │
└────────────────────┴───────────────┴────────────────────────┘
```

**Service Boundaries:**
- `MidiService`: Raw Web MIDI API - connection, send, receive only
- `LXPaletteAPI`: Protocol-specific - palette operations, no connection logic
- `SysExParser`: Pure functions - encoding/decoding, no side effects

**Data Flow:**
1. User clicks LED on Faceplate → `usePalette.selectLED(field, track, brightness)`
2. User adjusts ColorWheel → `usePalette.setColor(rgb12)`
3. `usePalette` calls `LXPaletteAPI.setRGBValue()` → SysEx to device
4. Device updates LED → Response confirms → UI state updates

### Integration Points

**External Integration: Web MIDI API**
- Entry point: `MidiService.requestAccess()`
- SysEx permission: Explicitly requested with `{ sysex: true }`
- Device detection: Filter by name containing "Tetrachords"

**Internal Communication:**
- Components → Hooks: Props and callbacks
- Hooks → Services: Direct method calls, async/await
- Services → Browser: Web MIDI API

**State Flow:**
- Connection state: `MidiContext` → `useMidiConnection()` → components
- Palette data: `PaletteContext` → `usePalette()` → components
- Local UI state: Component-level `useState`

### File Organization Patterns

**Configuration Files (root level):**
- `vite.config.ts` - Build configuration with Tailwind plugin
- `vitest.config.ts` - Unit/component test configuration
- `playwright.config.ts` - E2E test configuration
- `tsconfig.json` - TypeScript strict mode configuration
- `.eslintrc.cjs` - Linting rules enforcing naming conventions

**Test Organization:**
- Unit/component tests: Co-located with source (`.test.ts` suffix)
- E2E tests: `tests/e2e/` directory with Playwright specs
- Test fixtures: `tests/e2e/fixtures/` for mock data and services

**Asset Organization:**
- Static assets: `public/` directory (faceplate SVG, favicon)
- No dynamic assets - all content from MIDI device

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:** All technology choices verified compatible:
- Vite 7.x + React 18+ + TypeScript 5.x + Tailwind v4 ✅
- Vitest 4.x native integration with Vite ✅
- Playwright aligned with Chromium-only target ✅

**Pattern Consistency:** All patterns aligned with technology stack and React best practices.

**Structure Alignment:** Project structure supports all architectural decisions and component boundaries.

### Requirements Coverage Validation ✅

**Functional Requirements:** All 38 FRs mapped to specific components, hooks, or services.

| FR Category | Covered By |
|-------------|------------|
| FR1-5 (Connection) | `MidiService`, `useMidiConnection` |
| FR6-10 (Sync) | `LXPaletteAPI`, `usePalette` |
| FR11-19 (Color Edit) | `ColorWheel`, `BrightnessSlider`, `RGBInputGroup` |
| FR20-23 (Real-Time) | `usePalette` + `LXPaletteAPI.setRGBValue()` |
| FR24-29 (File Mgmt) | `fileHandlers.ts`, `FileControls` |
| FR30-38 (Error) | `ErrorDisplay`, `types/errors.ts` |

**Non-Functional Requirements:** All 30 NFRs addressed architecturally:
- Performance: Direct MIDI calls, <100ms target achievable
- Accessibility: Component testing with React Testing Library
- Integration: Full LX Palette UX API implementation
- Reliability: Error patterns, timeout handling, localStorage fallback

### Implementation Readiness Validation ✅

**Decision Completeness:** All critical decisions documented with verified versions.

**Structure Completeness:** Complete project tree with 50+ files defined.

**Pattern Completeness:** 15 conflict points addressed with examples.

### Gap Analysis Results

**Critical Gaps:** None

**Minor Gaps (addressable during implementation):**
- Accessibility testing: Add `axe-core` integration during component test setup
- MIDI mock: Implement detailed mock during E2E test development

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Low-Medium)
- [x] Technical constraints identified (Chromium-only, MIDI protocol)
- [x] Cross-cutting concerns mapped (5 identified)

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Testing strategy comprehensive

**✅ Implementation Patterns**
- [x] Naming conventions established (7 categories)
- [x] Structure patterns defined (co-located tests, type-based folders)
- [x] Communication patterns specified (callbacks, state updates)
- [x] Process patterns documented (loading, errors, timeouts)

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High - all decisions validated, no blocking issues

**Key Strengths:**
- Clean separation of MIDI protocol from React components
- Comprehensive TypeScript types for all data structures
- Full testing coverage strategy (unit, component, E2E)
- Explicit patterns prevent AI agent conflicts

**Areas for Future Enhancement:**
- Performance monitoring/metrics during implementation
- Detailed accessibility audit post-implementation

### Implementation Handoff

**AI Agent Guidelines:**
1. Follow all architectural decisions exactly as documented
2. Use implementation patterns consistently across all components
3. Respect project structure and boundaries
4. Refer to this document for all architectural questions
5. Co-locate tests with source files
6. Use TypeScript strict mode - no `any` types

**First Implementation Priority:**
```bash
npm create vite@latest tc_lx_midi_config -- --template react-ts
cd tc_lx_midi_config
npm install
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react playwright
```

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2026-01-04
**Document Location:** `_bmad-output/architecture.md`

### Final Architecture Deliverables

**Complete Architecture Document**
- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**Implementation Ready Foundation**
- 12+ architectural decisions made
- 15 implementation patterns defined
- 10+ architectural components specified
- 68 requirements (38 FR + 30 NFR) fully supported

**AI Agent Implementation Guide**
- Technology stack with verified versions
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries
- Integration patterns and communication standards

### Development Sequence

1. Initialize project using documented starter template
2. Set up development environment per architecture
3. Implement TypeScript types and interfaces
4. Build MIDI service layer with unit tests
5. Create React hooks wrapping services
6. Build UI components with component tests
7. Add E2E tests with mocked MIDI
8. Deploy to GitHub Pages

### Quality Assurance Checklist

**✅ Architecture Coherence**
- [x] All decisions work together without conflicts
- [x] Technology choices are compatible
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices

**✅ Requirements Coverage**
- [x] All functional requirements are supported
- [x] All non-functional requirements are addressed
- [x] Cross-cutting concerns are handled
- [x] Integration points are defined

**✅ Implementation Readiness**
- [x] Decisions are specific and actionable
- [x] Patterns prevent agent conflicts
- [x] Structure is complete and unambiguous
- [x] Examples are provided for clarity

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.

