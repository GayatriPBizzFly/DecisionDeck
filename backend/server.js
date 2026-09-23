const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//Import SMTP transporter
const transporter = require("./utils/mailer");
//Test EmailRoutes
const testEmailRoutes = require("./routes/testEmailRoutes");

const decisionRoutes = require("./routes/decisionRoutes");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/decisions", decisionRoutes);

app.use("/api/test-email", testEmailRoutes);

app.get("/", (req, res) => {
  res.send("DecisionDeck API is running");
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });