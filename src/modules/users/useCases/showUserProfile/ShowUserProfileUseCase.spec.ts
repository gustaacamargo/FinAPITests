import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';
import { ShowUserProfileError } from './ShowUserProfileError';

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Show User Profile", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
    })

    it("should be show user by id", async () => {
        const user = {
            name: "Test name",
            email: "email@test.com",
            password: "password"
        };

        await createUserUseCase.execute(user);

        const userCreated = await usersRepositoryInMemory.findByEmail(user.email);

        const result = await showUserProfileUseCase.execute(userCreated?.id as string);

        expect(result).toHaveProperty("id");
    })

    it("should not be to show user by a non existant id", async () => {
        expect(async () => {
            await showUserProfileUseCase.execute("1234");
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    })
})