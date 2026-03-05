const creditrouter = require('express').Router();

const {getplans, purchaseplan} = require('../controllers/creditscontroller.js');
const {protect} = require('../middlewares/auth.js');

creditrouter.get('/plans', getplans);
creditrouter.post('/purchase', protect, purchaseplan);

module.exports = creditrouter;