const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is Required"],
            trim: true,
            minlength: [2, "Name must be 2 character"],
        },

        email: {
            type: String,
            required: [true, "Email is Required"],
            unique: true,
            lowercase: true,
            match: [/.+@.+\..+/, "Please Enter a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is Required"],
            minlength: [8, "Password must be at least 8 character"],
        },
    },
    { timestamps: true }
);

const user = mongoose.model("user", userSchema);

module.exports = user;
