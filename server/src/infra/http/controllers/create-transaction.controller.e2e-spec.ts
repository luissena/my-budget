import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { UserFactory } from 'test/factories/make-user'

describe('Create Transaction (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let categoryFactory: CategoryFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, CategoryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    categoryFactory = moduleRef.get(CategoryFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /transactions', async () => {
    const user = await userFactory.makePrismaUser()
    const category = await categoryFactory.makePrismaCategory({
      userId: user.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })
    const response = await request(app.getHttpServer())
      .post('/transactions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Transaction 1',
        amount: 100,
        date: '2012-04-23T18:25:43.511Z',
        categoryId: category.id.toString(),
      })

    expect(response.statusCode).toBe(201)

    const transactionOnDatabase = await prisma.transaction.findFirst({
      where: {
        title: 'Transaction 1',
        amount: 100,
        categoryId: category.id.toString(),
      },
    })

    expect(transactionOnDatabase).toBeTruthy()
  })
})
