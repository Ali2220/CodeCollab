const Code = require("../models/Code");
const Room = require("../models/Room");

// @desc    Save code
// @route   POST /api/code/:roomId
// @access  Private
const saveCode = async (req, res) => {
  try {
    const { content, language, changeDescription } = req.body;
    const { roomId } = req.params;

    // Find room
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Get latest version
    const lastestCode = await Code.findOne({ room: room._id }).sort({
      version: -1,
    });
    const newVersion = lastestCode ? lastestCode.version + 1 : 1;

    // Save Code
    const code = await Code.create({
      room: room._id,
      content,
      language: language || room.language,
      updatedBy: req.user._id,
      version: newVersion,
      changeDescription: changeDescription || "Code Updated",
    });

    // Update room's current code
    (room.currentCode = content),
      (room.language = language || room.language),
      await room.save();

    const populatedCode = await Code.findById(code._id).populate(
      "updatedBy",
      "name email avatar"
    );

    res.status(201).json(populatedCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get code history
// @route   GET /api/code/:roomId/history
// @access  Private
// Ye function basically room ka pura code history laata hai (version wise), paginated form me.
const getCodeHistory = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    // Step 1: Room dhoondo
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Step 2: Code history fetch karo (sirf iss room ka) (har page par 10 record milen ge.)
    let codes = await Code.find({ room: room._id })
      .populate("updatedBy", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Step 3: Total codes count karo (sirf iss room ke)
    const count = await Code.countDocuments({ room: room._id });

    res.json({
      codes,
      totalPages: Math.ceil(count / limit), // kitne total pages banenge
      currentPage: page, // user konsa page dekh raha
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current code
// @route   GET /api/code/:roomId/current
// @access  Private
const getCurrentCode = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({
      content: room.currentCode,
      language: room.language,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific version
// @route   GET /api/code/:roomId/version/:version
// @access  Private
const getCodeVersion = async (req, res) => {
  try {
    const { roomId, version } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const code = await Code.findOne({
      room: room._id,
      version: parseInt(version),
    }).populate("updatedBy", "name email avatar");

    if (!code) {
      return res.status(404).json({ message: "Version not found" });
    }

    res.json(code);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { saveCode, getCodeHistory, getCurrentCode, getCodeVersion };
