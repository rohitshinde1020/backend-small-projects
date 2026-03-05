const mongoose=require('mongoose');

const connectdb=async()=>{
    try{
        mongoose.connection.on('connected',()=>console.log('database connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/quickgpt`)
    }
    catch(err){
        console.log('error occured in connection of database',err)
    }
}

module.exports=connectdb;