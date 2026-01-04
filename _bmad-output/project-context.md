---
project_name: 'tc_lx_midi_config'
user_name: 'Nick'
date: '2026-01-04'
sections_completed: ['technology_stack', 'implementation_rules', 'anti_patterns', 'file_organization', 'usage_guidelines']
status: 'complete'
rule_count: 28
optimized_for_llm: true
---

# Project Context for AI Agents

_Critical rules and patterns for implementing tc_lx_midi_config. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

| Technology | Version | Notes |
|------------|---------|-------|
| React | 18+ | Function components only |
| TypeScript | 5.x | Strict mode required |
| Vite | 7.x | ESM-only, `@tailwindcss/vite` plugin |
| Tailwind CSS | v4 | CSS-based config, no tailwind.config.js |
| Vitest | 4.x | Unit + component tests |
| Playwright | Latest | E2E tests only |
| React Testing Library | Latest | Component tests |

---

## Critical Implementation Rules

### MIDI Protocol Rules (CRITICAL)

- **RGB channel order is R, B, G** - NOT standard RGB. The firmware expects red, blue, green order.
- **All MIDI bytes must be 7-bit** (0x00-0x7F). Values >= 0x80 are invalid.
- **12-bit color values (0-4095)** encoded as two 7-bit bytes: MSB = `value >> 7`, LSB = `value & 0x7F`
- **Factory slots 0-1 are write-protected** - never attempt to save to these slots
- **500ms timeout** on all MIDI request/response operations
- **SysEx permission required** - request with `{ sysex: true }` option

### TypeScript Rules

- **Strict mode required** - no `any` types allowed
- **Use `RGB12` interface** for all internal color handling:
  ```typescript
  interface RGB12 { r: number; g: number; b: number; } // 0-4095 each
  ```
- **Tuple types for palette arrays** - use fixed-length tuples, not generic arrays
- **No I-prefix on interfaces** - use `Palette` not `IPalette`
- **Constants in SCREAMING_SNAKE_CASE** - `MANUFACTURER_ID`, `UX_ERRORS`

### React Patterns

- **Immutable state updates only** - never mutate state directly
- **Hook return objects, not arrays** - `{ data, isLoading, error }` not `[data, loading]`
- **Callback props: `on` + Event** - `onColorChange`, `onSlotSelect`
- **Handler functions: `handle` + Event** - `handleColorChange`
- **Separate loading states per operation** - `isConnecting`, `isSyncing`, `isSaving`

### Component Architecture

- **PascalCase for component files** - `ColorWheel.tsx`, not `colorWheel.tsx`
- **camelCase for hooks** - `useMidiConnection.ts`
- **Co-locate tests with source** - `MidiService.test.ts` next to `MidiService.ts`
- **Subfolder only if component has multiple files** - otherwise flat in `components/`

### Testing Rules

- **Test MIDI encoding/decoding first** - critical path, must be correct
- **Mock MIDI device for all tests** - never rely on real hardware
- **Include accessibility tests** - use React Testing Library queries
- **E2E tests in `tests/e2e/`** - not co-located

### Error Handling

- **Map all 17 UX_ERR codes** to user-friendly messages with categories
- **Error categories**: `connection`, `sd`, `validation`, `protocol`
- **All errors include `recoverable: boolean`** - determines if retry is offered
- **Connection errors show reconnect button**
- **SD card errors show retry button with clear message**

---

## Anti-Patterns to Avoid

- **NEVER** use standard RGB order - always R, B, G for this hardware
- **NEVER** send bytes >= 0x80 over MIDI
- **NEVER** mutate palette state directly
- **NEVER** write to factory slots 0-1
- **NEVER** use `any` type - find the correct type
- **NEVER** create a single global `isLoading` state
- **NEVER** use array returns from hooks - use objects

---

## File Organization Reference

```
src/
  components/     # UI components (PascalCase.tsx)
  hooks/          # Custom hooks (useCamelCase.ts)
  services/midi/  # MIDI layer (MidiService, LXPaletteAPI, SysExParser)
  types/          # TypeScript interfaces (palette.ts, midi.ts, errors.ts)
  utils/          # Helpers (colorMath.ts, sysexEncoding.ts)
  context/        # React contexts (MidiContext, PaletteContext)
```

---

## Quick Reference: Color Encoding

```typescript
// 12-bit to MIDI bytes
function encode12Bit(value: number): [number, number] {
  return [value >> 7, value & 0x7F]; // [MSB, LSB]
}

// MIDI bytes to 12-bit
function decode12Bit(msb: number, lsb: number): number {
  return (msb << 7) | lsb;
}

// RGB12 to CSS hex
function rgb12ToCssHex(color: RGB12): string {
  const r = Math.round((color.r / 4095) * 255);
  const g = Math.round((color.g / 4095) * 255);
  const b = Math.round((color.b / 4095) * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
```

---

## Usage Guidelines

**For AI Agents:**
- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**
- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

---

_Last Updated: 2026-01-04_
