const Room = require("../models/Room");
const Message = require("../models/Message");

// Store active users with their socket IDs
const activeUsers = new Map();

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`✅ New Connection: ${socket.id}`);

    // User bolta hai: "Bhai mujhe is room me ghusa do"
    socket.on("join_room", async ({ roomId, userId, userName }) => {
      try {
        // User room me enter
        socket.join(roomId);

        // Map me save kar liya user ka data (memory me)
        activeUsers.set(socket.id, { userId, userName, roomId });

        // DB me user online mark kia hai
        await Room.updateOne(
          { roomId, "participants.user": userId },
          { $set: { "participants.$.isAcive": true } }
        );

        // Room ke baqi users ko msg kro ke aik user ne room join kia hai. (sender ko nahi)
        socket.to(roomId).emit("user_joined", {
          userId,
          userName,
          message: `${userName} joined the room`,
        });

        // Get Current room data
        const room = await Room.findOne({ roomId });
        socket.emit("room_data", {
          currentCode: room.currentCode,
          language: room.language,
          participants: room.participants,
        });

        console.log(`${userName} joined room ${roomId}`);
      } catch (error) {
        console.log("join room error", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });
  });
};

module.exports = { initializeSocket };
