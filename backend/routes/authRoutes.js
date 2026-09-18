const express = require("express");

const router = express.Router();

const {
  signup,
  signin,
  googleSignin,
  updateProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleSignin);

// Update logged-in user's account
router.put("/update-profile", protect, updateProfile);

module.exports = router;