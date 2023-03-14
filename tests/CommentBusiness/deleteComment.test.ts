import { CommentBusiness } from "../../src/business/CommentBusiness"
import { CommentDTO, DeleteCommentInputDTO } from "../../src/dtos/CommentDTO"
import { CommentDatabaseMock } from "../mocks/CommentDatabaseMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { BadRequestError } from "../../src/errors/BadRequestError"

describe("deleteComment", () => {
    const commentBusiness = new CommentBusiness(
        new CommentDTO(),
        new CommentDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("deve disparar erro caso 'token' não seja válido", async () => { 
        expect.assertions(2)

        try {
            const input: DeleteCommentInputDTO = {
                id: "id-mock-post",
                token: "token-mock"
            }
            await commentBusiness.deleteComment(input)
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
            const input: DeleteCommentInputDTO = {
                id: "id",
                token: "token-mock-normal"
            }
            await commentBusiness.deleteComment(input)
        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.message).toBe("'id' não encontrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("garantir que o comentário seja deletado", async () => {
        const input: DeleteCommentInputDTO = {
            id: "id-mock-comment",
            token: "token-mock-normal"
        }
        const response = await commentBusiness.deleteComment(input)

        expect(response).toEqual({
            message: "Comentário excluído com sucesso"
        })
    })

})