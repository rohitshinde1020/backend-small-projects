const express=require("express");
const router=require("./routes/user.routes")
const dotenv=require('dotenv')
const connectdb=require('./config/db')
const cookieparser=require('cookie-parser')

dotenv.config()
connectdb()

const port=3000;
const app=express();

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieparser());

app.use('/',router)

app.listen(port,()=>{
    console.log(`server is sunning at port ${port}`)
})