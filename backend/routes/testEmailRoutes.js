const express = require("express");
const router = express.Router();

const {
  sendTestEmail,
} = require("../controllers/testEmailController");

router.get("/", sendTestEmail);

module.exports = router;