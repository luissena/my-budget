import { CategoriesRepository } from '@/domain/application/repositories/categories-repository'
import { TransactionsRepository } from '@/domain/application/repositories/transactions-repository'
import { UsersRepository } from '@/domain/application/repositories/users-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCategoriesRepository } from './prisma/repositories/prisma-categories-repository'
import { PrismaTransactionsRepository } from './prisma/repositories/prisma-transactions-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: CategoriesRepository,
      useClass: PrismaCategoriesRepository,
    },
    {
      provide: TransactionsRepository,
      useClass: PrismaTransactionsRepository,
    },
  ],
  exports: [PrismaService, UsersRepository, CategoriesRepository, TransactionsRepository],
})
export class DatabaseModule {}
