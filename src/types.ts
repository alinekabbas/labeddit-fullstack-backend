export enum USER_ROLE {
    ADMIN = "administrador",
    USER = "usuário"
}

export interface TokenPayload {
    id: string,
	name: string,
    role: USER_ROLE
}