import httpStatus from "http-status";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/user_model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer"; // Add this import
import { Meeting } from "../models/meeting_model.js";
import dotenv from 'dotenv'; // Fix import

dotenv.config(); // Initialize dotenv

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }

    // Check if user has a password (for OAuth users)
    if (!user.password) {
      return res.status(httpStatus.BAD_REQUEST).json({ 
        message: "This account uses Google login. Please sign in with Google." 
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      // Use JWT instead of random token for consistency
      const token = jwt.sign(
        { 
          id: user._id,
          username: user.username 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: "7d" }
      );

      // Update user token in database if needed
      user.token = token;
      await user.save();

      return res.status(httpStatus.OK).json({ 
        token: token,
        user: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email
        }
      });
    } else {
      return res.status(httpStatus.UNAUTHORIZED).json({ 
        message: "Invalid username or password" 
      });
    }
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ message: `Something went wrong: ${e.message}` });
  }
};

const register = async (req, res) => {
  const { name, username, password, email } = req.body; // Add email

  // Validation
  if (!name || !username || !password || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email" });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  try {
    // Check for existing username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(httpStatus.CONFLICT).json({ message: "Username already exists" });
    }

    // Check for existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(httpStatus.CONFLICT).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      username: username,
      email: email, // Add email
      password: hashedPassword,
      authProvider: "local",
      isEmailVerified: false
    });

    await newUser.save();

    res.status(httpStatus.CREATED).json({ message: "User registered successfully" });
  } catch (e) {
    console.error("Registration error:", e);
    res.status(500).json({ message: `Something went wrong: ${e.message}` });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Validate token exists
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture, sub: googleId } = payload;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ error: "Email not provided by Google" });
    }

    // Check if user exists by email or Google ID
    let user = await User.findOne({ 
      $or: [{ email }, { googleId }]
    });

    if (!user) {
      // Create new user
      user = await User.create({
        name,
        email,
        username: email.split("@")[0] + Math.random().toString(36).substr(2, 4), // Make username unique
        picture,
        googleId,
        authProvider: "google",
        isEmailVerified: true, // Google emails are pre-verified
      });
    } else if (!user.googleId) {
      // Update existing user with Google ID
      user.googleId = googleId;
      user.authProvider = "google";
      user.isEmailVerified = true;
      if (picture) user.picture = picture;
      await user.save();
    }

    // Create JWT token
    const authToken = jwt.sign(
      { 
        id: user._id,
        email: user.email 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    // Update user token
    user.token = authToken;
    await user.save();

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      picture: user.picture,
      authProvider: user.authProvider
    };

    res.json({ 
      success: true,
      token: authToken, 
      user: userResponse 
    });
  } catch (err) {
    console.error("Google login error:", err);
    
    // Handle specific Google Auth errors
    if (err.message.includes('Token used too early')) {
      return res.status(400).json({ error: "Token not valid yet" });
    }
    if (err.message.includes('Token used too late')) {
      return res.status(400).json({ error: "Token expired" });
    }
    if (err.message.includes('Invalid token signature')) {
      return res.status(400).json({ error: "Invalid token" });
    }
    
    res.status(500).json({ error: "Google login failed" });
  }
};

const getUserHistory = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    // For JWT tokens, verify and decode
    let user;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.id);
    } catch (jwtError) {
      // Fallback to old token system
      user = await User.findOne({ token: token });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const meetings = await Meeting.find({ user_id: user.username });
    res.json(meetings);
  } catch (e) {
    console.error("Get user history error:", e);
    res.status(500).json({ message: `Something went wrong: ${e.message}` });
  }
};

const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body;

  if (!token || !meeting_code) {
    return res.status(400).json({ message: "Token and meeting code are required" });
  }

  try {
    // For JWT tokens, verify and decode
    let user;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.id);
    } catch (jwtError) {
      // Fallback to old token system
      user = await User.findOne({ token: token });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newMeeting = new Meeting({
      user_id: user.username,
      meetingCode: meeting_code,
      createdAt: new Date()
    });

    await newMeeting.save();

    res.status(httpStatus.CREATED).json({ message: "Added code to history" });
  } catch (e) {
    console.error("Add to history error:", e);
    res.status(500).json({ message: `Something went wrong: ${e.message}` });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Note: For security, you might not want to reveal if a user exists.
      // Sending a success message regardless is a common practice.
      return res.status(200).json({ msg: "If an account with this email exists, a reset link has been sent." });
    }

    if (user.authProvider === "google" && !user.password) {
      return res.status(400).json({
        msg: "This account uses Google login. Please sign in with Google."
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();
    
    // --- FIX: Updated Nodemailer transporter to use OAuth2 ---
    // This now uses the credentials from your .env file to authenticate securely.
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN
      }
    });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request - QuickMeet",
      html: `
        <h2>Password Reset Request</h2>
        <p>You have requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });

    res.json({ msg: "Password reset link sent to email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ msg: "Failed to send reset email" });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ msg: "Password is required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters long" });
    }

    // Hash the token (because we stored it hashed in DB)
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token & not expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ msg: "Password reset successful. You can now login." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ msg: "Password reset failed" });
  }
};

export { 
  login, 
  register, 
  getUserHistory, 
  addToHistory, 
  forgotPassword, 
  resetPassword, 
  googleLogin 
};