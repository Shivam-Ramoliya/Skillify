const crypto = require("crypto");

// Generate random 8-digit verification code
const generateVerificationToken = () => {
  // Generate a random 8-digit numeric code (10000000 - 99999999)
  const code = crypto.randomInt(10000000, 100000000);
  return code.toString();
};

// Generate token expiry time (24 hours from now)
const getTokenExpiry = () => {
  return new Date(Date.now() + 24 * 60 * 60 * 1000);
};

module.exports = {
  generateVerificationToken,
  getTokenExpiry,
};
