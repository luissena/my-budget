import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface CategoryProps {
    name: string;
    type: "income" | "outcome"
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

  static create(props: CategoryProps, id?: UniqueEntityID) {
    const category = new Category(props, id);

    return category;
  }
}   