const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUpload");

// @desc    Upload Profile Picture
// @route   POST /api/profile/upload-picture
// @access  Private
exports.uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    // Delete old profile picture if exists
    if (user.profilePicturePublicId) {
      await deleteFromCloudinary(user.profilePicturePublicId);
    }

    // Upload new picture
    const uploadResult = await uploadToCloudinary(
      req.file.path,
      "profile-pictures",
    );

    user.profilePicture = uploadResult.url;
    user.profilePicturePublicId = uploadResult.publicId;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Upload Resume
// @route   POST /api/profile/upload-resume
// @access  Private
exports.uploadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    // Delete old resume if exists
    if (user.resumePublicId) {
      await deleteFromCloudinary(user.resumePublicId, "raw");
    }

    // Upload new resume
    const uploadResult = await uploadToCloudinary(req.file.path, "resumes");

    user.resume = uploadResult.url;
    user.resumePublicId = uploadResult.publicId;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      resume: user.resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile/update
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields if provided (allow empty strings/arrays to clear values)
    const updatableFields = [
      "bio",
      "location",
      "profilePicture",
      "resume",
      "availability",
      "skillsOffered",
      "skillsWanted",
      "profileVisibility",
    ];

    updatableFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        user[field] = req.body[field];
      }
    });

    // Check if profile is complete
    const isProfileComplete =
      user.bio &&
      user.location &&
      user.profilePicture &&
      user.availability &&
      user.availability !== "not available" &&
      user.skillsOffered &&
      user.skillsOffered.length > 0;

    user.profileComplete = isProfileComplete;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileComplete: user.profileComplete,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        profilePicture: user.profilePicture,
        resume: user.resume,
        availability: user.availability,
        skillsOffered: user.skillsOffered,
        skillsWanted: user.skillsWanted,
        profileVisibility: user.profileVisibility,
        profileComplete: user.profileComplete,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error during profile update",
    });
  }
};

// @desc    Get user profile
// @route   GET /api/profile/:userId
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "-password -emailVerificationToken -emailVerificationExpire",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if profile is private and current user is not the owner
    let requesterId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "your_jwt_secret_key",
        );
        requesterId = decoded.id;
      } catch (error) {
        requesterId = null;
      }
    }

    if (user.profileVisibility === "private" && requesterId !== userId) {
      return res.status(403).json({
        success: false,
        message: "This profile is private",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -emailVerificationToken -emailVerificationExpire",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Check profile completion status
// @route   GET /api/profile/status
// @access  Private
exports.getProfileStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profileData = {
      profileComplete: user.profileComplete,
      completionPercentage: calculateCompletionPercentage(user),
      missingFields: getMissingFields(user),
    };

    res.status(200).json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// Helper function to calculate profile completion percentage
function calculateCompletionPercentage(user) {
  const requiredFields = [
    "bio",
    "location",
    "profilePicture",
    "availability",
    "skillsOffered",
  ];

  let completedFields = 0;

  requiredFields.forEach((field) => {
    if (field === "skillsOffered") {
      if (user[field] && user[field].length > 0) completedFields++;
    } else {
      if (user[field]) completedFields++;
    }
  });

  return Math.round((completedFields / requiredFields.length) * 100);
}

// Helper function to get missing fields
function getMissingFields(user) {
  const missing = [];

  if (!user.bio) missing.push("bio");
  if (!user.location) missing.push("location");
  if (!user.profilePicture) missing.push("profilePicture");
  if (!user.availability || user.availability === "not available")
    missing.push("availability");
  if (!user.skillsOffered || user.skillsOffered.length === 0)
    missing.push("skillsOffered");

  return missing;
}

// @desc    Update profile visibility
// @route   PUT /api/profile/visibility
// @access  Private
exports.updateProfileVisibility = async (req, res) => {
  try {
    const { profileVisibility } = req.body;

    if (!["public", "private"].includes(profileVisibility)) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile visibility option",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileVisibility },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Profile visibility set to ${profileVisibility}`,
      profileVisibility: user.profileVisibility,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Get all public profiles (for discovery)
// @route   GET /api/profile/discover
// @access  Public
exports.discoverProfiles = async (req, res) => {
  try {
    const { role, skill, page = 1, limit = 10 } = req.query;

    const query = {
      profileVisibility: "public",
      profileComplete: true,
      isVerified: true,
    };

    // Optionally exclude current user if token is provided
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "your_jwt_secret_key",
        );
        if (decoded?.id) {
          query._id = { $ne: decoded.id };
        }
      } catch (error) {
        // ignore invalid token for public discover
      }
    }

    if (role) query.role = role;
    if (skill) {
      query.$or = [
        { skillsOffered: { $in: [skill] } },
        { skillsWanted: { $in: [skill] } },
      ];
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select("-password -emailVerificationToken -emailVerificationExpire")
      .limit(parseInt(limit))
      .skip(startIndex)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
