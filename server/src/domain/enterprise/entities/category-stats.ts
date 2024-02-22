import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CategoryStatsProps {
  name: string
  estimatedAmount: number
  spentAmount: number
  remainingAmount: number
  userId: UniqueEntityID
}

export class CategoryStats extends Entity<CategoryStatsProps> {
  get name() {
    return this.props.name
  }

  get estimatedAmount() {
    return this.props.estimatedAmount
  }

  get spentAmount() {
    return this.props.spentAmount
  }

  set spentAmount(value: number) {
    this.props.spentAmount = value
  }

  get remainingAmount() {
    return this.props.remainingAmount
  }

  set remainingAmount(value: number) {
    this.props.remainingAmount = value
  }

  get userId() {
    return this.props.userId
  }

  static create(props: CategoryStatsProps, id?: UniqueEntityID) {
    const categoryStats = new CategoryStats(props, id)

    return categoryStats
  }
}
