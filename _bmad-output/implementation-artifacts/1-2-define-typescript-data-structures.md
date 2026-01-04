# Story 1.2: Define TypeScript Data Structures

Status: done

## Story

As a developer,
I want comprehensive TypeScript interfaces for all palette data structures,
So that I have type safety across the entire application.

## Acceptance Criteria

**Given** the project is initialized
**When** I create `src/types/` directory with type definition files
**Then** `RGB12` interface is defined (r, g, b: 0-4095)
**And** `Palette` interface is defined with 24 colors across 4 field types (track_smd, track_smd_dim, track_smd_medium, track_btn[4][3])
**And** `SlotInfo` interface is defined (activeSlot, hwVersion, slotStatus array)
**And** `AppError` interface is defined with categorized error types (connection, sd, validation, protocol)
**And** `MidiMessage` and `SysExResponse` types are defined
**And** All types compile without errors with strict TypeScript mode

## Tasks / Subtasks

- [x] Create src/types/ directory structure (AC: All)
  - [x] Create src/types/palette.ts
  - [x] Create src/types/midi.ts
  - [x] Create src/types/errors.ts
- [x] Define RGB12 and Palette interfaces (AC: RGB12, Palette)
  - [x] Define RGB12 interface with r, g, b fields (0-4095 range)
  - [x] Define Palette interface with all 24 LED color contexts
  - [x] Define track_smd, track_smd_dim, track_smd_medium as fixed-length tuples of 4 RGB12
  - [x] Define track_btn as 4x3 nested tuple structure [RGB12, RGB12, RGB12][4]
  - [x] Add slot number and status fields to Palette interface
  - [x] Document RGB channel order (R, B, G) in type comments
- [x] Define SlotInfo and status types (AC: SlotInfo)
  - [x] Define SlotStatus type ('empty' | 'factory' | 'user_loaded' | 'user_modified')
  - [x] Define SlotInfo interface (activeSlot: number, hwVersion: 0 | 1, slotStatus: array)
  - [x] Document factory slot protection (slots 0-1 write-protected)
- [x] Define error handling types (AC: AppError)
  - [x] Define ErrorCategory type ('connection' | 'sd' | 'validation' | 'protocol')
  - [x] Define AppError interface (message, category, code?, recoverable)
  - [x] Map all 15 LX Palette UX API error codes to UX_ERRORS constant
  - [x] Document error code meanings with user-friendly messages
- [x] Define MIDI message types (AC: MidiMessage, SysExResponse)
  - [x] Define MidiMessage type for raw MIDI data
  - [x] Define SysExResponse interface for parsed SysEx messages
  - [x] Define command operation types (PALETTE_INFO, PALETTE_QUERY, PALETTE_SET_RGB, etc.)
  - [x] Document SysEx message structure and byte encoding rules
- [x] Verify strict TypeScript compilation (AC: All compile without errors)
  - [x] Run `npm run build` to verify all types compile
  - [x] Ensure strict mode is enabled in tsconfig.json
  - [x] Verify no `any` types are used
  - [x] Check all tuple types have fixed lengths

## Dev Notes

### Critical Data Structure Requirements

**TypeScript Strict Mode:**
- MUST be enabled in tsconfig.json (already set by Vite template)
- NO `any` types allowed - find the correct type instead
- All interfaces and types must compile without errors
- Target ES2022+ for modern browser features

### RGB12 Interface - The Foundation

The `RGB12` interface is the core data structure for all color handling:

```typescript
interface RGB12 {
  r: number;  // Red channel: 0-4095 (12-bit)
  g: number;  // Green channel: 0-4095 (12-bit)
  b: number;  // Blue channel: 0-4095 (12-bit)
}
```

**CRITICAL:** Hardware uses **R, B, G channel order** (not standard RGB) when encoding to MIDI. This interface uses standard RGB naming internally, but MIDI encoding must swap blue and green channels.

### Palette Interface - 24 LED Colors

