const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    attachTokens,
    clearCookies,
    createTokens,
    publicUser,
} = require("../utils/tokenUtils");

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const comparePassword = async (enterPassword, hashedPassword) => {
    return await bcrypt.compare(enterPassword, hashedPassword);
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ message: "All Fields Are Required" });

        if (password.length < 8)
            return res
                .status(400)
                .json({ message: "Please Must Be At Least 8 Character" });

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email Already Registered" });

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            name: name.trim(),
            email: email.trim(),
            password: hashedPassword,
        });

        await newUser.save();

        const tokens = createTokens(newUser);
        attachTokens(res.tokens);
        res.status(201).json({
            message: "✅ Registration successful!",
            user: publicUser(newUser),
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server Error During Registration." })
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message:"All Fields Are Required"})

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User Not Found" })

        const isMatch = await comparePassword(password, user.password);
        if (!password) return res.status(400).json({ message: "Invalid Credinals." })

        const tokens = createTokens(user);
        attachTokens(res, tokens);

        res.status(201).json({
            message: "Login Successfull!",
            user: publicUser(user)
        })
    } catch (error) {
        console.log("Login Error: ", error);
        res.status(500).json({ message: "Server Error During Login." })


    }

}


const logOutUser = async (req, res) => {

    try {
        clearCookies(res);
        res.status(200).json({ message: "LogOut SuccessFully!" })
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Server error during logout." });

    }

}

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: "No Refresh Token Found." })

        //verify refresh token

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        const user = await User.findById(decoded.id);

        if (!user) return res.status(401).json({ message: "Invalid User" })

        //generate new token
        const tokens = createTokens(user);
        attachTokens(res,tokens);

        res.status(201).json({ message: "Token Refreshed SuccessFully!", user: publicUser(user) })
    } catch (error) {
        console.error("Refresh Token Error:", error);
        res.status(403).json({ message: "Invalid or expired refresh token." });

    }
}

module.exports = {
    registerUser,
    loginUser,
    logOutUser,
    refreshToken
}