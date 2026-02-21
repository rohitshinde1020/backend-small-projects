const User = require('../models/user.model').User;


const userdata = async (req, res) => {
    try {
        const userid = req.userId;
        if (!userid) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true, data: {
                name: user.name,
                email: user.email,
                isverify: user.isverify
            }
        });

    }
    catch (err) {
        
        res.status(500).json({ success: false, message: "Operation failed" });
    }
}

module.exports = { userdata };

