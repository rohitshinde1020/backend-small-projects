const mongoose=require('mongoose');
let hasConnectionListener = false;

if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in environment variables");
}

const connectdb=async()=>{
    try{
        if (!hasConnectionListener) {
            mongoose.connection.on('connected',()=>console.log('database connected'));
            hasConnectionListener = true;
        }
        await mongoose.connect(`${process.env.MONGODB_URI}/quickgpt`)
    }
    catch(err){
        console.log('error occured in connection of database',err)
        throw err;
    }
}

module.exports=connectdb;