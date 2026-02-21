
const mongoose=require('mongoose')

const usermodel=new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        required:true,
        lowercase:true,
        minlength:[5,"email should be greater than 5 char"]

    },
    email:{
        type:String,
        trim:true,
        required:true,
        lowercase:true,
        minlength:[6,"email should be greater than 6 char"]
    },
    password:{
        type:String,
        trim:true,
        required:true,
        minlength:[5,"email should be greater than 5 char"]
    },
    posts :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }]
})

module.exports=mongoose.model("User",usermodel)
