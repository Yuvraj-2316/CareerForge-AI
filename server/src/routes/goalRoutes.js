
const express = require("express");
const mongoose = require("mongoose");

const Goal = require("../models/Goal");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Every Goals API request requires authentication.
router.use(protect);

const allowedCategories = [
  "DSA",
  "Projects",
  "Resume",
  "Interviews",
  "Custom",
];

const allowedStatuses = [
  "Active",
  "Paused",
  "Completed",
];

// Validate incoming goal data.
function validateGoal(body) {
  const {
    title,
    category,
    target,
    manualProgress = 0,
    deadline,
    status = "Active",
  } = body;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    title.trim().length > 120
  ) {
    return "Title is required and must be under 120 characters.";
  }

  if (!allowedCategories.includes(category)) {
    return "Please select a valid goal category.";
  }

  if (
    typeof target !== "number" ||
    !Number.isSafeInteger(target) ||
    target < 1
  ) {
    return "Target must be a positive whole number.";
  }

  if (
    typeof manualProgress !== "number" ||
    !Number.isSafeInteger(manualProgress) ||
    manualProgress < 0
  ) {
    return "Progress must be a non-negative whole number.";
  }

  // Activity-based categories will eventually
  // calculate progress from their own modules.
  if (
    category !== "Custom" &&
    manualProgress !== 0
  ) {
    return "Manual progress is only available for custom goals.";
  }

  if (!allowedStatuses.includes(status)) {
    return "Invalid goal status.";
  }

  if (deadline != null && deadline !== "") {
    const parsed = new Date(deadline);

    if (Number.isNaN(parsed.getTime())) {
      return "Please provide a valid deadline.";
    }
  }

  return null;
}

// Prepare fields for MongoDB.
function goalFields(body) {
  return {
    title: body.title.trim(),
    category: body.category,
    target: body.target,
    manualProgress:
      body.category === "Custom"
        ? body.manualProgress ?? 0
        : 0,
    deadline: body.deadline
      ? new Date(body.deadline)
      : null,
    status: body.status || "Active",
  };
}

// GET /api/goals
// Get only the logged-in student's goals.
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      goals,
    });
  } catch (error) {
    console.error(
      "Fetch goals error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch goals.",
    });
  }
});

// POST /api/goals
// Create a personal goal.
router.post("/", async (req, res) => {
  try {
    const validationError = validateGoal(
      req.body
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const goal = await Goal.create({
      ...goalFields(req.body),
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Goal created successfully.",
      goal,
    });
  } catch (error) {
    console.error(
      "Create goal error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to create goal.",
    });
  }
});

// PUT /api/goals/:id
// Update only a goal owned by this student.
router.put("/:id", async (req, res) => {
  try {
    if (
      !mongoose.isValidObjectId(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid goal ID.",
      });
    }

    const validationError = validateGoal(
      req.body
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const goal = await Goal.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        $set: goalFields(req.body),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Goal updated successfully.",
      goal,
    });
  } catch (error) {
    console.error(
      "Update goal error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to update goal.",
    });
  }
});

// DELETE /api/goals/:id
// Delete only a goal owned by this student.
router.delete("/:id", async (req, res) => {
  try {
    if (
      !mongoose.isValidObjectId(req.params.id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid goal ID.",
      });
    }

    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Goal deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete goal error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to delete goal.",
    });
  }
});

module.exports = router;