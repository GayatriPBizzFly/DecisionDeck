const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/userModel");

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        //email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Signin failed",
      error: error.message,
    });
  }
};

const googleSignin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      sub,
      name,
      email,
      email_verified,
    } = payload;

    if (!email_verified) {
      return res.status(401).json({
        message: "Google email is not verified",
      });
    }

    let user = await User.findOne({
      $or: [
        { googleId: sub },
        { email: email },
      ],
    });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: sub,
      });
    } else if (!user.googleId) {
      user.googleId = sub;
      await user.save();
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Google signin error:", error);

    res.status(500).json({
      message: "Google signin failed",
    });
  }
};


// Update logged-in user's account
const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update name
    if (name && name.trim()) {
      user.name = name.trim();
    }

    // Update email
    if (email && email.trim()) {
      const existingUser = await User.findOne({
        email: email.trim(),
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Email is already in use",
        });
      }

      user.email = email.trim();
    }

    // Update password
    if (password && password.trim()) {
      if (password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters",
        });
      }

      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      message: "Account updated successfully",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Failed to update account",
    });
  }
};


module.exports = {
  signup,
  signin,
  googleSignin,
  updateProfile,
};