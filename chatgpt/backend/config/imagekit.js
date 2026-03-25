const imagekit = require("imagekit");

if (!process.env.IMAGEKIT_PUBLIC_KEY) {
    throw new Error("Missing IMAGEKIT_PUBLIC_KEY in environment variables");
}

const imagekitinstance = new imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

module.exports = imagekitinstance;