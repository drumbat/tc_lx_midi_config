# LX Palette UX Command API

## Overview

The LX Palette UX Command API provides comprehensive remote control of Tetrachords LED color palettes via MIDI SysEx messages. This enables web-based configurators and MIDI control surfaces to query, modify, save, load, and delete color palettes on the hardware.

### Use Cases

- **Web MIDI Configurator**: Browser-based palette editor with live LED preview
- **MIDI Controller Integration**: Hardware controllers for palette navigation
- **Preset Management**: Backup/restore palettes via SysEx dumps
- **Real-time Color Editing**: Immediate visual feedback when adjusting colors
- **Factory Reset**: Restore to factory palettes from any state

### Architecture

The UX Command family (0x41) is separate from:
- **DEBUG_COMMAND (0x7D)**: Development/debugging features
- **MUSICAL_DATA_COMMAND (0x40)**: Musical content (scales, chords) - push-only

This separation provides:
- **Semantic clarity**: UI configuration vs musical content
- **Bidirectional communication**: Request/response pattern
- **Future extensibility**: Reserved for brightness, themes, button sensitivity

---

## Message Format

### Base Structure

All UX Command messages follow this format:

```
F0 77 01 41 [SUBCOMMAND] [params...] F7
│  │  │  │      │            │        │
│  │  │  │      │            │        └─ SysEx End
│  │  │  │      │            └────────── Parameters (operation-specific)
│  │  │  │      └─────────────────────── Subcommand (0x01-0x09)
│  │  │  └────────────────────────────── UX_COMMAND (0x41)
│  │  └───────────────────────────────── Device ID (0x01)
│  └──────────────────────────────────── Manufacturer ID (0x77)
└─────────────────────────────────────── SysEx Start
```

All bytes except F0/F7 must be 7-bit (0x00-0x7F).

---

## Operations Summary

| Code | Operation | Direction | Purpose |
|------|-----------|-----------|---------|
| 0x01 | PALETTE_QUERY | Request → Response | Stream full 24-color palette |
| 0x02 | PALETTE_SET_RGB | Request → Response | Edit individual RGB value |
| 0x03 | PALETTE_SAVE | Request → Response | Save palette to SD card |
| 0x04 | PALETTE_LOAD | Request → Response | Load palette from SD card |
| 0x05 | PALETTE_DELETE | Request → Response | Delete palette file |
| 0x06 | PALETTE_INFO | Request → Response | Query slot status metadata |
| 0x07 | PALETTE_LIST | Request → Response | List .lxp files on SD |
| 0x08 | PALETTE_SELECT | Request → Response | Select active palette |
| 0x09 | PALETTE_NAVIGATE | Request → Response | Navigate next/prev |

---

## 12-bit RGB Encoding

RGB values are 12-bit (0-4095) to support high-resolution LEDs. They are encoded as two 7-bit bytes for MIDI compatibility:

### Encoding (JavaScript)

```javascript
function encode12BitValue(value) {
  // value: 0-4095
  const msb = (value >> 7) & 0x7F;  // Bits 11-7
  const lsb = value & 0x7F;          // Bits 6-0
  return { msb, lsb };
}
```

### Decoding (JavaScript)

```javascript
function decode12BitValue(msb, lsb) {
  // msb, lsb: 0-127
  return (msb << 7) | lsb;  // Returns 0-4095
}
```

### Example

```javascript
// Encode red=2048
const { msb, lsb } = encode12BitValue(2048);
// msb = 16 (0x10), lsb = 0 (0x00)

// Decode back
const value = decode12BitValue(16, 0);
// value = 2048
```

---

## Palette Structure

Each palette contains **24 RGB colors** organized into 4 fields:

| Field ID | Field Name | Array Size | Description |
|----------|------------|------------|-------------|
| 0 | track_smd | [4] | Normal brightness track colors |
| 1 | track_smd_dim | [4] | Dim brightness track colors |
| 2 | track_smd_medium | [4] | Medium/highlight track colors |
| 3 | track_btn | [4][3] | Track button colors [track][brightness] |

**Total colors**: 4 + 4 + 4 + 12 = **24 RGB colors** = **72 values** (R, B, G per color)

### Field 3 Indexing

`track_btn[4][3]` requires **two indices**:
- **track_idx**: 0-3 (which track)
- **brightness_idx**: 0-2 (brightness level: dim/normal/bright)

All other fields use **single index** (track_idx only).

---

## Operation Details

### 0x01 - PALETTE_QUERY

Query and stream full palette data (24 colors, ~158 bytes).

#### Request Format

```
F0 77 01 41 01 [slot] F7
               │   │
               │   └─ Slot index: 0-7, or 0x7F for active slot
               └───── PALETTE_QUERY (0x01)
```

