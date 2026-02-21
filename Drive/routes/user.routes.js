const express = require("express")
const router = express.Router();
const Usermodel = require('../models/user.model')
const postmodel = require('../models/post.model')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require("../models/user.model");

router.post("/register",
    body("email").trim(),
    body("password").trim(),
    body("username").trim(),
    async (req, res) => {

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                })
            }
            const { username , email , password } = req.body;

            const user = await Usermodel.findOne({ email });
            if (user) return res.status(400).send("User is already register")

            const gensalt = await bcrypt.genSalt(10)
            const hashpassword = await bcrypt.hash(password, gensalt)

            const newuser = await Usermodel.create({
                username,
                email,
                password: hashpassword,
                
            })

            const token = jwt.sign(
                { userId: newuser._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );
            res.cookie('token', token)
            res.send("user registerd")
        }
        catch (err) {
            console.error("ERROR 👉", err);
            return res.status(500).send("server error");
        }



    })

router.get("/register", (req, res) => {
    res.render("register")
})

router.get("/signup", (req, res) => {
    res.redirect("/register")
})

router.post("/login",
    async (req, res) => {

        try {

            const { username, password } = req.body;

            const user = await Usermodel.findOne({ username: username });
            if (!user) return res.status(400).send("Invalid password or username")

            const ismatch = await bcrypt.compare(password, user.password);
            if (!ismatch) return res.status(400).send("Invalid password or username")

            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.cookie('token', token)
            return res.redirect("/profile")
        }
        catch (err) {
            console.error("ERROR 👉", err);
            return res.status(500).send("server error");
        }

})

router.get("/login", (req, res) => {
    res.render("login")
})

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

router.get("/profile", authMiddleware, async (req, res) => {
    const user = await userModel.findById(req.user.userId).populate('posts') // never send password
    res.render('profile',{user})
})

router.get("/like/:id", authMiddleware, async (req, res) => {
    const post = await postmodel.findOne({_id:req.params.id}).populate('user') 
    if(post.likes.indexOf(req.user.userId)===-1) post.likes.push(req.user.userId)
    // console.log(post)
    else {
        post.likes.splice(post.likes.indexOf(req.user.userId),1);
    }
    await post.save();
    res.redirect('/profile')
})

router.get("/edit/:id", authMiddleware, async (req, res) => {
    const post = await postmodel.findOne({_id:req.params.id}).populate('user') 
    res.render('edit',{post})
    
})

router.post("/update/:id", authMiddleware, async (req, res) => {
    const post = await postmodel.findOneAndUpdate({_id:req.params.id},{content:req.body.content}) 
    res.redirect('/profile')
    
})



router.post("/posts", authMiddleware, async (req, res) => {
    const user = await userModel.findById(req.user.userId) // never send password
    let {content}=req.body;

    let post=await postmodel.create({
        content:content,
        user:user._id,

    })

    user.posts.push(post._id)
    await user.save();
    res.redirect('/profile')
})



function authMiddleware(req, res, next) {
    console.log("COOKIES 👉", req.cookies);
    try {
        const token = req.cookies.token;
        if (!token) return res.redirect('/login');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).send("Invalid or expired token");
    }


};


module.exports = router