import { Transaction } from '@/domain/enterprise/entities/transaction'

export abstract class TransactionsRepository {
  abstract create(transaction: Transaction): Promise<void>
  abstract findManyByUserId(userId: string, options: { page: number }): Promise<Transaction[]>
}
