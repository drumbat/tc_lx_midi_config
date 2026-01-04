---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/prd.md
  - _bmad-output/architecture.md
  - _bmad-output/project-planning-artifacts/ux-design-specification.md
status: 'complete'
validationDate: '2026-01-04'
---

# tc_lx_midi_config - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for tc_lx_midi_config, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**Device Connection & Communication (FR1-5):**
- FR1: Users can detect Tetrachords devices connected via Web MIDI API
- FR2: Users can view connection status (connected/disconnected) for their device
- FR3: Users can establish MIDI SysEx communication with connected Tetrachords device
- FR4: Users can receive browser compatibility warnings when using non-Chromium browsers
- FR5: System can handle MIDI permission requests and denials gracefully

**Palette Synchronization (FR6-10):**
- FR6: Users can load the current active palette from their connected device into the editor
- FR7: Users can query palette data for all 24 LED contexts from the device
- FR8: Users can save edited palettes from the editor to the device SD card
- FR9: Users can specify palette names when saving to device
- FR10: Users can include optional slot number prefixes (1_ through 8_) in palette names

**Color Editing & Customization (FR11-19):**
- FR11: Users can edit RGB values for track_smd LED contexts (4 colors, normal brightness)
- FR12: Users can edit RGB values for track_smd_dim LED contexts (4 colors, dim brightness)
- FR13: Users can edit RGB values for track_smd_medium LED contexts (4 colors, medium/highlight brightness)
- FR14: Users can edit RGB values for track_btn LED contexts (12 colors: 4 tracks × 3 brightness levels)
- FR15: Users can select colors using standard color picker interfaces
- FR16: Users can copy RGB values from any color slot
- FR17: Users can paste RGB values to other color slots
- FR18: Users can apply brightness adjustment modifiers when pasting colors
- FR19: Users can view all 24 LED color contexts simultaneously in the interface

**Real-Time Visual Feedback (FR20-23):**
- FR20: Users can see color changes immediately on physical device LEDs as they edit
- FR21: System can send individual RGB value updates via MIDI SysEx (PALETTE_SET_RGB)
- FR22: Users can test palette distinguishability on actual hardware during editing
- FR23: System can maintain LED update latency within acceptable thresholds for instant feedback

**Palette File Management (FR24-29):**
- FR24: Users can save palettes as .lxp files to their computer
- FR25: Users can load .lxp files from their computer into the editor
- FR26: Users can name palettes within the application
- FR27: System can validate .lxp file format on load
- FR28: Users can download palette files using standard browser download mechanisms
- FR29: Users can upload palette files using standard browser file picker

**User Assistance & Error Handling (FR30-38):**
- FR30: Users can view error messages when device connection fails
- FR31: Users can view error messages when MIDI synchronization fails
- FR32: Users can view error messages when palette save operations fail
- FR33: Users can view error messages when palette load operations fail
- FR34: Users can view error messages when device is not found
- FR35: System can detect and report MIDI permission denial
- FR36: System can provide clear error states without requiring technical knowledge
- FR37: Users with keyboard-only navigation can access all editor functionality (WCAG 2.1 AA)
- FR38: Users with screen readers can understand interface structure and controls (WCAG 2.1 AA)

### Non-Functional Requirements

**Performance (NFR1-6):**
- NFR1: LED color updates must complete within 50-100ms of user color picker interaction
- NFR2: MIDI SysEx message transmission (PALETTE_SET_RGB) must complete within <10ms per color
- NFR3: Color picker UI interactions must remain responsive during MIDI communication
- NFR4: Initial palette query (PALETTE_QUERY) must complete within 500ms of connection
- NFR5: User interface must respond to all interactions within 100ms
- NFR6: Application must load and become interactive within 3 seconds on typical broadband

**Accessibility (NFR7-13):**
- NFR7: All interactive controls must be operable via keyboard alone
- NFR8: All form fields and controls must have proper semantic HTML labels
- NFR9: All meaningful images and icons must have text alternatives
- NFR10: Color contrast for all text elements must meet 4.5:1 ratio minimum
- NFR11: Focus indicators must be clearly visible for keyboard navigation
- NFR12: Screen reader users must be able to understand and operate all functionality
- NFR13: Application must provide proper ARIA attributes for complex interactions

**Integration (NFR14-22):**
- NFR14: Application must successfully establish Web MIDI access on Chromium browsers (Chrome 43+, Edge 79+)
- NFR15: Application must detect and enumerate Tetrachords devices within 2 seconds
- NFR16: Application must maintain stable bidirectional MIDI communication without dropped messages
- NFR17: Application must handle MIDI device disconnect/reconnect gracefully without data loss
- NFR18: All MIDI SysEx messages must conform to LX Palette UX Command API specification
- NFR19: Application must correctly encode/decode 12-bit RGB values using two 7-bit MIDI bytes
- NFR20: Application must handle all LX Palette UX API error codes (0x01-0x16) with user messages
- NFR21: Application must correctly parse and generate .lxp palette files
- NFR22: Application must validate .lxp file structure on load and reject invalid formats

