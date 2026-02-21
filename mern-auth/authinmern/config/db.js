const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectdb=async()=>{
    await mongoose.connect(`${process.env.MONGO_URI}/authmern`);
    console.log("Mongodb connected successfully");
}

module.exports=connectdb;