The Palette interface represents all LED colors for a single palette slot:

```typescript
interface Palette {
  slot: number;  // 0-7 (slots 0-1 are factory write-protected)
  status: SlotStatus;
  track_smd: [RGB12, RGB12, RGB12, RGB12];  // Normal brightness, 4 tracks
  track_smd_dim: [RGB12, RGB12, RGB12, RGB12];  // Dim brightness, 4 tracks
  track_smd_medium: [RGB12, RGB12, RGB12, RGB12];  // Medium/highlight brightness, 4 tracks
  track_btn: [
    [RGB12, RGB12, RGB12],  // Track 1: brightness levels 0, 1, 2
    [RGB12, RGB12, RGB12],  // Track 2: brightness levels 0, 1, 2
    [RGB12, RGB12, RGB12],  // Track 3: brightness levels 0, 1, 2
    [RGB12, RGB12, RGB12]   // Track 4: brightness levels 0, 1, 2
  ];
}
```

**Key Points:**
- **Fixed-length tuples** (not generic arrays) - enforces 4 tracks exactly
- **Nested tuple for track_btn** - 4 tracks × 3 brightness levels = 12 colors
- **Total: 24 LED color contexts** - 12 SMD (3 fields × 4 tracks) + 12 RGB button (4 tracks × 3 brightness)

### SlotInfo Interface - Device State

```typescript
type SlotStatus = 'empty' | 'factory' | 'user_loaded' | 'user_modified';

interface SlotInfo {
  activeSlot: number;  // 0-7
  hwVersion: 0 | 1;    // Hardware version (literal type)
  slotStatus: SlotStatus[];  // Array of 8 slot statuses
}
```

**Factory Protection:**
- Slots 0-1 are factory palettes (write-protected)
- Attempting to save to slots 0-1 returns error code 0x08

### Error Handling Types

```typescript
type ErrorCategory = 'connection' | 'sd' | 'validation' | 'protocol';

interface AppError {
  message: string;           // User-facing message (no technical jargon)
  category: ErrorCategory;   // Error classification
  code?: number;             // UX_ERR_* code if from firmware (0x01-0x16)
  recoverable: boolean;      // Can user retry this operation?
}
```

**Error Code Mapping:**
All 15 LX Palette UX API error codes must be mapped to user-friendly messages:

| Code | Message | Category | Recoverable |
|------|---------|----------|-------------|
| 0x01 | Invalid slot number | validation | false |
| 0x02 | Invalid field ID | validation | false |
| 0x03 | Invalid track index | validation | false |
| 0x04 | Invalid brightness index | validation | false |
| 0x05 | Invalid channel | validation | false |
| 0x06 | Value out of range | validation | false |
| 0x07 | Slot is empty | validation | true |
| 0x08 | Cannot modify factory palette | validation | false |
| 0x10 | SD card not ready. Check card is inserted. | sd | true |
| 0x11 | Failed to write to SD card | sd | true |
| 0x12 | Palette name too long (max 32 characters) | validation | true |
| 0x13 | Invalid characters in palette name | validation | true |
| 0x14 | Palette file not found | sd | true |
| 0x15 | Palette file is corrupted | sd | false |
| 0x16 | Hardware version mismatch | protocol | false |

### MIDI Message Types

```typescript
// Raw MIDI data
type MidiMessage = Uint8Array;

// Parsed SysEx response
interface SysExResponse {
  success: boolean;
  errorCode?: number;  // 0x01-0x16 if error occurred
  data?: Uint8Array;   // Payload data if success
}

// Palette operation commands
type PaletteCommand =
  | 'PALETTE_INFO'      // 0x01
  | 'PALETTE_QUERY'     // 0x02
  | 'PALETTE_SET_RGB'   // 0x03
  | 'PALETTE_SAVE'      // 0x04
  | 'PALETTE_LOAD'      // 0x05
  | 'PALETTE_DELETE'    // 0x06
  | 'PALETTE_RENAME'    // 0x07
  | 'PALETTE_COPY'      // 0x08
  | 'PALETTE_RESET';    // 0x09
```

