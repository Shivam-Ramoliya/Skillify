const crypto = require("crypto");

// Generate random verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Generate token expiry time (24 hours from now)
const getTokenExpiry = () => {
  return new Date(Date.now() + 24 * 60 * 60 * 1000);
};

module.exports = {
  generateVerificationToken,
  getTokenExpiry,
};
