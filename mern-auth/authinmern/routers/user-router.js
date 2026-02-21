const express=require('express');
const router=express.Router();
const {authmiddleware}=require('../components/authmain.js');
const {userdata}=require('../components/usermain.js');

router.get('/data',authmiddleware, userdata);

module.exports=router;