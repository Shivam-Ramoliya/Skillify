const express = require("express");
const multer = require("multer");
const protect = require("../middleware/auth");
const {
  publishJob,
  discoverJobs,
  applyToJob,
  getSentApplications,
  getReceivedApplications,
  updateApplicationStatus,
  getMyPostedJobs,
  toggleJobStatus,
} = require("../controllers/jobController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

router.post(
  "/publish",
  protect,
  upload.single("jobDescriptionDocument"),
  publishJob,
);
router.get("/discover", protect, discoverJobs);
router.get("/my-posts", protect, getMyPostedJobs);
router.get("/applications/sent", protect, getSentApplications);
router.get("/applications/received", protect, getReceivedApplications);
router.put(
  "/applications/:applicationId/status",
  protect,
  updateApplicationStatus,
);
router.post("/:jobId/apply", protect, applyToJob);
router.put("/:jobId/status", protect, toggleJobStatus);

module.exports = router;
