const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    logOutUser,
    refreshToken,
} = require("../controllers/auth.controller");

router.post("/register", registerUser);
router.post("login", loginUser);
router.post("/logout", logOutUser);
router.post("/refresh", refreshToken);

module.exports = router;
