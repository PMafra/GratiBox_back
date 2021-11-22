import connection from '../src/database/database.js';

const del = 'DELETE FROM';

const clearDatabase = async () => {
  await connection.query(`
    ${del} "users_plans_products";
    ${del} "addresses";
    ${del} "users_plans";
    ${del} "sessions";
    ${del} "users";
  `);
};

export default clearDatabase;
