const Room = require("../models/Room");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private
const createRoom = async (req, res) => {
  try {
    const { name, description, language } = req.body;

    const room = await Room.create({
      roomId: uuidv4().substring(0, 8),
      name,
      description,
      language: language || "javascript",
      creator: req.user._id,
      participants: [
        {
          user: req.user._id,
          isActive: true,
        },
      ],
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { rooms: room._id },
    });

    const populatedRoom = await Room.findById(room._id)
      .populate("creator", "name email avatar")
      .populate("participants.user", "name email avatar");

    res.status(201).json(populatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRoom };
