
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
    credits:{
        type:Number ,
        default:20,

    },
});

const User = mongoose.model('User', userschema);

module.exports = User;