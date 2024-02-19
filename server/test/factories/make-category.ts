import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category, CategoryProps } from '@/domain/enterprise/entities/category'
import { faker } from '@faker-js/faker'
import { makeUser } from './make-user'

export function makeCategory(override: Partial<CategoryProps> = {}, id?: UniqueEntityID) {
  const user = makeUser()

  const category = Category.create(
    {
      name: faker.commerce.department(),
      type: 'income',
      userId: user.id,
      ...override,
    },
    id,
  )

  return category
}
