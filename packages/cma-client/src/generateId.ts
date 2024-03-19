import { v4 } from 'uuid';
const decoder = new TextDecoder('utf8');

function toBase64(bytes: Uint8Array) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }

  return btoa(decoder.decode(bytes));
}

export function generateId() {
  const bytes = v4(null, new Uint8Array(16));

  // unset first bit to ensure [A-Za-f] first char
  bytes[0] = bytes[0]! & 0x7f;

  const base64 = toBase64(bytes);

  return (
    base64
      // Replace + with - (see RFC 4648, sec. 5)
      .replace(/\+/g, '-')
      // Replace / with _ (see RFC 4648, sec. 5)
      .replace(/\//g, '_')
      // Drop '==' padding
      .substring(0, 22)
  );
}
