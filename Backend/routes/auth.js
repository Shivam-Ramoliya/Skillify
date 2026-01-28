const express = require("express");
const {
    signup,
    login,
    getMe,
    verifyEmail,
    resendVerification,
} = require("../controllers/authController");
const protect = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

// Protected routes
router.get("/me", protect, getMe);

module.exports = router;