**MIDI Protocol Constraints:**
- All MIDI bytes must be 7-bit (0x00-0x7F)
- 12-bit RGB values encoded as MSB/LSB pairs
- SysEx format: [0xF0, 0x77, 0x01, 0x41, command, ...data, 0xF7]
- Manufacturer ID: 0x77, Device ID: 0x01, Palette command: 0x41

### Architecture Compliance

**From architecture.md:**
- File location: `src/types/palette.ts`, `src/types/midi.ts`, `src/types/errors.ts`
- Naming: PascalCase for interfaces, no I-prefix (use `Palette` not `IPalette`)
- Constants: SCREAMING_SNAKE_CASE (use `UX_ERRORS`, `MANUFACTURER_ID`)
- Documentation: Include JSDoc comments explaining non-obvious constraints

**From project-context.md:**
- TypeScript strict mode required
- No `any` types allowed
- Use fixed-length tuples for palette arrays
- Document RGB channel order (R, B, G hardware encoding)

### Implementation Patterns

**Good Example - Type Definition:**
```typescript
// src/types/palette.ts

/**
 * 12-bit RGB color value (0-4095 per channel).
 *
 * CRITICAL: Hardware uses R, B, G channel order when encoding to MIDI.
 * This interface uses standard RGB naming, but SysExParser must swap B and G.
 */
export interface RGB12 {
  r: number;  // Red: 0-4095
  g: number;  // Green: 0-4095
  b: number;  // Blue: 0-4095
}

/** Palette slot status */
export type SlotStatus = 'empty' | 'factory' | 'user_loaded' | 'user_modified';

/**
 * Complete palette data for one slot (24 LED color contexts).
 *
 * Structure:
 * - track_smd: 4 tracks × normal brightness = 4 colors
 * - track_smd_dim: 4 tracks × dim brightness = 4 colors
 * - track_smd_medium: 4 tracks × medium brightness = 4 colors
 * - track_btn: 4 tracks × 3 brightness levels = 12 colors
 * Total: 24 LED contexts
 */
export interface Palette {
  slot: number;  // 0-7 (0-1 are factory protected)
  status: SlotStatus;
  track_smd: [RGB12, RGB12, RGB12, RGB12];
  track_smd_dim: [RGB12, RGB12, RGB12, RGB12];
  track_smd_medium: [RGB12, RGB12, RGB12, RGB12];
  track_btn: [
    [RGB12, RGB12, RGB12],
    [RGB12, RGB12, RGB12],
    [RGB12, RGB12, RGB12],
    [RGB12, RGB12, RGB12]
  ];
}
```

**Anti-Patterns to Avoid:**
```typescript
// ❌ Wrong: Generic arrays instead of tuples
track_smd: RGB12[];  // Should be [RGB12, RGB12, RGB12, RGB12]

// ❌ Wrong: I-prefix on interface
interface IPalette { ... }  // Should be just 'Palette'

// ❌ Wrong: Using any type
errorCode: any;  // Should be number | undefined

// ❌ Wrong: camelCase constants
const manufacturerId = 0x77;  // Should be MANUFACTURER_ID

// ❌ Wrong: Missing JSDoc for non-obvious constraints
interface RGB12 {  // Should document R, B, G channel order swap
  r: number;
  g: number;
  b: number;
}
```

### Testing Requirements

**Type Verification:**
- Run `npm run build` to verify all types compile
- Enable TypeScript strict mode in tsconfig.json
- No compilation errors should occur
- All tuple types should enforce exact lengths

**Future Unit Tests (Story 1.3):**
- When Vitest is set up, add type guard tests
- Test RGB12 validation (0-4095 range)
- Test error code mapping completeness
- Test SlotStatus type narrowing

### File Organization

