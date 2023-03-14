import { PostBusiness } from "../../src/business/PostBusiness"
import { PostDTO } from "../../src/dtos/PostDTO"
import { PostDatabaseMock } from "../mocks/PostDatabaseMock"
import { IdGeneratorMock } from "../../tests/mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../tests/mocks/TokenManagerMock"
import { EditPostInputDTO } from "../../src/dtos/PostDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"
import { NotFoundError } from "../../src/errors/NotFoundError"

describe("editPost", () => {
    const postBusiness = new PostBusiness(
        new PostDTO(),
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("retornar erro caso o 'content' não seja preenchido", async () => {
        expect.assertions(2)
        try {
            const input: EditPostInputDTO = {
                id: "id-mock-post",
                token: "token-mock-normal",
                content: ""
            }
            await postBusiness.editPost(input)
            
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
            const input: EditPostInputDTO = {
                id: "id-mock-post",
                token: "token-mock",
                content: "Conteúdo do post"
            }
            await postBusiness.editPost(input)
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
            const input: EditPostInputDTO = {
                id: "id",
                token: "token-mock-normal",
                content: "Conteúdo do post"
            }
            await postBusiness.editPost(input)
        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.message).toBe("'id' não encontrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("garantir que o post seja editado", async () => {
        const input: EditPostInputDTO = {
            id: "id-mock-post",
            token: "token-mock-normal",
            content: "Conteúdo do post"
        }
        const response = await postBusiness.editPost(input)

        expect(response).toEqual({
            message: "Post editado com sucesso",
            content:  "Conteúdo do post"
        })
    })
})