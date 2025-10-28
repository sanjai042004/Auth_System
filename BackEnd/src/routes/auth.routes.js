const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    logOutUser,
    refreshToken,
    googleLogin,
    forgotPassword,
    resetPassword
} = require("../controllers/auth.controller");

router.post("/register", registerUser);
router.post("login", loginUser);
router.post("/logout", logOutUser);
router.post("/refresh", refreshToken);
router.post("/google-login", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
