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
    socket.on("join_room", async ({ roomId }) => {
      try {
        // Room check
        const findRoom = await Room.findOne({ roomId });
        if (!findRoom) {
          return socket.emit("room_found_error", { message: "Room not found" });
        }

        // Logged-in user info
        const userId = socket.user._id;
        const userName = socket.user.name;

        // User ko room me join karado
        socket.join(roomId);

        // Map me save karo
        activeUsers.set(socket.id, { userId, userName, roomId });

        // Participants me check karo: user already hai ya nahi
        const isAlreadyParticipant = findRoom.participants.some(
          (p) => p.user.toString() === userId.toString()
        );

        if (!isAlreadyParticipant) {
          // Naya participant add karo
          await Room.updateOne(
            { roomId },
            {
              $push: {
                participants: { user: userId, name: userName, isActive: true },
              },
            }
          );
        } else {
          // Agar already participant hai, to bas isActive true karo
          await Room.updateOne(
            { roomId, "participants.user": userId },
            { $set: { "participants.$.isActive": true } }
          );
        }

        // Baaki users ko notify karo ke ek user join hua
        socket.to(roomId).emit("user_joined", {
          userId,
          userName,
          message: `${userName} joined the room`,
        });

        // Room ka current data sirf iss user ko bhejo
        const room = await Room.findOne({ roomId });
        socket.emit("room_data", {
          currentCode: room.currentCode,
          language: room.language,
          participants: room.participants,
        });

        console.log(`${userName} joined room ${roomId}`);
      } catch (error) {
        console.error("join room error", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    // Code Change event ( User ne code change kia )
    socket.on("code_change", async ({ roomId, code }) => {
      try {
        const room = await Room.findOne({ roomId });
        const userId = socket.user._id;
        const userName = socket.user.name;

        if (!room) {
          return socket.emit("room_found_error", { message: "Room not found" });
        }

        // Agr user room mai hai, tab hi room ka code change kr skta hai, wrna nhi karskta.
        const isUserInRoom = room.participants.some(
          (p) => p.user.toString() === userId.toString() && p.isActive
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

    // Cursor postion event (Live cursor movement)
    socket.on("cursor_position", async ({ roomId, position }) => {
      const room = await Room.findOne({ roomId });
      // loggedin user ki id and name nikala hai.
      const userId = socket.user._id;
      const userName = socket.user.name;

      if (!room) {
        return socket.emit("room_found_error", { message: "Room not found" });
      }

      // Agr user room mai hai, tab hi cursor move kr skta hai, wrna nhi karskta.
      const isUserInRoom = room.participants.some(
        (p) => p.user.toString() === userId.toString() && p.isActive
      );

      if (!isUserInRoom) {
        console.log("❌ User is not in room");
        return socket.emit("user_found_error", {
          message: "Join the room first",
        });
      }

      // Ab is data ko room ke BAAKI SAB Members ko bhejo (sender ko nahi)
      socket.to(roomId).emit("cursor_update", {
        position,
        userId,
        userName,
      });
    });

    // Chat message event
    socket.on("send_message", async ({ roomId, message }) => {
      try {
        const room = await Room.findOne({ roomId });
        const userId = socket.user._id;
        const userName = socket.user.name;

        if (!room) {
          return socket.emit("room_found_error", { message: "Room not found" });
        }

        // Agr user room mai hai, tab hi message send kr skta hai
        const isUserInRoom = room.participants.some(
          (p) => p.user.toString() === userId.toString() && p.isActive
        );

        if (!isUserInRoom) {
          console.log("❌ User is not in room");
          return socket.emit("user_found_error", {
            message: "Join the room first",
          });
        }

        const newMessage = await Message.create({
          room: room._id,
          sender: userId,
          content: message,
          type: "text",
        });

        const populatedMessage = await Message.findById(
          newMessage._id
        ).populate("sender", "name email avatar");

        // Broadcast to all in room (including sender)
        io.to(roomId).emit("receive_message", populatedMessage);

        console.log(`💬 Message in room ${roomId} from ${userName}`);
      } catch (error) {
        console.error("Send message error:", error);
      }
    });

    // Language change event
    socket.on("language_change", async ({ roomId, language }) => {
      try {
        const room = await Room.findOne({ roomId });
        if (!room) {
          return socket.emit("room_found_error", { message: "Room not found" });
        }

        const userId = socket.user._id;
        const userName = socket.user.name;

        // ✅ Check: user room ka active member hai ya nahi
        const isUserInRoom = room.participants.some(
          (p) => p.user.toString() === userId.toString() && p.isActive
        );

        if (!isUserInRoom) {
          console.log("❌ User not in room, language change blocked");
          return socket.emit("user_found_error", {
            message: "Join the room first",
          });
        }

        // ✅ Update language in DB
        await Room.updateOne({ roomId }, { language });

        // ✅ Sab users ko broadcast (including sender)
        io.to(roomId).emit("language_updated", {
          language,
          changedBy: userName,
        });

        console.log(
          `🔄 Language changed to ${language} in room ${roomId} by ${userName}`
        );
      } catch (error) {
        console.error("Language change error:", error);
      }
    });
  });
};

module.exports = { initializeSocket };
