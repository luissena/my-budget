import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate-user'
import { CreateCategoryUseCase } from '@/domain/application/use-cases/create-category'
import { CreateTransactionUseCase } from '@/domain/application/use-cases/create-transaction'
import { RegisterUserUseCase } from '@/domain/application/use-cases/register-user'
import { DatabaseModule } from '@/infra/database/database.module'
import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateCategoryController } from './controllers/create-category.controller'
import { CreateTransactionController } from './controllers/create-transaction.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController, AuthenticateController, CreateCategoryController, CreateTransactionController],
  providers: [RegisterUserUseCase, AuthenticateUserUseCase, CreateCategoryUseCase, CreateTransactionUseCase],
})
export class HttpModule {}