#### Response Format

```
F0 77 01 41 01 [timestamp_msb] [timestamp_lsb] [slot] [hw_version] [num_colors]
   [status] [field_0_colors...] [field_1_colors...] [field_2_colors...]
   [field_3_colors...] F7
```

**Header Bytes**:
- `timestamp_msb`, `timestamp_lsb`: HAL_GetTick() >> 7, & 0x7F
- `slot`: Resolved slot index (0-7)
- `hw_version`: 0=V1, 1=V2
- `num_colors`: Always 24
- `status`: Slot status (0=empty, 1=factory, 2=user_loaded, 3=user_modified)

**Color Encoding** (6 bytes per RGB color):
```
[r_msb] [r_lsb] [b_msb] [b_lsb] [g_msb] [g_lsb]
```

**Field Order**:
1. Field 0: track_smd[4] = 4 colors × 6 bytes = 24 bytes
2. Field 1: track_smd_dim[4] = 24 bytes
3. Field 2: track_smd_medium[4] = 24 bytes
4. Field 3: track_btn[4][3] = 12 colors × 6 bytes = 72 bytes

**Total**: ~158 bytes (fits in single SysEx message)

#### JavaScript Example

```javascript
class LXPaletteAPI {
  constructor(midiOutput) {
    this.output = midiOutput;
  }

  queryPalette(slot) {
    // slot: 0-7 or 0x7F for active
    const message = [0xF0, 0x77, 0x01, 0x41, 0x01, slot & 0x7F, 0xF7];
    this.output.send(message);
  }
}

class LXPaletteParser {
  parsePaletteQuery(data) {
    // data: Uint8Array SysEx message (F0...F7)
    if (data[0] !== 0xF0 || data[data.length - 1] !== 0xF7) {
      throw new Error('Invalid SysEx message');
    }
    if (data[3] !== 0x41 || data[4] !== 0x01) {
      throw new Error('Not a PALETTE_QUERY response');
    }

    const timestamp = (data[5] << 7) | data[6];
    const slot = data[7];
    const hwVersion = data[8];
    const numColors = data[9];
    const status = data[10];

    let idx = 11;
    const palette = {
      slot,
      hwVersion,
      status,
      timestamp,
      track_smd: [],
      track_smd_dim: [],
      track_smd_medium: [],
      track_btn: [[],[],[],[]]
    };

    // Parse field 0: track_smd[4]
    for (let i = 0; i < 4; i++) {
      palette.track_smd.push(this.parseRGB(data, idx));
      idx += 6;
    }

    // Parse field 1: track_smd_dim[4]
    for (let i = 0; i < 4; i++) {
      palette.track_smd_dim.push(this.parseRGB(data, idx));
      idx += 6;
    }

    // Parse field 2: track_smd_medium[4]
    for (let i = 0; i < 4; i++) {
      palette.track_smd_medium.push(this.parseRGB(data, idx));
      idx += 6;
    }

    // Parse field 3: track_btn[4][3]
    for (let track = 0; track < 4; track++) {
      for (let brightness = 0; brightness < 3; brightness++) {
        palette.track_btn[track].push(this.parseRGB(data, idx));
        idx += 6;
      }
    }

    return palette;
  }

  parseRGB(data, idx) {
    const r = (data[idx] << 7) | data[idx + 1];
    const b = (data[idx + 2] << 7) | data[idx + 3];
    const g = (data[idx + 4] << 7) | data[idx + 5];
    return { r, b, g };
  }
}
```

#### Error Responses

| Error Code | Name | Reason |
|------------|------|--------|
| 0x01 | UX_ERR_INVALID_SLOT | Slot > 7 |
| 0x07 | UX_ERR_SLOT_EMPTY | Slot not loaded |

---

### 0x02 - PALETTE_SET_RGB

Edit a single RGB value in a palette slot. **If slot is active, LEDs update immediately**.

#### Request Format

```
F0 77 01 41 02 [slot] [field_id] [track_idx] [brightness_idx] [channel]
   [val_msb] [val_lsb] F7
```

**Parameters**:
- `slot`: 0-7 (slot to edit)
- `field_id`: 0-3 (see Palette Structure table)
- `track_idx`: 0-3 (track index)
- `brightness_idx`: 0-2 (only used for field_id=3, otherwise 0)
- `channel`: 0=red, 1=blue, 2=green
- `val_msb`, `val_lsb`: 12-bit value (0-4095)

#### Response Format

```
F0 77 01 41 02 [timestamp_msb] [timestamp_lsb] [status] [slot]
   [field_id] [track_idx] [brightness_idx] [channel] [val_msb] [val_lsb] F7
```