**Reliability (NFR23-30):**
- NFR23: Application must detect and report all MIDI connection failures with actionable messages
- NFR24: Application must gracefully handle MIDI permission denials and guide users
- NFR25: Application must detect browser incompatibility on load and display compatibility warning
- NFR26: Application must recover from temporary MIDI communication errors without page reload
- NFR27: Application must prevent user data loss during palette editing (localStorage fallback)
- NFR28: Static hosting infrastructure must maintain 99% uptime
- NFR29: Application must function completely offline once loaded
- NFR30: Application must handle network disconnects gracefully and resume MIDI when reconnected

### Additional Requirements

**From Architecture Document:**
- Starter Template: Initialize project using Vite React-TS template with Tailwind v4 integration
- Testing Infrastructure: Vitest 4.x for unit/component tests, Playwright for E2E tests, React Testing Library
- TypeScript Data Structures: RGB12 interface, Palette interface with 24 colors, SlotInfo interface, categorized error handling
- MIDI Communication Architecture: MidiService, LXPaletteAPI, SysExParser, hooks (useMidiConnection, usePalette)
- Deployment: GitHub Pages static hosting with CI/CD via GitHub Actions

**From UX Design Document:**
- Interactive Faceplate SVG: Clickable LED elements with hover/active states, mode-switching to highlight LED contexts
- Spectrum-Inspired Color Wheel: Line-through-center complementary color visualization, continuous updates, brightness slider
- Responsive Design Strategy: Desktop (lg: 1024px+) shows all 5 pickers simultaneously, mobile shows contextual pickers
- Visual Design System: Neutral gray app background (#2e2e2e), warm white workspace (#fafaf8), Primary Blue (#0EA5E9), Secondary Teal (#14B8A6)
- Smart Connection Flow: Auto-detect single Tetrachords device, filter by name, show picker only if 2+ devices

### FR Coverage Map

**Epic 1 - Project Foundation:**
- (Enables all future epics, no direct FR coverage)

**Epic 2 - Web MIDI Connection:**
- FR1: Detect Tetrachords devices via Web MIDI API
- FR2: View connection status
- FR3: Establish MIDI SysEx communication
- FR4: Browser compatibility warnings
- FR5: Handle MIDI permission requests/denials
- FR30: Connection failure error messages
- FR34: Device not found error messages
- FR35: MIDI permission denial detection

**Epic 3 - Palette Sync & Data:**
- FR6: Load palette from device
- FR7: Query all 24 LED contexts
- FR8: Save palette to device SD card
- FR9: Specify palette names
- FR10: Slot number prefixes (1-8)
- FR24: Save .lxp files to computer
- FR25: Load .lxp files from computer
- FR26: Name palettes in app
- FR27: Validate .lxp file format
- FR28: Browser download for palettes
- FR29: Browser file picker for upload
- FR31: MIDI sync failure messages
- FR32: Palette save failure messages
- FR33: Palette load failure messages

**Epic 4 - Color Editing Interface:**
- FR11: Edit track_smd RGB values (4 colors, normal)
- FR12: Edit track_smd_dim RGB values (4 colors, dim)
- FR13: Edit track_smd_medium RGB values (4 colors, medium)
- FR14: Edit track_btn RGB values (12 colors: 4×3 brightness)
- FR15: Color picker interfaces
- FR16: Copy RGB values
- FR17: Paste RGB values
- FR18: Brightness adjustment on paste
- FR19: View all 24 LED contexts simultaneously
- FR20: Immediate LED changes on physical device
- FR21: Send individual RGB updates via PALETTE_SET_RGB
- FR22: Test distinguishability on hardware
- FR23: Maintain LED update latency <100ms
- FR37: Keyboard-only navigation (WCAG 2.1 AA)
- FR38: Screen reader support (WCAG 2.1 AA)

**Epic 5 - Error Handling:**
- FR36: Clear error states without technical knowledge

## Epic List

### Epic 1: Project Foundation & Development Infrastructure

Development team can build, test, and deploy the application with confidence.

**FRs covered:** None directly (enables all future epics)

**NFRs covered:** NFR6 (3s load time), NFR28 (99% uptime), NFR7-13 (accessibility foundation)

**Additional Requirements:**
- Vite React-TS starter template initialization
- Tailwind v4 integration
- Testing infrastructure (Vitest, Playwright, React Testing Library)
- TypeScript data structures (RGB12, Palette, SlotInfo, Error types)
- GitHub Pages deployment with CI/CD
- Accessibility testing setup

---

### Epic 2: Web MIDI Device Connection & Communication

Users can discover their Tetrachords device, establish connection, and see connection status clearly.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR30, FR34, FR35

**NFRs covered:** NFR14, NFR15, NFR16, NFR17, NFR23, NFR24, NFR25, NFR26

**Additional Requirements:**
- MidiService implementation (Web MIDI API wrapper)
- LXPaletteAPI service layer (9 palette operations)
- SysExParser for message encoding/decoding
- useMidiConnection hook
- Smart connection flow with auto-detect
- Browser compatibility detection
- Error handling for MIDI permissions and connection failures

---

### Epic 3: Palette Synchronization & Data Management

Users can load palettes from their device and save customized palettes back to the device.

**FRs covered:** FR6, FR7, FR8, FR9, FR10, FR24, FR25, FR26, FR27, FR28, FR29, FR31, FR32, FR33

**NFRs covered:** NFR4 (500ms palette query), NFR18 (SysEx API compliance), NFR19 (12-bit RGB encoding), NFR20 (error code handling), NFR21 (.lxp format), NFR22 (.lxp validation), NFR27 (localStorage fallback), NFR29 (offline functionality), NFR30 (network disconnect handling)

**Additional Requirements:**
- usePalette hook
- .lxp file parsing and generation
- Palette slot management (8 slots, protect factory 0-1)
- Browser file download/upload
- localStorage fallback for unsaved changes

---

### Epic 4: Interactive Color Editing Interface

Users can visually select and adjust LED colors with real-time hardware feedback.

**FRs covered:** FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21, FR22, FR23, FR37, FR38

**NFRs covered:** NFR1 (50-100ms LED latency), NFR2 (<10ms SysEx), NFR3 (UI responsiveness), NFR5 (100ms UI response)

**Additional Requirements:**
- Interactive Faceplate SVG with clickable LEDs
- Spectrum-inspired color wheel with complementary line
- Brightness slider with dynamic gradient
- RGB value input group
- Virtual track buttons (1-4)
- Copy/paste color functionality with brightness modifiers
- Real-time PALETTE_SET_RGB during editing
- Responsive design (desktop: all 5 pickers visible, mobile: contextual)
- Visual design system (neutral gray #2e2e2e, warm white #fafaf8)
- Keyboard navigation and screen reader support

---

### Epic 5: Error Handling & User Guidance

Users receive clear, actionable error messages and can recover gracefully from all failure scenarios.

**FRs covered:** FR36

**NFRs covered:** All error-related NFRs not covered in previous epics

**Additional Requirements:**
- Error display component with categorized messages
- User-friendly error message mapping from technical error codes
- Recovery paths for all failure modes

---

## Epic 1: Project Foundation & Development Infrastructure

Development team can build, test, and deploy the application with confidence.

### Story 1.1: Initialize Vite React-TS Project with Tailwind v4

As a developer,
I want a working Vite + React + TypeScript project with Tailwind CSS v4 configured,
So that I can begin building the palette editor with a modern, fast development environment.

**Acceptance Criteria:**

**Given** I have Node.js installed
**When** I run `npm create vite@latest tc_lx_midi_config -- --template react-ts`
**Then** the project initializes successfully
**And** I can run `npm install` and `npm run dev` without errors
**And** Tailwind CSS v4 is installed via `@tailwindcss/vite` plugin
**And** The app displays a basic "Hello World" in the browser at localhost

### Story 1.2: Define TypeScript Data Structures

As a developer,
I want comprehensive TypeScript interfaces for all palette data structures,
So that I have type safety across the entire application.

**Acceptance Criteria:**

**Given** the project is initialized
**When** I create `src/types/` directory with type definition files
**Then** `RGB12` interface is defined (r, g, b: 0-4095)
**And** `Palette` interface is defined with 24 colors across 4 field types (track_smd, track_smd_dim, track_smd_medium, track_btn[4][3])
**And** `SlotInfo` interface is defined (activeSlot, hwVersion, slotStatus array)
**And** `AppError` interface is defined with categorized error types (connection, sd, validation, protocol)
**And** `MidiMessage` and `SysExResponse` types are defined
**And** All types compile without errors with strict TypeScript mode

### Story 1.3: Setup Vitest Testing Infrastructure

As a developer,
I want Vitest configured for unit and component testing,
So that I can write tests co-located with source files.

**Acceptance Criteria:**

**Given** the project has TypeScript configured
**When** I install Vitest and @testing-library/react
**Then** `vitest.config.ts` is created and properly configured
**And** I can run `npm test` and see test results
**And** A sample test file `src/App.test.tsx` passes successfully
**And** Coverage reporting is enabled via Vitest
**And** Tests run in watch mode during development

### Story 1.4: Setup Playwright E2E Testing

As a developer,
I want Playwright configured for end-to-end testing with MIDI mocks,
So that I can test complete user journeys without physical hardware.

**Acceptance Criteria:**

**Given** Vitest is configured
**When** I install Playwright and run `npx playwright install`
**Then** `playwright.config.ts` is created
**And** `tests/e2e/` directory exists with example spec file
**And** `tests/e2e/fixtures/mockMidiDevice.ts` mock is created
**And** I can run `npx playwright test` successfully
**And** Tests run in Chromium (target browser)

### Story 1.5: Configure GitHub Pages Deployment with CI/CD

As a developer,
I want automated deployment to GitHub Pages via GitHub Actions,
So that every push to main deploys the latest version automatically.

**Acceptance Criteria:**

**Given** the project is on GitHub
**When** I create `.github/workflows/deploy.yml`
**Then** workflow triggers on push to main branch
**And** workflow builds the Vite production bundle
**And** workflow deploys to GitHub Pages
**And** deployed site is accessible via HTTPS (required for Web MIDI)
**And** `vite.config.ts` has correct `base` path for GitHub Pages

### Story 1.6: Setup CI Pipeline for Tests and Linting

As a developer,
I want automated testing and linting on every pull request,
So that code quality is maintained.

**Acceptance Criteria:**

**Given** GitHub repository exists
**When** I create `.github/workflows/ci.yml`
**Then** workflow triggers on pull request
**And** workflow runs `npm test` (Vitest unit + component tests)
**And** workflow runs ESLint checks
**And** workflow runs TypeScript type checking
**And** workflow fails if any checks fail
**And** PR shows check status (pass/fail)

### Story 1.7: Configure Accessibility Testing Setup

As a developer,
I want axe-core integrated into component tests,
So that accessibility violations are caught during development.

**Acceptance Criteria:**

**Given** Vitest and React Testing Library are configured
**When** I install `axe-core` and `jest-axe`
**Then** accessibility checks are available in component tests
**And** sample accessibility test passes for App component
**And** tests fail if WCAG 2.1 Level AA violations are detected
**And** violations show clear error messages with remediation guidance

---

## Epic 2: Web MIDI Device Connection & Communication

Users can discover their Tetrachords device, establish connection, and see connection status clearly.

### Story 2.1: Implement MidiService Web MIDI API Wrapper

As a developer,
I want a MidiService class that wraps the Web MIDI API,
So that I have a clean abstraction for MIDI communication.

**Acceptance Criteria:**

**Given** TypeScript types are defined
**When** I create `src/services/midi/MidiService.ts`
**Then** `requestAccess()` method requests Web MIDI with SysEx permission
**And** `enumerateDevices()` method returns all MIDI input/output pairs
**And** `connect(deviceId)` method establishes connection to specific device
**And** `disconnect()` method closes MIDI connection
**And** `sendSysEx(data)` method sends MIDI SysEx messages
**And** `onMessage(callback)` method registers listener for incoming MIDI
**And** Unit tests cover all methods with >80% coverage
**And** Mock Web MIDI API used in tests

### Story 2.2: Implement SysEx Parser for LX Palette UX API

As a developer,
I want a SysExParser that encodes/decodes LX Palette UX Command API messages,
So that I can correctly format MIDI SysEx communication.

**Acceptance Criteria:**

**Given** MidiService exists
**When** I create `src/services/midi/SysExParser.ts`
**Then** `encode12Bit(value)` converts 0-4095 to MSB/LSB 7-bit pairs
**And** `decode12Bit(msb, lsb)` converts 7-bit pairs back to 0-4095
**And** `buildPaletteSetRGB()` creates PALETTE_SET_RGB SysEx message
**And** `buildPaletteQuery()` creates PALETTE_QUERY SysEx message
**And** `buildPaletteSave()` creates PALETTE_SAVE SysEx message
**And** `parseSysExResponse()` extracts error codes and data from responses
**And** All messages conform to LX Palette UX API spec (manufacturer ID 0x77, device ID 0x01, command 0x41)
**And** Unit tests validate encoding/decoding correctness
**And** RGB channel order is R, B, G (not RGB) per hardware spec

### Story 2.3: Implement LXPaletteAPI Service Layer

As a developer,
I want an LXPaletteAPI service implementing all 9 palette operations,
So that I can perform high-level palette commands.

**Acceptance Criteria:**

**Given** MidiService and SysExParser exist
**When** I create `src/services/midi/LXPaletteAPI.ts`
**Then** `paletteInfo()` queries active slot and status (PALETTE_INFO)
**And** `paletteQuery(slot)` retrieves all 24 colors for a slot (PALETTE_QUERY)
**And** `paletteSetRGB(field, track, brightness, rgb)` updates single LED (PALETTE_SET_RGB)
**And** `paletteSave(slot, name)` saves palette to SD card (PALETTE_SAVE)
**And** `paletteLoad(slot)` loads palette from SD card (PALETTE_LOAD)
**And** All operations return promises with timeout handling (500ms)
**And** Error responses map to AppError types
**And** Unit tests mock MidiService for all operations

### Story 2.4: Create useMidiConnection React Hook

As a developer,
I want a useMidiConnection hook that manages connection state,
So that React components can easily access MIDI connection status.

**Acceptance Criteria:**

**Given** MidiService and LXPaletteAPI exist
**When** I create `src/hooks/useMidiConnection.ts`
**Then** hook returns `{ isConnected, devices, connect, disconnect, error, isConnecting }`
**And** `isConnected` boolean reflects current connection state
**And** `devices` array contains available Tetrachords devices (filtered by name)
**And** `connect(deviceId)` method initiates connection
**And** `disconnect()` method closes connection
**And** `error` contains connection errors as AppError type
**And** `isConnecting` boolean shows loading state during connection
**And** Hook handles Web MIDI permission requests
**And** Component tests validate hook behavior with mock MIDI

### Story 2.5: Build Browser Compatibility Detection

As a user,
I want to see a clear warning if I'm using an unsupported browser,
So that I know why Web MIDI isn't working.

**Acceptance Criteria:**

**Given** the app loads
**When** I open the app in a non-Chromium browser (Firefox, Safari)
**Then** I see a compatibility warning message
**And** message states "Web MIDI requires Chromium-based browsers"
**And** message lists supported browsers (Chrome, Edge, Opera, Brave)
**And** warning displays before attempting MIDI connection
**And** no warning shows in Chromium browsers
**And** warning uses Tailwind error styling (red background, clear text)

### Story 2.6: Implement Smart Connection Flow with Auto-Detect

As a user,
I want the app to automatically detect my Tetrachords device,
So that I can connect with minimal clicks.

**Acceptance Criteria:**

**Given** I have one Tetrachords device connected via USB
**When** the app loads and Web MIDI permission is granted
**Then** app scans for devices with "Tetrachords" in the name
**And** if 1 device found, shows single "Connect to Tetrachords" button
**And** if 0 devices found, shows "No Tetrachords Connected" + list all MIDI devices (debug mode)
**And** if 2+ devices found, shows device picker with Tetrachords options only
**And** connection status indicator shows connected/disconnected state
**And** auto-refresh device list on USB connection events
**And** UI uses Primary Blue (#0EA5E9) for connection button per UX spec

### Story 2.7: Handle MIDI Permission and Connection Errors

As a user,
I want clear error messages when MIDI connection fails,
So that I know how to fix the problem.

**Acceptance Criteria:**

**Given** I attempt to connect to a device
**When** browser MIDI permission is denied
**Then** I see "MIDI Access Required" message with instructions to enable
**And** message includes browser-specific guidance for granting permission
**And** "Retry" button allows me to re-request permission
**When** device connection fails (timeout, device not responding)
**Then** I see "Connection Failed" message with retry option
**And** error message is categorized as "connection" type
**And** errors map to user-friendly messages (no technical jargon)
**And** all error states meet WCAG 2.1 Level AA contrast requirements

---

## Epic 3: Palette Synchronization & Data Management

Users can load palettes from their device and save customized palettes back to the device.

### Story 3.1: Create usePalette React Hook

As a developer,
I want a usePalette hook that manages palette state and operations,
So that React components can load, edit, and save palette data.

**Acceptance Criteria:**

**Given** LXPaletteAPI and useMidiConnection exist
**When** I create `src/hooks/usePalette.ts`
**Then** hook returns `{ palette, isLoading, error, loadFromDevice, saveToDevice, setColor, resetPalette }`
**And** `palette` contains current Palette object with all 24 LED colors
**And** `loadFromDevice(slot)` calls LXPaletteAPI.paletteQuery and updates state
**And** `saveToDevice(slot, name)` calls LXPaletteAPI.paletteSave
**And** `setColor(field, track, brightness, rgb)` updates palette state immutably
**And** `resetPalette()` reloads from device (undo all unsaved changes)
**And** hook handles loading states and errors from MIDI operations
**And** Component tests validate hook behavior with mocked LXPaletteAPI

### Story 3.2: Implement .lxp File Parsing and Generation

As a developer,
I want utilities to parse and generate .lxp palette files,
So that users can save/load palettes to their computer.

**Acceptance Criteria:**

**Given** Palette TypeScript interface exists
**When** I create `src/utils/fileHandlers.ts`
**Then** `parseLxpFile(file)` reads .lxp file and returns Palette object
**And** `generateLxpFile(palette, name)` creates .lxp file Blob from Palette
**And** parser validates file structure and rejects malformed files
**And** generator creates files matching device .lxp format exactly
**And** RGB values are stored as 12-bit (0-4095) per spec
**And** palette names are validated (alphanumeric, underscore, hyphen only, max 32 chars)
**And** Unit tests validate round-trip (generate → parse returns identical data)
**And** Tests cover edge cases (empty slots, max values, invalid characters)

### Story 3.3: Build Palette Slot Manager Component

As a user,
I want to see all 8 palette slots and their status,
So that I can choose which slot to load or save.

**Acceptance Criteria:**

**Given** usePalette hook exists
**When** I create `src/components/SlotSelector.tsx`
**Then** component displays 8 slots (0-7) with status indicators
**And** slots 0-1 show "Factory" status (write-protected)
**And** slots 2-7 show status: empty, factory, user_loaded, or user_modified
**And** clicking a slot number loads that palette from device
**And** active slot is visually highlighted (Primary Blue #0EA5E9)
**And** slot names display if palette has been named
**And** component is keyboard accessible (arrow keys navigate slots)
**And** Component tests validate slot selection and status display

### Story 3.4: Implement Browser File Download for Palettes

As a user,
I want to save my palette as a .lxp file to my computer,
So that I can back it up or share it with others.

**Acceptance Criteria:**

**Given** generateLxpFile utility and usePalette hook exist
**When** I click "Download Palette" button in the app
**Then** browser initiates download of .lxp file
**And** filename follows pattern: `{slot}_{name}.lxp` (e.g., "3_custom_palette.lxp")
**And** if no name provided, uses default "palette_{slot}.lxp"
**And** file contains all 24 LED colors from current palette state
**And** downloaded file can be loaded back into device
**And** button uses Secondary Teal (#14B8A6) per UX spec
**And** download works via standard browser File API

### Story 3.5: Implement Browser File Upload for Palettes

As a user,
I want to load a .lxp file from my computer into the editor,
So that I can edit previously saved palettes.

**Acceptance Criteria:**

**Given** parseLxpFile utility and usePalette hook exist
**When** I click "Load Palette File" button and select a .lxp file
**Then** file picker opens for .lxp files only
**And** selected file is parsed into Palette object
**And** palette state updates with loaded data
**And** all 24 LED colors display correctly in editor
**And** invalid files show error message "Invalid palette file format"
**And** corrupted files are rejected with clear error
**And** upload uses standard browser file input element
**And** Component tests mock file selection

### Story 3.6: Implement localStorage Fallback for Unsaved Changes

As a user,
I want my unsaved palette changes preserved if I accidentally close the browser,
So that I don't lose my work.

**Acceptance Criteria:**

**Given** palette editing is in progress
**When** palette state changes (setColor called)
**Then** current palette automatically saves to localStorage
**And** localStorage key format is `tc_lx_palette_unsaved`
**And** saved data includes all 24 LED colors
**When** user reopens app
**Then** app detects unsaved changes in localStorage
**And** shows "Restore unsaved changes?" prompt
**And** user can restore or discard unsaved palette
**And** localStorage clears after successful save to device
**And** fallback works offline (no network required per NFR29)

### Story 3.7: Handle Palette Save and Load Errors

As a user,
I want clear error messages when palette save/load operations fail,
So that I can understand and fix the problem.

**Acceptance Criteria:**

**Given** I attempt to save or load a palette
**When** SD card is not ready (error code 0x10)
**Then** I see "SD Card Not Ready. Check card is inserted."
**When** SD write fails (error code 0x11)
**Then** I see "Failed to write to SD card. Check card space/health."
**When** palette file not found (error code 0x14)
**Then** I see "Palette file not found"
**When** palette file corrupted (error code 0x15)
**Then** I see "Palette file is corrupted"
**When** trying to overwrite factory slot (0-1)
**Then** I see "Cannot modify factory palette"
**And** all errors provide "Retry" button
**And** error messages use categorized AppError types (sd, validation)
**And** errors meet WCAG 2.1 Level AA accessibility standards

---

## Epic 4: Interactive Color Editing Interface

Users can visually select and adjust LED colors with real-time hardware feedback.

### Story 4.1: Build Interactive Faceplate SVG Component

As a user,
I want to see a visual representation of my Tetrachords device with clickable LEDs,
So that I can select which LED I want to edit.

**Acceptance Criteria:**

**Given** TC_Faceplate.svg exists in public/ directory
**When** I create `src/components/Faceplate/Faceplate.tsx`
**Then** faceplate SVG renders in the app
**And** all SMD LEDs are clickable elements with hover states
**And** all RGB button LEDs are clickable with hover states
**And** clicking an LED highlights it (Primary Blue #0EA5E9 outline)
**And** selected LED triggers callback with (field, track, brightness) data
**And** faceplate scales responsively for different screen sizes
**And** component is keyboard accessible (Tab to navigate, Enter to select)
**And** Component tests validate LED selection and callbacks

### Story 4.2: Implement Spectrum-Inspired Color Wheel Component

As a user,
I want a circular color wheel to visually explore hues,
So that I can intuitively find colors without knowing RGB numbers.

**Acceptance Criteria:**

**Given** I need to select a color
**When** I create `src/components/ColorWheel/ColorWheel.tsx`
**Then** color wheel renders as 200px diameter circle (desktop) or 180px (mobile)
**And** wheel displays full HSL spectrum in circular gradient
**And** I can drag around the wheel to select different hues
**And** selected color is marked with a circular indicator
**And** complementary color (180° opposite) is shown with connecting line
**And** line has solid segment for selected color, dashed segment for complementary
**And** dragging updates in real-time (<100ms perceived latency)
**And** wheel is accessible via keyboard (arrow keys rotate hue)
**And** Component tests validate hue selection and drag interaction

### Story 4.3: Build Brightness Slider with Dynamic Gradient

As a user,
I want a brightness slider that shows my selected color at varying intensities,
So that I can adjust LED brightness intuitively.

**Acceptance Criteria:**

**Given** ColorWheel component exists and a hue is selected
**When** I create `src/components/BrightnessSlider.tsx`
**Then** vertical slider renders at 200px height, 32px width
**And** slider background shows gradient from black to current selected hue
**And** gradient updates immediately when color wheel hue changes
**And** dragging slider thumb adjusts brightness (0-100%)
**And** brightness maps to 12-bit RGB values (0-4095)
**And** slider is keyboard accessible (arrow keys adjust brightness)
**And** current brightness value is visually indicated
**And** Component tests validate brightness adjustment and gradient updates

### Story 4.4: Create RGB Value Input Group Component

As a user,
I want numeric RGB input fields,
So that I can enter precise color values when needed.

**Acceptance Criteria:**

**Given** color wheel and brightness slider exist
**When** I create `src/components/RGBInputGroup.tsx`
**Then** three input fields display for R, G, B values
**And** each input shows current 12-bit value (0-4095)
**And** typing a value updates the color immediately
**And** invalid values (>4095, negative, non-numeric) are rejected
**And** inputs update when color wheel or brightness slider changes
**And** each input is 60px wide with 4px spacing between
**And** inputs are keyboard accessible with Tab navigation
**And** ARIA labels describe each field for screen readers
**And** Component tests validate value sync and validation

### Story 4.5: Build Virtual Track Buttons Component

As a user,
I want virtual track buttons (1-4) that mirror my hardware,
So that I can switch between editing different tracks.

**Acceptance Criteria:**

**Given** faceplate component exists
**When** I create `src/components/TrackButtons.tsx`
**Then** 4 track buttons render (Track 1, 2, 3, 4)
**And** clicking a track button selects that track
**And** active track is highlighted (Primary Blue #0EA5E9)
**And** selecting track loads that track's 5 LED colors into UI
**And** buttons are keyboard accessible (1-4 number keys)
**And** selected track is announced to screen readers
**And** Component tests validate track switching

### Story 4.6: Implement Real-Time LED Update via PALETTE_SET_RGB

As a user,
I want my physical device LED to change immediately when I adjust colors,
So that I can see the actual hardware result in real-time.

**Acceptance Criteria:**

**Given** usePalette hook, ColorWheel, and BrightnessSlider exist
**When** I drag the color wheel or brightness slider
**Then** `usePalette.setColor()` is called with new RGB12 value
**And** `LXPaletteAPI.paletteSetRGB()` sends MIDI SysEx to device
**And** physical device LED updates within 50-100ms (NFR1)
**And** SysEx transmission completes within <10ms (NFR2)
**And** UI remains responsive during MIDI communication (NFR3)
**And** color changes feel instant (no perceived lag)
**And** E2E tests validate real-time update flow with mocked MIDI

### Story 4.7: Build Copy/Paste Color Functionality

As a user,
I want to copy RGB values from one LED and paste to others,
So that I can quickly create consistent color schemes.

**Acceptance Criteria:**

**Given** multiple LEDs are editable
**When** I click "Copy" button next to a color picker
**Then** current RGB12 value is copied to clipboard state
**And** "Paste" button becomes enabled on other LEDs
**When** I click "Paste" on a different LED
**Then** copied RGB value is applied to that LED
**And** optional brightness modifier slider appears (50%-150%)
**And** brightness modifier scales the pasted RGB values
**And** physical device LED updates immediately with pasted color
**And** clipboard state persists during editing session
**And** keyboard shortcut Ctrl+C / Ctrl+V works (desktop)

### Story 4.8: Implement Responsive Desktop Layout (All 5 Pickers Visible)

As a desktop user,
I want all 5 color pickers for the current track visible simultaneously,
So that I can efficiently edit without menu navigation.

**Acceptance Criteria:**

**Given** viewport width >= 1024px (lg breakpoint)
**When** I select a track
**Then** all 5 LED color pickers display:
  - track_smd (bright SMD LED)
  - track_smd_dim (dim SMD LED)
  - track_smd_medium (medium/complementary SMD LED)
  - track_btn brightness 0 (very bright RGB button)
  - track_btn brightness 1 (standard RGB button)
**And** faceplate occupies left 3 columns of 6-column grid
**And** color pickers occupy right 3 columns
**And** layout uses Tailwind grid utilities
**And** all controls visible without scrolling (on typical desktop screens)
**And** visual hierarchy follows UX spec (faceplate as hero element)

### Story 4.9: Implement Responsive Mobile Layout (Contextual Pickers)

As a mobile user,
I want to see relevant color pickers only when I click a specific LED,
So that the interface isn't overwhelming on small screens.

**Acceptance Criteria:**

**Given** viewport width < 1024px (below lg breakpoint)
**When** I click an SMD LED on faceplate
**Then** 3 SMD color pickers appear (bright, dim, medium)
**And** RGB button pickers are hidden
**When** I click an RGB button LED on faceplate
**Then** 2 RGB button pickers appear (brightness 0 and 1)
**And** SMD pickers are hidden
**And** faceplate stacks full-width above pickers
**And** all interactive elements meet 44x44px touch target size
**And** generous spacing (16-24px) between controls per UX spec
**And** layout responds smoothly to orientation changes

### Story 4.10: Apply Visual Design System (Colors, Typography, Spacing)

As a user,
I want a visually polished interface that matches the Cycle Instruments brand,
So that the app feels professional and trustworthy.

**Acceptance Criteria:**

**Given** all UI components exist
**When** I apply visual design system from UX spec
**Then** app background uses neutral gray (#2e2e2e)
**And** workspace (faceplate + pickers) uses warm white (#fafaf8)
**And** primary actions use Primary Blue (#0EA5E9)
**And** secondary actions use Secondary Teal (#14B8A6)
**And** typography follows Cycle Instruments scale (14px body, 18px h3, etc.)
**And** spacing uses defined scale (xs:4px, sm:8px, md:12px, lg:16px)
**And** all text meets WCAG 2.1 Level AA contrast (4.5:1 minimum)
**And** focus states use visible 2px outline
**And** hover states provide clear visual feedback

### Story 4.11: Implement Comprehensive Keyboard Navigation

As a keyboard-only user,
I want to navigate and control all editing functions via keyboard,
So that I can use the app without a mouse.

**Acceptance Criteria:**

**Given** all UI components exist
**When** I navigate using only keyboard
**Then** Tab key moves between all interactive elements in logical order
**And** color wheel accepts arrow keys for hue adjustment
**And** brightness slider accepts arrow keys for intensity adjustment
**And** RGB inputs accept numeric entry and Tab navigation
**And** track buttons accept 1-4 number keys for selection
**And** faceplate LEDs accept Tab to navigate, Enter to select
**And** all focused elements show visible 2px outline (Primary Blue)
**And** focus order follows visual layout (top to bottom, left to right)
**And** no keyboard traps (can exit all modal interactions)

### Story 4.12: Add ARIA Attributes and Screen Reader Support

As a screen reader user,
I want all interface elements properly labeled and described,
So that I can understand and operate the palette editor.

**Acceptance Criteria:**

**Given** all UI components exist
**When** I use a screen reader (VoiceOver, NVDA, JAWS)
**Then** all buttons have descriptive aria-label attributes
**And** color wheel announces "Hue selector, {degrees} degrees"
**And** brightness slider announces "Brightness, {percent}%"
**And** RGB inputs have aria-label "Red value 0 to 4095" (etc.)
**And** track buttons announce "Track {number} {selected state}"
**And** faceplate LEDs announce "{LED name}, {field type}, {color}"
**And** connection status is announced via aria-live region
**And** error messages are announced immediately
**And** all semantic HTML used (buttons, inputs, labels)
**And** axe-core tests pass with zero WCAG 2.1 Level AA violations

---

## Epic 5: Error Handling & User Guidance

Users receive clear, actionable error messages and can recover gracefully from all failure scenarios.

### Story 5.1: Build Centralized Error Display Component

As a user,
I want error messages displayed consistently throughout the app,
So that I always know when something goes wrong and how to fix it.

**Acceptance Criteria:**

**Given** errors can occur in multiple parts of the app
**When** I create `src/components/ErrorDisplay.tsx`
**Then** component displays categorized error messages (connection, sd, validation, protocol)
**And** errors show with appropriate visual styling (red background, error icon)
**And** each error includes user-friendly message (no technical jargon)
**And** errors include actionable recovery options (Retry, Reconnect, etc.)
**And** component supports toast notifications for temporary errors
**And** component supports modal dialogs for critical errors
**And** errors are announced to screen readers via aria-live="assertive"
**And** Component tests validate error display for all categories

### Story 5.2: Map All LX Palette UX API Error Codes to User Messages

As a user,
I want all device error codes translated to clear messages,
So that I understand what went wrong without needing technical knowledge.

**Acceptance Criteria:**

**Given** device can return error codes 0x01-0x16
**When** I create `src/types/errors.ts` with error mapping
**Then** all 17 error codes have user-friendly messages:
  - 0x01: "Invalid slot number"
  - 0x02: "Invalid field ID"
  - 0x03: "Invalid track index"
  - 0x04: "Invalid brightness index"
  - 0x05: "Invalid channel"
  - 0x06: "Value out of range"
  - 0x07: "Slot is empty"
  - 0x08: "Cannot modify factory palette"
  - 0x10: "SD card not ready. Check card is inserted."
  - 0x11: "Failed to write to SD card"
  - 0x12: "Palette name too long (max 32 characters)"
  - 0x13: "Invalid characters in palette name"
  - 0x14: "Palette file not found"
  - 0x15: "Palette file is corrupted"
  - 0x16: "Hardware version mismatch"
**And** each error is categorized (connection, sd, validation, protocol)
**And** each error includes recoverable flag (true/false)
**And** Unit tests validate all error code mappings

### Story 5.3: Implement Comprehensive E2E Error Recovery Tests

As a developer,
I want end-to-end tests covering all error scenarios,
So that we know error handling works correctly in production.

**Acceptance Criteria:**

**Given** Playwright E2E tests are configured
**When** I create `tests/e2e/error-recovery.spec.ts`
**Then** tests cover MIDI permission denial → grant → retry flow
**And** tests cover device not found → connect device → retry flow
**And** tests cover connection timeout → retry flow
**And** tests cover SD card error → fix → retry save flow
**And** tests cover invalid .lxp file upload → show error → upload valid file flow
**And** tests cover palette name validation errors
**And** all tests use mocked MIDI device for reproducibility
**And** tests verify error messages match expected user-friendly text
**And** tests validate Retry buttons actually trigger retry logic
