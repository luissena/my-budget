import { UsersRepository } from "@/domain/application/repositories/users-repository";
import { User } from "@/domain/enterprise/entities/user";

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findByEmail(email: string) {
    const user = this.items.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }
  async create(user: User) {
    this.items.push(user);
  }
}
