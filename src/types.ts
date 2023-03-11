export enum USER_ROLE {
    ADMIN = "administrador",
    USER = "usuário"
}

export interface TokenPayload {
    id: string,
    nickname: string,
    role: USER_ROLE
}

export interface UserModel {
    id: string,
    nickname: string,
    email: string,
    password: string,
    role: USER_ROLE,
    createdAt: string
}

export interface UserDB {
    id: string,
    nickname: string,
    email: string,
    password: string,
    role: USER_ROLE,
    created_at: string
}

export interface PostModel {
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
    }
}

export interface PostDB {
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    comments_post: number,
    created_at: string,
    updated_at: string
}

export interface PostWithCreatorDB extends PostDB {
    creator_nickname: string
}

export interface PostWithCommentsDB extends PostDB {
    creator_nickname: string
    comments_id: string,
    comments_post_id: string,
    comments_content: string,
    comments_likes: number,
    comments_dislikes: number,
    comments_created_at: string,
    comments_updated_at: string,
    comments_creator_id: string,
    comments_creator_nickname: string
}

export interface LikesDislikesPostsDB {
    user_id: string,
    post_id: string,
    like: number
}

export interface CommentModel {
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
}

export interface CommentDB {
    id: string,
    creator_id: string,
    post_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string
}

export interface CommentWithCreatorDB extends CommentDB {
    creator_nickname: string
}

export interface LikesDislikesCommentsDB {
    user_id: string,
    comments_id: string,
    like: number
}

