const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    jobName: {
      type: String,
      required: [true, "Job name is required"],
      trim: true,
      maxlength: [120, "Job name cannot be more than 120 characters"],
    },
    githubRepoUrl: {
      type: String,
      default: "",
      trim: true,
      maxlength: [300, "GitHub repo URL cannot be more than 300 characters"],
    },
    jobDetails: {
      type: String,
      required: [true, "Specific job details are required"],
      trim: true,
      maxlength: [3000, "Job details cannot be more than 3000 characters"],
    },
    skillsRequired: [
      {
        type: String,
        required: true,
        trim: true,
        maxlength: [50, "Each skill cannot be more than 50 characters"],
      },
    ],
    experienceRequired: {
      type: String,
      required: [true, "Experience required field is required"],
      trim: true,
      maxlength: [
        120,
        "Experience required cannot be more than 120 characters",
      ],
    },
    compensationType: {
      type: String,
      enum: ["paid", "unpaid"],
      required: [true, "Compensation type is required"],
    },
    salary: {
      type: String,
      default: "",
      trim: true,
      maxlength: [120, "Salary cannot be more than 120 characters"],
    },
    durationFrom: {
      type: Date,
      required: [true, "Duration start date is required"],
    },
    durationTo: {
      type: Date,
      required: [true, "Duration end date is required"],
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    closingDate: {
      type: Date,
      required: [true, "Closing date is required"],
    },
    jobDescriptionDocument: {
      type: String,
      default: null,
    },
    jobDescriptionDocumentPublicId: {
      type: String,
      default: null,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

jobSchema.index({ postedBy: 1, createdAt: -1 });

module.exports = mongoose.model("Job", jobSchema);
