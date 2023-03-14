import { PostBusiness } from "../../src/business/PostBusiness"
import { PostDTO } from "../../src/dtos/PostDTO"
import { PostDatabaseMock } from "../mocks/PostDatabaseMock"
import { IdGeneratorMock } from "../../tests/mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../tests/mocks/TokenManagerMock"
import { DeletePostInputDTO } from "../../src/dtos/PostDTO"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { BadRequestError } from "../../src/errors/BadRequestError"

describe("deletePost", () => {
    const postBusiness = new PostBusiness(
        new PostDTO(),
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("deve disparar erro caso 'token' não seja válido", async () => { 
        expect.assertions(2)

        try {
            const input: DeletePostInputDTO = {
                id: "id-mock-post",
                token: "token-mock"
            }
            await postBusiness.deletePost(input)
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
            const input: DeletePostInputDTO = {
                id: "id",
                token: "token-mock-normal"
            }
            await postBusiness.deletePost(input)
        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.message).toBe("'id' não encontrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("garantir que o post seja deletado", async () => {
        const input: DeletePostInputDTO = {
            id: "id-mock-post",
            token: "token-mock-normal"
        }
        const response = await postBusiness.deletePost(input)

        expect(response).toEqual({
            message: "Post excluído com sucesso"
        })
    })

})