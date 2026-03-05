
const mongoose = require('mongoose');
const userschema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,

    },
    password: {
        type: String,
        require: true,
    },
    credits:{
        type:Number ,
        default:20,

    },
});

const User = mongoose.model('User', userschema);

module.exports = User;