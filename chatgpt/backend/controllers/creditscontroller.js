const Transaction = require('../models/transaction.js');
const stripe1 = require('stripe');
const User = require('../models/usermodel.js');

// Stripe will be initialized only if key exists
const stripe = process.env.STRIPE_SECRET_KEY ? new stripe1(process.env.STRIPE_SECRET_KEY) : null;

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


const getFrontendUrl = () => {
    if (!process.env.FRONTEND_URL) {
        return null;
    }
    return process.env.FRONTEND_URL.replace(/\/$/, '');
}

const applyTransactionCredits = async (transactionId) => {
    const transaction = await Transaction.findById(transactionId);

    if (!transaction || transaction.ispaid) {
        return false;
    }

    await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } });
    transaction.ispaid = true;
    await transaction.save();

    return true;
}

// api controller for purchasing the plan
const purchaseplan = async (req, res) => {
    try {
        // Check if Stripe is configured
        if (!stripe || !process.env.STRIPE_SECRET_KEY) {
            return res.status(503).json({ 
                success: false, 
                message: "Payment service is not available at the moment. Please try again later." 
            });
        }
        
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
        const frontendUrl = getFrontendUrl() || (req.headers.origin ? req.headers.origin.replace(/\/$/, '') : null);

        if (!frontendUrl) {
            return res.status(500).json({ success: false, message: 'Frontend URL is not configured' });
        }

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
            success_url: `${frontendUrl}/loading?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendUrl}`,
            metadata: {
                transactionId: newTransaction._id.toString(),appId:'quickgpt'
            },
            client_reference_id: userId.toString(),
            expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // Session expires in 1 hour
        });

        res.json({ success: true, url: session.url });

    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const verifyStripeSession = async (req, res) => {
    try {
        // Check if Stripe is configured
        if (!stripe || !process.env.STRIPE_SECRET_KEY) {
            return res.status(503).json({ 
                success: false, 
                message: "Payment service is not available at the moment. Please try again later." 
            });
        }
        
        const sessionId = req.body.sessionId || req.query.session_id;

        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'sessionId is required' });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ success: false, message: 'Payment not completed' });
        }

        const transactionId = session.metadata?.transactionId;

        if (!transactionId) {
            return res.status(400).json({ success: false, message: 'Transaction metadata not found' });
        }

        const didApply = await applyTransactionCredits(transactionId);

        return res.status(200).json({ success: true, message: didApply ? 'Credits added' : 'Already verified' });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const stripeWebhook = async (req, res) => {
    try {
        const signature = req.headers['stripe-signature'];

        // If Stripe is not configured, acknowledge webhook but don't process
        if (!stripe || !process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
            console.log('Stripe webhook received but service is not configured');
            return res.status(200).json({ received: true });
        }

        const event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const transactionId = session.metadata?.transactionId;

            if (transactionId) {
                await applyTransactionCredits(transactionId);
            }
        }

        return res.status(200).json({ received: true });
    }
    catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
}

module.exports = { getplans, purchaseplan, verifyStripeSession, stripeWebhook };