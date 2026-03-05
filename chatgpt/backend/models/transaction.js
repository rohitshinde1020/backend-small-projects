const mongoose = require('mongoose');

const transactionschema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    planId: {
        type: String,
        required: true,
    },
    amount: {   
        type: Number,
        required: true,
    },
    credits:{
        type:Number ,
        required: true,
    },
    ispaid: {
        type: Boolean,
        default: false,
    },
},{timestamps:true});

const Transaction = mongoose.model('Transaction', transactionschema);

module.exports = Transaction;