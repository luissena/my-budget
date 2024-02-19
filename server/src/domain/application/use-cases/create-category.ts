import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Category } from '@/domain/enterprise/entities/category'
import { InvalidTypeError } from './errors/invalid-type-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CategoriesRepository } from '../repositories/categories-repository'

interface CreateCategoryUseCaseRequest {
  name: string
  type: string
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

  async execute({ name, type, userId }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    if (type !== 'income' && type !== 'outcome') {
      return left(new InvalidTypeError())
    }

    const category = Category.create({
      name,
      type,
      userId: new UniqueEntityID(userId),
    })

    await this.categoriesRepository.create(category)

    return right({
      category,
    })
  }
}
