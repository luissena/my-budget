import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Category } from '@/domain/enterprise/entities/category'
import { Prisma, Category as PrismaCategory } from '@prisma/client'

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory): Category {
    return Category.create(
      {
        name: raw.name,
        type: raw.type,
        estimatedAmount: raw.estimatedAmount,
        userId: new UniqueEntityID(raw.userId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(category: Category): Prisma.CategoryUncheckedCreateInput {
    return {
      id: category.id.toString(),
      name: category.name,
      type: category.type,
      estimatedAmount: category.estimatedAmount,
      userId: category.userId.toString(),
    }
  }
}
