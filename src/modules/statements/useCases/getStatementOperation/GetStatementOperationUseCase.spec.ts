import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
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
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementRepositoryInMemory)
        createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementRepositoryInMemory)
    })

    it("should be able to get statement", async () => {
        const user = {
            name: "Test name",
            email: "email@test.com",
            password: "password"
        };

        await createUserUseCase.execute(user);

        const userCreated = await usersRepositoryInMemory.findByEmail(user.email);
        
        const statementCreated = await createStatementUseCase.execute({ 
            user_id: userCreated?.id as string,
            type: OperationType.DEPOSIT,
            amount: 10,
            description: "test"
        })

        const statement = await getStatementOperationUseCase.execute({ 
            user_id: userCreated?.id as string,
            statement_id: statementCreated.id as string
        })

        expect(statement).toHaveProperty("id")
    })

    it("should not be able to get statement from non existant user", async () => {
        expect(async () => {
            await getStatementOperationUseCase.execute({ 
                user_id: "1234",
                statement_id: "1234"
            })
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
    })

    it("should not be able to get a non existant statement", async () => {
        expect(async () => {
            const user = {
                name: "Test name",
                email: "email@test.com",
                password: "password"
            };
    
            await createUserUseCase.execute(user);
    
            const userCreated = await usersRepositoryInMemory.findByEmail(user.email);
     
            await getStatementOperationUseCase.execute({ 
                user_id: userCreated?.id as string,
                statement_id: "1234"
            })
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
    })
})