import '../src/setup.js';
import supertest from 'supertest';
import { user, createUser } from '../factories/userFactory.js';
import clearDatabase from '../factories/tableFactory.js';
import app from '../src/app.js';
import connection from '../src/database/database.js';

const agent = supertest(app);

beforeEach(async () => {
  await clearDatabase();
});
afterAll(() => {
  connection.end();
});

describe('POST /sign-up', () => {
  it('returns 201 for signing up sucess', async () => {
    const result = await agent
      .post('/sign-up')
      .send(user);
    expect(result.status).toEqual(201);
  });

  it('returns 400 for incorrect body', async () => {
    const result = await agent
      .post('/sign-up')
      .send({
        name: user.name,
        email: user.email,
        password: 'oi',
        cpf: user.cpf,
      });
    expect(result.status).toEqual(400);
  });

  it('returns 409 for email already registered', async () => {
    await createUser(user.name, user.email, user.cpf, user.password);

    const result = await agent
      .post('/sign-up')
      .send(user);
    expect(result.status).toEqual(409);
  });
});
