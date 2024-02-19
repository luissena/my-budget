import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { CreateCategoryUseCase } from './create-category'
import { InvalidTypeError } from './errors/invalid-type-error'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: CreateCategoryUseCase

describe('Create Category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    sut = new CreateCategoryUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to create a category', async () => {
    const result = await sut.execute({
      name: 'Business',
      type: 'outcome',
      userId: '1',
    })

    expect(result.isRight()).toBe(true)
    expect(result.isLeft()).toBe(false)

    expect(result.value).toEqual({
      category: inMemoryCategoriesRepository.items[0],
    })
  })

  it('should not be able to create a category with invalid type', async () => {
    const result = await sut.execute({
      name: 'Business',
      type: 'invalid-type',
      userId: '1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.isRight()).toBe(false)

    expect(result.value).toBeInstanceOf(InvalidTypeError)
  })
})
