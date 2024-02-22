import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCategory } from 'test/factories/make-category'
import { makeTransaction } from 'test/factories/make-transaction'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { ListCategoriesStatsUseCase } from './list-categories-stats'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: ListCategoriesStatsUseCase

describe('List CategoriesStats', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    sut = new ListCategoriesStatsUseCase(inMemoryCategoriesRepository, inMemoryTransactionsRepository)
  })

  it('should be able to list transactions by user id', async () => {
    const category1 = makeCategory({
      userId: new UniqueEntityID('user-1'),
      name: 'Category 1',
      estimatedAmount: 1000,
      type: 'outcome',
    })

    const category2 = makeCategory({
      userId: new UniqueEntityID('user-1'),
      name: 'Category 2',
      estimatedAmount: 1000,
      type: 'outcome',
    })

    await inMemoryCategoriesRepository.create(category1)
    await inMemoryCategoriesRepository.create(category2)

    await inMemoryTransactionsRepository.create(
      makeTransaction({
        userId: new UniqueEntityID('user-1'),
        categoryId: category1.id,
        amount: 100,
      }),
    )

    await inMemoryTransactionsRepository.create(
      makeTransaction({
        userId: new UniqueEntityID('user-1'),
        categoryId: category1.id,
        amount: 100,
      }),
    )

    const result = await sut.execute({
      page: 1,
      userId: 'user-1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)

    expect(result.value?.categoriesStats).toHaveLength(2)

    expect(result.value?.categoriesStats[0].name).toBe('Category 1')
    expect(result.value?.categoriesStats[0].estimatedAmount).toBe(1000)
    expect(result.value?.categoriesStats[0].spentAmount).toBe(200)
    expect(result.value?.categoriesStats[0].remainingAmount).toBe(800)

    expect(result.value?.categoriesStats[1].name).toBe('Category 2')
    expect(result.value?.categoriesStats[1].estimatedAmount).toBe(1000)
    expect(result.value?.categoriesStats[1].spentAmount).toBe(0)
    expect(result.value?.categoriesStats[1].remainingAmount).toBe(1000)
  })
})
