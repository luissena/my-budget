import { CategoryStats } from '@/domain/enterprise/entities/category-stats'

export class CategoryStatsPresenter {
  static toHTTP(categoryStats: CategoryStats) {
    return {
      id: categoryStats.id.toString(),
      name: categoryStats.name,
      estimatedAmount: categoryStats.estimatedAmount,
      spentAmount: categoryStats.spentAmount,
      remainingAmount: categoryStats.remainingAmount,
    }
  }
}
