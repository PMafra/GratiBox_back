import { v4 as uuid } from 'uuid';
import connection from '../src/database/database';
import { user, createUser } from './userFactory';

const badToken = {
  token: '156_87*95',
};

const realToken = uuid();

const token = uuid();

const createSession = async () => {
  await createUser(user.name, user.email, user.cpf, user.password);
  const selectUser = 'SELECT * FROM "Users" WHERE email = $1';
  const usersTable = await connection.query(selectUser, [user.email]);

  const userId = usersTable.rows[0].id;

  await connection.query(`
      INSERT INTO "sessions" ("user_id", token)
      VALUES ($1, $2)
    `, [userId, token]);
};

export {
  realToken,
  badToken,
  createSession,
  token,
};
