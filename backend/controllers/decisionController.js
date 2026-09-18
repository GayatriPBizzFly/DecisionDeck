const Decision = require("../models/decisionModel");

// Get user's decisions
const getDecisions = async (req, res) => {
  try {
    const decisions = await Decision.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(decisions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch decisions",
      error: error.message,
    });
  }
};


// Create decision
const createDecision = async (req, res) => {
  try {
    const { title, description, status, priority , options , criteria , scores } = req.body;

    const decision = await Decision.create({
      userId: req.user.userId,
      title,
      description,
      status,
      priority,
      options,
      criteria,
      scores,
    });

    res.status(201).json(decision);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create decision",
      error: error.message,
    });
  }
};


// Update user's decision
const updateDecision = async (req, res) => {
  try {
    const decision = await Decision.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!decision) {
      return res.status(404).json({
        message: "Decision not found",
      });
    }

    res.status(200).json(decision);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update decision",
      error: error.message,
    });
  }
};


// Delete user's decision
const deleteDecision = async (req, res) => {
  try {
    const decision = await Decision.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!decision) {
      return res.status(404).json({
        message: "Decision not found",
      });
    }

    res.status(200).json({
      message: "Decision deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete decision",
      error: error.message,
    });
  }
};


module.exports = {
  getDecisions,
  createDecision,
  updateDecision,
  deleteDecision,
};