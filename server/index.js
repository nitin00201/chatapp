import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import messageRoutes from "./routes/messages.js";
import { verifySocket } from "./middleware/auth.js";
import Message from "./models/Message.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// DB
connectDB();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/conversations", messageRoutes);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.use(verifySocket);

// Store online users in memory (userId → socketId)
export const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.userId);

  // Mark user online
  onlineUsers.set(socket.userId, socket.id);
  io.emit("user:online", { userId: socket.userId });

  socket.join(socket.userId);

  /**
   * 1️⃣ Send message
   */
  socket.on("message:send", async ({ receiver, text }) => {
    try {
      const msg = await Message.create({
        sender: socket.userId,
        receiver,
        text,
        status: "sent" // new field in schema: "sent" | "delivered" | "read"
      });

      // Always send back to sender immediately
      io.to(socket.userId).emit("message:new", msg);

      // If receiver is online → deliver + update
      if (onlineUsers.has(receiver)) {
        io.to(receiver).emit("message:new", { ...msg._doc, status: "delivered" });

        await Message.findByIdAndUpdate(msg._id, { status: "delivered" });
        io.to(socket.userId).emit("message:status", { id: msg._id, status: "delivered" });
      }
    } catch (err) {
      console.error("❌ Error saving message:", err.message);
    }
  });

  /**
   * 2️⃣ Typing events
   */
  socket.on("typing:start", ({ receiver }) => {
    if (onlineUsers.has(receiver)) {
      io.to(receiver).emit("typing:start", { from: socket.userId });
    }
  });

  socket.on("typing:stop", ({ receiver }) => {
    if (onlineUsers.has(receiver)) {
      io.to(receiver).emit("typing:stop", { from: socket.userId });
    }
  });

  /**
   * 3️⃣ Read receipts
   */
 socket.on("message:read", async ({ msgId }) => {
      try {
        const msg = await Message.findById(msgId);
        if (!msg) return;

        msg.status = "read";
        await msg.save();

        // Tell both users
        io.to(msg.sender.toString()).emit("message:read", msg);
        io.to(msg.receiver.toString()).emit("message:read", msg);
      } catch (err) {
        console.error("Error marking message as read:", err.message);
      }
    });

  /**
   * 4️⃣ Disconnect
   */
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.userId);
    onlineUsers.delete(socket.userId);
    io.emit("user:offline", { userId: socket.userId });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
