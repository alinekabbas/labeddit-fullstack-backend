import { PostBusiness } from "../../src/business/PostBusiness"
import { PostDTO } from "../../src/dtos/PostDTO"
import { PostDatabaseMock } from "../mocks/PostDatabaseMock"
import { IdGeneratorMock } from "../../tests/mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../tests/mocks/TokenManagerMock"
import { CreatePostInputDTO } from "../../src/dtos/PostDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"

describe("createPost", () => {
    const postBusiness = new PostBusiness(
        new PostDTO(),
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("retornar erro caso o 'content' não seja preenchido", async () => {
        expect.assertions(2)
        try {
            const input: CreatePostInputDTO = {
                token: "token-mock-normal",
                content: ""
            }
            await postBusiness.createPost(input)
            
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
            const input: CreatePostInputDTO = {
                token: "token-mock",
                content: "Conteúdo do post"
            }
            await postBusiness.createPost(input)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'token' inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("garantir que o post seja criado", async () => {
        const input: CreatePostInputDTO = {
            token: "token-mock-normal",
            content: "Conteúdo do post"
        }
        const response = await postBusiness.createPost(input)

        expect(response).toEqual({
            message: "Post criado com sucesso",
            post: {
                id: "id-mock",
                content: "Conteúdo do post",
                likes: 0,
                dislikes: 0,
                commentsPost: 0,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                creatorId: "id-mock",
                creatorNickname: "Normal Mock"
            }
        })
    })
})

