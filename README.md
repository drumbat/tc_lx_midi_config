# TC LX MIDI Palette Editor

A web-based MIDI palette editor for the Tetrachords LX, enabling real-time color palette editing via Web MIDI API with support for RGB color controls, SysEx communication, and palette management.

## Description

The TC LX MIDI Palette Editor is a browser-based application that allows users to configure and manage color palettes for the Tetrachords LX hardware. The editor communicates with the device using the Web MIDI API over SysEx messages, providing an intuitive interface for real-time color editing and palette configuration.

## Setup

### Prerequisites

- Node.js (Latest LTS version recommended)
- Modern browser with Web MIDI API support (Chrome, Edge, or Opera)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tc_lx_midi_config
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the local development URL (typically `http://localhost:5173`)

## Available Commands

- `npm run dev` - Start Vite development server with hot module replacement
- `npm run build` - Build production-ready application (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## Tech Stack

### Core Technologies
- **React 19.2** - UI framework (function components only)
- **TypeScript 5.9** - Type-safe JavaScript (strict mode enabled)
- **Vite 7.2** - Fast build tool and dev server

### Styling
- **Tailwind CSS v4.1** - Utility-first CSS framework
- **@tailwindcss/vite** - Vite plugin for Tailwind v4 (CSS-based configuration)

### Development Tools
- **ESLint 9.39** - Code linting with React-specific rules
- **typescript-eslint 8.46** - TypeScript ESLint integration

## Project Structure

```
src/
  components/     # UI components (PascalCase.tsx)
  hooks/          # Custom hooks (useCamelCase.ts)
  services/midi/  # MIDI layer (MidiService, LXPaletteAPI, SysExParser)
  types/          # TypeScript interfaces (palette.ts, midi.ts, errors.ts)
  utils/          # Helpers (colorMath.ts, sysexEncoding.ts)
  context/        # React contexts (MidiContext, PaletteContext)
```

## Development Guidelines

- **TypeScript Strict Mode**: All code must pass strict type checking (no `any` types)
- **React Patterns**: Function components only, immutable state updates
- **Tailwind v4**: CSS-based configuration via `@import "tailwindcss"` (no tailwind.config.js)
- **RGB Channel Order**: Hardware uses R, B, G order (not standard RGB)
- **MIDI Constraints**: All MIDI bytes must be 7-bit (0x00-0x7F)

## Browser Requirements

- Modern browser with Web MIDI API support
- HTTPS connection required for Web MIDI API access (development on localhost is exempt)

## License

[Add license information here]
