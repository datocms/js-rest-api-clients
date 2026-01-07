import { v4 } from 'uuid';

function fromUint8ArrayToUrlSafeBase64(bytes: Uint8Array) {
  const base64 =
    typeof Buffer === 'undefined'
      ? btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''))
      : Buffer.from(bytes).toString('base64');

  // Convert to URL-safe format (see RFC 4648, sec. 5)
  return (
    base64
      // Replace + with -
      .replace(/\+/g, '-')
      // Replace / with _
      .replace(/\//g, '_')
      // Drop '==' padding
      .substring(0, 22)
  );
}

function fromUrlSafeBase64toUint8Array(urlSafeBase64: string): Uint8Array {
  // Convert from URL-safe format (see RFC 4648, sec. 5)
  const base64 = urlSafeBase64
    // Replace - with +
    .replace(/-/g, '+')
    // Replace _ with /
    .replace(/_/g, '/');

  return typeof Buffer === 'undefined'
    ? Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
    : new Uint8Array(Buffer.from(base64, 'base64'));
}

export function isValidId(id: string) {
  // For backward compatibility, first check to see if this is an older-style integer ID formerly used by Dato
  if (/^\d+$/.test(id)) {
    const intId = BigInt(id);
    const maxDatoIntegerId = 281474976710655; // Max 6-byte/48-bit unsigned int
    return intId <= maxDatoIntegerId;
  }

  let bytes: Uint8Array;
  try {
    bytes = fromUrlSafeBase64toUint8Array(id);
  } catch {
    // If the string is not valid base64, it's not a valid ID
    return false;
  }

  // UUIDs are 16 bytes
  if (bytes.length !== 16) {
    return false;
  }

  // The variant field determines the layout of the UUID
  // (see RFC 4122, sec. 4.1.1)

  const variant = bytes.at(8)!;

  // Variant must be the one described in RFC 4122
  if ((variant & 0b11000000) !== 0b10000000) {
    return false;
  }

  // The version number is in the most significant 4 bits
  // of the time stamp (see RFC 4122, sec. 4.1.3)

  const version = bytes.at(6)! >> 4;

  // Version number must be 4 (randomly generated)
  if (version !== 0x4) {
    return false;
  }

  return true;
}

export function generateId() {
  const bytes = v4(null, new Uint8Array(16));

  // Here we unset the first bit to ensure [A-Za-f] as the first char.
  //
  // If we didn't do this, we would generate IDs that, once encoded
  // in base64, could start with a '+' or a '/'. This makes them less
  // easy to copy/paste, with bad DX.

  // This choice is purely aesthetic: definitely non-mandatory!

  bytes[0] = bytes[0]! & 0x7f;

  const base64 = fromUint8ArrayToUrlSafeBase64(bytes);

  return base64;
}
