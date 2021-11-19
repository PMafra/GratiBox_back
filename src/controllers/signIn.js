/* eslint-disable max-len */
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from '../database/database.js';
import { signInSchema } from '../validations/bodyValidations.js';

const selectUser = 'SELECT * FROM "users" WHERE email = $1';
const passwordRules = 'Your password must contain at least 8 characters, 1 upper case letter, 1 lower case letter, 1 number and 1 special character.';
const incorrectInputMessage = 'Email or password is invalid!';

async function signIn(req, res) {
  const isCorrectBody = signInSchema.validate(req.body);
  if (isCorrectBody.error) {
    if (isCorrectBody.error.details[0].path[0] === 'password') {
      return res.status(400).send(passwordRules);
    }
    return res.status(400).send(isCorrectBody.error.details[0].message);
  }

  const {
    email,
    password: receivedPassword,
  } = req.body;

  try {
    const usersTable = await connection.query(selectUser, [email]);

    if (usersTable.rowCount === 0) {
      return res.status(404).send(incorrectInputMessage);
    }

    const {
      id: userId,
      name,
      password,
    } = usersTable.rows[0];

    if (!bcrypt.compareSync(receivedPassword, password)) {
      return res.status(401).send(incorrectInputMessage);
    }

    const token = uuid();

    await connection.query(`
        INSERT INTO "sessions" ("user_id", token)
        VALUES ($1, $2)
    `, [userId, token]);

    return res.send({ token, name });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return res.sendStatus(500);
  }
}

export default signIn;
