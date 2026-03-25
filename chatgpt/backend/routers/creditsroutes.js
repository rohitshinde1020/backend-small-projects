const creditrouter = require('express').Router();

const {getplans, purchaseplan, verifyStripeSession} = require('../controllers/creditscontroller.js');
const {protect} = require('../middlewares/auth.js');

creditrouter.get('/plans', getplans);
creditrouter.post('/purchase', protect, purchaseplan);
creditrouter.post('/verify-session', protect, verifyStripeSession);

module.exports = creditrouter;