**Response Fields**:
- `status`: 0x00 (UX_SUCCESS)
- Echoes all parameters from request
- After success, slot status may transition to USER_MODIFIED (3)

#### JavaScript Example

```javascript
class LXPaletteAPI {
  setRGBValue(slot, fieldId, trackIdx, brightnessIdx, channel, value) {
    // value: 0-4095
    const { msb, lsb } = this.encode12Bit(value);
    const message = [
      0xF0, 0x77, 0x01, 0x41, 0x02,
      slot & 0x7F,
      fieldId & 0x7F,
      trackIdx & 0x7F,
      brightnessIdx & 0x7F,
      channel & 0x7F,
      msb,
      lsb,
      0xF7
    ];
    this.output.send(message);
  }

  encode12Bit(value) {
    return {
      msb: (value >> 7) & 0x7F,
      lsb: value & 0x7F
    };
  }
}

// Example: Set track 0 normal brightness red to 2048 (half brightness)
api.setRGBValue(
  0,     // slot 0 (factory)
  0,     // field 0 (track_smd)
  0,     // track 0
  0,     // brightness (unused for field 0)
  0,     // red channel
  2048   // value
);
```

#### Error Responses

| Error Code | Name | Reason |
|------------|------|--------|
| 0x01 | UX_ERR_INVALID_SLOT | Slot > 7 |
| 0x02 | UX_ERR_INVALID_FIELD | field_id > 3 |
| 0x03 | UX_ERR_INVALID_TRACK | track_idx > 3 |
| 0x04 | UX_ERR_INVALID_BRIGHT | brightness_idx > 2 |
| 0x05 | UX_ERR_INVALID_CHANNEL | channel > 2 |
| 0x06 | UX_ERR_VALUE_RANGE | value > 4095 |
| 0x07 | UX_ERR_SLOT_EMPTY | Slot not loaded |

---

### 0x03 - PALETTE_SAVE

Save a palette slot to SD card with filename `[slot+1]_[name].lxp`.

#### Request Format

```
F0 77 01 41 03 [slot] [name_len] [name_chars...] F7
```

**Parameters**:
- `slot`: 0-7 (slot to save)
- `name_len`: 1-32 (length of name)
- `name_chars`: ASCII characters (alphanumeric, underscore, hyphen only)

**Name Validation**:
- Allowed: `a-z`, `A-Z`, `0-9`, `_`, `-`
- Max length: 32 characters
- No spaces, special characters, or periods

#### Response Format

```
F0 77 01 41 03 [timestamp_msb] [timestamp_lsb] [status] [slot]
   [name_len] [name_chars...] F7
```

**Response Fields**:
- `status`: 0x00 (UX_SUCCESS) or error code
- Echoes slot, name_len, name_chars
- On success, slot status transitions to USER_LOADED (2)

#### JavaScript Example

```javascript
class LXPaletteAPI {
  savePalette(slot, name) {
    // Validate name
    if (name.length > 32) {
      throw new Error('Name too long (max 32 characters)');
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      throw new Error('Invalid name characters (use alphanumeric, _, -)');
    }

    const nameBytes = Array.from(name).map(c => c.charCodeAt(0) & 0x7F);
    const message = [
      0xF0, 0x77, 0x01, 0x41, 0x03,
      slot & 0x7F,
      nameBytes.length & 0x7F,
      ...nameBytes,
      0xF7
    ];
    this.output.send(message);
  }
}

// Example: Save slot 2 as "my_palette"
api.savePalette(2, 'my_palette');
// Creates file: 0:/LX_PALETTES/3_my_palette.lxp
```

#### Error Responses

| Error Code | Name | Reason |
|------------|------|--------|
| 0x01 | UX_ERR_INVALID_SLOT | Slot > 7 |
| 0x07 | UX_ERR_SLOT_EMPTY | Slot not loaded |
| 0x10 | UX_ERR_SD_NOT_READY | SD card not mounted |
| 0x11 | UX_ERR_SD_WRITE_FAILED | Write operation failed |
| 0x12 | UX_ERR_NAME_TOO_LONG | name_len > 32 |
| 0x13 | UX_ERR_NAME_INVALID | Invalid characters in name |

---

### 0x04 - PALETTE_LOAD

Load a palette from SD card file `[slot+1]_[name].lxp` into specified slot.

#### Request Format

```
F0 77 01 41 04 [slot] [name_len] [name_chars...] F7
```

**Parameters**:
- `slot`: 0-7 (destination slot)
- `name_len`: 1-32 (length of name)
- `name_chars`: ASCII filename (without .lxp extension)

**File Resolution**:
- Firmware searches for: `0:/LX_PALETTES/[slot+1]_[name].lxp`
- Example: slot=2, name="custom" → `0:/LX_PALETTES/3_custom.lxp`

