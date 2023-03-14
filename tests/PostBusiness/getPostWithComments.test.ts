import { PostBusiness } from "../../src/business/PostBusiness"
import { PostDTO } from "../../src/dtos/PostDTO"
import { PostDatabaseMock } from "../mocks/PostDatabaseMock"
import { IdGeneratorMock } from "../../tests/mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../tests/mocks/TokenManagerMock"
import { GetPostWithCommentsInputDTO } from "../../src/dtos/PostDTO"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { BadRequestError } from "../../src/errors/BadRequestError"

describe("getPostWithComments", () => {
    const postBusiness = new PostBusiness(
        new PostDTO(),
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("deve disparar erro caso 'token' não seja válido", async () => { 
        expect.assertions(2)

        try {
            const input: GetPostWithCommentsInputDTO = {
                id: "id-mock-post",
                token: "token-mock"
            }
            await postBusiness.getPostWithComments(input)
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
            const input: GetPostWithCommentsInputDTO = {
                id: "id",
                token: "token-mock-normal"
            }
            await postBusiness.getPostWithComments(input)
        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.message).toBe("'id' não encontrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    test("retornar um post específico com os comentários", async () => {
        const input: GetPostWithCommentsInputDTO = {
            id: "id-mock-post",
            token: "token-mock-normal"
        }

        const response = await postBusiness.getPostWithComments(input)
        expect(response).toEqual({
            id: "id-mock-post",
            content: "Conteúdo do post",
            likes: 0,
            dislikes: 0,
            commentsPost: 0,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            creator: {
                id: "id-mock",
                nickname: "Normal Mock"
            },
            comments: [{
                id: "id-mock-comments",
                postId: "id-mock-post",
                content: "Conteúdo do comentário",
                likes: 0,
                dislikes: 0,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                creator: {
                    id: "id-mock",
                nickname: "Normal Mock"
                }
            }]
        })
    })
})

