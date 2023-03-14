import { PostBusiness } from "../../src/business/PostBusiness"
import { PostDTO } from "../../src/dtos/PostDTO"
import { PostDatabaseMock } from "../mocks/PostDatabaseMock"
import { IdGeneratorMock } from "../../tests/mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../tests/mocks/TokenManagerMock"
import { GetPostInputDTO } from "../../src/dtos/PostDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"


describe("getPosts", () => {
    const postBusiness = new PostBusiness(
        new PostDTO(),
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock()
    )

    test("deve disparar erro caso 'token' não seja válido", async () => { 
        expect.assertions(2)

        try {
            const input: GetPostInputDTO = {
                token: "token-mock"
            }
            await postBusiness.getPosts(input)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe("'token' inválido")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("retornar a lista de 'posts'", async () => {
        const input: GetPostInputDTO = {
            token: "token-mock-normal"
        }
        const response = await postBusiness.getPosts(input)
        expect(response).toEqual([
            {
                id: "id-mock",
                content: "Conteúdo do post",
                likes: 0,
                dislikes: 0,
                commentsPost: 0,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                creator:{
                    id: "id-mock",
                    nickname: "Normal Mock"
                }
            }
        ])
    })
})