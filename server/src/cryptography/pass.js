const crypto = require("crypto");

function verifyPassword(password, hash, salt) {
  let hashPassword = generateHash(password, salt);
  return hashPassword === hash;
}

function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function generateHash(password, salt) {
  let hash = crypto
    .pbkdf2Sync(password, salt, 100000, 512, "sha512")
    .toString("hex");
  return hash;
}
module.exports = { verifyPassword, generateSalt, generateHash };
