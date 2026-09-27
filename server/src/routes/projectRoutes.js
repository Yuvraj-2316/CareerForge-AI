
const express = require("express");
const mongoose = require("mongoose");

const Project = require("../models/Project");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All project routes require a logged-in user.
router.use(protect);

const allowedStatuses = [
  "Planned",
  "In Progress",
  "Completed",
];

function validateProject(body) {
  const {
    title,
    description,
    techStack = [],
    githubUrl = "",
    liveUrl = "",
    status = "In Progress",
  } = body;

  if (
    typeof title !== "string" ||
    !title.trim() ||
    title.trim().length > 100
  ) {
    return "Title is required and must be at most 100 characters.";
  }

  if (
    typeof description !== "string" ||
    !description.trim() ||
    description.trim().length > 2000
  ) {
    return "Description is required and must be at most 2000 characters.";
  }

  if (
    !Array.isArray(techStack) ||
    !techStack.every(
      (tech) =>
        typeof tech === "string" &&
        tech.trim().length > 0 &&
        tech.length <= 50
    )
  ) {
    return "Tech stack must be an array of technology names.";
  }

  if (!allowedStatuses.includes(status)) {
    return "Invalid project status.";
  }

  for (const url of [githubUrl, liveUrl]) {
    if (typeof url !== "string" || url.length > 500) {
      return "Project URLs must be strings under 500 characters.";
    }

    if (url.trim()) {
      try {
        const parsed = new URL(url.trim());

        if (!["http:", "https:"].includes(parsed.protocol)) {
          return "Only HTTP and HTTPS URLs are allowed.";
        }
      } catch {
        return "Please enter valid project URLs.";
      }
    }
  }

  return null;
}

function projectFields(body) {
  return {
    title: body.title.trim(),
    description: body.description.trim(),
    techStack: [...new Set(
      (body.techStack || []).map((tech) => tech.trim())
    )],
    githubUrl: (body.githubUrl || "").trim(),
    liveUrl: (body.liveUrl || "").trim(),
    status: body.status || "In Progress",
  };
}

// GET /api/projects
// Return only the logged-in student's projects.
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Fetch projects error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch projects.",
    });
  }
});

// POST /api/projects
// Create a project for the logged-in student.
router.post("/", async (req, res) => {
  try {
    const validationError = validateProject(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const project = await Project.create({
      ...projectFields(req.body),
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project,
    });
  } catch (error) {
    console.error("Create project error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to create project.",
    });
  }
});

// PUT /api/projects/:id
// Update a project only if it belongs to this student.
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const validationError = validateProject(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      { $set: projectFields(req.body) },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      project,
    });
  } catch (error) {
    console.error("Update project error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to update project.",
    });
  }
});

// DELETE /api/projects/:id
// Delete a project only if it belongs to this student.
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("Delete project error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to delete project.",
    });
  }
});

module.exports = router;