#### Response Format

```
F0 77 01 41 04 [timestamp_msb] [timestamp_lsb] [status] [slot]
   [hw_version] [name_len] [name_chars...] F7
```

**Response Fields**:
- `status`: 0x00 (UX_SUCCESS) or error code
- `hw_version`: Hardware version from file (0=V1, 1=V2)
- On success, slot status set to USER_LOADED (2)
- **If slot is active, LEDs update immediately**

#### JavaScript Example

```javascript
class LXPaletteAPI {
  loadPalette(slot, name) {
    const nameBytes = Array.from(name).map(c => c.charCodeAt(0) & 0x7F);
    const message = [
      0xF0, 0x77, 0x01, 0x41, 0x04,
      slot & 0x7F,
      nameBytes.length & 0x7F,
      ...nameBytes,
      0xF7
    ];
    this.output.send(message);
  }
}

// Example: Load "factory_backup" into slot 5
api.loadPalette(5, 'factory_backup');
// Loads file: 0:/LX_PALETTES/6_factory_backup.lxp
```

#### Error Responses

| Error Code | Name | Reason |
|------------|------|--------|
| 0x01 | UX_ERR_INVALID_SLOT | Slot > 7 |
| 0x10 | UX_ERR_SD_NOT_READY | SD card not mounted |
| 0x14 | UX_ERR_FILE_NOT_FOUND | File doesn't exist |
| 0x15 | UX_ERR_PARSE_ERROR | File format invalid/corrupted |
| 0x16 | UX_ERR_HW_MISMATCH | File hw_version ≠ detected hw |

---

### 0x05 - PALETTE_DELETE

Delete a palette file from SD card. **Factory slots 0-1 are protected**.

#### Request Format

```
F0 77 01 41 05 [slot] F7
```

**Parameters**:
- `slot`: 2-7 (user slots only; 0-1 protected)

**File Resolution**:
- Firmware searches for: `0:/LX_PALETTES/[slot+1]_*.lxp`
- Example: slot=2 → finds and deletes `3_*.lxp`

**Behavior**:
- Deletes matching .lxp file via FatFs `f_unlink()`
- Sets slot status to SLOT_EMPTY (0)
- **If deleted slot was active, switches to slot 0 (factory fallback)**

#### Response Format

```
F0 77 01 41 05 [timestamp_msb] [timestamp_lsb] [status] [slot] F7
```

**Response Fields**:
- `status`: 0x00 (UX_SUCCESS) or error code
- `slot`: Echoed slot index

#### JavaScript Example

```javascript
class LXPaletteAPI {
  deletePalette(slot) {
    if (slot < 2) {
      throw new Error('Cannot delete factory slots 0-1');
    }
    const message = [
      0xF0, 0x77, 0x01, 0x41, 0x05,
      slot & 0x7F,
      0xF7
    ];
    this.output.send(message);
  }
}

// Example: Delete palette in slot 3
api.deletePalette(3);
// Deletes: 0:/LX_PALETTES/4_*.lxp
```

#### Error Responses

| Error Code | Name | Reason |
|------------|------|--------|
| 0x01 | UX_ERR_INVALID_SLOT | Slot > 7 |
| 0x08 | UX_ERR_WRITE_PROTECTED | Slot < 2 (factory protection) |
| 0x10 | UX_ERR_SD_NOT_READY | SD card not mounted |
| 0x14 | UX_ERR_FILE_NOT_FOUND | No matching .lxp file found |

---

### 0x06 - PALETTE_INFO

Query metadata for all 8 palette slots (status, active slot, hardware version).

#### Request Format

```
F0 77 01 41 06 F7
```

No parameters required.

#### Response Format

```
F0 77 01 41 06 [timestamp_msb] [timestamp_lsb] [active_slot] [hw_version]
   [num_loaded] [status_0] [status_1] ... [status_7] F7
```

**Response Fields**:
- `active_slot`: Currently selected slot (0-7)
- `hw_version`: Detected hardware (0=V1, 1=V2)
- `num_loaded`: Count of loaded slots (1-8)
- `status_N`: Status for slot N (0-3)

**Status Values**:
- 0 = SLOT_EMPTY
- 1 = SLOT_FACTORY
- 2 = SLOT_USER_LOADED
- 3 = SLOT_USER_MODIFIED

**Total Size**: ~21 bytes

#### JavaScript Example

