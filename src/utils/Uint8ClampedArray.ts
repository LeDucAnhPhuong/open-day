export function base64ToUint8Array(base64: string): Uint8Array {
  const raw = atob(base64.split(",")[1]); // Giải mã base64
  const array = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

export function base64ToUint8ClampedArray(base64: string): Uint8ClampedArray {
  const uint8Array = base64ToUint8Array(base64);
  return new Uint8ClampedArray(uint8Array);
}
