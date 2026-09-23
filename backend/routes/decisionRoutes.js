const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getDecisions,
  createDecision,
  updateDecision,
  deleteDecision,
  togglePinDecision,
} = require("../controllers/decisionController");

router.get("/", protect, getDecisions);
router.post("/", protect, createDecision);
router.put("/:id", protect, updateDecision);
router.delete("/:id", protect, deleteDecision);
router.patch("/:id/pin", protect, togglePinDecision);

module.exports = router;