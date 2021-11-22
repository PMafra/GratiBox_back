import '../src/setup.js';
import supertest from 'supertest';
import { v4 as uuid } from 'uuid';
import connection from '../src/database/database.js';
import app from '../src/app.js';
import clearDatabase from '../factories/tableFactory.js';
import { user, createUser } from '../factories/userFactory.js';
import createSession from '../factories/sessionFactory.js';
import { selectUsers } from '../src/shared/variables.js';

const agent = supertest(app);

beforeEach(async () => {
  await clearDatabase();
});
afterAll(() => {
  connection.end();
});

describe('POST /plans', () => {
  it('returns 401 for no token', async () => {
    const result = await agent
      .post('/plans');
    expect(result.status).toEqual(401);
  });

  it('returns 400 for wrong body', async () => {
    const userEmail = user.email;
    const token = uuid();
    await createUser(user.name, userEmail, user.cpf, user.password);
    const obtainUserId = await connection.query(`
        ${selectUsers} WHERE email = $1;
    `, [userEmail]);
    const userId = obtainUserId.rows[0].id;
    await createSession(userId, token);

    const result = await agent
      .post('/plans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        plan: {
          planType: 'nothing',
          planDay: 'nothing',
        },
        address: {
          fullName: 'Pedro Gratibox',
          cep: '12345678',
          address: 'Rio Street 120',
          city: 'Rio',
          state: 'RJ',
        },
      });
    expect(result.status).toEqual(400);
  });

  it('returns 403 for wrong token', async () => {
    const result = await agent
      .post('/plans')
      .set('Authorization', 'Bearer lalala999999');
    expect(result.status).toEqual(403);
  });

  it('returns 404 for nonexistent plan', async () => {
    const userEmail = user.email;
    const token = uuid();
    await createUser(user.name, userEmail, user.cpf, user.password);
    const obtainUserId = await connection.query(`
        ${selectUsers} WHERE email = $1;
    `, [userEmail]);
    const userId = obtainUserId.rows[0].id;
    await createSession(userId, token);

    const result = await agent
      .post('/plans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        plan: {
          planType: 'nothing',
          planDay: 'nothing',
          products: ['Teas'],
        },
        address: {
          fullName: 'Pedro Gratibox',
          cep: '12345678',
          address: 'Rio Street 120',
          city: 'Rio',
          state: 'RJ',
        },
      });
    expect(result.status).toEqual(404);
  });

  it('returns 201 for sucess creating user plan', async () => {
    const userEmail = user.email;
    const token = uuid();
    await createUser(user.name, userEmail, user.cpf, user.password);
    const obtainUserId = await connection.query(`
        ${selectUsers} WHERE email = $1;
    `, [userEmail]);
    const userId = obtainUserId.rows[0].id;
    await createSession(userId, token);

    const result = await agent
      .post('/plans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        plan: {
          planType: 'weekly',
          planDay: 'monday',
          products: ['Teas'],
        },
        address: {
          fullName: 'Pedro Gratibox',
          cep: '12345678',
          address: 'Rio Street 120',
          city: 'Rio',
          state: 'RJ',
        },
      });
    expect(result.status).toEqual(201);
  });
});
