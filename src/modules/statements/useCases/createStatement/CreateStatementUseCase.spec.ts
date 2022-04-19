import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        statementRepositoryInMemory = new InMemoryStatementsRepository()
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory)
    })

    it("should be able to create statement with type deposit", async () => {
        const user = {
            name: "Test name",
            email: "email@test.com",
            password: "password"
        };

        await createUserUseCase.execute(user);

        const userCreated = await usersRepositoryInMemory.findByEmail(user.email);
        
        const statement = await createStatementUseCase.execute({ 
            user_id: userCreated?.id as string,
            type: OperationType.DEPOSIT,
            amount: 10,
            description: "test"
        })

        expect(statement).toHaveProperty("id")
    })

    it("should be able to create statement with type withdraw", async () => {
        const user = {
            name: "Test name",
            email: "email@test.com",
            password: "password"
        };

        await createUserUseCase.execute(user);

        const userCreated = await usersRepositoryInMemory.findByEmail(user.email);
        
        await createStatementUseCase.execute({ 
            user_id: userCreated?.id as string,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "test"
        })

        const withdraw = await createStatementUseCase.execute({ 
            user_id: userCreated?.id as string,
            type: OperationType.WITHDRAW,
            amount: 10,
            description: "test"
        })

        expect(withdraw).toHaveProperty("id")
    })

    it("should not be able to create statement with type withdraw", async () => {
        expect(async () => {
            const user = {
                name: "Test name",
                email: "email@test.com",
                password: "password"
            };
    
            await createUserUseCase.execute(user);
    
            const userCreated = await usersRepositoryInMemory.findByEmail(user.email);
            
            await createStatementUseCase.execute({ 
                user_id: userCreated?.id as string,
                type: OperationType.WITHDRAW,
                amount: 10,
                description: "test"
            })
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
    })

    it("should not be able to realize a statement with a non existant user", async () => {
        expect(async () => {      
            await createStatementUseCase.execute({ 
                user_id: "1234",
                type: OperationType.DEPOSIT,
                amount: 10,
                description: "test"
            })
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
    })
})