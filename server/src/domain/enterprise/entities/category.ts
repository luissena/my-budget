import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface CategoryProps {
    name: string;
    type: "income" | "outcome"
    estimatedAmount: number;
    userId: UniqueEntityID;
}

export class Category extends Entity<CategoryProps> {

    get name() {
        return this.props.name;
    }

    set name(value: string) {
        this.props.name = value;
    }

    get type() {
        return this.props.type;
    }

    set type(value: "income" | "outcome") {
        this.props.type = value;
    }

    get estimatedAmount() {
        return this.props.estimatedAmount;
    }

    set estimatedAmount(value: number) {
        this.props.estimatedAmount = value;
    }

    get userId() {
        return this.props.userId;
    }

    set userId(value: UniqueEntityID) {
        this.props.userId = value;
    }

  static create(props: CategoryProps, id?: UniqueEntityID) {
    const category = new Category(props, id);

    return category;
  }
}   