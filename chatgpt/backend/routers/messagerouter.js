const express = require('express');
const messagerouter = express.Router();
const { protect } = require('../middlewares/auth.js');
const { textmessagecontroller,imagemessagecontroller} = require('../controllers/messagecontoller.js');


messagerouter.post('/text',protect,textmessagecontroller);
messagerouter.post('/image',protect,imagemessagecontroller);

module.exports = messagerouter;
