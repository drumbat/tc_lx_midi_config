/**
 * Error category classification for user-facing error handling.
 * - connection: MIDI device connection/communication errors
 * - sd: SD card read/write errors
 * - validation: Invalid input or parameter errors
 * - protocol: MIDI protocol or firmware version errors
 */
export type ErrorCategory = 'connection' | 'sd' | 'validation' | 'protocol';

/**
 * Application error with user-friendly messaging and recovery guidance.
 */
export interface AppError {
  /** User-facing error message (no technical jargon) */
  message: string;
  /** Error classification for UI handling */
  category: ErrorCategory;
  /** UX_ERR_* code from firmware if applicable (0x01-0x16) */
  code?: number;
  /** Whether user can retry this operation */
  recoverable: boolean;
}

/**
 * LX Palette UX API Error Code Mapping.
 *
 * Maps all 15 firmware error codes (0x01-0x08, 0x10-0x16) to user-friendly messages.
 * These errors are returned in SysEx response messages when operations fail.
 *
 * CRITICAL: Firmware uses these exact error codes. Do not modify codes.
 */
export const UX_ERRORS: Record<number, Omit<AppError, 'code'>> = {
  // Validation Errors (0x01-0x08)
  0x01: {
    message: 'Invalid slot number',
    category: 'validation',
    recoverable: false,
  },
  0x02: {
    message: 'Invalid field ID',
    category: 'validation',
    recoverable: false,
  },
  0x03: {
    message: 'Invalid track index',
    category: 'validation',
    recoverable: false,
  },
  0x04: {
    message: 'Invalid brightness index',
    category: 'validation',
    recoverable: false,
  },
  0x05: {
    message: 'Invalid channel',
    category: 'validation',
    recoverable: false,
  },
  0x06: {
    message: 'Value out of range',
    category: 'validation',
    recoverable: false,
  },
  0x07: {
    message: 'Slot is empty',
    category: 'validation',
    recoverable: true,
  },
  0x08: {
    message: 'Cannot modify factory palette',
    category: 'validation',
    recoverable: false,
  },

  // SD Card Errors (0x10-0x15)
  0x10: {
    message: 'SD card not ready. Check card is inserted.',
    category: 'sd',
    recoverable: true,
  },
  0x11: {
    message: 'Failed to write to SD card',
    category: 'sd',
    recoverable: true,
  },
  0x12: {
    message: 'Palette name too long (max 32 characters)',
    category: 'validation',
    recoverable: true,
  },
  0x13: {
    message: 'Invalid characters in palette name',
    category: 'validation',
    recoverable: true,
  },
  0x14: {
    message: 'Palette file not found',
    category: 'sd',
    recoverable: true,
  },
  0x15: {
    message: 'Palette file is corrupted',
    category: 'sd',
    recoverable: false,
  },

  // Protocol Errors (0x16)
  0x16: {
    message: 'Hardware version mismatch',
    category: 'protocol',
    recoverable: false,
  },
} as const;
