import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Authenticate User", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
    })

    it("should be able to authenticate user", async () => {
        const user = {
            name: "Test name",
            email: "email@test.com",
            password: "password"
        };

        await createUserUseCase.execute(user);
        const result = await authenticateUserUseCase.execute({ email: user.email, password: user.password })

        expect(result).toHaveProperty("token")
    })

    it("should not be able to authenticate with a non existant e-mail", async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({ 
                email: "email@test.com", 
                password: "password" 
            })   
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })

    it("should not be able to authenticate with a incorrect password", async () => {
        expect(async () => {
            const user = {
                name: "Test name",
                email: "email@test.com",
                password: "password"
            };
    
            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({ 
                email: user.email, 
                password: "password123" 
            })   
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })
})