import { UserBusiness } from "../../src/business/UserBusiness"
import { UserDatabaseMock } from "../mocks/UserDatabaseMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { HashManagerMock } from "../mocks/HashManagerMock"
import { SignupUsersInputDTO, UserDTO } from "../../src/dtos/UserDTO"
import { BadRequestError } from "../../src/errors/BadRequestError"

describe("signup", () => {
    const userBusiness = new UserBusiness(
        new UserDTO(),
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("cadastro realizado com sucesso retornando token", async () => {
        const input: SignupUsersInputDTO = {
            nickname: "Example Mock",
            email: "example@email.com",
            password: "Senha@teste1"
        }

        const response = await userBusiness.signupUsers(input)
        expect(response.token).toBe("token-mock-normal")
    })

    test('retornar erro caso o email fornecido já tenha sido cadastrado', async() => {
        expect.assertions(2)
        try {
            const input: SignupUsersInputDTO = {
                nickname: "Example Mock",
                email: "normal@email.com",
                password: "Senha@teste1"
            }
            await userBusiness.signupUsers(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'email' já cadastrado")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("retornar erro caso 'password' não esteja no padrão determinado", async () => {
        expect.assertions(2)
        try {
            const input: SignupUsersInputDTO = {
                nickname: "Example Mock",
                email: "example@email.com",
                password: "Senha"
            }
            await userBusiness.signupUsers(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
                expect(error.statusCode).toBe(400)
            }
        }
    })

    test("retornar erro caso 'email' não esteja no padrão determinado", async () => {
        expect.assertions(2)
        try {
            const input: SignupUsersInputDTO = {
                nickname: "Example Mock",
                email: "example",
                password: "Senha@teste1"
            }
            await userBusiness.signupUsers(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe("O email deve ter o formato 'exemplo@exemplo.com'.")
                expect(error.statusCode).toBe(400)
            }
        }
    })

})