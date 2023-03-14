import { TokenPayload, USER_ROLE } from "../../src/types"

export class TokenManagerMock {

    public createToken = (payload: TokenPayload): string => {
        if (payload.role == USER_ROLE.USER) {
            return "token-mock-normal"
        } else {
            return "token-mock-admin"
        }
    }

    public getPayload = (token: string): TokenPayload | null => {
        if (token == "token-mock-normal") {
            return {
                id: "id-mock",
                nickname: "Normal Mock",
                role: USER_ROLE.USER
            }

        } else if (token == "token-mock-admin") {
            return {
                id: "id-mock",
                nickname: "Admin Mock",
                role: USER_ROLE.ADMIN
            }

        } else {
            return null
        }
    }
}