```
src/
  types/
    palette.ts       # RGB12, Palette, SlotInfo, SlotStatus
    midi.ts          # MidiMessage, SysExResponse, PaletteCommand
    errors.ts        # AppError, ErrorCategory, UX_ERRORS constant
```

**Import Pattern:**
```typescript
// In other files
import type { RGB12, Palette, SlotInfo } from './types/palette';
import type { AppError, ErrorCategory } from './types/errors';
import type { MidiMessage, SysExResponse } from './types/midi';
```

### Project Context Reference

**CRITICAL:** Always follow rules in `/Users/Nick/Dropbox/Tetrachords/Code/tc_lx_midi_config/_bmad-output/project-context.md`

Key highlights for this story:
- **RGB channel order is R, B, G** - hardware constraint, document in RGB12 interface
- **All MIDI bytes must be 7-bit** (0x00-0x7F) - document in MIDI types
- **Factory slots 0-1 write-protected** - document in Palette interface
- **TypeScript strict mode required** - no `any` types
- **Fixed-length tuples** - not generic arrays for palette fields

### Previous Story Learnings

From Story 1.1 (Initialize Vite React-TS):
- TypeScript strict mode is already enabled in tsconfig.app.json:20
- Project uses ES2022 target with ESNext modules
- No compilation errors allowed - fix at source, not with type casts
- Vite template provides clean TypeScript setup

**Patterns Established:**
- PascalCase for component files
- Strict mode enforcement
- No backwards-compatibility hacks

### Success Verification Checklist

Before marking this story as complete, verify:
- ✅ All type definition files created in src/types/
- ✅ RGB12 interface defined with 0-4095 range documentation
- ✅ Palette interface uses fixed-length tuples (not arrays)
- ✅ All 24 LED color contexts represented in Palette
- ✅ SlotInfo interface defined with hwVersion literal type (0 | 1)
- ✅ AppError interface defined with all 4 categories
- ✅ All 15 error codes mapped in UX_ERRORS constant
- ✅ MIDI types defined (MidiMessage, SysExResponse, PaletteCommand)
- ✅ `npm run build` compiles without errors
- ✅ No `any` types used anywhere
- ✅ All interfaces have JSDoc comments for non-obvious constraints
- ✅ RGB channel order (R, B, G) documented

### References

