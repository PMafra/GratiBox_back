import '../src/setup.js';
import supertest from 'supertest';
import connection from '../src/database/database.js';
import app from '../src/app.js';
import clearDatabase from '../factories/tableFactory.js';
import { user, createUser } from '../factories/userFactory.js';

const agent = supertest(app);

beforeEach(async () => {
  await clearDatabase();
});
afterAll(() => {
  connection.end();
});

describe('POST /sign-in', () => {
  it('returns 400 for incorrect body', async () => {
    const result = await agent
      .post('/sign-in')
      .send({
        email: user.email,
      });
    expect(result.status).toEqual(400);
  });

  it('returns 404 for email not registered', async () => {
    const result = await agent
      .post('/sign-in')
      .send({
        email: user.email,
        password: user.password,
      });
    expect(result.status).toEqual(404);
  });

  it('returns 401 for wrong password', async () => {
    const userEmail = user.email;
    await createUser(user.name, userEmail, user.cpf, user.password);

    const result = await agent
      .post('/sign-in')
      .send({
        email: userEmail,
        password: 'NotBookland123@',
      });
    expect(result.status).toEqual(401);
  });

  it('returns 200 for sign-in sucess', async () => {
    const userEmail = user.email;
    const userPassword = user.password;
    await createUser(user.name, userEmail, user.cpf, userPassword);

    const result = await agent
      .post('/sign-in')
      .send({
        email: userEmail,
        password: userPassword,
      });
    expect(result.status).toEqual(200);
  });
});
