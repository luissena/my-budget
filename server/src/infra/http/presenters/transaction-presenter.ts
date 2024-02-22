import { Transaction } from '@/domain/enterprise/entities/transaction'

export class TransactionPresenter {
  static toHTTP(transaction: Transaction) {
    return {
      id: transaction.id.toString(),
      title: transaction.title,
      amount: transaction.amount,
      date: transaction.date,
      categoryId: transaction.categoryId.toString(),
    }
  }
}
