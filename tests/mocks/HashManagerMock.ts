export class HashManagerMock {
    public hash = async (plaintext: string): Promise<string> => {
        if (plaintext == "Senha@teste1") {
            return "hash-Senha@teste1"
        }

        return "hash-mock"
    }

    public compare = async (plaintext: string, hash: string): Promise<boolean> => {
        if (plaintext == "Senha@teste1" && hash == "hash-Senha@teste1") {
            return true
        }

        return false
    }
}