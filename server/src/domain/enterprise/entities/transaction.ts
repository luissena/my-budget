import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface TransactionProps {
  title: string
  amount: number
  date: Date
  userId: UniqueEntityID
  categoryId: UniqueEntityID
}

export class Transaction extends Entity<TransactionProps> {
  get title() {
    return this.props.title
  }

  set title(value: string) {
    this.props.title = value
  }

  get amount() {
    return this.props.amount
  }

  set amount(value: number) {
    this.props.amount = value
  }

  get date() {
    return this.props.date
  }

  set date(value: Date) {
    this.props.date = value
  }

  get categoryId() {
    return this.props.categoryId
  }

  set categoryId(value: UniqueEntityID) {
    this.props.categoryId = value
  }

  get userId() {
    return this.props.userId
  }

  set userId(value: UniqueEntityID) {
    this.props.userId = value
  }

  static create(props: TransactionProps, id?: UniqueEntityID) {
    const transaction = new Transaction(props, id)

    return transaction
  }
}
