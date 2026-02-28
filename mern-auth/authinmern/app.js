const express = require("express");
const dotenv = require("dotenv")
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectdb = require("./config/db.js");
dotenv.config();
const router=require("./routers/main-router.js");
const userrouter=require("./routers/user-router.js");
const allowedOrigins = ['https://authentication-system-yoa2.onrender.com'];

app.use(cookieParser());
app.use(express.json());
app.use(cors({credentials:true , origin: allowedOrigins}));
connectdb();

const PORT = process.env.PORT || 4000 ;
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', router);
app.use('/api/user',userrouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});

