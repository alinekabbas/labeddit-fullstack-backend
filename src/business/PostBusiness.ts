import { PostDatabase } from "../database/PostDatabase";
import {
CreatePostInputDTO,
DeletePostInputDTO,
EditPostInputDTO,
GetPostInputDTO,
GetPostOuputDTO,
GetPostWithCommentsInputDTO,
LikeDislikePostInputDTO,
PostDTO
}
from "../dtos/PostDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Comment } from "../models/Comment";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { LikesDislikesPostsDB, PostWithCreatorDB, USER_ROLE } from "../types";

export class PostBusiness {
    constructor(
        private postDTO: PostDTO,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public getPosts = async (input: GetPostInputDTO) => {
        const { token } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const postsDB: PostWithCreatorDB[] = await this.postDatabase.getPosts()


        const posts = postsDB.map((postDB) => {
            const post = new Post(
                postDB.id,
                postDB.content,
                postDB.likes,
                postDB.dislikes,
                postDB.comments_post,
                postDB.created_at,
                postDB.updated_at,
                postDB.creator_id,
                postDB.creator_nickname
            )
            return post.toBusinessModel()
        })

        const output: GetPostOuputDTO = posts

        return output

    }

    public getPostWithComments = async (input: GetPostWithCommentsInputDTO) => {
        const { id, token } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const postDB = await this.postDatabase.getPostsWithComments(id)

        if (!postDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.comments_post,
            postDB.created_at,
            postDB.updated_at,
            postDB.creator_id,
            postDB.creator_nickname
        )

        const commentsPost = await this.postDatabase.findComments(id)

        if (!commentsPost) {
            throw new NotFoundError("'id' não encontrado")
        }

        const comments = new Comment(
            commentsPost.id,
            commentsPost.post_id,
            commentsPost.content,
            commentsPost.likes,
            commentsPost.dislikes,
            commentsPost.created_at,
            commentsPost.updated_at,
            commentsPost.creator_id,
            commentsPost.creator_nickname
        )

        const output = this.postDTO.getPostWithCommentsOutput(post, comments)

        return output
    }

    public createPost = async (input: CreatePostInputDTO) => {
        const { token, content } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        if (content.length <= 0) {
            throw new BadRequestError("'content' não pode ser zero ou negativo")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const id = this.idGenerator.generate()
        const creatorId = tokenPayload.id
        const creatorName = tokenPayload.nickname

        const newPost = new Post(
            id,
            content,
            0,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            creatorId,
            creatorName
        )

        const newPostDB = newPost.toDBModel()

        await this.postDatabase.insertPost(newPostDB)



        const output = this.postDTO.createPostOutput(newPost)

        return output
    }

    public editPost = async (input: EditPostInputDTO) => {
        const { id, token, content } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        if (content.length <= 0) {
            throw new BadRequestError("'content' não pode ser zero ou negativo")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const postToEditDB = await this.postDatabase.findPost(id)

        if (!postToEditDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = tokenPayload.id

        if (postToEditDB.creator_id !== creatorId) {
            throw new BadRequestError("usuário não autorizado a editar este post")
        }

        const creatorName = tokenPayload.nickname

        const postToEdit = new Post(
            postToEditDB.id,
            postToEditDB.content,
            postToEditDB.likes,
            postToEditDB.dislikes,
            postToEditDB.comments_post,
            postToEditDB.created_at,
            postToEditDB.updated_at,
            creatorId,
            creatorName
        )

        postToEdit.setContent(content)
        postToEdit.setUpdatedAt(new Date().toISOString())

        const updatedPostDB = postToEdit.toDBModel()

        await this.postDatabase.updatePost(updatedPostDB)

        const output = this.postDTO.editPostOutput(postToEdit)

        return output

    }

    public deletePost = async (input: DeletePostInputDTO) => {
        const { id, token } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const postToDeleteDB = await this.postDatabase.findPost(id)

        if (!postToDeleteDB) {
            throw new NotFoundError("'id' não encontrada")
        }

        const creatorId = tokenPayload.id

        if (
            tokenPayload.role !== USER_ROLE.ADMIN &&
            postToDeleteDB.creator_id !== creatorId
        ) {
            throw new BadRequestError("usuário não autorizado a deletar este post")
        }

        await this.postDatabase.deletePost(id)

        const output = this.postDTO.deletePostOutput()

        return output

    }

    public likeDislikePost = async (input: LikeDislikePostInputDTO) => {
        const { id, token, like } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const likeDislikePostDB = await this.postDatabase.findPostWithCreatorId(id)

        if (!likeDislikePostDB) {
            throw new NotFoundError("'id' não encontrada")
        }

        const userId = tokenPayload.id
        const likeDB = like ? 1 : 0

        if (likeDislikePostDB.creator_id === userId) {
            throw new BadRequestError("Quem criou o post não pode dar 'like' ou 'dislike' no mesmo")
        }

        const likeDislikeDB: LikesDislikesPostsDB = {
            user_id: userId,
            post_id: likeDislikePostDB.id,
            like: likeDB
        }

        const post = new Post(
            likeDislikePostDB.id,
            likeDislikePostDB.content,
            likeDislikePostDB.likes,
            likeDislikePostDB.dislikes,
            likeDislikePostDB.comments_post,
            likeDislikePostDB.created_at,
            likeDislikePostDB.updated_at,
            likeDislikePostDB.creator_id,
            likeDislikePostDB.creator_nickname
        )

        const likeDislikeExists = await this.postDatabase.findLikeDislike(likeDislikeDB)

        if (likeDislikeExists === "already liked") {
            if (like) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeLike()
            } else {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeLike()
                post.addDislike()
            }
        } else if (likeDislikeExists === "already disliked") {
            if (like) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeDislike()
                post.addLike()
            } else {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeDislike()
            }
        } else {
            await this.postDatabase.likeOrDislikePost(likeDislikeDB)

            like ? post.addLike() : post.addDislike()

        }

        const updatedPostDB = post.toDBModel()
        await this.postDatabase.updatePost(updatedPostDB)

        const output = this.postDTO.likeDislikePostOutput(post)

        return output

    }
}