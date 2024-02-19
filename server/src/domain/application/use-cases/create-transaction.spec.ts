import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { makeCategory } from 'test/factories/make-category'
import { makeUser } from 'test/factories/make-user'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { CreateTransactionUseCase } from './create-transaction'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: CreateTransactionUseCase

describe('Create Transaction', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    sut = new CreateTransactionUseCase(inMemoryTransactionsRepository, inMemoryCategoriesRepository)
  })

  it('should be able to create a transaction', async () => {
    const user = makeUser({}, new UniqueEntityID('user-id'))
    const category = makeCategory({ userId: user.id }, new UniqueEntityID('category-id'))

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      title: 'Buy a car',
      amount: 10000,
      date: new Date(),
      userId: 'user-id',
      categoryId: 'category-id',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)

    expect(result.value).toEqual({
      transaction: inMemoryTransactionsRepository.items[0],
    })

    expect(inMemoryTransactionsRepository.items[0].userId).toEqual(user.id)

    expect(inMemoryTransactionsRepository.items[0].categoryId).toEqual(category.id)

    expect(inMemoryTransactionsRepository.items[0].title).toEqual('Buy a car')
  })

  it('should not be able to create a transaction with invalid category', async () => {
    const result = await sut.execute({
      title: 'Buy a car',
      amount: 10000,
      date: new Date(),
      userId: 'user-id',
      categoryId: 'category-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
