import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  followUnfollowUser,
  getUserFollowing,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/:id/following", verifyToken, getUserFollowing);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.patch("/:id/follow/:followId", verifyToken, followUnfollowUser);

export default router;
