import QRCode from 'qrcode';

/**
 * Generates a SHA-256 hash of a JSON object using the browser's Web Crypto API.
 * @param data The JSON object to hash.
 * @returns A promise that resolves with the hex-encoded SHA-256 hash.
 */
export const generateSha256 = async (data: object): Promise<string> => {
  const str = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataUint8Array = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataUint8Array);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
};

/**
 * Generates a Data URL for a QR code from a given string.
 * @param text The text to encode in the QR code.
 * @returns A promise that resolves with the QR code Data URL.
 */
export const generateQrCode = async (text: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      width: 256,
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
};