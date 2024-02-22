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

  test('[GET] /transactions', async () => {
    const user = await userFactory.makePrismaUser()
    const category = await categoryFactory.makePrismaCategory({
      userId: user.id,
    })

    const transaction1 = await transactionFactory.makePrismaTransaction({
      title: 'Transaction 01',
      userId: user.id,
      categoryId: category.id,
    })

    const transaction2 = await transactionFactory.makePrismaTransaction({
      title: 'Transaction 02',
      userId: user.id,
      categoryId: category.id,
    })

    const transaction3 = await transactionFactory.makePrismaTransaction({
      title: 'Transaction 03',
      userId: user.id,
      categoryId: category.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({})

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      transactions: expect.arrayContaining([
        expect.objectContaining({ title: 'Transaction 01' }),
        expect.objectContaining({ title: 'Transaction 02' }),
        expect.objectContaining({ title: 'Transaction 03' }),
      ]),
    })

    const transactionsOnDatabase = await prisma.transaction.findMany({
      where: {
        userId: user.id.toString(),
      },
    })

    expect(transactionsOnDatabase).toHaveLength(3)

    expect(transactionsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Transaction 01' }),
        expect.objectContaining({ title: 'Transaction 02' }),
        expect.objectContaining({ title: 'Transaction 03' }),
      ]),
    )
  })
})
