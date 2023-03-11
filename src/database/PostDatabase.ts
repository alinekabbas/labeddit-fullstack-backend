import { CommentWithCreatorDB, LikesDislikesPostsDB, PostDB, PostWithCreatorDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes_posts"
    public static TABLE_COMMENTS = "comments"

    public async getPosts() {
        const result: PostWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                "posts.id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.comments_post",
                "posts.created_at",
                "posts.updated_at",
                "posts.creator_id",
                "users.nickname AS creator_nickname"
            )
            .join("users", "posts.creator_id", "=", "users.id")
        return result
    }

    public async insertPost(newPostDB: PostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert(newPostDB)
    }

    public async getPostsWithComments(id: string) {
        const [posts]: PostWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                "posts.id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.comments_post",
                "posts.created_at",
                "posts.updated_at",
                "posts.creator_id",
                "users.nickname AS creator_nickname"
            )
            .join("users", "posts.creator_id", "=", "users.id")
            .where({ "posts.id": id })
        return posts
    }

    public async findComments(id: string) {
        const [comments]: CommentWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_COMMENTS)
            .select(
                "comments.id ",
                "comments.post_id ",
                "comments.content ",
                "comments.likes",
                "comments.dislikes ",
                "comments.created_at ",
                "comments.updated_at ",
                "comments.creator_id",
                "users.nickname AS creator_nickname"
            )
            .join("users", "comments.creator_id", "=", "users.id")
            .where({ "comments.post_id": id })

        return comments

    }

    public async findPost(id: string) {
        const [postDB]: PostDB[] | undefined = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .where({ id })

        return postDB
    }

    public async updatePost(postDB: PostDB) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .update(postDB)
            .where({ id: postDB.id })
    }

    public async deletePost(id: string) {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .delete()
            .where({ post_id: id })

        await BaseDatabase
            .connection(PostDatabase.TABLE_COMMENTS)
            .delete()
            .where({ post_id: id })

        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .delete()
            .where({ id: id })
    }

    public async findPostWithCreatorId(id: string) {
        const result: PostWithCreatorDB[] | undefined = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                "posts.id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.comments_post",
                "posts.created_at",
                "posts.updated_at",
                "posts.creator_id",
                "users.nickname AS creator_nickname"
            )
            .join("users", "posts.creator_id", "=", "users.id")
            .where("posts.id", id)

        return result[0]
    }

    public async likeOrDislikePost(likeDislike: LikesDislikesPostsDB) {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .insert(likeDislike)
    }

    public async findLikeDislike(likeDislike: LikesDislikesPostsDB) {
        const [likeDislikeDB]: LikesDislikesPostsDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .select()
            .where({
                user_id: likeDislike.user_id,
                post_id: likeDislike.post_id
            })
        if (likeDislikeDB) {
            return likeDislikeDB.like === 1 ? "already liked" : "already disliked"
        } else {
            return null
        }
    }

    public async removeLikeDislike(likeDislike: LikesDislikesPostsDB) {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .delete()
            .where({
                user_id: likeDislike.user_id,
                post_id: likeDislike.post_id
            })
    }

    public async updateLikeDislike(likeDislike: LikesDislikesPostsDB) {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .update(likeDislike)
            .where({
                user_id: likeDislike.user_id,
                post_id: likeDislike.post_id
            })
    }

}