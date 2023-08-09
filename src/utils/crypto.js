import CryptoJS from "crypto-js";

const encryption = (text) => {
  const hash = CryptoJS.SHA256(text);
  return hash.toString(CryptoJS.enc.Base64);
};

export { encryption };
