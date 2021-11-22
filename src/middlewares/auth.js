/* eslint-disable no-console */
import connection from '../database/database.js';

async function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).send('You are not authorized to see this content. Please try signing in.');

  try {
    const session = await connection.query(`
        SELECT * FROM sessions WHERE token = $1;
      `, [token]);

    if (session.rowCount === 0) {
      return res.sendStatus(403);
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }

  return next();
}

export default auth;