```javascript
class LXPaletteAPI {
  queryInfo() {
    const message = [0xF0, 0x77, 0x01, 0x41, 0x06, 0xF7];
    this.output.send(message);
  }
}

class LXPaletteParser {
  parsePaletteInfo(data) {
    if (data[3] !== 0x41 || data[4] !== 0x06) {
      throw new Error('Not a PALETTE_INFO response');
    }

    const timestamp = (data[5] << 7) | data[6];
    const activeSlot = data[7];
    const hwVersion = data[8];
    const numLoaded = data[9];
    const slotStatus = [];

    for (let i = 0; i < 8; i++) {
      slotStatus.push(data[10 + i]);
    }

    return {
      timestamp,
      activeSlot,
      hwVersion,
      numLoaded,
      slotStatus
    };
  }
}
```

---

### 0x07 - PALETTE_LIST

List all .lxp palette files on SD card. Uses chunking if >3 files found.

#### Request Format

```
F0 77 01 41 07 F7
```

No parameters required.

#### Response Format

**Single chunk** (≤3 files):
```
F0 77 01 41 07 [timestamp_msb] [timestamp_lsb] [total_files]
   [chunk_idx] [files_in_chunk]
   [file_0_target_slot] [file_0_name_len] [file_0_name_chars...]
   [file_1_target_slot] [file_1_name_len] [file_1_name_chars...]
   ...
   F7
```

**Multiple chunks** (>3 files):
- First chunk: `chunk_idx=0`, `files_in_chunk=3`
- Subsequent chunks: `chunk_idx=1,2,3...`
- Last chunk: `files_in_chunk < 3` (possibly)

**Response Fields**:
- `total_files`: Total number of .lxp files found
- `chunk_idx`: 0-based chunk index
- `files_in_chunk`: Number of files in this chunk (1-3)
- `target_slot`: Slot index extracted from filename (0-7)
- `name_len`: Length of filename (without .lxp)
- `name_chars`: Filename characters

#### JavaScript Example

```javascript
class LXPaletteAPI {
  listPalettes() {
    const message = [0xF0, 0x77, 0x01, 0x41, 0x07, 0xF7];
    this.output.send(message);
  }
}

class LXPaletteParser {
  parsePaletteList(data) {
    if (data[3] !== 0x41 || data[4] !== 0x07) {
      throw new Error('Not a PALETTE_LIST response');
    }

    const timestamp = (data[5] << 7) | data[6];
    const totalFiles = data[7];
    const chunkIdx = data[8];
    const filesInChunk = data[9];

    let idx = 10;
    const files = [];

    for (let i = 0; i < filesInChunk; i++) {
      const targetSlot = data[idx++];
      const nameLen = data[idx++];
      const nameChars = [];

      for (let j = 0; j < nameLen; j++) {
        nameChars.push(String.fromCharCode(data[idx++]));
      }

      files.push({
        targetSlot,
        name: nameChars.join('')
      });
    }

    return {
      timestamp,
      totalFiles,
      chunkIdx,
      filesInChunk,
      files
    };
  }
}
```

#### Error Responses

| Error Code | Name | Reason |
|------------|------|--------|
| 0x10 | UX_ERR_SD_NOT_READY | SD card not mounted |

---

### 0x08 - PALETTE_SELECT

Select a specific palette slot as active. **LEDs update immediately**.

#### Request Format

```
F0 77 01 41 08 [slot] F7
```

**Parameters**:
- `slot`: 0-7 (slot to select)

#### Response Format

```
F0 77 01 41 08 [timestamp_msb] [timestamp_lsb] [status] [old_slot] [new_slot] F7
```

**Response Fields**:
- `status`: 0x00 (UX_SUCCESS) or error code
- `old_slot`: Previously active slot
- `new_slot`: Newly active slot (echoed from request)

#### JavaScript Example

```javascript
class LXPaletteAPI {
  selectPalette(slot) {
    const message = [
      0xF0, 0x77, 0x01, 0x41, 0x08,
      slot & 0x7F,
      0xF7
    ];
    this.output.send(message);
  }
}
```

#### Error Responses

| Error Code | Name | Reason |
|------------|------|--------|
| 0x01 | UX_ERR_INVALID_SLOT | Slot > 7 |
| 0x07 | UX_ERR_SLOT_EMPTY | Slot not loaded |

---

### 0x09 - PALETTE_NAVIGATE

Navigate to next or previous palette (skips empty slots). **LEDs update immediately**.

#### Request Format

```
F0 77 01 41 09 [direction] F7
```

**Parameters**:
- `direction`: 0x00=previous, 0x01=next

**Behavior**:
- Wraps around (slot 0 ← prev ← slot 7)
- Automatically skips empty slots
- Uses `select_next_palette()` / `select_previous_palette()` API

#### Response Format

```
F0 77 01 41 09 [timestamp_msb] [timestamp_lsb] [status] [old_slot] [new_slot] F7
```

