const jwt = require("jsonwebtoken");

const cookieOptions = {
    httpsOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
};

const createTokens = (user) => {
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1hr",
    });

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
};

const attachTokens = (res, tokens) => {
    res.cookie("accessToken", tokens.accessToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

const clearCookies = () => {
    res.clearCookies("accessToken", cookieOptions);
    res.clearCookies("refreshToken", cookieOptions);
};

const publicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    profileImage: user.profileImage || "",
    authProvider: user.authProvider || "email",
    role: user.role || "user",
});

module.exports = {
    createTokens,
    attachTokens,
    clearCookies,
    publicUser,
};
