/* eslint-disable max-len */
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import connection from '../database/database.js';
import { signInSchema } from '../validations/bodyValidations.js';
import createSession from '../../factories/sessionFactory.js';
import { selectUsers, passwordRules, incorrectInputMessage } from '../shared/variables.js';

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
    const usersTable = await connection.query(`${selectUsers} WHERE email = $1`, [email]);

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
    createSession(userId, token);

    return res.send({ token, name });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return res.sendStatus(500);
  }
}

export default signIn;
