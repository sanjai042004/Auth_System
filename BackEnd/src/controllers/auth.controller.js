const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
const {
  attachTokens,
  clearCookies,
  createTokens,
  publicUser,
} = require("../utils/tokenUtils");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper Functions
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

// Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "Email already registered" });

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
    });

    await newUser.save();

    const tokens = createTokens(newUser);
    attachTokens(res, tokens);

    return res.status(201).json({
      message: "Registration successful!",
      user: publicUser(newUser),
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error during registration." });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user || !(await comparePassword(password, user.password)))
      return res.status(401).json({ message: "Invalid email or password" });


    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const tokens = createTokens(user);
    attachTokens(res, tokens);

    return res.status(200).json({
      message: "Login successful!",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error during login." });
  }
};

// Google Login
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token is required" });

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        profileImage: picture,
        googleId,
        isGoogleUser: true,
      });
      await user.save();
    }

    const tokens = createTokens(user);
    attachTokens(res, tokens);

    return res.status(200).json({
      message: "Google login successful!",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(500).json({ message: "Server error during Google login." });
  }
};

// Logout
const logOutUser = async (req, res) => {
  try {
    clearCookies(res);
    return res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Server error during logout." });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token found." });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Invalid user." });

    const tokens = createTokens(user);
    attachTokens(res, tokens);

    return res.status(200).json({
      message: "Token refreshed successfully!",
      user: publicUser(user),
    });
  } catch (error) {
    clearCookies(res);
    console.error("Refresh Token Error:", error);
    return res.status(403).json({ message: "Invalid or expired refresh token." });
  }
};

// Forgot Password
let resetTokens = {};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found with this email" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    resetTokens[resetToken] = { email, expires: Date.now() + 15 * 60 * 1000 };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.name},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_self" style="background:#4F46E5;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Verify Email</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    return res.status(200).json({ message: "Password reset email sent!" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Error sending reset email." });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword)
      return res.status(400).json({ message: "Invalid request" });

    const stored = resetTokens[token];
    if (!stored || stored.expires < Date.now())
      return res.status(400).json({ message: "Invalid or expired token" });

    const user = await User.findOne({ email: stored.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await hashPassword(newPassword);
    await user.save();

    delete resetTokens[token];

    return res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Error resetting password." });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  logOutUser,
  refreshToken,
  forgotPassword,
  resetPassword,
};
