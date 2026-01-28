const User = require("../models/User");

// @desc    Update user profile
// @route   PUT /api/profile/update
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const {
      bio,
      location,
      profilePicture,
      resume,
      availability,
      skillsOffered,
      skillsWanted,
      profileVisibility,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields if provided
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (profilePicture) user.profilePicture = profilePicture;
    if (resume) user.resume = resume;
    if (availability) user.availability = availability;
    if (skillsOffered) user.skillsOffered = skillsOffered;
    if (skillsWanted) user.skillsWanted = skillsWanted;
    if (profileVisibility) user.profileVisibility = profileVisibility;

    // Check if profile is complete
    const isProfileComplete =
      user.bio &&
      user.location &&
      user.profilePicture &&
      user.availability &&
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
    if (
      user.profileVisibility === "private" &&
      req.user &&
      req.user.id !== userId
    ) {
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
