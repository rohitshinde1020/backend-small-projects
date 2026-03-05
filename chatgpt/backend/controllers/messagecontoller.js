const axios = require("axios");
const openai = require("../config/opeai.js");
const imagekitinstance = require("../config/imagekit.js");
const User = require("../models/usermodel.js");
const Chat = require("../models/chat.js");


const textmessagecontroller = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId, prompt } = req.body;
        
        if(req.user.credits<1){
            return res.status(400).json({ success: false, message: "Not enough credits to generate image" });
        }

        if (!prompt) {
            return res.status(400).json({ success: false, message: "Prompt is required" });
        }

        if (req.user.credits < 1) {
            return res.status(400).json({ success: false, message: "Not enough credits to generate content" });
        }

        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
            ispublished: false,
        });


        const { choices } = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const reply = {
            ...choices[0].message,
            timestamp: Date.now(),
            isImage: false,
            ispublished: false,
            role: "assistant",
        };
        res.status(200).json({ success: true, message: "Message processed successfully", reply });
        chat.messages.push(reply);
        await chat.save();

        await User.updateOne({_id:userId},{$inc:{credits:-1}});

        

    }
    catch (err) {
        res.status(500).json({ success: false, message: "Error processing message", error: err.message });
    }
}

// User Prompt
//      ↓
// Encode prompt for URL
//      ↓
// Create ImageKit AI generation URL
//      ↓
// Axios downloads generated image
//      ↓
// Binary → Base64 conversion
//      ↓
// Upload image to ImageKit storage
//      ↓
// Get public image URL
//      ↓
// Create assistant reply object
//      ↓
// Send image URL to frontend

const imagemessagecontroller = async (req, res) => {
    try {
        const userId = req.user._id;
        const { chatId, ispublished } = req.body;
        const prompt = req.body.prompt;

        if (!prompt) {
            return res.status(400).json({ success: false, message: "Prompt is required" });
        }

        if(req.user.credits < 1){
            return res.status(400).json({ success: false, message: "Not enough credits to generate image" });
        }

        const chat = await Chat.findOne({ userId, _id: chatId });
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
            ispublished: false,
        });

        // This converts the prompt into a URL-safe format.
        const encodedprompt = encodeURIComponent(prompt);

        // Creates a dynamic URL that tells ImageKit to generate an image. 
        // The URL includes the encoded prompt and a unique filename based on the current timestamp. 
        // The transformation parameters (tr=w-800,h-800) specify that the generated image should be resized to 800x800 pixels.
        const generatedimageurl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedprompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;


        const base64image = Buffer.from((await axios.get(generatedimageurl,{responseType:'arraybuffer'})).data,'binary').toString('base64');

        const uploadresponse = await imagekitinstance.upload({
            file: `data:image/png;base64,${base64image}`,
            fileName: `quickgpt-${Date.now()}.png`,
            folder: "quickgpt",
        });

        //upload response contains the URL of the uploaded image in ImageKit storage.
        //  This URL is then used to create a reply object that is sent back to the frontend and also stored in the chat history in the database.
        //  The user is charged credits for generating the image, and the chat history is updated with both the user's prompt and the assistant's reply containing the image URL.
        const reply = {
            role: "assistant",
            content: uploadresponse.url,
            timestamp: Date.now(),
            isImage: true,
            ispublished: Boolean(ispublished),
        };

        res.status(200).json({ success: true, message: "Image generated and uploaded successfully", reply });
        chat.messages.push(reply);
        await chat.save();

        await User.updateOne({_id:userId},{$inc:{credits:-1}});
        

    }
    catch (err) {
        res.status(500).json({ success: false, message: "Error processing message", error: err.message });
    }  
}

module.exports = { textmessagecontroller, imagemessagecontroller };