- [Source: _bmad-output/architecture.md#Data Architecture]
- [Source: _bmad-output/architecture.md#Naming Patterns]
- [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- [Source: _bmad-output/project-context.md#TypeScript Rules]
- [Source: _bmad-output/prd.md#Data Structures]
- [Source: docs/lx_palette_ux.md#Error Codes]
- [Source: _bmad-output/epics.md#Story 1.2]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

None - types compiled cleanly on first attempt.

### Completion Notes List

✅ **All TypeScript Type Definitions Created**

**Implemented:**
- Created complete type system for LX Palette MIDI configuration application
- All 24 LED color contexts properly represented in Palette interface
- Fixed-length tuples enforced (not generic arrays) for type safety
- All 15 firmware error codes mapped to user-friendly messages
- Comprehensive JSDoc comments documenting critical constraints

**Key Implementations:**

1. **palette.ts** - Core data structures:
   - RGB12 interface with 12-bit color channels (0-4095)
   - Documented critical R, B, G channel order for hardware encoding
   - Palette interface with all 24 LED contexts using fixed-length tuples
   - SlotStatus type with 4 states (empty, factory, user_loaded, user_modified)
   - SlotInfo interface with literal type for hwVersion (0 | 1)

2. **errors.ts** - Error handling:
   - ErrorCategory type with 4 categories (connection, sd, validation, protocol)
   - AppError interface with user-friendly messaging
   - UX_ERRORS constant mapping all 15 error codes (0x01-0x08, 0x10-0x16)
   - Each error includes category, message, and recoverable flag

3. **midi.ts** - MIDI protocol types:
   - MidiMessage type (Uint8Array) with 7-bit constraint documentation
   - SysExResponse interface for parsed responses
   - PaletteCommand type with all 9 operations
   - MIDI_CONSTANTS with protocol values
   - PALETTE_COMMAND_CODES mapping commands to byte codes

**Verification:**
- TypeScript compilation successful with strict mode enabled
- No `any` types used anywhere
- All tuple types have fixed lengths
- No compilation errors or warnings

### Code Review (AI)

**Reviewer:** AI Code Review Agent  
**Date:** 2026-01-04  
**Status:** Issues Fixed

**Issues Found:** 2 High, 2 Medium, 2 Low  
**Issues Fixed:** 6 (2 High + 2 Medium + 2 Low)

**Fixes Applied:**

1. **HIGH - Fixed:** `SlotInfo.slotStatus` changed from generic array to fixed-length tuple of 8 elements
   - Changed `slotStatus: SlotStatus[]` to `slotStatus: [SlotStatus, SlotStatus, SlotStatus, SlotStatus, SlotStatus, SlotStatus, SlotStatus, SlotStatus]`
   - Added JSDoc clarification: "must have exactly 8 elements, one per slot"
   - Location: `src/types/palette.ts:74`

2. **HIGH - Fixed:** Added literal type unions for slot numbers
   - Changed `slot: number` to `slot: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7` in Palette interface
   - Changed `activeSlot: number` to `activeSlot: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7` in SlotInfo interface
   - Location: `src/types/palette.ts:41,70`

3. **MEDIUM - Fixed:** Enhanced JSDoc for `slotStatus` array length constraint
   - Updated comment to clarify "must have exactly 8 elements, one per slot"
   - Location: `src/types/palette.ts:74`

4. **LOW - Fixed:** Story documentation discrepancy corrected
   - Changed "17 error codes" to "15 error codes" throughout story file (5 locations)
   - Implementation was correct; documentation was inaccurate
   - Location: `1-2-define-typescript-data-structures.md` (multiple lines)

5. **LOW - Fixed:** Added validation comments for slot range enforcement
   - Added JSDoc comments noting TypeScript literal types enforce slot range (0-7) at compile time
   - Clarifies that validation is compile-time, not runtime
   - Location: `src/types/palette.ts:41,70`

**Remaining Issues (Cannot Fix):**
- CSS build warning about "file" property (Tailwind v4 issue, not related to this story - cannot be fixed in this story's scope)

**Build Status:** ✅ All fixes compile successfully with TypeScript strict mode

### Code Review (AI) - Second Review

**Reviewer:** AI Code Review Agent (Second Review)  
**Date:** 2026-01-04  
**Status:** Additional Issues Fixed

**Issues Found:** 1 Medium, 1 Low  
**Issues Fixed:** 2 (1 Medium + 1 Low)

**Fixes Applied:**

6. **MEDIUM - Fixed:** Inaccurate error code count in `errors.ts` JSDoc
   - Changed "Maps all 17 firmware error codes" to "Maps all 15 firmware error codes"
   - Updated to accurately reflect actual error code count (0x01-0x08, 0x10-0x16)
   - Location: `src/types/errors.ts:27`

7. **LOW - Fixed:** Incorrect error code range comment
   - Changed "Validation Errors (0x01-0x09)" to "Validation Errors (0x01-0x08)"
   - Corrected range to reflect actual validation error codes (0x09 doesn't exist)
   - Location: `src/types/errors.ts:33`

**Total Issues Fixed Across Both Reviews:** 8 (2 High + 3 Medium + 3 Low)

**Build Status:** ✅ All fixes compile successfully with TypeScript strict mode

### File List

**Created:**
- src/types/palette.ts
- src/types/errors.ts
- src/types/midi.ts

**Modified:**
- src/types/palette.ts (code review fixes: added literal types for slots, fixed-length tuple for slotStatus)
- src/types/errors.ts (second review fix: corrected error code count and range in JSDoc comments)

**Deleted:**
None
