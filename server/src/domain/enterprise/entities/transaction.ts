import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface TransactionProps {
    title: string;
    amount: number;
    date: Date;
}

export class Transaction extends Entity<TransactionProps> {

    get title() {
        return this.props.title;
    }

    set title(value: string) {
        this.props.title = value;
    }

    get amount() {
        return this.props.amount;
    }

    set amount(value: number) {
        this.props.amount = value;
    }

    get date() {
        return this.props.date;
    }

    set date(value: Date) {
        this.props.date = value;
    }


  static create(props: TransactionProps, id?: UniqueEntityID) {
    const transaction = new Transaction(props, id);

    return transaction;
  }
}