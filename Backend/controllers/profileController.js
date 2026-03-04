const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUpload");

const getConnectionStatus = (currentUser, targetUserId) => {
  const targetId = String(targetUserId);

  if (
    (currentUser.connections || []).some(
      (connectionId) => String(connectionId) === targetId,
    )
  ) {
    return "connected";
  }

  if (
    (currentUser.sentConnectionRequests || []).some(
      (request) => String(request.user) === targetId,
    )
  ) {
    return "request_sent";
  }

  if (
    (currentUser.receivedConnectionRequests || []).some(
      (request) => String(request.user) === targetId,
    )
  ) {
    return "request_received";
  }

  return "none";
};

const getRatingMeta = (user) => {
  const activeConnectionCount = (user.connections || []).length;
  const totalConnectionCount = Math.max(
    Number(user.totalConnectionsCount || 0),
    activeConnectionCount,
  );
  const ratingEntries = user.ratingsReceived || [];
  const averageRating = ratingEntries.length
    ? Number(
        (
          ratingEntries.reduce(
            (sum, entry) => sum + Number(entry.rating || 0),
            0,
          ) / ratingEntries.length
        ).toFixed(1),
      )
    : 0;
  return { activeConnectionCount, totalConnectionCount, averageRating };
};

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

    // Upload new picture directly to Cloudinary from memory
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "profile-pictures",
      req.file.originalname,
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

    // Delete old resume from Cloudinary if exists
    if (user.resumePublicId) {
      await deleteFromCloudinary(user.resumePublicId, "raw");
    }

    // Upload resume directly to Cloudinary from memory
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "resumes",
      req.file.originalname,
    );

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

    const { activeConnectionCount, totalConnectionCount, averageRating } =
      getRatingMeta(user);

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
        connections: user.connections,
        connectionCount: activeConnectionCount,
        totalConnectionsCount: totalConnectionCount,
        averageRating,
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

    let connectionStatus = "none";
    if (requesterId && requesterId !== userId) {
      const requester = await User.findById(requesterId).select(
        "connections sentConnectionRequests receivedConnectionRequests",
      );
      if (requester) {
        connectionStatus = getConnectionStatus(requester, userId);
      }
    }

    const { activeConnectionCount, totalConnectionCount, averageRating } =
      getRatingMeta(user);

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        connectionCount: activeConnectionCount,
        totalConnectionsCount: totalConnectionCount,
        averageRating,
      },
      connectionStatus,
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

    const { activeConnectionCount, totalConnectionCount, averageRating } =
      getRatingMeta(user);

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        connectionCount: activeConnectionCount,
        totalConnectionsCount: totalConnectionCount,
        averageRating,
      },
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

