import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Transaction, TransactionProps } from '@/domain/enterprise/entities/transaction'
import { PrismaTransactionMapper } from '@/infra/database/prisma/mappers/prisma-transaction-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
export function makeTransaction(override: Partial<TransactionProps> = {}, id?: UniqueEntityID) {
  const transaction = Transaction.create(
    {
      title: faker.lorem.words(),
      categoryId: new UniqueEntityID(),
      userId: new UniqueEntityID(),
      amount: Number(faker.finance.amount()),
      date: faker.date.anytime(),
      ...override,
    },
    id,
  )

  return transaction
}

@Injectable()
export class TransactionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTransaction(data: Partial<TransactionProps> = {}): Promise<Transaction> {
    const transaction = makeTransaction(data)

    await this.prisma.transaction.create({
      data: PrismaTransactionMapper.toPrisma(transaction),
    })

    return transaction
  }
}
