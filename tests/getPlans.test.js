import '../src/setup.js';
import supertest from 'supertest';
import { v4 as uuid } from 'uuid';
import connection from '../src/database/database.js';
import app from '../src/app.js';
import clearDatabase from '../factories/tableFactory.js';
import { user, createUser } from '../factories/userFactory.js';
import createSession from '../factories/sessionFactory.js';
import { selectUsers } from '../src/shared/variables.js';
import { createUserPlan, addUserProduct } from '../factories/planFactory.js';

const agent = supertest(app);

beforeEach(async () => {
  await clearDatabase();
});
afterAll(() => {
  connection.end();
});

describe('GET /plans', () => {
  it('returns 401 for no token', async () => {
    const result = await agent
      .get('/plans');
    expect(result.status).toEqual(401);
  });

  it('returns 403 for wrong token', async () => {
    const result = await agent
      .get('/plans')
      .set('Authorization', 'Bearer lalala999999');
    expect(result.status).toEqual(403);
  });

  it('returns 204 for no content', async () => {
    const userEmail = user.email;
    const token = uuid();
    await createUser(user.name, userEmail, user.cpf, user.password);
    const obtainUserId = await connection.query(`
        ${selectUsers} WHERE email = $1;
    `, [userEmail]);
    const userId = obtainUserId.rows[0].id;
    await createSession(userId, token);

    const result = await agent
      .get('/plans')
      .set('Authorization', `Bearer ${token}`);
    expect(result.status).toEqual(204);
  });

  it('returns 200 for sucess getting user plan information', async () => {
    const userEmail = user.email;
    const token = uuid();
    await createUser(user.name, userEmail, user.cpf, user.password);
    const obtainUserId = await connection.query(`
        ${selectUsers} WHERE email = $1;
    `, [userEmail]);
    const userId = obtainUserId.rows[0].id;
    await createSession(userId, token);
    await createUserPlan(userId);
    const obtainUserPlanId = await connection.query(`
      SELECT * FROM "users_plans"
      WHERE "user_id" = $1
        AND "plan_id" = $2;
    `, [userId, 1]);
    const userPlanId = obtainUserPlanId.rows[0].id;
    await addUserProduct(userPlanId);

    const result = await agent
      .get('/plans')
      .set('Authorization', `Bearer ${token}`);
    expect(result.status).toEqual(200);
  });
});
