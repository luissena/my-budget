import { CreateTransactionUseCase } from '@/domain/application/use-cases/create-transaction'
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user-already-exists-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createTransactionBodySchema = z.object({
  title: z.string(),
  amount: z.number(),
  date: z.coerce.date(),
  categoryId: z.string().uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(createTransactionBodySchema)
type CreateTransactionBodySchema = z.infer<typeof createTransactionBodySchema>

@Controller('/transactions')
export class CreateTransactionController {
  constructor(private createTransaction: CreateTransactionUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateTransactionBodySchema, @CurrentUser() user: UserPayload) {
    const { title, amount, date, categoryId } = body
    const userId = user.sub

    const result = await this.createTransaction.execute({
      title,
      amount,
      date,
      categoryId,
      userId,
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
