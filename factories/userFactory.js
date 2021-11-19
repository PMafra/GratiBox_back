import faker from 'faker';
import bcrypt from 'bcrypt';
import { cpf } from 'cpf-cnpj-validator';
import connection from '../src/database/database.js';

const user = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  cpf: cpf.generate(),
  password: 'GratiBox123@',
};

const createUser = async (name, email, CPF, password) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  await connection.query(
    `
          INSERT INTO "users"
          (name, email, password, cpf)
          VALUES ($1, $2, $3, $4);
      `,
    [name, email, hashedPassword, CPF],
  );
};

export { user, createUser };
