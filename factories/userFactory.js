import faker from 'faker';
import bcrypt from 'bcrypt';
import { generate as generateCPF } from 'gerador-validador-cpf';
import connection from '../src/database/database.js';

const user = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  cpf: generateCPF(),
  password: 'GratiBox123@',
};

const createUser = async (name, email, cpf, password) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  await connection.query(
    `
          INSERT INTO "users"
          (name, email, password, cpf)
          VALUES ($1, $2, $3, $4);
      `,
    [name, email, hashedPassword, cpf],
  );
};

export { user, createUser };
