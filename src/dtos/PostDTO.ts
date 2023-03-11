import { BadRequestError } from "../errors/BadRequestError"
import { Comment } from "../models/Comment"
import { Post } from "../models/Post"
import { PostModel } from "../types"

export interface GetPostInputDTO {
    token: string | undefined
}

export type GetPostOuputDTO = PostModel[]

export interface GetPostWithCommentsInputDTO {
    id: string,
    token: string | undefined
}

export type GetPostWithCommentsOuputDTO = {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    commentsPost: number,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        nickname: string
    },
    comments: [{
        id: string,
        postId: string,
        content: string,
        likes: number,
        dislikes: number,
        createdAt: string,
        updatedAt: string,
        creator: {
            id: string,
            nickname: string
        }
    }]

}

export interface CreatePostInputDTO {
    token: string | undefined,
    content: string
}

export interface CreatePostOutputDTO {
    message: string,
    post: Post
}

export interface EditPostInputDTO {
    id: string,
    token: string | undefined,
    content: string
}

export interface EditPostOutputDTO {
    message: string,
    content: string
}

export interface DeletePostInputDTO {
    id: string,
    token: string | undefined
}

export interface DeletePostOutputDTO {
    message: string
}

export interface LikeDislikePostInputDTO {
    id: string,
    token: string | undefined
    like: boolean
}

export interface LikeDislikePostOutputDTO {
    content: string,
    like: number,
    dislike: number
}

export class PostDTO {
    public getPostInput(
        token: unknown
    ): GetPostInputDTO {

        if (typeof token !== "string") {
            throw new BadRequestError("'token' deve ser string")
        }

        const dto: GetPostInputDTO = {
            token
        }

        return dto
    }

    public getPostWithCommentsInput(
        id: unknown,
        token: undefined
    ): GetPostWithCommentsInputDTO {
        if (typeof id !== "string") {
            throw new BadRequestError("'id' deve ser string")
        }

        if (typeof token !== "string") {
            throw new BadRequestError("'token' deve ser string")
        }

        const dto: GetPostWithCommentsInputDTO = {
            id,
            token
        }

        return dto
    }

    public getPostWithCommentsOutput(post: Post, comment: Comment): GetPostWithCommentsOuputDTO {
        const dto: GetPostWithCommentsOuputDTO = {
            id: post.getId(),
            content: post.getContent(),
            likes: post.getLikes(),
            dislikes: post.getDislikes(),
            commentsPost: post.getCommentsPost(),
            createdAt: post.getCreatedAt(),
            updatedAt: post.getUpdatedAt(),
            creator: {
                id: post.getCreatorId(),
                nickname: post.getCreatorNickname()
            },
            comments: [{
                id: comment.getId(),
                postId: comment.getPostId(),
                content: comment.getContent(),
                likes: comment.getLikes(),
                dislikes: comment.getDislikes(),
                createdAt: comment.getCreatedAt(),
                updatedAt: comment.getUpdatedAt(),
                creator: {
                    id: comment.getCreatorId(),
                    nickname: comment.getCreatorNickname()
                }
            }]
        }
        return dto
    }

    public createPostInput(
        token: unknown,
        content: unknown
    ): CreatePostInputDTO {

        if (typeof token !== "string") {
            throw new BadRequestError("'token' deve ser string")
        }
        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        const dto: CreatePostInputDTO = {
            token,
            content
        }
        return dto
    }

    public createPostOutput(post: Post): CreatePostOutputDTO {
        const dto: CreatePostOutputDTO = {
            message: "Post criado com sucesso",
            post: post
        }
        return dto
    }

    public editPostInput(
        id: unknown,
        token: unknown,
        content: unknown
    ): EditPostInputDTO {
        if (typeof id !== "string") {
            throw new BadRequestError("'id' deve ser string")
        }

        if (typeof token !== "string") {
            throw new BadRequestError("'token' deve ser string")
        }
        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        const dto: EditPostInputDTO = {
            id,
            token,
            content
        }
        return dto
    }

    public editPostOutput(post: Post): EditPostOutputDTO {
        const dto: EditPostOutputDTO = {
            message: "Post editado com sucesso",
            content: post.getContent()
        }
        return dto
    }

    public deletePostInput(
        id: unknown,
        token: unknown
    ): DeletePostInputDTO {
        if (typeof id !== "string") {
            throw new BadRequestError("'id' deve ser string")
        }

        if (typeof token !== "string") {
            throw new BadRequestError("'token' deve ser string")
        }

        const dto: DeletePostInputDTO = {
            id,
            token
        }
        return dto
    }

    public deletePostOutput(): DeletePostOutputDTO {
        const dto: DeletePostOutputDTO = {
            message: "Post excluído com sucesso",
        }
        return dto
    }

    public likeDislikePostInput(
        id: unknown,
        token: unknown,
        like: unknown
    ): LikeDislikePostInputDTO {
        if (typeof id !== "string") {
            throw new BadRequestError("'id' deve ser string")
        }

        if (typeof token !== "string") {
            throw new BadRequestError("'token' deve ser string")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' deve ser boolean")
        }

        const dto: LikeDislikePostInputDTO = {
            id,
            token,
            like
        }
        return dto
    }

    public likeDislikePostOutput(post: Post): LikeDislikePostOutputDTO {
        const dto: LikeDislikePostOutputDTO = {
            content: post.getContent(),
            like: post.getLikes(),
            dislike: post.getDislikes()
        }
        return dto
    }


}