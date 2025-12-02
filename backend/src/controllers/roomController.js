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

// @desc    Get all user's rooms
// @route   GET /api/rooms
// @access  Private
// loggedin user jin rooms mai hai, wo sb rooms dedo.
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      "participants.user": req.user._id,
      isActive: true,
    })
      .populate("creator", "name email avatar")
      .populate("participants.user", "name email avatar")
      .sort({ updatedAt: -1 });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get room by ID
// @route   GET /api/rooms/:roomId
// @access  Private
const getRoomById = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId })
      .populate("creator", "name email avatar")
      .populate("participants.user", "name email avatar");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join room
// @route   POST /api/rooms/:roomId/join
// @access  Private
const joinRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Check if user already in room
    const alreadyJoined = room.participants.some(
      (p) => p.user.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: "Already in room" });
    }

    // Check max participants
    if (room.participants.length >= room.maxParticipants) {
      return res.status(400).json({ message: "Room is full" });
    }

    room.participants.push({
      user: req.user._id,
      isActive: true,
    });

    // Add room to user's rooms
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { rooms: room._id },
    });

    const populatedRoom = await Room.findById(room._id)
      .populate("creator", "name email avatar")
      .populate("participants.user", "name email avatar");

    res.json(populatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRoom, getRooms, getRoomById, joinRoom };
