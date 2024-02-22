import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Transaction } from '@/domain/enterprise/entities/transaction'
import { Prisma, Transaction as PrismaTransaction } from '@prisma/client'

export class PrismaTransactionMapper {
  static toDomain(raw: PrismaTransaction): Transaction {
    return Transaction.create(
      {
        title: raw.title,
        amount: raw.amount,
        date: raw.date,
        categoryId: new UniqueEntityID(raw.categoryId),
        userId: new UniqueEntityID(raw.userId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(transaction: Transaction): Prisma.TransactionUncheckedCreateInput {
    return {
      id: transaction.id.toString(),
      title: transaction.title,
      amount: transaction.amount,
      categoryId: transaction.categoryId.toString(),
      date: transaction.date,
      userId: transaction.userId.toString(),
    }
  }
}
