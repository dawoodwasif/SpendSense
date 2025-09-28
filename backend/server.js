const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const FormEntry = require("./models/formEntry");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Import routes
const aiRoutes = require("./routes/aiRoutes");

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Mount routes
app.use("/api", aiRoutes);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Import models

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ msg: "Invalid token" });
  }
};

// API Routes

// Signup endpoint
app.post("/signup", async (req, res) => {
  console.log("Received signup data:", req.body);
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User already exists with this email" });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password, // Will be hashed by the pre-save hook
    });

    await newUser.save();

    // Create token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      msg: "User registered successfully",
      token,
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ msg: "Error during signup" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      msg: "Login successful",
      token,
      userId: user._id,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ msg: "Error during login" });
  }
});

// Submit form data
app.post("/submit-form", authenticateToken, async (req, res) => {
  const formData = req.body;
  const userId = req.user.id;

  try {
    // Check if form data already exists for this user
    let userFormData = await FormEntry.findOne({ userId });

    if (userFormData) {
      // Update existing form data
      userFormData = await FormEntry.findOneAndUpdate(
        { userId },
        { $set: { ...formData, updatedAt: Date.now() } },
        { new: true }
      );
    } else {
      // Create new form data entry
      userFormData = new FormEntry({
        userId,
        ...formData,
      });
      await userFormData.save();
    }

    res.status(200).json({
      msg: "Form data submitted successfully",
      formData: userFormData,
    });
  } catch (error) {
    console.error("Error submitting form data:", error);
    res.status(500).json({ msg: "Error submitting form data" });
  }
});

// Get user form data
app.get("/user-form-data", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const formData = await FormEntry.findOne({ userId });
    if (!formData) {
      return res.status(404).json({ msg: "No form data found for this user" });
    }

    res.status(200).json({ formData });
  } catch (error) {
    console.error("Error fetching form data:", error);
    res.status(500).json({ msg: "Error fetching form data" });
  }
});

// Get user profile
app.get("/user-profile", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ msg: "Error fetching user profile" });
  }
});

// Server startup
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
