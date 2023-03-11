import { Request, Response } from "express"
import { CommentBusiness } from "../business/CommentBusiness"
import { CommentDTO } from "../dtos/CommentDTO"
import { BaseError } from "../errors/BaseError"

export class CommentController {
    constructor(
        private commentDTO: CommentDTO,
        private commentBusiness: CommentBusiness
    ) { }

    public createComment = async (req: Request, res: Response) => {
        try {
            const input = this.commentDTO.createCommentInput(
                req.params.id,
                req.headers.authorization,
                req.body.content
            )

            const output = await this.commentBusiness.createComment(input)

            res.status(201).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public editComment = async (req: Request, res: Response) => {
        try {
            const input = this.commentDTO.editCommentInput(
                req.params.id,
                req.headers.authorization,
                req.body.content
            )

            const output = await this.commentBusiness.editComment(input)

            res.status(201).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public deleteComment = async (req: Request, res: Response) => {
        try {
            const input = this.commentDTO.deleteCommentInput(
                req.params.id,
                req.headers.authorization
            )

            const output = await this.commentBusiness.deleteComment(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public likeDislikeComment = async (req: Request, res: Response) => {
        try {
            const input = this.commentDTO.likeDislikeCommentInput(
                req.params.id,
                req.headers.authorization,
                req.body.like
            )

            const output = await this.commentBusiness.likeDislikeComment(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

}