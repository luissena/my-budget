import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { TransactionFactory } from 'test/factories/make-transaction'
import { UserFactory } from 'test/factories/make-user'

describe('List transactions (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let categoryFactory: CategoryFactory
  let transactionFactory: TransactionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CategoryFactory, TransactionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    transactionFactory = moduleRef.get(TransactionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /categories-stats', async () => {
    const user = await userFactory.makePrismaUser()
    const category = await categoryFactory.makePrismaCategory({
      userId: user.id,
      type: 'outcome',
      estimatedAmount: 1000,
    })

    const transaction1 = await transactionFactory.makePrismaTransaction({
      title: 'Transaction 01',
      userId: user.id,
      categoryId: category.id,
      amount: 100,
    })

    const transaction2 = await transactionFactory.makePrismaTransaction({
      title: 'Transaction 02',
      userId: user.id,
      categoryId: category.id,
      amount: 100,
    })

    const transaction3 = await transactionFactory.makePrismaTransaction({
      title: 'Transaction 03',
      userId: user.id,
      categoryId: category.id,
      amount: 100,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/categories-stats')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      categoriesStats: expect.arrayContaining([
        expect.objectContaining({
          id: category.id.toString(),
          name: category.name,
          estimatedAmount: 1000,
          spentAmount: 300,
          remainingAmount: 700,
        }),
      ]),
    })
  })
})
