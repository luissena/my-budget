import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category } from '@/domain/enterprise/entities/category'
import { Injectable } from '@nestjs/common'
import { CategoriesRepository } from '../repositories/categories-repository'
import { InvalidTypeError } from './errors/invalid-type-error'

interface CreateCategoryUseCaseRequest {
  name: string
  type: string
  estimatedAmount?: number
  userId: string
}

type CreateCategoryUseCaseResponse = Either<
  InvalidTypeError,
  {
    category: Category
  }
>

@Injectable()
export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    name,
    type,
    estimatedAmount,
    userId,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    if (type !== 'income' && type !== 'outcome') {
      return left(new InvalidTypeError())
    }

    const category = Category.create({
      name,
      type,
      estimatedAmount,
      userId: new UniqueEntityID(userId),
    })

    await this.categoriesRepository.create(category)

    return right({
      category,
    })
  }
}
