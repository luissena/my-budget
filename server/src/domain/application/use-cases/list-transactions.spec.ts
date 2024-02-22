import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeTransaction } from 'test/factories/make-transaction'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { ListTransactionsUseCase } from './list-transactions'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: ListTransactionsUseCase

describe('List Transactions', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    sut = new ListTransactionsUseCase(inMemoryTransactionsRepository)
  })

  it('should be able to list transactions by user id', async () => {
    await inMemoryTransactionsRepository.create(
      makeTransaction({
        userId: new UniqueEntityID('user-1'),
      }),
    )
    await inMemoryTransactionsRepository.create(
      makeTransaction({
        userId: new UniqueEntityID('user-1'),
      }),
    )
    await inMemoryTransactionsRepository.create(
      makeTransaction({
        userId: new UniqueEntityID('user-1'),
      }),
    )

    const result = await sut.execute({
      page: 1,
      userId: 'user-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)

    expect(result.value?.transactions).toHaveLength(3)
  })
})
