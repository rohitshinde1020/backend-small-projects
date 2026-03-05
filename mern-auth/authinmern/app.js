const express = require("express");
const dotenv = require("dotenv")
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const connectdb = require("./config/db.js");
dotenv.config();
const router=require("./routers/main-router.js");
const userrouter=require("./routers/user-router.js");

// Validate environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI', 'SENDER', 'SMTP_USER', 'SMTP_PASSWORD'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

const allowedOrigins = [
  "https://authentication-system-yoa2.onrender.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
  "https://mern-auth-frontend.onrender.com"
].filter(Boolean);

console.log('Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
connectdb();

const PORT = process.env.PORT || 4000 ;
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', router);
app.use('/api/user',userrouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Backend is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});

