const Room = require("../models/Room");
const Message = require("../models/Message");
const User = require("../models/User");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

// Store active users with their socket IDs
const activeUsers = new Map();

const initializeSocket = (io) => {
  // 🧩 Middleware: connection establish hone se pehle user ko verify karna
  io.use(async (socket, next) => {
    // Handshake se cookies nikal rahe hain (browser se bheji gayi)
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    // Check karte hain ke token hai ya nahi
    if (!cookies.token) {
      next(new Error("Authentication Error: No token provided"));
    }

    // Ab token verify karte hain (JWT ke zariye)
    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET_KEY);
      // Token se user ka ID mil gaya, ab DB se user nikal lo
      const user = await User.findById(decoded.id);

      // Loggedin user ka data socket.user mai rakh dia hai.
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  // Socket.IO connection event
  io.on("connection", (socket) => {
    console.log(`✅ New Connection: ${socket.id} ${socket.user.name}`);

    // User join room event ( User bolta hai: "Bhai mujhe is room me ghusa do" )
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

        // Get Current room data  (Sirf iss user ko room ka current code, language, participants dikhao)
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

    // Code Change event ( User ne code change kia )
    socket.on("code_change", async ({ roomId, code, userId, userName }) => {
      try {
        const room = await Room.findOne({ roomId });

        if (!room) {
          return socket.emit("room_found_error", { message: "Room not found" });
        }

        // Agr user room mai hai, tab hi room ka code change kr skta hai, wrna nhi karskta.
        const isUserInRoom = room.participants.some(
          (p) => p.user.toString() === userId && p.isActive
        );

        if (!isUserInRoom) {
          console.log("❌ User is not in room");
          return socket.emit("user_found_error", {
            message: "Join the room first",
          });
        }

        // Update room's current code ( Latest code DB me save hua )
        await Room.findOneAndUpdate({ roomId }, { currentCode: code });

        // Broadcast room's current code ( Sab ko update karo (except sender) )
        socket.to(roomId).emit("code_update", {
          code,
          userId,
          userName,
          timeStamp: new Date(),
        });

        console.log(`Code update in room ${roomId} by ${userName}`);
      } catch (error) {
        console.error("Code change error:", error);
      }
    });
  });
};

module.exports = { initializeSocket };
