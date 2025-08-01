import CryptoJS from 'crypto-js';

const key = CryptoJS.enc.Utf8.parse('gptbots-assistant-1234567890');
const iv = CryptoJS.enc.Utf8.parse('gptbots-assistant-1234567890');

export function aesEncrypt(data: string) {
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

export function aesDecrypt(data: string) {
  const decrypted = CryptoJS.AES.decrypt(data, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
