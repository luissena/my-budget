import { TransactionsRepository } from '@/domain/application/repositories/transactions-repository'
import { Transaction } from '@/domain/enterprise/entities/transaction'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transaction[] = []

  async create(transaction: Transaction): Promise<void> {
    this.items.push(transaction)
  }

  async findManyByUserId(userId: string, options: { page: number }): Promise<Transaction[]> {
    const transactions = this.items
      .filter((transaction) => transaction.userId.toString() === userId)
      .slice((options.page - 1) * 10, options.page * 10)

    return transactions
  }

  async findManyByCategoryId(categoryId: string): Promise<Transaction[]> {
    const transactions = this.items.filter((transaction) => transaction.categoryId.toString() === categoryId)

    return transactions
  }
}
