import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";

const privateKeyPath = path.resolve("rsa", "private.pem");
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

export function decryptWithPrivateKey(encryptedData) {
  try {
    const buffer = Buffer.from(encryptedData, "base64");
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      buffer
    );
    return JSON.parse(decrypted.toString());
  } catch (error) {
    console.error("Node.js decryption failed:", error.message);

    try {
      const tempFile = "/tmp/encrypted.bin";
      const tempOut = "/tmp/decrypted.txt";
      fs.writeFileSync(tempFile, Buffer.from(encryptedData, "base64"));
      execSync(
        `openssl rsautl -decrypt -inkey rsa/private.pem -in ${tempFile} -out ${tempOut}`
      );
      const decrypted = fs.readFileSync(tempOut, "utf8");
      return JSON.parse(decrypted);
    } catch (fallbackError) {
      console.error("OpenSSL fallback failed:", fallbackError.message);
      throw new Error("Decryption failed");
    }
  }
}
