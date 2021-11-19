import connection from '../src/database/database.js';

const createSession = async (userId, token) => {
  await connection.query(`
      INSERT INTO "sessions" ("user_id", token)
      VALUES ($1, $2)
    `, [userId, token]);
};

export default createSession;
