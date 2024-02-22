import { Either, right } from '@/core/either'
import { Transaction } from '@/domain/enterprise/entities/transaction'
import { Injectable } from '@nestjs/common'
import { TransactionsRepository } from '../repositories/transactions-repository'

interface ListTransactionsUseCaseRequest {
  page: number
  userId: string
}
type ListTransactionsUseCaseResponse = Either<
  null,
  {
    transactions: Transaction[]
  }
>

@Injectable()
export class ListTransactionsUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({ page, userId }: ListTransactionsUseCaseRequest): Promise<ListTransactionsUseCaseResponse> {
    const transactions = await this.transactionsRepository.findManyByUserId(userId, { page })

    return right({
      transactions,
    })
  }
}
