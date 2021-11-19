import connection from '../database/database.js';
import { signUpSchema } from '../validations/bodyValidations.js';
import { createUser } from '../../factories/userFactory.js';
import { selectUsers, passwordRules, CPFRules } from '../shared/variables.js';

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

    await createUser(name, email, cpf, password);

    return res.sendStatus(201);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return res.sendStatus(500);
  }
}

export default signUp;
