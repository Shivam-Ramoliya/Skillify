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
router.get("/:userId", getUserProfile);

// Protected routes
router.put("/update", protect, updateProfile);
router.get("/me", protect, getMyProfile);
router.get("/status", protect, getProfileStatus);
router.put("/visibility", protect, updateProfileVisibility);

module.exports = router;
