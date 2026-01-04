# Story 1.1: Initialize Vite React-TS Project with Tailwind v4

Status: done

## Story

As a developer,
I want a working Vite + React + TypeScript project with Tailwind CSS v4 configured,
So that I can begin building the palette editor with a modern, fast development environment.

## Acceptance Criteria

**Given** I have Node.js installed
**When** I run `npm create vite@latest tc_lx_midi_config -- --template react-ts`
**Then** the project initializes successfully
**And** I can run `npm install` and `npm run dev` without errors
**And** Tailwind CSS v4 is installed via `@tailwindcss/vite` plugin
**And** The app displays a basic "Hello World" in the browser at localhost using React 19+

## Tasks / Subtasks

- [x] Initialize Vite React-TS project (AC: All)
  - [x] Run `npm create vite@latest tc_lx_midi_config -- --template react-ts`
  - [x] Navigate to project directory `cd tc_lx_midi_config`
  - [x] Install base dependencies with `npm install`
  - [x] Verify project runs with `npm run dev`
  - [x] Confirm browser shows default Vite + React template at localhost
- [x] Install and configure Tailwind CSS v4 (AC: All)
  - [x] Install Tailwind v4 via `npm install -D tailwindcss @tailwindcss/vite`
  - [x] Add `@tailwindcss/vite` plugin to `vite.config.ts`
  - [x] Create `src/index.css` with `@import "tailwindcss";`
  - [x] Import `index.css` in `src/main.tsx`
  - [x] Test Tailwind with utility class (e.g., `bg-blue-500` on div)
  - [x] Verify styles apply correctly in browser
- [x] Replace default template with "Hello World" (AC: All)
  - [x] Simplify `App.tsx` to display "Hello World" heading
  - [x] Use Tailwind utility classes for basic styling
  - [x] Remove unused Vite template assets
  - [x] Verify clean "Hello World" displays at localhost

### Review Follow-ups (AI Code Review - 2026-01-04)

**Critical Issues:**
- [x] [AI-Review][HIGH] Fix false claim: Remove src/vite-env.d.ts from File List (line 228) - file doesn't exist [1-1-initialize-vite-react-ts-project-with-tailwind-v4.md:228]
- [x] [AI-Review][HIGH] Create initial git commit with all project files [.]
- [x] [AI-Review][HIGH] Clean up assets directory: Remove empty src/assets/ OR document why kept [src/assets/]

**Medium Priority:**
- [x] [AI-Review][MEDIUM] Update HTML title to human-readable format [index.html:7]
- [x] [AI-Review][MEDIUM] Fix deprecated ESLint config: Remove globalIgnores import [eslint.config.js:6]
- [x] [AI-Review][MEDIUM] Create README.md with setup instructions [.]
- [x] [AI-Review][MEDIUM] Clarify Deleted section in File List [1-1-initialize-vite-react-ts-project-with-tailwind-v4.md:234-237]

**Low Priority:**
- [x] [AI-Review][LOW] Add .gitattributes for line ending consistency [.]
- [x] [AI-Review][LOW] Consider replacing generic Vite favicon (or note intentionally kept) [public/vite.svg]
- [x] [AI-Review][LOW] Update story AC to say "React 19+" instead of "18+" [1-1-initialize-vite-react-ts-project-with-tailwind-v4.md:18]

## Dev Notes

### Architecture Foundation

**Selected Starter Template:** Vite React-TS + Tailwind v4
- **Rationale:** Official Vite template ensures long-term maintenance and Vite 7.x compatibility
- **Key Benefit:** Clean TypeScript setup optimized for LLM-assisted development
- **Tailwind v4:** Uses `@tailwindcss/vite` plugin with CSS-based config (no tailwind.config.js needed)
- **Favicon:** Vite logo (public/vite.svg) intentionally kept from template - custom favicon will be added in future branding story

**Initialization Commands:**
```bash
npm create vite@latest tc_lx_midi_config -- --template react-ts
cd tc_lx_midi_config
npm install
npm install -D tailwindcss @tailwindcss/vite
```

**Vite Config for Tailwind v4:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**Main CSS File:**
```css
/* src/index.css */
@import "tailwindcss";
```

### Technology Stack Requirements

| Technology | Version | Critical Notes |
|------------|---------|----------------|
| React | 19+ | Function components only (no class components) |
| TypeScript | 5.x | **Strict mode required** - no `any` types allowed |
| Vite | 7.x | ESM-only, native ESM for instant server start |
| Tailwind CSS | v4 | CSS-based config via `@tailwindcss/vite` plugin |
| Node.js | Latest LTS | Required for Vite dev server |

### Critical Implementation Rules

**TypeScript Configuration:**
- **Strict mode MUST be enabled** - already included in Vite React-TS template
- **No `any` types** - find the correct type instead
- Target: ES2022+ for modern browser features
- ESM-only distribution (Vite 7.x default)

**React Patterns:**
- **Function components only** - no class components
- Use hooks (useState, useEffect, useContext) for state management
- Immutable state updates only - never mutate state directly

**Tailwind CSS v4 Setup:**
- **CRITICAL:** Use `@tailwindcss/vite` plugin (NOT the old PostCSS method)
- **No tailwind.config.js file needed** - v4 uses CSS-based configuration
- Single `@import "tailwindcss";` in main CSS file
- Lightning CSS handles production CSS optimization automatically

