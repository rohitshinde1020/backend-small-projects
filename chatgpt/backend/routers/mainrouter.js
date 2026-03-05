const express = require('express');
const router = express.Router();
const { registeruser, login, getuserdata,getpublished} = require('../controllers/usercontoller.js'); 
const { protect } = require('../middlewares/auth.js');

router.post('/register', registeruser);
router.post('/login', login);
router.get('/userdata', protect, getuserdata);
router.get('/published',getpublished);

module.exports = router;