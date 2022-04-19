import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Create Statement", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        statementRepositoryInMemory = new InMemoryStatementsRepository()
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        getBalanceUseCase = new GetBalanceUseCase(statementRepositoryInMemory, usersRepositoryInMemory)
    })

    it("should be able to get balance of user", async () => {
        const user = {
            name: "Test name",
            email: "email@test.com",
            password: "password"
        };

        await createUserUseCase.execute(user);

        const userCreated = await usersRepositoryInMemory.findByEmail(user.email);
        
        const balance = await getBalanceUseCase.execute({ 
            user_id: userCreated?.id as string
        })

        expect(balance).toHaveProperty("balance")
    })

    it("should not be able to get balance of a non existant user", async () => {
        expect(async () => {
            await getBalanceUseCase.execute({ 
                user_id: "1234"
            })
        }).rejects.toBeInstanceOf(GetBalanceError)
    })
})