**Response Fields**:
- `status`: 0x00 (UX_SUCCESS)
- `old_slot`: Previously active slot
- `new_slot`: Newly active slot (after navigation)

#### JavaScript Example

```javascript
class LXPaletteAPI {
  navigatePalette(direction) {
    // direction: 'next' or 'prev'
    const dirByte = direction === 'next' ? 0x01 : 0x00;
    const message = [
      0xF0, 0x77, 0x01, 0x41, 0x09,
      dirByte,
      0xF7
    ];
    this.output.send(message);
  }
}

// Example: Navigate to next palette
api.navigatePalette('next');
```

---

## Error Handling

### Error Response Format

All error responses follow this format:

```
F0 77 01 41 [SUBCOMMAND] [timestamp_msb] [timestamp_lsb] [error_code]
   [message_len] [message_chars...] F7
```

**Error Code Summary**:

| Code | Name | Description |
|------|------|-------------|
| 0x00 | UX_SUCCESS | Operation successful (not an error) |
| 0x01 | UX_ERR_INVALID_SLOT | Slot index out of range (>7) |
| 0x02 | UX_ERR_INVALID_FIELD | Field ID out of range (>3) |
| 0x03 | UX_ERR_INVALID_TRACK | Track index out of range (>3) |
| 0x04 | UX_ERR_INVALID_BRIGHT | Brightness index out of range (>2) |
| 0x05 | UX_ERR_INVALID_CHANNEL | Channel out of range (>2) |
| 0x06 | UX_ERR_VALUE_RANGE | RGB value out of range (>4095) |
| 0x07 | UX_ERR_SLOT_EMPTY | Attempted operation on empty slot |
| 0x08 | UX_ERR_WRITE_PROTECTED | Attempted delete of factory slot (0-1) |
| 0x10 | UX_ERR_SD_NOT_READY | SD card not mounted/ready |
| 0x11 | UX_ERR_SD_WRITE_FAILED | SD card write operation failed |
| 0x12 | UX_ERR_NAME_TOO_LONG | Filename exceeds 32 characters |
| 0x13 | UX_ERR_NAME_INVALID | Filename contains invalid characters |
| 0x14 | UX_ERR_FILE_NOT_FOUND | Requested .lxp file not found |
| 0x15 | UX_ERR_PARSE_ERROR | File format invalid/corrupted |
| 0x16 | UX_ERR_HW_MISMATCH | File hw_version ≠ detected hardware |

### JavaScript Error Handler Example

```javascript
class LXPaletteParser {
  parseResponse(data) {
    if (data[3] !== 0x41) {
      throw new Error('Not a UX_COMMAND response');
    }

    const subcommand = data[4];
    const timestamp = (data[5] << 7) | data[6];
    const status = data[7];

    if (status !== 0x00) {
      // Error response
      const messageLen = data[8];
      const messageChars = [];
      for (let i = 0; i < messageLen; i++) {
        messageChars.push(String.fromCharCode(data[9 + i]));
      }
      const errorMessage = messageChars.join('');

      throw new Error(`UX Error ${status}: ${errorMessage}`);
    }

    // Success - parse based on subcommand
    switch (subcommand) {
      case 0x01: return this.parsePaletteQuery(data);
      case 0x02: return this.parsePaletteSetRGB(data);
      case 0x03: return this.parsePaletteSave(data);
      case 0x04: return this.parsePaletteLoad(data);
      case 0x05: return this.parsePaletteDelete(data);
      case 0x06: return this.parsePaletteInfo(data);
      case 0x07: return this.parsePaletteList(data);
      case 0x08: return this.parsePaletteSelect(data);
      case 0x09: return this.parsePaletteNavigate(data);
      default:
        throw new Error(`Unknown subcommand: ${subcommand}`);
    }
  }
}
```

---

## Common Workflows

### Workflow 1: Query and Display Palette

```javascript
// 1. Query palette info to see what's loaded
api.queryInfo();
// Response: { activeSlot: 0, hwVersion: 0, slotStatus: [1,1,2,0,0,0,0,0] }

// 2. Query active palette colors
api.queryPalette(0x7F);  // 0x7F = active slot
// Response: full palette with 24 colors

// 3. Display in UI
palette.track_smd.forEach((color, idx) => {
  console.log(`Track ${idx}: R=${color.r} B=${color.b} G=${color.g}`);
});
```

### Workflow 2: Edit Color with Live Preview

```javascript
// 1. Select palette to edit (if not already active)
api.selectPalette(0);

// 2. Edit color (LEDs update immediately since slot 0 is active)
api.setRGBValue(
  0,     // slot 0
  0,     // field 0 (track_smd)
  0,     // track 0
  0,     // brightness (unused for field 0)
  0,     // red channel
  3000   // new value
);

// 3. User sees LED change in real-time on hardware
// 4. Continue editing other colors...
```

