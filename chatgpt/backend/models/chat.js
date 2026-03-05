const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true,
    },
    userName:{
        type:String,
        required:true,
    },
    name: {
        type: String,
        required: true,
    },
    messages: [{
            isImage: {
                type: Boolean,
                default: false,
                required: true,
            },
            ispublished: {
                type: Boolean,
                default: false,
            },
            role:{
                type: String,
                required: true,
            },
            content:{
                type: String,
                required: true,
            },
            timestamp:{
                type: Number,
                required: true,
            },
    }]
},{timestamps:true});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;