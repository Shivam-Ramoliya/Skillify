const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationExpire: {
      type: Date,
      default: null,
    },
    deleteAccountOtp: {
      type: String,
      default: null,
    },
    deleteAccountOtpExpire: {
      type: Date,
      default: null,
    },
    // Profile fields
    profilePicture: {
      type: String,
      default: null,
    },
    profilePicturePublicId: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot be more than 500 characters"],
      default: "",
    },
    location: {
      type: String,
      maxlength: [100, "Location cannot be more than 100 characters"],
      default: "",
    },
    resume: {
      type: String,
      default: null,
    },
    resumePublicId: {
      type: String,
      default: null,
    },
    availability: {
      type: String,
      enum: ["not available", "part-time", "full-time"],
      default: "not available",
    },
    education: {
      type: String,
      maxlength: [300, "Education cannot be more than 300 characters"],
      default: "",
    },
    experience: {
      type: String,
      maxlength: [1000, "Experience cannot be more than 1000 characters"],
      default: "",
    },
    yearsOfExperience: {
      type: Number,
      min: [0, "Years of experience cannot be negative"],
      max: [60, "Years of experience cannot be more than 60"],
      default: 0,
    },
    currentRole: {
      type: String,
      maxlength: [100, "Current role cannot be more than 100 characters"],
      default: "",
    },
    company: {
      type: String,
      maxlength: [100, "Company cannot be more than 100 characters"],
      default: "",
    },
    skills: [
      {
        type: String,
        maxlength: [50, "Skill cannot be more than 50 characters"],
      },
    ],
    githubUrl: {
      type: String,
      maxlength: [300, "GitHub URL cannot be more than 300 characters"],
      default: "",
    },
    linkedinUrl: {
      type: String,
      maxlength: [300, "LinkedIn URL cannot be more than 300 characters"],
      default: "",
    },
    portfolioUrl: {
      type: String,
      maxlength: [300, "Portfolio URL cannot be more than 300 characters"],
      default: "",
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    profileVisibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
