
const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetOTP: {
        type: String,
        default: "",
    },
    verifyotp: {
        type: String,
        default: "",
    },
    verifyotpexpiry: {
        type: Number,
        default: 0,
    },
    isverify: {
        type: Boolean,
        default: false,
    },
    resetotpexpiry: {
        type: Number,
        default: 0,
    },

})

const User = mongoose.models.User || mongoose.model("User", userschema);

module.exports = { User };