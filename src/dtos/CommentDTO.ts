import { BadRequestError } from "../errors/BadRequestError"
import { Post } from "../models/Post"
import { PostModel } from "../types"

export interface CreateCommentInputDTO {
    token: string | undefined,
    content: string
}

export interface CreateCommentOutputDTO {
    message: string,
    content: string
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
    content: string,
    like: number,
    dislike: number
}

export class PostDTO {
    
    public createPostInput(
        token: unknown,
        content: unknown
    ): CreateCommentInputDTO {
        
        if (typeof token !== "string") {
            throw new BadRequestError("'token' deve ser string")
        }
        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        const dto: CreateCommentInputDTO = {
            token,
            content
        }
        return dto
    }

    public createPostOutput(post: Post): CreateCommentOutputDTO {
        const dto: CreateCommentOutputDTO = {
            message: "Post criado com sucesso",
            content: post.getContent()
        }
        return dto 
    }
    
    public editPostInput(
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

    public editPostOutput(post: Post): EditCommentOutputDTO {
        const dto: EditCommentOutputDTO = {
            message: "Post editado com sucesso",
            content: post.getContent()
        }
        return dto 
    }

    public deletePostInput(
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

    public deletePostOutput(): DeleteCommentOutputDTO {
        const dto: DeleteCommentOutputDTO = {
            message: "Post excluído com sucesso",
        }
        return dto 
    }

    public likeDislikePostInput(
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

    public likeDislikePostOutput(post: Post): LikeDislikeCommentOutputDTO {
        const dto: LikeDislikeCommentOutputDTO = {
            content: post.getContent(),
            like: post.getLikes(),
            dislike: post.getDislikes()
        }
        return dto 
    }

    
}