import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { onlineUsers } from "../index.js";

const router = express.Router();

// @route GET /users
router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    const usersWithStatus = users.map((u) => ({
      ...u.toObject(),
      isOnline: onlineUsers.has(u._id.toString()), 
    }));

    res.json(usersWithStatus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
