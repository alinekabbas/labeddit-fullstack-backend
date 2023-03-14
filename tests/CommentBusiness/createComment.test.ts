import { CommentBusiness } from "../../src/business/CommentBusiness"
import { CommentDTO, CreateCommentInputDTO } from "../../src/dtos/CommentDTO"
import { CommentDatabaseMock } from "../mocks/CommentDatabaseMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { NotFoundError } from "../../src/errors/NotFoundError"

describe("createComment", () => {
    const commentBusiness = new CommentBusiness(
        new CommentDTO(),
        new CommentDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("retornar erro caso o 'content' não seja preenchido", async () => {
        expect.assertions(2)
        try {
            const input: CreateCommentInputDTO = {
                id: "id-mock-post",
                token: "token-mock-normal",
                content: ""
            }
            await commentBusiness.createComment(input)
            
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'content' não pode ser zero ou negativo")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar erro caso 'token' não seja válido", async () => { 
        expect.assertions(2)

        try {
            const input: CreateCommentInputDTO = {
                id: "id-mock-post",
                token: "token-mock",
                content: "Conteúdo do comentário"
            }
            await commentBusiness.createComment(input)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'token' inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar erro caso 'postId' não seja encontrado", async () => { 
        expect.assertions(2)
        try {
            const input: CreateCommentInputDTO = {
                id: "id",
                token: "token-mock-normal",
                content: "Conteúdo do comentário"
            }
            await commentBusiness.createComment(input)
        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.message).toBe("'post' não encontrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("garantir que o comentário seja criado", async () => {
        const input: CreateCommentInputDTO = {
            id: "id-mock-post",
            token: "token-mock-normal",
            content: "Conteúdo do comentário"
        }
        const response = await commentBusiness.createComment(input)

        expect(response).toEqual({
            message: "Comentário criado com sucesso",
            comment: {
                id: "id-mock",
                postId: "id-mock-post",
                content: "Conteúdo do comentário",
                likes: 0,
                dislikes: 0,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                creatorId: "id-mock",
                creatorNickname: "Normal Mock"
            }
        })
    })
})

