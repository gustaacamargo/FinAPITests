import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    })

    it("should be able to create a new user", async () => {
        const user = {
            name: "Test name",
            email: "email@test.com",
            password: "password"
        };

        await createUserUseCase.execute(user);

        const userCreated = await usersRepositoryInMemory.findByEmail(user.email);

        expect(userCreated).toHaveProperty("id");
    })

    it("should not be able to create a user with same e-mail", () => {
        expect(async () => {
            const user = {
                name: "Test name",
                email: "email@test.com",
                password: "password"
            };
    
            await createUserUseCase.execute(user);
            await createUserUseCase.execute(user);
        }).rejects.toBeInstanceOf(CreateUserError)
    })
})