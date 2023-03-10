import { CommentDB, CommentWithCreatorDB, LikesDislikesCommentsDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class CommentDatabase extends BaseDatabase{
    public static TABLE_COMMENTS = "comments"
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comments"
    
    public async insertComment(newCommentDB: CommentDB) {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .insert(newCommentDB)  
    }

    public async findPost(id: string) {
        const [commentDB]: CommentDB[] | undefined = await BaseDatabase
            .connection(CommentDatabase.TABLE_POSTS)
            .where({ id: id })
        return commentDB
    }
    
    public async updateCommentsInPosts(id:string){
        await BaseDatabase
            .connection(CommentDatabase.TABLE_POSTS)
            .where({id: id})
    }

    public async updateComment(commentDB: CommentDB) {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .update(commentDB)
            .where({ id: commentDB.id })
    }

    public async deleteComment(id: string) {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
            .delete()
            .where({ comments_id: id })

        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .delete()
            .where({ id: id })
    }

    public async findCommentWithCreatorId(id: string) {
        const result: CommentWithCreatorDB[] | undefined = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .select(
                "comments.id",
                "comments.post_id",
                "comments.content",
                "comments.likes",
                "comments.dislikes",
                "comments.created_at",
                "comments.updated_at",
                "comments.creator_id",
                "users.nickname AS creator_nickname"
            )
            .join("users", "comments.creator_id", "=", "users.id")
            .where("comments.id", id)

        return result[0]
    }

    public async likeOrDislikeComment(likeDislike: LikesDislikesCommentsDB) {
        await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
            .insert(likeDislike)
    }

    public async findLikeDislike(likeDislike: LikesDislikesCommentsDB) {
        const [likeDislikeDB]: LikesDislikesCommentsDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
            .select()
            .where({
                user_id: likeDislike.user_id,
                comments_id: likeDislike.comments_id
            })
        if(likeDislikeDB){
            return likeDislikeDB.like === 1 ? "already liked" : "already disliked"
        } else {
            return null
        }
    }

    public async removeLikeDislike (likeDislike: LikesDislikesCommentsDB) {
        await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
            .delete()
            .where({
                user_id: likeDislike.user_id,
                comments_id: likeDislike.comments_id
            })
    }

    public async updateLikeDislike (likeDislike: LikesDislikesCommentsDB){
        await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
            .update(likeDislike)
            .where({
                user_id: likeDislike.user_id,
                comments_id: likeDislike.comments_id
            })
    }
}