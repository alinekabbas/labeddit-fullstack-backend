import express from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { CommentController } from "../controller/CommentController";
import { CommentDatabase } from "../database/CommentDatabase";
import { CommentDTO } from "../dtos/CommentDTO";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export const commentRouter = express.Router()

const commentController = new CommentController(
    new CommentDTO(), 
    new CommentBusiness(
        new CommentDTO(), 
        new CommentDatabase(), 
        new IdGenerator(), 
        new TokenManager()
    )
)

commentRouter.post("/:id/post", commentController.createComment)
commentRouter.put("/:id", commentController.editComment)
commentRouter.delete("/:id", commentController.deleteComment)
commentRouter.put("/:id/like", commentController.likeDislikeComment)
