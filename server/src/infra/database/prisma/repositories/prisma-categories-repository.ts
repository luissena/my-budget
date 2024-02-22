import { CategoriesRepository } from '@/domain/application/repositories/categories-repository'
import { Category } from '@/domain/enterprise/entities/category'
import { Injectable } from '@nestjs/common'
import { PrismaCategoryMapper } from '../mappers/prisma-category-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private prisma: PrismaService) {}

  async create(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category)
    await this.prisma.category.create({
      data,
    })
  }
  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    })

    if (!category) return null

    return PrismaCategoryMapper.toDomain(category)
  }
}
