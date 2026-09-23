const express = require("express");

const router = express.Router();

const {
  signup,
  signin,
  googleSignin,
  updateProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", googleSignin);

// Update logged-in user's account
router.put("/update-profile", protect, updateProfile);

//SMTP-Forgot Password
router.post("/forgot-password", forgotPassword);

//SMTP-Reset Password
router.post("/reset-password/:token", resetPassword);

module.exports = router;