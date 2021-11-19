import '../src/setup.js';
import supertest from 'supertest';
import connection from '../src/database/database.js';
import app from '../src/app.js';
import clearDatabase from '../factories/tableFactory.js';
import { user, createUser } from '../factories/userFactory.js';

beforeEach(async () => {
  await clearDatabase();
});

afterAll(() => {
  connection.end();
});

describe('POST /sign-in', () => {
  it('returns 400 for incorrect body', async () => {
    const result = await supertest(app)
      .post('/sign-in')
      .send({
        email: user.email,
      });
    expect(result.status).toEqual(400);
  });

  it('returns 404 for email not registered', async () => {
    const result = await supertest(app)
      .post('/sign-in')
      .send({
        email: user.email,
        password: user.password,
      });
    expect(result.status).toEqual(404);
  });

  it('returns 401 for wrong password', async () => {
    await createUser(user.name, user.email, user.cpf, user.password);

    const result = await supertest(app)
      .post('/sign-in')
      .send({
        email: user.email,
        password: 'NotBookland123@',
      });
    expect(result.status).toEqual(401);
  });

  it('returns 200 for sign-in sucess', async () => {
    await createUser(user.name, user.email, user.cpf, user.password);

    const result = await supertest(app)
      .post('/sign-in')
      .send({
        email: user.email,
        password: user.password,
      });
    expect(result.status).toEqual(200);
  });
});
