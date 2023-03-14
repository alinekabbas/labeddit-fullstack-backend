import { BaseDatabase } from "../../src/database/BaseDatabase"
import { UserDB, USER_ROLE } from "../../src/types"


export class UserDatabaseMock extends BaseDatabase {
    public static TABLE_USERS = "users"


    public findUser = async (email: string): Promise<UserDB | undefined> => {
        switch (email) {
            case "normal@email.com":
                return {
                    id: "id-mock",
                    nickname: "Normal Mock",
                    email: "normal@email.com",
                    password: "hash-Senha@teste1",
                    role: USER_ROLE.USER,
                    created_at: new Date().toISOString(),
                }
            case "admin@email.com":
                return {
                    id: "id-mock",
                    nickname: "Admin Mock",
                    email: "admin@email.com",
                    password: "hash-Senha@teste1",
                    role: USER_ROLE.ADMIN,
                    created_at: new Date().toISOString(),
                }
            default:
                return undefined
        }
    }

    public insertUser = async (userDB: UserDB): Promise<void> =>{

    }
}