const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    currentCode: {
      type: String,
      default: "// Start coding here... ",
    },
    language: {
      type: String,
      default: "javascript",
    // enum = “Sirf in allowed languages me se hi koi value allow hai.”
      enum: [
        "javascript",
        "python",
        "java",
        "cpp",
        "html",
        "css",
        "typescript",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    maxParticipants: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

// Index for faster Queries.
roomSchema.index({roomId : 1});
roomSchema.index({creator: 1})

module.exports = mongoose.model("Room", roomSchema);
