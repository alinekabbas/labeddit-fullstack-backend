import { CommentBusiness } from "../../src/business/CommentBusiness"
import { CommentDTO, EditCommentInputDTO } from "../../src/dtos/CommentDTO"
import { CommentDatabaseMock } from "../mocks/CommentDatabaseMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { NotFoundError } from "../../src/errors/NotFoundError"

describe("editComment", () => {
    const commentBusiness = new CommentBusiness(
        new CommentDTO(),
        new CommentDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("retornar erro caso o 'content' não seja preenchido", async () => {
        expect.assertions(2)
        try {
            const input: EditCommentInputDTO = {
                id: "id-mock-comment",
                token: "token-mock-normal",
                content: ""
            }
            await commentBusiness.editComment(input)
            
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
            const input: EditCommentInputDTO = {
                id: "id-mock-comment",
                token: "token-mock",
                content: "Conteúdo do comentário"
            }
            await commentBusiness.editComment(input)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'token' inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("deve disparar erro caso 'id' não seja encontrado", async () => { 
        expect.assertions(2)
        try {
            const input: EditCommentInputDTO = {
                id: "id",
                token: "token-mock-normal",
                content: "Conteúdo do comentário"
            }
            await commentBusiness.editComment(input)
        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.message).toBe("'id' não encontrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("garantir que o comentário seja editado", async () => {
        const input: EditCommentInputDTO = {
            id: "id-mock-comment",
            token: "token-mock-normal",
            content: "Conteúdo do comentário"
        }
        const response = await commentBusiness.editComment(input)

        expect(response).toEqual({
            message: "Comentário editado com sucesso",
            content:  "Conteúdo do comentário"
        })
    })
})