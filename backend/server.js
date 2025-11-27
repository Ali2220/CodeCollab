const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./src/config/database");
const dotenv = require("dotenv");

dotenv.config();

connectDB();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({
        message: 'Code Collab Project'
    })
})

io.on("connection", (socket) => {
    console.log("User Connected", socket.id);
    
})

httpServer.listen(3000, () => {
    console.log('Server Started on port 3000');
    console.log('Socket.IO server started.');
})