**File Organization (from Architecture):**
```
src/
  components/     # UI components (PascalCase.tsx)
  hooks/          # Custom hooks (useCamelCase.ts)
  services/midi/  # MIDI layer (MidiService, LXPaletteAPI, SysExParser)
  types/          # TypeScript interfaces (palette.ts, midi.ts, errors.ts)
  utils/          # Helpers (colorMath.ts, sysexEncoding.ts)
  context/        # React contexts (MidiContext, PaletteContext)
```

### Testing Requirements (Future Stories)

**Note:** Testing infrastructure will be added in subsequent stories (1.3, 1.4, 1.7):
- Story 1.3: Vitest 4.x for unit/component tests
- Story 1.4: Playwright for E2E tests
- Story 1.7: axe-core for accessibility testing

**For this story:** Focus only on project initialization and Tailwind setup. Testing setup comes next.

### Deployment Context (Future Story)

**Note:** GitHub Pages deployment will be configured in Story 1.5:
- HTTPS required for Web MIDI API access
- `vite.config.ts` will need correct `base` path for GitHub Pages
- GitHub Actions workflow for automated deployment

**For this story:** No deployment setup needed yet. Just ensure local dev server works.

### Project Context Reference

**CRITICAL:** Always follow rules in `/Users/Nick/Dropbox/Tetrachords/Code/tc_lx_midi_config/_bmad-output/project-context.md`

Key highlights for this story:
- **RGB channel order is R, B, G** (NOT standard RGB) - critical for MIDI implementation in future stories
- **All MIDI bytes must be 7-bit** (0x00-0x7F) - hardware constraint for future MIDI stories
- **PascalCase for component files** - `ColorWheel.tsx`, not `colorWheel.tsx`
- **camelCase for hooks** - `useMidiConnection.ts`
- **Co-locate tests with source** - `MidiService.test.ts` next to `MidiService.ts` (in future testing stories)

### Anti-Patterns to Avoid

- **NEVER** use standard RGB order in future MIDI code - always R, B, G for this hardware
- **NEVER** use `any` type - TypeScript strict mode is non-negotiable
- **NEVER** create a tailwind.config.js file - v4 uses CSS-based config
- **NEVER** use class components - function components only
- **NEVER** mutate state directly - always use immutable updates

### Success Verification Checklist

Before marking this story as complete, verify:
- ✅ `npm run dev` starts Vite dev server without errors
- ✅ Browser displays "Hello World" at http://localhost:5173
- ✅ Tailwind utility classes (e.g., `bg-blue-500`, `text-white`) apply correctly
- ✅ TypeScript strict mode is enabled in `tsconfig.json`
- ✅ No compilation errors in terminal or browser console
- ✅ Hot Module Replacement (HMR) works (edit `App.tsx` and see instant update)
- ✅ Project structure matches Vite React-TS template defaults

### References

- [Source: _bmad-output/architecture.md#Starter Template Evaluation]
- [Source: _bmad-output/architecture.md#Frontend Architecture]
- [Source: _bmad-output/project-context.md#Technology Stack & Versions]
- [Source: _bmad-output/project-context.md#Critical Implementation Rules]
- [Source: _bmad-output/prd.md#Technical Success]

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

- vite.config.ts:7 - Added @tailwindcss/vite plugin
- src/index.css:1 - Replaced default CSS with Tailwind import
- src/App.tsx:1-9 - Simplified to Hello World with Tailwind utilities

### Completion Notes List

✅ **Project Initialization Complete**
- Vite + React + TypeScript project initialized using official template
- All base dependencies installed successfully via npm
- Dev server runs without errors on http://localhost:5173

✅ **Tailwind CSS v4 Configuration Complete**
- Installed tailwindcss@latest and @tailwindcss/vite plugin
- Added tailwindcss() plugin to vite.config.ts
- Created src/index.css with single `@import "tailwindcss";` directive
- Verified CSS import exists in src/main.tsx (already included by template)

✅ **Hello World Implementation Complete**
- Replaced App.tsx with minimal Hello World component
- Applied Tailwind utility classes: bg-blue-500, min-h-screen, flex, items-center, justify-center, text-4xl, font-bold, text-white
- Removed unused template files: src/App.css, src/assets/react.svg
- Verified in browser via Playwright: blue background, centered white "Hello World" heading

✅ **TypeScript Strict Mode Verified**
- Confirmed strict: true in tsconfig.app.json:20
- No TypeScript compilation errors
- Target: ES2022 with ESNext modules

✅ **All Acceptance Criteria Met**
- `npm run dev` starts without errors ✓
- Browser displays "Hello World" at localhost ✓
- Tailwind utility classes apply correctly ✓
- No console errors (only React DevTools info message) ✓

### File List

**Created:**
- package.json - Project dependencies and scripts
- package-lock.json - Locked dependency versions
- vite.config.ts - Vite configuration with React and Tailwind plugins
- tsconfig.json - TypeScript project references
- tsconfig.app.json - App TypeScript config with strict mode
- tsconfig.node.json - Node TypeScript config
- eslint.config.js - ESLint configuration
- index.html - HTML entry point
- src/main.tsx - React root render
- src/App.tsx - Hello World component
- src/index.css - Tailwind CSS import
- public/vite.svg - Vite logo (unchanged from template)

**Modified:**
- .gitignore - Added by Vite template

**Deleted:**
- src/App.css - Removed unused template CSS
- src/assets/react.svg - Removed unused React logo asset
