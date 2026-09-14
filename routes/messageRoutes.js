const express = require("express");

const Message = require("../models/message");
const User = require("../models/user");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();



router.get("/:userId", authenticateToken, async (req, res) => {

    try {

        const otherUserId = req.params.userId;

        const otherUser = await User.findById(otherUserId);

        if (!otherUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const messages = await Message.find({
            $or: [
                {
                    sender: req.user.userId,
                    receiver: otherUserId
                },
                {
                    sender: otherUserId,
                    receiver: req.user.userId
                }
            ]
        })
        .sort({ createdAt: 1 });

        res.json(messages);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Unable to load messages"
        });

    }

});



router.post('/', authenticateToken, async (req, res) => {
    try {
        const { to, content, mediaUrl, _tempId } = req.body;
        if (!to || (!content && !mediaUrl)) {
            return res.status(400).json({ message: 'Missing "to" or message content' });
        }

        const msg = await Message.create({ sender: req.user.userId, receiver: to, message: content || '', mediaUrl: mediaUrl || '' });

        try {
            const io = req.app && req.app.locals && req.app.locals.io;
            if (io) {
                const msgObj = (msg && msg.toObject) ? msg.toObject() : msg;
                if (_tempId) msgObj._tempId = _tempId;
                io.to(to).emit('private_message', msgObj);
                io.to(req.user.userId).emit('private_message', msgObj);
            }
        } catch (e) {
            console.warn('Could not emit socket message from HTTP route', e?.message || e);
        }

        const resp = (msg && msg.toObject) ? msg.toObject() : msg;
        if (_tempId) resp._tempId = _tempId;
        res.status(201).json(resp);

    } catch (error) {
        console.error('HTTP message send error', error);
        res.status(500).json({ message: 'Unable to send message' });
    }
});

module.exports = router;