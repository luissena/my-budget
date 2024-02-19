import { FakeHasher } from 'test/cryptography/fake-hasher';

import { makeUser } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUserUseCase } from './register-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;

let sut: RegisterUserUseCase;

describe('Register User', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it('should be able to register a new user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);

    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    });
  });

  it('should not be able to register a new user with same email from another', async () => {
    await inMemoryUsersRepository.create(
      makeUser({
        email: 'johndoe@example.com',
      }),
    );

    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);

    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
  });

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword);
  });
});
