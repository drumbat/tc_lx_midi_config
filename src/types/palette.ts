/**
 * 12-bit RGB color value (0-4095 per channel).
 *
 * CRITICAL: Hardware uses R, B, G channel order when encoding to MIDI.
 * This interface uses standard RGB naming internally, but MIDI encoding
 * must swap blue and green channels during SysEx conversion.
 */
export interface RGB12 {
  /** Red channel: 0-4095 (12-bit) */
  r: number;
  /** Green channel: 0-4095 (12-bit) */
  g: number;
  /** Blue channel: 0-4095 (12-bit) */
  b: number;
}

/**
 * Palette slot status
 * - empty: No palette saved in slot
 * - factory: Factory preset (slots 0-1 are write-protected)
 * - user_loaded: User palette loaded from SD card
 * - user_modified: User palette modified in memory (unsaved changes)
 */
export type SlotStatus = 'empty' | 'factory' | 'user_loaded' | 'user_modified';

/**
 * Complete palette data for one slot (24 LED color contexts).
 *
 * Structure:
 * - track_smd: 4 tracks × normal brightness = 4 colors
 * - track_smd_dim: 4 tracks × dim brightness = 4 colors
 * - track_smd_medium: 4 tracks × medium/highlight brightness = 4 colors
 * - track_btn: 4 tracks × 3 brightness levels = 12 colors
 * Total: 24 LED contexts
 *
 * CRITICAL: Factory slots 0-1 are write-protected. Attempting to save
 * to these slots will return error code 0x08.
 */
export interface Palette {
  /**
   * Slot number: 0-7 (slots 0-1 are factory write-protected)
   * TypeScript literal type enforces compile-time validation of valid slot range.
   */
  slot: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** Current slot status */
  status: SlotStatus;
  /** Normal brightness SMD LEDs for 4 tracks */
  track_smd: [RGB12, RGB12, RGB12, RGB12];
  /** Dim brightness SMD LEDs for 4 tracks */
  track_smd_dim: [RGB12, RGB12, RGB12, RGB12];
  /** Medium/highlight brightness SMD LEDs for 4 tracks */
  track_smd_medium: [RGB12, RGB12, RGB12, RGB12];
  /**
   * RGB button LEDs: 4 tracks × 3 brightness levels
   * [track][brightness] where brightness: 0=off/dim, 1=mid, 2=bright
   */
  track_btn: [
    [RGB12, RGB12, RGB12],  // Track 1: brightness levels 0, 1, 2
    [RGB12, RGB12, RGB12],  // Track 2: brightness levels 0, 1, 2
    [RGB12, RGB12, RGB12],  // Track 3: brightness levels 0, 1, 2
    [RGB12, RGB12, RGB12]   // Track 4: brightness levels 0, 1, 2
  ];
}

/**
 * Device slot information returned by PALETTE_INFO command.
 *
 * Provides current active slot, hardware version, and status
 * of all 8 palette slots.
 */
export interface SlotInfo {
  /**
   * Currently active slot: 0-7
   * TypeScript literal type enforces compile-time validation of valid slot range.
   */
  activeSlot: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** Hardware version: 0 or 1 */
  hwVersion: 0 | 1;
  /** Status array for all 8 slots (must have exactly 8 elements, one per slot) */
  slotStatus: [
    SlotStatus,
    SlotStatus,
    SlotStatus,
    SlotStatus,
    SlotStatus,
    SlotStatus,
    SlotStatus,
    SlotStatus
  ];
}
