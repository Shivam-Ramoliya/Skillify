const express = require("express");
const {
  updateProfile,
  getUserProfile,
  getMyProfile,
  getProfileStatus,
  updateProfileVisibility,
  discoverProfiles,
} = require("../controllers/profileController");
const protect = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/discover", discoverProfiles);

// Protected routes
router.put("/update", protect, updateProfile);
router.get("/me", protect, getMyProfile);
router.get("/status", protect, getProfileStatus);
router.put("/visibility", protect, updateProfileVisibility);

// Public route (keep last to avoid catching static paths)
router.get("/:userId", getUserProfile);

module.exports = router;
