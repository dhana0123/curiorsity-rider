import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Login endpoint with passcode
router.post("/login", (req, res) => {
  const { passcode } = req.body;

  // Get passcode from environment variable
  const correctPasscode = process.env.PASSCODE;

  if (!correctPasscode) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  // Validate passcode
  if (!passcode || passcode.length !== 4 || !/^\d{4}$/.test(passcode)) {
    return res.status(400).json({ error: "Passcode must be 4 digits" });
  }

  if (passcode !== correctPasscode) {
    return res.status(401).json({ error: "Invalid passcode" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { authenticated: true },
    process.env.JWT_SECRET || "your-secret-key-change-in-production",
    { expiresIn: "7d" } // Token expires in 7 days
  );

  res.json({ token });
});

export default router;