### Workflow 3: Save Edited Palette

```javascript
// 1. After editing palette in slot 0 (factory)
// Status has changed: FACTORY (1) → USER_MODIFIED (3)

// 2. Save to user slot
api.savePalette(2, 'my_custom_palette');
// Creates: 0:/LX_PALETTES/3_my_custom_palette.lxp
// Slot 2 status: USER_MODIFIED (3) → USER_LOADED (2)

// 3. Verify save
api.queryInfo();
// Response: slotStatus[2] = 2 (USER_LOADED)
```

### Workflow 4: Load Custom Palette

```javascript
// 1. List available palettes on SD
api.listPalettes();
// Response: [
//   { targetSlot: 2, name: 'my_custom_palette' },
//   { targetSlot: 5, name: 'colorblind_v2' }
// ]

// 2. Load palette into slot 4
api.loadPalette(4, 'colorblind_v2');
// Loads: 0:/LX_PALETTES/5_colorblind_v2.lxp → slot 4

// 3. Select loaded palette (LEDs update immediately)
api.selectPalette(4);
```

### Workflow 5: Delete and Restore

```javascript
// 1. Delete user palette from slot 3
api.deletePalette(3);
// Deletes: 0:/LX_PALETTES/4_*.lxp
// If slot 3 was active, firmware auto-switches to slot 0 (factory)

// 2. Verify deletion
api.queryInfo();
// Response: slotStatus[3] = 0 (SLOT_EMPTY)

// 3. Restore from backup (if needed)
api.loadPalette(3, 'backup_palette');
```

### Workflow 6: Navigate Palettes

```javascript
// 1. Get current state
api.queryInfo();
// Response: activeSlot = 0

// 2. Navigate to next palette (skips empty slots automatically)
api.navigatePalette('next');
// Response: { oldSlot: 0, newSlot: 1 }

// 3. Navigate back
api.navigatePalette('prev');
// Response: { oldSlot: 1, newSlot: 0 }
```

---

## Web MIDI API Integration

### Complete Example: Palette Editor

```javascript
class TetrachordsPaletteEditor {
  constructor() {
    this.api = null;
    this.parser = new LXPaletteParser();
    this.midiInput = null;
    this.midiOutput = null;
  }

  async init() {
    // Request MIDI access
    const midiAccess = await navigator.requestMIDIAccess({ sysex: true });

    // Find Tetrachords device
    for (const input of midiAccess.inputs.values()) {
      if (input.name.includes('Tetrachords')) {
        this.midiInput = input;
        this.midiInput.onmidimessage = this.handleMidiMessage.bind(this);
      }
    }

    for (const output of midiAccess.outputs.values()) {
      if (output.name.includes('Tetrachords')) {
        this.midiOutput = output;
      }
    }

    if (!this.midiInput || !this.midiOutput) {
      throw new Error('Tetrachords device not found');
    }

    this.api = new LXPaletteAPI(this.midiOutput);
    console.log('Connected to Tetrachords');
  }

  handleMidiMessage(event) {
    const data = event.data;

    // Check if SysEx message
    if (data[0] === 0xF0 && data[data.length - 1] === 0xF7) {
      try {
        const response = this.parser.parseResponse(data);
        this.onPaletteResponse(response);
      } catch (error) {
        console.error('Parse error:', error);
      }
    }
  }

  onPaletteResponse(response) {
    // Override in your UI code
    console.log('Palette response:', response);
  }

  // High-level API methods
  async loadAndDisplay(slot) {
    this.api.queryPalette(slot);
  }

  async editColor(slot, field, track, brightness, channel, value) {
    this.api.setRGBValue(slot, field, track, brightness, channel, value);
  }

  async saveAs(slot, name) {
    this.api.savePalette(slot, name);
  }
}

// Usage
const editor = new TetrachordsPaletteEditor();
await editor.init();

// Load factory palette
editor.loadAndDisplay(0);

// Edit track 0 red channel
editor.editColor(0, 0, 0, 0, 0, 2048);

// Save to slot 2
editor.saveAs(2, 'my_palette');
```

---

## Troubleshooting

### Problem: No response from firmware

**Causes**:
- MIDI device not connected
- SysEx not enabled in Web MIDI API
- Incorrect manufacturer ID or command bytes

**Solutions**:
- Check `navigator.requestMIDIAccess({ sysex: true })`
- Verify message starts with `F0 77 01 41`
- Use browser console to log sent/received messages

### Problem: Parse error on response

**Causes**:
- Timestamp overflow (timestamps are 14-bit)
- Incorrect byte order
- Multiple messages concatenated

