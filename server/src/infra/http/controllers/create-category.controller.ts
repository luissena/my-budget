import { CreateCategoryUseCase } from '@/domain/application/use-cases/create-category'
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createCategoryBodySchema = z.object({
  name: z.string(),
  type: z.enum(['income', 'outcome']),
  estimatedAmount: z.number().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(createCategoryBodySchema)
type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>

@Controller('/categories')
export class CreateCategoryController {
  constructor(private createCategory: CreateCategoryUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateCategoryBodySchema, @CurrentUser() user: UserPayload) {
    const { name, type, estimatedAmount } = body
    const userId = user.sub

    const result = await this.createCategory.execute({
      name,
      type,
      userId,
      estimatedAmount,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)

        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
