import { UserBusiness } from "../../src/business/UserBusiness"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { LoginUserInputDTO, UserDTO } from "../../src/dtos/UserDTO"
import { NotFoundError } from "../../src/errors/NotFoundError"
import { BadRequestError } from "../../src/errors/BadRequestError"

describe("login", () => {
    const userBusiness = new UserBusiness(
        new UserDTO(),
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("login em conta de usuário retornando token", async () => {
        const input: LoginUserInputDTO = {
            email: "normal@email.com",
            password: "Senha@teste1"
        }

        const response = await userBusiness.loginUser(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test("login em conta admin retornando token", async () => {
        const input: LoginUserInputDTO = {
            email: "admin@email.com",
            password: "Senha@teste1"
        }

        const response = await userBusiness.loginUser(input)
        expect(response.token).toBe("token-mock-admin")
    })

    test("retornar erro caso 'email' não esteja no padrão determinado", async () => {
        expect.assertions(2)
        try {
            const input: LoginUserInputDTO = {
                email: "example",
                password: "Senha@teste1"
            }
            await userBusiness.loginUser(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("O email deve ter o formato 'exemplo@exemplo.com'.")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("retornar erro caso 'password' não esteja no padrão determinado", async () => {
        expect.assertions(2)
        try {
            const input: LoginUserInputDTO = {
                email: "admin@email.com",
                password: "senha"
            }
            await userBusiness.loginUser(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("retornar erro caso 'email' não seja encontrado", async () => {
        expect.assertions(2)
        try {
            const input: LoginUserInputDTO = {
                email: "email@email.com",
                password: "Senha@teste1"
            }

            await userBusiness.loginUser(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.message).toBe("'email' incorreto ou não cadastrado")
                expect(error.statusCode).toBe(404)
            }
        }
    })

    

})