// @desc    Send a connection request
// @route   POST /api/profile/connections/send/:targetUserId
// @access  Private
exports.sendConnectionRequest = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const currentUserId = req.user.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a connection request to yourself",
      });
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(targetUserId),
    ]);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyConnected = (currentUser.connections || []).some(
      (connectionId) => String(connectionId) === targetUserId,
    );
    if (alreadyConnected) {
      return res.status(400).json({
        success: false,
        message: "You are already connected",
      });
    }

    const alreadySent = (currentUser.sentConnectionRequests || []).some(
      (request) => String(request.user) === targetUserId,
    );
    if (alreadySent) {
      return res.status(400).json({
        success: false,
        message: "Connection request already sent",
      });
    }

    const hasIncomingFromTarget = (
      currentUser.receivedConnectionRequests || []
    ).some((request) => String(request.user) === targetUserId);
    if (hasIncomingFromTarget) {
      return res.status(400).json({
        success: false,
        message:
          "This user has already sent you a request. Accept it from Connections page.",
      });
    }

    currentUser.sentConnectionRequests.push({ user: targetUser._id });
    targetUser.receivedConnectionRequests.push({ user: currentUser._id });

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.status(200).json({
      success: true,
      message: "Connection request sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Withdraw a sent connection request
// @route   POST /api/profile/connections/withdraw/:targetUserId
// @access  Private
exports.withdrawConnectionRequest = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const currentUserId = req.user.id;

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(targetUserId),
    ]);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    currentUser.sentConnectionRequests = (
      currentUser.sentConnectionRequests || []
    ).filter((request) => String(request.user) !== targetUserId);
    targetUser.receivedConnectionRequests = (
      targetUser.receivedConnectionRequests || []
    ).filter((request) => String(request.user) !== currentUserId);

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.status(200).json({
      success: true,
      message: "Connection request withdrawn",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Accept a received connection request
// @route   POST /api/profile/connections/accept/:senderUserId
// @access  Private
exports.acceptConnectionRequest = async (req, res) => {
  try {
    const { senderUserId } = req.params;
    const currentUserId = req.user.id;

    const [currentUser, senderUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(senderUserId),
    ]);

    if (!currentUser || !senderUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hasReceivedRequest = (
      currentUser.receivedConnectionRequests || []
    ).some((request) => String(request.user) === senderUserId);

    if (!hasReceivedRequest) {
      return res.status(400).json({
        success: false,
        message: "No pending request from this user",
      });
    }

    currentUser.receivedConnectionRequests = (
      currentUser.receivedConnectionRequests || []
    ).filter((request) => String(request.user) !== senderUserId);
    senderUser.sentConnectionRequests = (
      senderUser.sentConnectionRequests || []
    ).filter((request) => String(request.user) !== currentUserId);

    const addedToCurrent = !(currentUser.connections || []).some(
      (id) => String(id) === senderUserId,
    );
    if (addedToCurrent) {
      currentUser.connections.push(senderUser._id);
      currentUser.totalConnectionsCount =
        Number(currentUser.totalConnectionsCount || 0) + 1;
    }

    const addedToSender = !(senderUser.connections || []).some(
      (id) => String(id) === currentUserId,
    );
    if (addedToSender) {
      senderUser.connections.push(currentUser._id);
      senderUser.totalConnectionsCount =
        Number(senderUser.totalConnectionsCount || 0) + 1;
    }

    await Promise.all([currentUser.save(), senderUser.save()]);

    res.status(200).json({
      success: true,
      message: "Connection request accepted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Decline a received connection request
// @route   POST /api/profile/connections/decline/:senderUserId
// @access  Private
exports.declineConnectionRequest = async (req, res) => {
  try {
    const { senderUserId } = req.params;
    const currentUserId = req.user.id;

    const [currentUser, senderUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(senderUserId),
    ]);

    if (!currentUser || !senderUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    currentUser.receivedConnectionRequests = (
      currentUser.receivedConnectionRequests || []
    ).filter((request) => String(request.user) !== senderUserId);
    senderUser.sentConnectionRequests = (
      senderUser.sentConnectionRequests || []
    ).filter((request) => String(request.user) !== currentUserId);

    await Promise.all([currentUser.save(), senderUser.save()]);

    res.status(200).json({
      success: true,
      message: "Connection request declined",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Request disconnection from an active connection (with rating)
// @route   POST /api/profile/connections/disconnect-request/:targetUserId
// @access  Private
exports.requestDisconnectConnection = async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const currentUserId = req.user.id;
    const rating = Number(req.body?.rating);

    if (!Number.isFinite(rating) || rating < 0 || rating > 10) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 0 and 10",
      });
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(targetUserId),
    ]);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isConnected = (currentUser.connections || []).some(
      (id) => String(id) === targetUserId,
    );
    if (!isConnected) {
      return res.status(400).json({
        success: false,
        message: "You are not connected with this user",
      });
    }

    const hasAlreadyRequested = (currentUser.sentDisconnectRequests || []).some(
      (request) => String(request.user) === targetUserId,
    );
    const hasRequestFromTarget = (
      currentUser.receivedDisconnectRequests || []
    ).some((request) => String(request.user) === targetUserId);

    if (hasAlreadyRequested || hasRequestFromTarget) {
      return res.status(400).json({
        success: false,
        message: "A disconnect confirmation is already pending",
      });
    }

    currentUser.sentDisconnectRequests.push({ user: targetUser._id, rating });
    targetUser.receivedDisconnectRequests.push({
      user: currentUser._id,
      rating,
    });

    await Promise.all([currentUser.save(), targetUser.save()]);

    res.status(200).json({
      success: true,
      message: "Disconnect request sent. Waiting for other user confirmation.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Confirm disconnection request (with rating) and finalize disconnect
// @route   POST /api/profile/connections/disconnect-confirm/:requesterUserId
// @access  Private
exports.confirmDisconnectConnection = async (req, res) => {
  try {
    const { requesterUserId } = req.params;
    const currentUserId = req.user.id;
    const rating = Number(req.body?.rating);

    if (!Number.isFinite(rating) || rating < 0 || rating > 10) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a number between 0 and 10",
      });
    }

    const [currentUser, requesterUser] = await Promise.all([
      User.findById(currentUserId),
      User.findById(requesterUserId),
    ]);

    if (!currentUser || !requesterUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const incomingRequest = (currentUser.receivedDisconnectRequests || []).find(
      (request) => String(request.user) === requesterUserId,
    );

    if (!incomingRequest) {
      return res.status(400).json({
        success: false,
        message: "No pending disconnect request from this user",
      });
    }

    currentUser.receivedDisconnectRequests = (
      currentUser.receivedDisconnectRequests || []
    ).filter((request) => String(request.user) !== requesterUserId);

    requesterUser.sentDisconnectRequests = (
      requesterUser.sentDisconnectRequests || []
    ).filter((request) => String(request.user) !== currentUserId);

    currentUser.connections = (currentUser.connections || []).filter(
      (id) => String(id) !== requesterUserId,
    );
    requesterUser.connections = (requesterUser.connections || []).filter(
      (id) => String(id) !== currentUserId,
    );

    currentUser.ratingsReceived = currentUser.ratingsReceived || [];
    requesterUser.ratingsReceived = requesterUser.ratingsReceived || [];

    currentUser.ratingsReceived.push({
      from: requesterUser._id,
      rating: Number(incomingRequest.rating),
    });
    requesterUser.ratingsReceived.push({
      from: currentUser._id,
      rating,
    });

    await Promise.all([currentUser.save(), requesterUser.save()]);

    res.status(200).json({
      success: true,
      message: "Disconnected successfully after mutual confirmation",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// @desc    Get connection dashboard data
// @route   GET /api/profile/connections
// @access  Private
exports.getConnectionsData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate(
        "connections",
        "name profilePicture location skillsOffered skillsWanted",
      )
      .populate("sentConnectionRequests.user", "name profilePicture location")
      .populate(
        "receivedConnectionRequests.user",
        "name profilePicture location",
      )
      .populate("sentDisconnectRequests.user", "name profilePicture location")
      .populate(
        "receivedDisconnectRequests.user",
        "name profilePicture location",
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const sentRequests = (user.sentConnectionRequests || [])
      .filter((request) => request.user)
      .map((request) => ({
        user: request.user,
        createdAt: request.createdAt,
      }));

    const receivedRequests = (user.receivedConnectionRequests || [])
      .filter((request) => request.user)
      .map((request) => ({
        user: request.user,
        createdAt: request.createdAt,
      }));

    const sentDisconnectRequests = (user.sentDisconnectRequests || [])
      .filter((request) => request.user)
      .map((request) => ({
        user: request.user,
        rating: request.rating,
        createdAt: request.createdAt,
      }));

    const receivedDisconnectRequests = (user.receivedDisconnectRequests || [])
      .filter((request) => request.user)
      .map((request) => ({
        user: request.user,
        rating: request.rating,
        createdAt: request.createdAt,
      }));

    const { averageRating } = getRatingMeta(user);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          activeConnections: (user.connections || []).length,
          sentRequests: sentRequests.length,
          receivedRequests: receivedRequests.length,
          averageRating,
        },
        activeConnections: user.connections || [],
        sentRequests,
        receivedRequests,
        sentDisconnectRequests,
        receivedDisconnectRequests,
      },
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
    const { role, skill, type, page = 1, limit = 10 } = req.query;
    let requesterId = null;

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
          requesterId = decoded.id;
          query._id = { $ne: decoded.id };
        }
      } catch (error) {
        // ignore invalid token for public discover
      }
    }

    if (role) query.role = role;
    if (skill) {
      const trimmedSkill = skill.trim();
      if (trimmedSkill) {
        const regexFilter = { $regex: trimmedSkill, $options: "i" };

        if (type === "offered") {
          query.skillsOffered = regexFilter;
        } else if (type === "wanted") {
          query.skillsWanted = regexFilter;
        } else {
          // Default: search in both offered and wanted skills
          query.$or = [
            { skillsOffered: regexFilter },
            { skillsWanted: regexFilter },
          ];
        }
      }
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select("-password -emailVerificationToken -emailVerificationExpire")
      .limit(parseInt(limit))
      .skip(startIndex)
      .sort({ createdAt: -1 });

    let usersWithStatus = users;
    if (requesterId) {
      const requester = await User.findById(requesterId).select(
        "connections sentConnectionRequests receivedConnectionRequests",
      );
      if (requester) {
        usersWithStatus = users.map((foundUser) => ({
          ...foundUser.toObject(),
          connectionStatus: getConnectionStatus(requester, foundUser._id),
        }));
      }
    }

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: usersWithStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
