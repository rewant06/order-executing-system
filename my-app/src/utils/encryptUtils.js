// utils/encryptUtils.js
import publicKeyBase64 from "../rsa/publicKeyBase64"; // key must be base64 without header/footer

export async function encryptWithPublicKey(data) {
  const keyData = Uint8Array.from(atob(publicKeyBase64), (c) =>
    c.charCodeAt(0)
  );

  const cryptoKey = await window.crypto.subtle.importKey(
    "spki",
    keyData.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"]
  );

  const encrypted = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    cryptoKey,
    new TextEncoder().encode(JSON.stringify(data))
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted))); // Return base64-encoded string
}
