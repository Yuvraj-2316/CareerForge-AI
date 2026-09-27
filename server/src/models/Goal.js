
const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    category: {
      type: String,
      enum: [
        "DSA",
        "Projects",
        "Resume",
        "Interviews",
        "Custom",
      ],
      required: true,
    },

    target: {
      type: Number,
      required: true,
      min: 1,
    },

    // Used for custom goals. Activity-based goals
    // will get their progress from their own modules.
    manualProgress: {
      type: Number,
      default: 0,
      min: 0,
    },

    deadline: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["Active", "Paused", "Completed"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Goal",
  goalSchema
);