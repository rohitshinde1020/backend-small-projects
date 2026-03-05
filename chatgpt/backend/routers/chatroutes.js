const express = require("express");
const { createchat, getallchats, deletechat } = require("../controllers/chatcontoller.js");
const { protect } = require("../middlewares/auth.js");
const chatrouter = express.Router();

chatrouter.get("/create", protect, createchat);
chatrouter.get("/all", protect, getallchats);
chatrouter.post("/delete", protect, deletechat);

module.exports = chatrouter;