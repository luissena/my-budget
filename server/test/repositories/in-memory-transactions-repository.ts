import { TransactionsRepository } from '@/domain/application/repositories/transactions-repository'
import { Transaction } from '@/domain/enterprise/entities/transaction'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transaction[] = []

  async create(transaction: Transaction): Promise<void> {
    this.items.push(transaction)
  }
}
