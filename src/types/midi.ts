/**
 * Raw MIDI message data.
 *
 * CRITICAL: All MIDI bytes must be 7-bit (0x00-0x7F).
 * Values >= 0x80 are invalid and will cause MIDI protocol errors.
 */
export type MidiMessage = Uint8Array;

/**
 * Parsed SysEx response from LX Palette device.
 *
 * SysEx message structure:
 * [0xF0, 0x77, 0x01, 0x41, command, ...data, 0xF7]
 * - 0xF0: SysEx start
 * - 0x77: Manufacturer ID
 * - 0x01: Device ID
 * - 0x41: Palette command category
 * - command: PaletteCommand code (0x01-0x09)
 * - data: Command-specific payload
 * - 0xF7: SysEx end
 */
export interface SysExResponse {
  /** Whether the operation succeeded */
  success: boolean;
  /** Error code (0x01-0x16) if operation failed */
  errorCode?: number;
  /** Response payload data if operation succeeded */
  data?: Uint8Array;
}

/**
 * Palette operation command codes.
 *
 * These map to the command byte in SysEx messages.
 * All commands are sent via MIDI SysEx with 500ms timeout.
 */
export type PaletteCommand =
  | 'PALETTE_INFO'      // 0x01 - Query device info and slot status
  | 'PALETTE_QUERY'     // 0x02 - Read palette data from slot
  | 'PALETTE_SET_RGB'   // 0x03 - Update LED color in real-time
  | 'PALETTE_SAVE'      // 0x04 - Save palette to SD card
  | 'PALETTE_LOAD'      // 0x05 - Load palette from SD card
  | 'PALETTE_DELETE'    // 0x06 - Delete palette from SD card
  | 'PALETTE_RENAME'    // 0x07 - Rename palette on SD card
  | 'PALETTE_COPY'      // 0x08 - Copy palette to another slot
  | 'PALETTE_RESET';    // 0x09 - Reset slot to factory default

/**
 * MIDI protocol constants for LX Palette UX API.
 *
 * CRITICAL: These values must match firmware specification exactly.
 */
export const MIDI_CONSTANTS = {
  /** SysEx start byte */
  SYSEX_START: 0xF0,
  /** SysEx end byte */
  SYSEX_END: 0xF7,
  /** Manufacturer ID for LX Palette */
  MANUFACTURER_ID: 0x77,
  /** Device ID */
  DEVICE_ID: 0x01,
  /** Palette command category */
  PALETTE_CATEGORY: 0x41,
  /** Request timeout in milliseconds */
  TIMEOUT_MS: 500,
} as const;

/**
 * Palette command code mapping.
 *
 * Maps PaletteCommand enum values to their byte codes.
 */
export const PALETTE_COMMAND_CODES: Record<PaletteCommand, number> = {
  PALETTE_INFO: 0x01,
  PALETTE_QUERY: 0x02,
  PALETTE_SET_RGB: 0x03,
  PALETTE_SAVE: 0x04,
  PALETTE_LOAD: 0x05,
  PALETTE_DELETE: 0x06,
  PALETTE_RENAME: 0x07,
  PALETTE_COPY: 0x08,
  PALETTE_RESET: 0x09,
} as const;
