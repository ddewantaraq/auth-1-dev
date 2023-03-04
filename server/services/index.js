const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
dotenv.config();

const coreService = {
    sidGeneration: (userEmail) => {
      const appIdVer = process.env.APP_ID + '_' + process.env.APP_VERSION
      const expiredToken = new Date();
      expiredToken.setTime(expiredToken.getTime() + (process.env.EXPIRE_TOKEN ?? 3600) * 1000);
      const plainSid = `${userEmail}|${appIdVer}|${expiredToken.getTime()}`
      const encSid = coreService.encryptData(plainSid)
      return {encSid, plainSid}
    },
    encryptData: (plainText) => {
      // Perform the encryption AES-256-CBC
      const ciphertext = CryptoJS.AES.encrypt(plainText, process.env.SECRET_KEY, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString();

      return ciphertext
    },
    decryptData: (text) => {
      // Perform the encryption AES-256-CBC
      const plaintext = CryptoJS.AES.decrypt(text, process.env.SECRET_KEY, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);

      return plaintext
    }
}

module.exports = coreService