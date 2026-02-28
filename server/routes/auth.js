const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const mongoose = require("mongoose");

// Signup
router.post("/register", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      msg: "Database not connected. Please check your MONGODB_URI/Internet.",
      error: "DB_CONNECTION_FAILED",
    });
  }
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ username, email, password });
    await user.save();

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "JWT_SECRET is not defined in .env" });
    }
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            monthlyBudget: user.monthlyBudget,
          },
        });
      },
    );
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      msg: "Database not connected. Please check your MONGODB_URI/Internet.",
      error: "DB_CONNECTION_FAILED",
    });
  }
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "JWT_SECRET is not defined in .env" });
    }
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            monthlyBudget: user.monthlyBudget,
          },
        });
      },
    );
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Update Budget
const auth = require("../middleware/auth");
router.put("/budget", auth, async (req, res) => {
  try {
    const { budget } = req.body;
    await User.findByIdAndUpdate(req.user.id, { monthlyBudget: budget });
    res.json({ msg: "Budget updated" });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
