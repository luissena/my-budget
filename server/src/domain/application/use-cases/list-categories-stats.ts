import { Either, right } from '@/core/either'
import { CategoryStats } from '@/domain/enterprise/entities/category-stats'
import { Injectable } from '@nestjs/common'
import { CategoriesRepository } from '../repositories/categories-repository'
import { TransactionsRepository } from '../repositories/transactions-repository'

interface ListCategoriesStatsUseCaseRequest {
  userId: string
  page: number
}

type ListCategoriesStatsUseCaseResponse = Either<
  null,
  {
    categoriesStats: CategoryStats[]
  }
>

@Injectable()
export class ListCategoriesStatsUseCase {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private transactionsRepository: TransactionsRepository,
  ) {}

  async execute({ userId }: ListCategoriesStatsUseCaseRequest): Promise<ListCategoriesStatsUseCaseResponse> {
    const categories = await this.categoriesRepository.findOutcomesByUserId(userId)
    const categoriesStats = categories.map(async (category) => {
      const transactions = await this.transactionsRepository.findManyByCategoryId(category.id.toString())

      const spentAmount = transactions.reduce((acc, transaction) => acc + transaction.amount, 0)

      const remainingAmount = (category.estimatedAmount as number) - spentAmount

      return CategoryStats.create(
        {
          name: category.name,
          estimatedAmount: category.estimatedAmount as number,
          spentAmount,
          remainingAmount,
          userId: category.userId,
        },
        category.id,
      )
    })

    return right({
      categoriesStats: await Promise.all(categoriesStats),
    })
  }
}
