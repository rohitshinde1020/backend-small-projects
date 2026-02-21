
const mongoose=require('mongoose')

const postmodel=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
    ,
    content:{
        type:String,
        trim:true,
        required:true,
    },
    likes :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],

    date:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model("Post",postmodel)