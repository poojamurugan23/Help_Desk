const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

connectDB().then(() => {
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
