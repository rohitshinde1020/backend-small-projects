const { stripeWebhook } = require("../controllers/creditscontroller");

const requiredEnv = [
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'OPENAI_API_KEY',
    'IMAGEKIT_PUBLIC_KEY',
    'IMAGEKIT_PRIVATE_KEY',
    'IMAGEKIT_URL_ENDPOINT',
];
    
const requiredProdEnv = [
    'FRONTEND_URL',
    'CORS_ORIGINS',
    
];

const validateEnv = () => {
    const missing = requiredEnv.filter((key) => !process.env[key]);

    if (process.env.NODE_ENV === 'production') {
        missing.push(...requiredProdEnv.filter((key) => !process.env[key]));
    }

    if (missing.length) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};

module.exports = { validateEnv };