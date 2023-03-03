import express from "express";
import { PostController } from "../controller/PostController";

export const postRouter = express.Router()

const postController = new PostController()

postRouter.get("/")
postRouter.post("/")
postRouter.put("/:id")
postRouter.delete("/:id")
postRouter.put("/:id/like")
postRouter.get("/:id/comments/like")