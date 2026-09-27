
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: 2000,
    },

    techStack: {
      type: [String],
      default: [],
    },

    githubUrl: {
      type: String,
      trim: true,
      default: "",
    },

    liveUrl: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Planned", "In Progress", "Completed"],
      default: "In Progress",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);