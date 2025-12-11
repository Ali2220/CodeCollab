const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require('cookie-parser')
const connectDB = require("./src/config/database");

// Routes
const authRoutes = require('./src/routes/authRoutes')
const roomRoutes = require('./src/routes/roomRoutes')
const codeRoutes = require('./src/routes/codeRoutes')
const aiRoutes = require('./src/routes/aiRoutes')

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
app.use(cookieParser())

app.get('/', (req, res) => {
    res.json({
        message: 'Code Collab Project'
    })
})

// Api Routes
app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/code', codeRoutes)
app.use('/api/ai', aiRoutes)

io.on("connection", (socket) => {
    console.log("User Connected", socket.id);
    
})

httpServer.listen(3000, () => {
    console.log('Server Started on port 3000');
    console.log('Socket.IO server started.');
})
