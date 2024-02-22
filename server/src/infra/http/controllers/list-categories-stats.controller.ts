import { ListCategoriesStatsUseCase } from '@/domain/application/use-cases/list-categories-stats'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CategoryStatsPresenter } from '../presenters/category-stats-presenter'

const pageQueryParamSchema = z.string().optional().default('1').transform(Number).pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)
type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
@Controller('/categories-stats')
export class ListCategoriesStatsController {
  constructor(private listCategoriesStats: ListCategoriesStatsUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema, @CurrentUser() user: UserPayload) {
    const result = await this.listCategoriesStats.execute({
      page,
      userId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const categoriesStats = result.value.categoriesStats

    return {
      categoriesStats: categoriesStats.map(CategoryStatsPresenter.toHTTP),
    }
  }
}
