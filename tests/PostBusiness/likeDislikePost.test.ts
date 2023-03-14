import { PostBusiness } from "../../src/business/PostBusiness"
import { PostDTO } from "../../src/dtos/PostDTO"
import { PostDatabaseMock } from "../mocks/PostDatabaseMock"
import { IdGeneratorMock } from "../../tests/mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../tests/mocks/TokenManagerMock"
import { LikeDislikePostInputDTO } from "../../src/dtos/PostDTO"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { BadRequestError } from "../../src/errors/BadRequestError"

describe("likeDislikePost", () => {
    const postBusiness = new PostBusiness(
        new PostDTO(),
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("deve disparar erro caso 'token' não seja válido", async () => { 
        expect.assertions(2)

        try {
            const input: LikeDislikePostInputDTO = {
                id: "id-mock-post",
                token: "token-mock",
                like: true
            }
            await postBusiness.likeDislikePost(input)
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
            const input: LikeDislikePostInputDTO = {
                id: "id",
                token: "token-mock-normal",
                like: true
            }
            await postBusiness.likeDislikePost(input)
        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.message).toBe("'id' não encontrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("garantir que o post receba 'like' ou 'dislike'", async () => {
        const input: LikeDislikePostInputDTO = {
            id: "id-mock-post",
            token: "token-mock-admin",
            like: true
        }

        const response = await postBusiness.likeDislikePost(input)

        expect(response).toEqual({
            message: "Você interagiu no post"
        })
    })
})