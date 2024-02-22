import { TransactionsRepository } from '@/domain/application/repositories/transactions-repository'
import { Transaction } from '@/domain/enterprise/entities/transaction'
import { Injectable } from '@nestjs/common'
import { PrismaTransactionMapper } from '../mappers/prisma-transaction-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaTransactionsRepository implements TransactionsRepository {
  constructor(private prisma: PrismaService) {}

  async create(transaction: Transaction): Promise<void> {
    const data = PrismaTransactionMapper.toPrisma(transaction)
    await this.prisma.transaction.create({
      data,
    })
  }

  async findManyByUserId(userId: string, options: { page: number }): Promise<Transaction[]> {
    const { page } = options
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
      },
      skip: (page - 1) * 10,
      take: 10,
    })

    return transactions.map(PrismaTransactionMapper.toDomain)
  }
}
