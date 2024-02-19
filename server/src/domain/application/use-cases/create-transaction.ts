import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Transaction } from '@/domain/enterprise/entities/transaction'
import { Injectable } from '@nestjs/common'
import { CategoriesRepository } from '../repositories/categories-repository'
import { TransactionsRepository } from '../repositories/transactions-repository'
import { InvalidTypeError } from './errors/invalid-type-error'

interface CreateTransactionUseCaseRequest {
  title: string
  date: Date
  amount: number
  categoryId: string
  userId: string
}

type CreateTransactionUseCaseResponse = Either<
  InvalidTypeError,
  {
    transaction: Transaction
  }
>

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({
    title,
    amount,
    date,
    categoryId,
    userId,
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const existsCategory = await this.categoriesRepository.findById(categoryId)

    if (!existsCategory) {
      return left(new ResourceNotFoundError())
    }

    const transaction = Transaction.create({
      title,
      date,
      amount,
      categoryId: new UniqueEntityID(categoryId),
      userId: new UniqueEntityID(userId),
    })

    await this.transactionsRepository.create(transaction)

    return right({
      transaction,
    })
  }
}
