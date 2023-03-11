import { CommentDatabase } from "../database/CommentDatabase"
import { CommentDTO, CreateCommentInputDTO, DeleteCommentInputDTO, EditCommentInputDTO, LikeDislikeCommentInputDTO } from "../dtos/CommentDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Comment } from "../models/Comment"
import { Post } from "../models/Post"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { LikesDislikesCommentsDB, USER_ROLE } from "../types"

export class CommentBusiness {
    constructor(
        private commentDTO: CommentDTO,
        private commentDatabase: CommentDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public createComment = async (input: CreateCommentInputDTO) => {
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

        const post = await this.commentDatabase.findPost(id)

        if (!post) {
            throw new NotFoundError("'post' não encontrado")
        }

        const commentId = this.idGenerator.generate()
        const creatorId = tokenPayload.id
        const creatorName = tokenPayload.nickname

        const newComment = new Comment(
            commentId,
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            creatorId,
            creatorName
        )

        const newCommentDB = newComment.toCommentDBModel()

        await this.commentDatabase.insertComment(newCommentDB)
        
        const updateCommentCount = new Post(
            post.id,
            post.content,
            post.likes,
            post.dislikes,
            post.comments_post,
            post.created_at,
            post.updated_at,
            post.creator_id,
            post.creator_nickname
        )
        
        updateCommentCount.addCommentsPosts()

        await this.commentDatabase.updateCommentsInPosts(id)

        updateCommentCount.toBusinessModel()
        
        const output = this.commentDTO.createCommentOutput(newComment)

        return output
    }

    public editComment = async (input: EditCommentInputDTO) => {
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

        const commentToEditDB = await this.commentDatabase.findComment(id)

        if (!commentToEditDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = tokenPayload.id

        if (commentToEditDB.creator_id !== creatorId) {
            throw new BadRequestError("usuário não autorizado a editar este comentário")
        }

        const creatorName = tokenPayload.nickname

        const commentToEdit = new Comment(
            commentToEditDB.id,
            commentToEditDB.post_id,
            commentToEditDB.content,
            commentToEditDB.likes,
            commentToEditDB.dislikes,
            commentToEditDB.created_at,
            commentToEditDB.updated_at,
            creatorId,
            creatorName
        )

        commentToEdit.setContent(content)
        commentToEdit.setUpdatedAt(new Date().toISOString())

        const updatedCommentDB = commentToEdit.toCommentDBModel()

        await this.commentDatabase.updateComment(updatedCommentDB)

        const output = this.commentDTO.editCommentOutput(commentToEdit)

        return output

    }

    public deleteComment = async (input: DeleteCommentInputDTO) => {
        const { id, token } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const commentToDeleteDB = await this.commentDatabase.findComment(id)

        if (!commentToDeleteDB) {
            throw new NotFoundError("'id' não encontrada")
        }

        const creatorId = tokenPayload.id

        if (
            tokenPayload.role !== USER_ROLE.ADMIN &&
            commentToDeleteDB.creator_id !== creatorId
        ) {
            throw new BadRequestError("usuário não autorizado a deletar este post")
        }

        await this.commentDatabase.deleteComment(id)

        const output = this.commentDTO.deleteCommentOutput()

        return output
    }

    public likeDislikeComment = async (input: LikeDislikeCommentInputDTO) => {
        const { id, token, like } = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        const tokenPayload = this.tokenManager.getPayload(token)

        if (tokenPayload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const likeDislikeCommentDB = await this.commentDatabase.findCommentWithCreatorId(id)

        if (!likeDislikeCommentDB) {
            throw new NotFoundError("'id' não encontrada")
        }

        const userId = tokenPayload.id
        const likeDB = like ? 1 : 0

        if (likeDislikeCommentDB.creator_id === userId) {
            throw new BadRequestError("Quem criou o post não pode dar 'like' ou 'dislike' no mesmo")
        }

        const likeDislikeDB: LikesDislikesCommentsDB = {
            user_id: userId,
            comments_id: likeDislikeCommentDB.id,
            like: likeDB
        }

        const comment = new Comment(
            likeDislikeCommentDB.id,
            likeDislikeCommentDB.post_id,
            likeDislikeCommentDB.content,
            likeDislikeCommentDB.likes,
            likeDislikeCommentDB.dislikes,
            likeDislikeCommentDB.created_at,
            likeDislikeCommentDB.updated_at,
            likeDislikeCommentDB.creator_id,
            likeDislikeCommentDB.creator_nickname
        )

        const likeDislikeExists = await this.commentDatabase.findLikeDislike(likeDislikeDB)

        if (likeDislikeExists === "already liked") {
            if (like) {
                await this.commentDatabase.removeLikeDislike(likeDislikeDB)
                comment.removeLike()
            } else {
                await this.commentDatabase.updateLikeDislike(likeDislikeDB)
                comment.removeLike()
                comment.addDislike()
            }
        } else if (likeDislikeExists === "already disliked") {
            if (like) {
                await this.commentDatabase.removeLikeDislike(likeDislikeDB)
                comment.removeDislike()
                comment.addLike()
            } else {
                await this.commentDatabase.updateLikeDislike(likeDislikeDB)
                comment.removeDislike()
            }
        } else {
            await this.commentDatabase.likeOrDislikeComment(likeDislikeDB)

            like ? comment.addLike() : comment.addDislike()

        }

        const updatedPostDB = comment.toCommentDBModel()
        await this.commentDatabase.updateComment(updatedPostDB)

        const output = this.commentDTO.likeDislikeCommentOutput(comment)

        return output
    }
}