**Solutions**:
- Validate `data[0] === 0xF0` and `data[data.length - 1] === 0xF7`
- Parse one message at a time
- Check for unexpected length

### Problem: Color values don't match

**Causes**:
- Incorrect 12-bit encoding/decoding
- RGB vs BGR confusion
- Channel indexing error

**Solutions**:
- Verify: `value = (msb << 7) | lsb`
- Note: Firmware uses R, B, G order (not RGB)
- Channels: 0=red, 1=blue, 2=green

### Problem: SD card errors

**Causes**:
- SD card not inserted/mounted
- File system corruption
- Filename conflicts

**Solutions**:
- Check error code 0x10 (SD_NOT_READY)
- Validate filename format: `[1-8]_[name].lxp`
- Use LIST operation to verify files

### Problem: Hardware version mismatch

**Causes**:
- Loading V1 palette on V2 hardware (or vice versa)
- Corrupted .lxp file

**Solutions**:
- Check error code 0x16 (HW_MISMATCH)
- Query INFO to get detected hardware version
- Use hardware-specific palettes only

---

## Performance Considerations

### Message Timing

- **Query operations**: ~50ms response time
- **Set operations**: <10ms (immediate LED update)
- **SD operations**: 100-500ms (file I/O)

### Buffer Limits

- **Max SysEx size**: 256 bytes (firmware buffer)
- **Palette query**: ~158 bytes (safe)
- **File list**: Chunked at 3 files/chunk (safe)

### Best Practices

1. **Batch edits**: Wait for response before sending next SET_RGB
2. **Debounce UI**: Don't send on every slider pixel (use 50ms debounce)
3. **Cache palette data**: Query once, cache locally
4. **Handle timeouts**: Expect 500ms max for SD operations
5. **Retry logic**: Implement exponential backoff for errors

---

## Implementation Notes

### Firmware Constants

From `Core/Inc/sysex_debugger.h`:

```c
#define UX_COMMAND              0x41
#define UX_PALETTE_QUERY        0x01
#define UX_PALETTE_SET_RGB      0x02
#define UX_PALETTE_SAVE         0x03
#define UX_PALETTE_LOAD         0x04
#define UX_PALETTE_DELETE       0x05
#define UX_PALETTE_INFO         0x06
#define UX_PALETTE_LIST         0x07
#define UX_PALETTE_SELECT       0x08
#define UX_PALETTE_NAVIGATE     0x09
```

### Palette API Functions

From `Core/Inc/led_colour_palette.h`:

```c
const colour_palette_t* lx_get_palette(uint8_t slot);
bool lx_set_rgb_value(uint8_t slot, uint8_t field_id, uint8_t track_idx,
                       uint8_t brightness_idx, uint8_t channel, uint16_t value);
uint16_t lx_get_rgb_value(uint8_t slot, uint8_t field_id, uint8_t track_idx,
                           uint8_t brightness_idx, uint8_t channel);
palette_slot_status_t lx_get_slot_status(uint8_t slot);
void lx_select_palette_slot(uint8_t slot);
uint8_t get_current_palette_index(void);
hardware_version_t lx_get_hardware_version(void);
```

### File Format

.lxp files use JSON format (implemented in Phase 2):
- Hardware version detection
- 24 RGB color values
- Atomic save (temp file + rename)
- See: `Core/Src/lxp_palette_parser.c` for details

---

## Future Extensions

Reserved UX subcommands for future features:

```c
#define UX_BRIGHTNESS_SET       0x10  // Global LED brightness
#define UX_THEME_QUERY          0x20  // UI theme settings
```

These subcommands are reserved but not yet implemented. Web configurator should return "not implemented" error if firmware responds with unknown subcommand.

---

## Summary

The LX Palette UX Command API provides:

- ✅ **Complete palette lifecycle**: Query, modify, save, load, delete
- ✅ **Real-time visual feedback**: Immediate LED updates on active palette
- ✅ **Factory protection**: Slots 0-1 cannot be deleted
- ✅ **Hardware compatibility**: V1/V2 detection and validation
- ✅ **Efficient streaming**: Full 24-color palette in single message
- ✅ **Robust error handling**: 17 error codes with descriptive messages
- ✅ **SD card persistence**: Atomic saves with wear-leveling journal

**Total Operations**: 9 subcommands
**Total Size**: ~600 lines firmware code
**Buffer Usage**: 256 bytes max SysEx message
**Files Modified**: `sysex_debugger.h`, `sysex_debugger.c`

For questions or issues, contact firmware team or reference:
- `tests/docs/sysex_debugger/message_catalog.md` - Complete message reference
- `tests/docs/sysex_debugger/adding_new_features.md` - Implementation guide
- `Core/Inc/led_colour_palette.h` - Palette API reference
