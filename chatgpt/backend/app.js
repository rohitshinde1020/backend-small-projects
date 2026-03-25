require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { validateEnv } = require('./config/env.js');
const connectdb = require('./config/DB.js');
const router = require('./routers/mainrouter.js');
const chatrouter = require('./routers/chatroutes.js');
const messagerouter = require('./routers/messagerouter.js');
const creditrouter = require('./routers/creditsroutes.js');
const { stripeWebhook } = require('./controllers/creditscontroller.js');

validateEnv();
const port = process.env.PORT || 3000;

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

if (allowedOrigins.length === 0 && process.env.NODE_ENV !== 'production') {
    allowedOrigins.push('http://localhost:5173', 'http://localhost:3000');
}

connectdb().catch((err) => {
    console.error('Database connection failed', err);
    if (require.main === module) {
        process.exit(1);
    }
});

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.length === 0 && process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.post('/api/credits/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('server is live')
})

app.use('/api/user',router);
app.use('/api/chat',chatrouter);
app.use('/api/message',messagerouter);
app.use('/api/credits',creditrouter );

if (require.main === module) {
    app.listen(port, () => {
        console.log(`server is running on port ${port}`);
    });
}

module.exports = app;

