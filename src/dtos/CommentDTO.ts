import { BadRequestError } from "../errors/BadRequestError"
import { Comment } from "../models/Comment"
import { CommentModel } from "../types"

export interface GetCommentInputDTO {
    id: string
    token: string | undefined
}

export type GetCommentOuputDTO = CommentModel[]

export interface CreateCommentInputDTO {
    id: string
    token: string | undefined,
    content: string
}

export interface CreateCommentOutputDTO {
    message: string,
    comment: {
        id: string,
        postId: string,
        content: string,
        likes: number,
        dislikes: number,
        createdAt: string,
        updatedAt: string,
        creatorId: string,
        creatorNickname: string
    }
}

export interface EditCommentInputDTO {
    id: string,
    token: string | undefined,
    content: string
}

export interface EditCommentOutputDTO {
    message: string,
    content: string
}

export interface DeleteCommentInputDTO {
    id: string,
    token: string | undefined
}

export interface DeleteCommentOutputDTO {
    message: string
}

export interface LikeDislikeCommentInputDTO {
    id: string,
    token: string | undefined
    like: boolean
}

export interface LikeDislikeCommentOutputDTO {
    message: string
}

export class CommentDTO {
    public getCommentInput(
        id: unknown,
        token: unknown
    ): GetCommentInputDTO {
        if (typeof id !== "string") {
            throw new BadRequestError("'id' deve ser string")
        }

        if (typeof token !== "string") {
            throw new BadRequestError("'token' deve ser string")
        }

        const dto: GetCommentInputDTO = {
            id,
            token
        }

        return dto
    }
    
    public createCommentInput(
        id: unknown,
        token: unknown,
        content: unknown
        
    ): CreateCommentInputDTO {

        if (typeof id !== "string") {
            throw new BadRequestError("'id' deve ser string")
        }
        if (typeof token !== "string") {
            throw new BadRequestError("'token' deve ser string")
        }
        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        const dto: CreateCommentInputDTO = {
            id,
            token,
            content
        }
        return dto
    }

    public createCommentOutput(comment: Comment): CreateCommentOutputDTO {
        const dto: CreateCommentOutputDTO = {
            message: "Comentário criado com sucesso",
            comment: {
                id: comment.getId(),
                postId: comment.getPostId(),
                content: comment.getContent(),
                likes: comment.getLikes(),
                dislikes: comment.getDislikes(),
                createdAt: comment.getCreatedAt(),
                updatedAt: comment.getUpdatedAt(),
                creatorId: comment.getCreatorId(),
                creatorNickname: comment.getCreatorNickname()
            }
        }
        return dto 
    }
    
    public editCommentInput(
        id: unknown,
        token: unknown,
        content: unknown
    ): EditCommentInputDTO {
        if (typeof id !== "string") {
            throw new BadRequestError("'id' deve ser string")
        }
        
        if (typeof token !== "string") {
            throw new BadRequestError("'token' deve ser string")
        }
        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        const dto: EditCommentInputDTO = {
            id,
            token,
            content
        }
        return dto
    }

    public editCommentOutput(comment: Comment): EditCommentOutputDTO {
        const dto: EditCommentOutputDTO = {
            message: "Comentário editado com sucesso",
            content: comment.getContent()
        }
        return dto 
    }

    public deleteCommentInput(
        id: unknown,
        token: unknown
    ): DeleteCommentInputDTO {
        if (typeof id !== "string") {
            throw new BadRequestError("'id' deve ser string")
        }
        
        if (typeof token !== "string") {
            throw new BadRequestError("'token' deve ser string")
        }

        const dto: DeleteCommentInputDTO = {
            id,
            token
        }
        return dto
    }

    public deleteCommentOutput(): DeleteCommentOutputDTO {
        const dto: DeleteCommentOutputDTO = {
            message: "Comentário excluído com sucesso",
        }
        return dto 
    }

    public likeDislikeCommentInput(
        id: unknown,
        token: unknown,
        like: unknown
    ): LikeDislikeCommentInputDTO {
        if (typeof id !== "string") {
            throw new BadRequestError("'id' deve ser string")
        }
        
        if (typeof token !== "string") {
            throw new BadRequestError("'token' deve ser string")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' deve ser boolean")
        }

        const dto: LikeDislikeCommentInputDTO = {
            id,
            token,
            like
        }
        return dto
    }

    public likeDislikeCommentOutput(comment: Comment): LikeDislikeCommentOutputDTO {
        const dto: LikeDislikeCommentOutputDTO = {
            message: "Você interagiu no post"
        }
        return dto 
    }

    
}