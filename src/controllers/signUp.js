/* eslint-disable consistent-return */
import bcrypt from 'bcrypt';
import connection from '../database/database.js';
import signUpSchema from '../validations/bodyValidations.js';

const selectUsers = 'SELECT * FROM "users"';
const passwordRules = 'Your password must contain at least 8 characters, 1 upper case letter, 1 lower case letter, 1 number and 1 special character.';
const CPFRules = 'Your cpf must only contain 11 numbers';

async function signUp(req, res) {
  const isCorrectBody = signUpSchema.validate(req.body);
  if (isCorrectBody.error) {
    if (isCorrectBody.error.details[0].path[0] === 'password') {
      return res.status(400).send(passwordRules);
    }
    if (isCorrectBody.error.details[0].path[0] === 'CPF') {
      return res.status(400).send(CPFRules);
    }
    return res.status(400).send(isCorrectBody.error.details[0].message);
  }

  const {
    name, email, password, cpf,
  } = req.body;

  try {
    const isEmailAlreadyRegistered = await connection.query(`${selectUsers} WHERE email = $1`, [email]);
    if (isEmailAlreadyRegistered.rowCount !== 0) {
      return res.status(409).send(`${email} is already registered!`);
    }
    const iscpfAlreadyRegistered = await connection.query(`${selectUsers} WHERE cpf = $1`, [cpf]);
    if (iscpfAlreadyRegistered.rowCount !== 0) {
      return res.status(409).send(`${cpf} is already registered!`);
    }

    const hashedPassword = bcrypt.hashSync(password, 11);
    await connection.query(
      `
        INSERT INTO "users"
        (name, email, password, cpf)
        VALUES ($1, $2, $3, $4);
      `,
      [name, email, hashedPassword, cpf],
    );

    res.sendStatus(201);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    res.sendStatus(500);
  }
}

export default signUp;
