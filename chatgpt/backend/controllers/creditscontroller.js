const Transaction = require('../models/transaction.js');
const stripe1 = require('stripe');


const Plans = [
    {
        _id: "basic",
        name: "Basic",
        price: 1,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 2,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 3,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
];


const getplans = (req, res) => {
    try {
        res.json({ success: true, plans: Plans });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error fetching plans", error: error.message });
    }
}


const stripe = new stripe1(process.env.STRIPE_SECRET_KEY);
// api conroller ofr perchasign the plan
const purchaseplan = async (req, res) => {
    try {
        const { planId } = req.body;
        const plan = Plans.find(p => p._id === planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }

        const userId = req.user._id;
        const newTransaction = await Transaction.create({
            userId,
            planId: plan._id,
            amount: plan.price,
            credits: plan.credits,
            ispaid: false,
        });
        await newTransaction.save();
        const {origin}=req.headers;

        const session = await stripe.checkout.sessions.create({
            
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: plan.name,
                    },
                    unit_amount: plan.price * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${origin}/loading`,
            cancel_url: `${origin}`,
            metadata: {
                transactionId: newTransaction._id.toString(),appId:'quickgpt'
            },
            expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // Session expires in 1 hour
        });

        res.json({ success: true, url: session.url });

    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { getplans, purchaseplan };