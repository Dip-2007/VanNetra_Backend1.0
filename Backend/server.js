// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User"); // Import the User model
require("dotenv").config();

const app = express();
const port = 3002;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error(
    "MongoDB URI is missing. Please add MONGO_URI to your .env file in the backend directory."
  );
} else {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

// --- API Endpoints ---

/**
 * Endpoint to register a new user.
 */
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required." });
  }

  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "An account with this email already exists." });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create a new user in the database
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user", // All new registrations default to the 'user' role
    });
    await newUser.save();

    // 4. Create a JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d", // Token expires in 1 day
      }
    );

    // 5. Prepare user data to send back (without the password)
    const userPayload = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      fraRecordId: newUser.fraRecordId,
    };

    res.status(201).json({ user: userPayload, token });
  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ error: "Server error during registration." });
  }
});

/**
 * Endpoint to log in a user.
 */
app.post("/api/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ error: "Email, password, and role are required." });
  }

  try {
    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    // 2. Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    // 3. Check if the role matches
    if (user.role !== role) {
      return res
        .status(403)
        .json({ error: "Invalid credentials for the selected role." });
    }

    // 4. Create a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // 5. Prepare user data to send back
    const userPayload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      fraRecordId: user.fraRecordId,
    };

    res.status(200).json({ user: userPayload, token });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: "Server error during login." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
